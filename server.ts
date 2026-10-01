import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  User,
  ChatMessage,
  ClientSignalMessage,
  ServerSignalMessage,
} from './src/types/index.ts';
import { CHANNELS, DEFAULT_STUN_SERVERS } from './src/utils/constants.ts';
import { sanitizeText } from './src/utils/helpers.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// CORS Configuration with strict allowlist
const ALLOWED_ORIGINS = [
  'tauri://localhost',
  'https://tauri.localhost',
  'http://tauri.localhost',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];

if (process.env.APP_URL) {
  ALLOWED_ORIGINS.push(process.env.APP_URL);
}

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    const isAllowed = ALLOWED_ORIGINS.includes(origin);
    if (isAllowed) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }
  }

  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  next();
});

// Serve public releases directory directly
app.use('/releases', express.static(path.resolve(__dirname, 'public/releases')));

// In-memory server state
interface ConnectedClient {
  ws: WebSocket;
  user: User;
  lastPing: number;
}

const clients = new Map<string, ConnectedClient>(); // userId -> ConnectedClient
const channelMessages = new Map<string, ChatMessage[]>(); // channelId -> ChatMessage[]
const voiceChannels = new Map<string, Set<string>>(); // channelId -> Set<userId>
const activeScreenShares = new Map<string, string>(); // channelId -> userId
const rateLimits = new Map<string, { count: number; resetAt: number }>();

// Prepopulate channels in message store
CHANNELS.forEach((channel) => {
  if (channel.type === 'text') {
    channelMessages.set(channel.id, []);
  } else {
    voiceChannels.set(channel.id, new Set<string>());
  }
});

// Seed an initial system message in #geral so new users see an inviting greeting
const initialMessage: ChatMessage = {
  id: 'sys-welcome',
  channelId: 'text-geral',
  userId: 'system',
  displayName: 'pumpkin bot',
  avatarColor: '#FF7A00',
  content: 'Bem-vindo ao servidor pumpkin! Conecte-se em um canal de voz, digite no chat ou inicie um compartilhamento de tela com qualidade de até 1080p 60fps.',
  createdAt: Date.now(),
};
channelMessages.get('text-geral')?.push(initialMessage);

// Helper: Broadcast to all connected clients
function broadcast(message: ServerSignalMessage, excludeUserId?: string) {
  const data = JSON.stringify(message);
  clients.forEach((client, userId) => {
    if (userId !== excludeUserId && client.ws.readyState === WebSocket.OPEN) {
      client.ws.send(data);
    }
  });
}

// Helper: Send message to specific user
function sendToUser(userId: string, message: ServerSignalMessage) {
  const client = clients.get(userId);
  if (client && client.ws.readyState === WebSocket.OPEN) {
    client.ws.send(JSON.stringify(message));
  }
}

// Helper: Broadcast to members in a specific voice channel
function broadcastToVoiceChannel(channelId: string, message: ServerSignalMessage, excludeUserId?: string) {
  const members = voiceChannels.get(channelId);
  if (!members) return;
  const data = JSON.stringify(message);
  members.forEach((userId) => {
    if (userId !== excludeUserId) {
      const client = clients.get(userId);
      if (client && client.ws.readyState === WebSocket.OPEN) {
        client.ws.send(data);
      }
    }
  });
}

// REST API Endpoints
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    uptime: process.uptime(),
    activeUsers: clients.size,
    timestamp: Date.now(),
  });
});

app.get('/api/ice-servers', (req, res) => {
  const iceServers: RTCIceServer[] = [...DEFAULT_STUN_SERVERS];

  // Optional custom TURN configuration via environment variables
  if (process.env.TURN_URL && process.env.TURN_USERNAME && process.env.TURN_CREDENTIAL) {
    iceServers.push({
      urls: process.env.TURN_URL,
      username: process.env.TURN_USERNAME,
      credential: process.env.TURN_CREDENTIAL,
    });
  }

  res.json({ iceServers });
});

app.get('/api/channels', (req, res) => {
  res.json({ channels: CHANNELS });
});

app.get('/api/version', (req, res) => {
  res.json({
    version: '1.0.2',
    name: 'pumpkin',
    status: 'stable',
    platforms: ['web', 'windows', 'android'],
  });
});

app.get('/api/releases/latest', (req, res) => {
  try {
    const manifestPath = path.resolve(__dirname, 'public/releases/latest.json');
    res.sendFile(manifestPath);
  } catch {
    res.status(404).json({ error: 'Release manifest not found' });
  }
});

// WebSocket Server
const wss = new WebSocketServer({ server, path: '/ws' });

wss.on('connection', (ws: WebSocket) => {
  let authenticatedUserId: string | null = null;

  ws.on('message', (rawData) => {
    try {
      const msg: ClientSignalMessage = JSON.parse(rawData.toString());

      switch (msg.type) {
        case 'auth': {
          const { userId, displayName, avatarColor } = msg.payload;
          if (!userId || !displayName) {
            ws.send(JSON.stringify({ type: 'error', payload: { message: 'Invalid credentials.' } }));
            return;
          }

          authenticatedUserId = userId;

          const user: User = {
            id: userId,
            displayName: displayName.trim().slice(0, 24),
            avatarColor: avatarColor || '#00e5ff',
            isOnline: true,
            voiceChannelId: null,
            isMuted: false,
            isDeafened: false,
            isSpeaking: false,
            isScreenSharing: false,
            screenShareChannelId: null,
            joinedAt: Date.now(),
          };

          clients.set(userId, {
            ws,
            user,
            lastPing: Date.now(),
          });

          // Compile all current active users
          const currentUsers = Array.from(clients.values()).map((c) => c.user);

          // Compile messages by channel
          const messagesObj: Record<string, ChatMessage[]> = {};
          channelMessages.forEach((msgs, chId) => {
            messagesObj[chId] = msgs;
          });

          // Acknowledge authentication with full initial state
          ws.send(
            JSON.stringify({
              type: 'auth:ack',
              payload: {
                user,
                users: currentUsers,
                messages: messagesObj,
              },
            })
          );

          // Broadcast to everyone else that a new user joined
          broadcast({ type: 'user:joined', payload: { user } }, userId);
          break;
        }

        case 'ping': {
          if (authenticatedUserId) {
            const client = clients.get(authenticatedUserId);
            if (client) {
              client.lastPing = Date.now();
            }
          }
          ws.send(JSON.stringify({ type: 'pong' }));
          break;
        }

        case 'chat:send': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { channelId, content } = msg.payload;
          const cleanContent = sanitizeText(content?.trim() || '');

          if (!cleanContent || cleanContent.length > 2000) {
            return;
          }

          // Anti-spam Rate Limiter (max 5 msgs per 3 seconds)
          const now = Date.now();
          const userLimit = rateLimits.get(authenticatedUserId) || { count: 0, resetAt: now + 3000 };
          if (now > userLimit.resetAt) {
            userLimit.count = 1;
            userLimit.resetAt = now + 3000;
          } else {
            userLimit.count += 1;
            if (userLimit.count > 5) {
              ws.send(
                JSON.stringify({
                  type: 'error',
                  payload: { message: 'Você está enviando mensagens rápido demais. Aguarde um instante.' },
                })
              );
              return;
            }
          }
          rateLimits.set(authenticatedUserId, userLimit);

          const newChatMessage: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            channelId,
            userId: client.user.id,
            displayName: client.user.displayName,
            avatarColor: client.user.avatarColor,
            content: cleanContent,
            createdAt: Date.now(),
          };

          // Store in memory (keep last 150 messages per channel)
          const msgs = channelMessages.get(channelId) || [];
          msgs.push(newChatMessage);
          if (msgs.length > 150) {
            msgs.shift();
          }
          channelMessages.set(channelId, msgs);

          // Broadcast immediately to all connected clients
          broadcast({
            type: 'chat:message',
            payload: { message: newChatMessage },
          });
          break;
        }

        case 'voice:join': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { channelId, isMuted, isDeafened } = msg.payload;

          // If user was already in another voice channel, leave it first
          if (client.user.voiceChannelId && client.user.voiceChannelId !== channelId) {
            const oldChannelId = client.user.voiceChannelId;
            voiceChannels.get(oldChannelId)?.delete(authenticatedUserId);
            broadcastToVoiceChannel(oldChannelId, {
              type: 'voice:peer-left',
              payload: { userId: authenticatedUserId, channelId: oldChannelId },
            });
            if (activeScreenShares.get(oldChannelId) === authenticatedUserId) {
              activeScreenShares.delete(oldChannelId);
              broadcast({
                type: 'screen:stopped',
                payload: { userId: authenticatedUserId, channelId: oldChannelId },
              });
            }
          }

          // Add to new channel
          if (!voiceChannels.has(channelId)) {
            voiceChannels.set(channelId, new Set<string>());
          }
          const channelMembers = voiceChannels.get(channelId)!;

          // Notify existing members of this voice channel that a new peer joined
          broadcastToVoiceChannel(
            channelId,
            {
              type: 'voice:peer-joined',
              payload: { userId: authenticatedUserId, channelId },
            },
            authenticatedUserId
          );

          channelMembers.add(authenticatedUserId);

          // Update user state
          client.user.voiceChannelId = channelId;
          client.user.isMuted = isMuted;
          client.user.isDeafened = isDeafened;
          client.user.isSpeaking = false;

          broadcast({
            type: 'user:updated',
            payload: { user: client.user },
          });

          // Also inform the joining user of existing peers so WebRTC connections can initiate
          channelMembers.forEach((memberId) => {
            if (memberId !== authenticatedUserId) {
              ws.send(
                JSON.stringify({
                  type: 'voice:peer-joined',
                  payload: { userId: memberId, channelId },
                })
              );
            }
          });
          break;
        }

        case 'voice:leave': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { channelId } = msg.payload;
          voiceChannels.get(channelId)?.delete(authenticatedUserId);

          broadcastToVoiceChannel(
            channelId,
            {
              type: 'voice:peer-left',
              payload: { userId: authenticatedUserId, channelId },
            },
            authenticatedUserId
          );

          if (activeScreenShares.get(channelId) === authenticatedUserId) {
            activeScreenShares.delete(channelId);
            broadcast({
              type: 'screen:stopped',
              payload: { userId: authenticatedUserId, channelId },
            });
            client.user.isScreenSharing = false;
            client.user.screenShareChannelId = null;
          }

          client.user.voiceChannelId = null;
          client.user.isSpeaking = false;

          broadcast({
            type: 'user:updated',
            payload: { user: client.user },
          });
          break;
        }

        case 'voice:state': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { isMuted, isDeafened, isSpeaking } = msg.payload;
          client.user.isMuted = isMuted;
          client.user.isDeafened = isDeafened;
          client.user.isSpeaking = isSpeaking;

          broadcast({
            type: 'user:updated',
            payload: { user: client.user },
          });
          break;
        }

        case 'screen:start': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { channelId } = msg.payload;
          activeScreenShares.set(channelId, authenticatedUserId);
          client.user.isScreenSharing = true;
          client.user.screenShareChannelId = channelId;

          broadcast({
            type: 'screen:started',
            payload: { userId: authenticatedUserId, channelId },
          });

          broadcast({
            type: 'user:updated',
            payload: { user: client.user },
          });
          break;
        }

        case 'screen:stop': {
          if (!authenticatedUserId) return;
          const client = clients.get(authenticatedUserId);
          if (!client) return;

          const { channelId } = msg.payload;
          if (activeScreenShares.get(channelId) === authenticatedUserId) {
            activeScreenShares.delete(channelId);
          }
          client.user.isScreenSharing = false;
          client.user.screenShareChannelId = null;

          broadcast({
            type: 'screen:stopped',
            payload: { userId: authenticatedUserId, channelId },
          });

          broadcast({
            type: 'user:updated',
            payload: { user: client.user },
          });
          break;
        }

        case 'rtc:signal': {
          if (!authenticatedUserId) return;
          const { toUserId, channelId, mediaType, signal } = msg.payload;

          // Forward the WebRTC signal directly to the intended peer
          sendToUser(toUserId, {
            type: 'rtc:signal',
            payload: {
              fromUserId: authenticatedUserId,
              channelId,
              mediaType,
              signal,
            },
          });
          break;
        }

        default:
          break;
      }
    } catch (err) {
      console.error('Error handling WebSocket message:', err);
    }
  });

  ws.on('close', () => {
    if (authenticatedUserId) {
      const client = clients.get(authenticatedUserId);
      if (client) {
        const vChannel = client.user.voiceChannelId;
        if (vChannel) {
          voiceChannels.get(vChannel)?.delete(authenticatedUserId);
          broadcastToVoiceChannel(vChannel, {
            type: 'voice:peer-left',
            payload: { userId: authenticatedUserId, channelId: vChannel },
          });
          if (activeScreenShares.get(vChannel) === authenticatedUserId) {
            activeScreenShares.delete(vChannel);
            broadcast({
              type: 'screen:stopped',
              payload: { userId: authenticatedUserId, channelId: vChannel },
            });
          }
        }

        clients.delete(authenticatedUserId);
        rateLimits.delete(authenticatedUserId);

        broadcast({
          type: 'user:left',
          payload: { userId: authenticatedUserId },
        });
      }
    }
  });

  ws.on('error', (err) => {
    console.error('WebSocket connection error:', err);
  });
});

// Periodic heartbeat to clean up abandoned connections
const heartbeatInterval = setInterval(() => {
  const now = Date.now();
  clients.forEach((client, userId) => {
    if (now - client.lastPing > 45000) {
      // Stale connection (no ping for 45s)
      client.ws.terminate();
      clients.delete(userId);
      broadcast({ type: 'user:left', payload: { userId } });
    }
  });
}, 20000);

wss.on('close', () => {
  clearInterval(heartbeatInterval);
});

// Dev vs Prod Vite handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`[pumpkin] Server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('[pumpkin] Failed to start server:', err);
  process.exit(1);
});

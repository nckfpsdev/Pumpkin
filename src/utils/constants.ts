import { Channel } from '../types';

export const CHANNELS: Channel[] = [
  // Text Channels
  {
    id: 'text-geral',
    name: 'geral',
    type: 'text',
    description: 'Canal de texto principal para conversas gerais da equipe.',
  },
  {
    id: 'text-desenvolvimento',
    name: 'desenvolvimento',
    type: 'text',
    description: 'Discussões técnicas, commits, PRs, snippets e arquitetura.',
  },
  {
    id: 'text-off-topic',
    name: 'off-topic',
    type: 'text',
    description: 'Descontração, memes, bate-papo informal e cafezinho.',
  },
  // Voice Channels
  {
    id: 'voice-geral',
    name: 'Geral',
    type: 'voice',
    description: 'Canal de voz principal aberto para todos.',
    userLimit: 25,
  },
  {
    id: 'voice-dev-room',
    name: 'Dev Room',
    type: 'voice',
    description: 'Pair programming, code reviews e debugging ao vivo.',
    userLimit: 12,
  },
  {
    id: 'voice-chill',
    name: 'Chill',
    type: 'voice',
    description: 'Espaço para trabalhar junto ouvindo música ou relaxando.',
    userLimit: 15,
  },
];

export const AVATAR_COLORS = [
  '#00e5ff', // Electric Cyan
  '#3b82f6', // Bright Blue
  '#8b5cf6', // Electric Violet
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#6366f1', // Indigo
];

export const DEFAULT_STUN_SERVERS: RTCIceServer[] = [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
  { urls: 'stun:stun2.l.google.com:19302' },
  { urls: 'stun:stun3.l.google.com:19302' },
  { urls: 'stun:stun4.l.google.com:19302' },
];

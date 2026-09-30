import { AVATAR_COLORS } from './constants';

export function getAvatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export function getInitials(name: string): string {
  if (!name) return '?';
  const clean = name.trim();
  if (clean.length === 1) return clean.toUpperCase();
  const parts = clean.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return clean.slice(0, 2).toUpperCase();
}

export function validateNickname(rawName: string): { isValid: boolean; error?: string; cleanName: string } {
  if (!rawName) {
    return { isValid: false, error: 'Por favor, digite um apelido.', cleanName: '' };
  }

  // Remove leading/trailing and collapse multiple spaces
  const clean = rawName.trim().replace(/\s+/g, ' ');

  if (clean.length < 2) {
    return { isValid: false, error: 'O apelido deve ter pelo menos 2 caracteres.', cleanName: clean };
  }

  if (clean.length > 24) {
    return { isValid: false, error: 'O apelido deve ter no máximo 24 caracteres.', cleanName: clean };
  }

  // Basic check for control characters or script injection
  const dangerousRegex = /[<>{}"'`\\/]/g;
  if (dangerousRegex.test(clean)) {
    return {
      isValid: false,
      error: 'O apelido contém caracteres inválidos. Use apenas letras, números e espaços.',
      cleanName: clean.replace(dangerousRegex, ''),
    };
  }

  return { isValid: true, cleanName: clean };
}

export function sanitizeText(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function formatFullDate(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

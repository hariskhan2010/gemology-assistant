const NOTE_PATTERNS = [
  { regex: /^note\s+(this[:\s]+)?(.+)$/i, extract: 2 },
  { regex: /^remember\s+(this[:\s]+)?(.+)$/i, extract: 2 },
  { regex: /^save\s+(this\s+)?(for\s+later[:\s]+)?(.+)$/i, extract: 3 },
  { regex: /^don'?t\s+forget\s+(that\s+)?(.+)$/i, extract: 2 },
];

export function detectNote(content: string): string | null {
  const trimmed = content.trim();
  for (const { regex, extract } of NOTE_PATTERNS) {
    const match = trimmed.match(regex);
    if (match && match[extract]) {
      return match[extract].trim();
    }
  }
  return null;
}

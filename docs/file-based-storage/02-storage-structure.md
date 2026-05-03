# Storage Structure

## Directory Layout

```
data/
├── users.jsonl              # User accounts
├── sessions.jsonl           # Active sessions
├── conversations/           # Per-chat message history
│   ├── {sessionId}.jsonl
│   ├── {sessionId}.jsonl
│   └── ...
├── agent_memory.md          # Long-term notes
└── .compact_state           # Internal: tracks last compact time/sizes
```

## File Formats

### `users.jsonl`
One JSON object per line. Append-only.

```jsonl
{"email":"haris@test.com","passwordHash":"$2b$10$abc...","createdAt":"2026-05-01T12:00:00Z"}
{"email":"user2@test.com","passwordHash":"$2b$10$xyz...","createdAt":"2026-05-01T13:00:00Z"}
```

### `sessions.jsonl`
One JSON object per line. Contains expiry.

```jsonl
{"token":"jwt_here","userId":"uuid","email":"haris@test.com","expiresAt":"2026-05-08T12:00:00Z"}
```

### `conversations/{sessionId}.jsonl`
One JSON object per line. Message history for a single chat.

```jsonl
{"role":"user","content":"hi","timestamp":"2026-05-01T12:00:00Z"}
{"role":"assistant","content":"Hello! How can I help?","timestamp":"2026-05-01T12:00:01Z"}
{"role":"user","content":"note my name is haris","timestamp":"2026-05-01T12:01:00Z"}
{"role":"assistant","content":"Got it, I'll remember that.","timestamp":"2026-05-01T12:01:01Z"}
```

### `agent_memory.md`
Markdown file. Each note is a list item with timestamp.

```markdown
# Agent Memory

- [2026-05-01 12:01] User's name is Haris
- [2026-05-01 14:30] User prefers emerald color theme
- [2026-05-02 09:15] User is working on a gemology project
```

### `.compact_state`
Internal tracking file.

```json
{"lastCompact":"2026-05-01T12:00:00Z","fileSizes":{}}
```

## Initialization
- On first run, `ensureDataDir()` creates the `data/` folder and empty files if missing
- No schema, no migrations

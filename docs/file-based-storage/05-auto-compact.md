# Auto-Compact System

## Purpose
Prevent JSONL files from growing indefinitely. When files exceed the size threshold, the system automatically compacts them.

## Threshold
- **2MB** per file triggers compaction
- Checked on each write operation (signup, signin, new message, etc.)

## Compaction Rules by File Type

### `users.jsonl`
- **Problem**: Same user might have multiple entries if they update
- **Action**: Deduplicate by email, keep only the latest entry per email
- **Result**: One line per unique email

### `sessions.jsonl`
- **Problem**: Expired sessions accumulate
- **Action**: Remove all entries where `expiresAt` is in the past
- **Result**: Only active sessions remain

### `conversations/{id}.jsonl`
- **Problem**: Long conversations create large files
- **Action**: Keep the last 200 messages
  - If conversation has >200 messages, keep first 3 + last 197
  - Insert a summary marker: `{"role":"system","content":"[Older messages summarized and removed during compact]","timestamp":"..."}`
- **Result**: Max ~200 messages per conversation file

### `agent_memory.md`
- **Problem**: Notes keep growing
- **Action**: Keep all notes (they are important long-term memory)
- **Optional**: If >500 notes, archive oldest 200 to `agent_memory_archived.md`
- **Result**: Active file stays manageable

## Compaction Flow

```
1. User triggers action (send message, sign up, etc.)
2. After write, check file size
3. If size > 2MB:
   a. Load file into memory
   b. Apply compaction rules
   c. Write compacted version
   d. Update .compact_state
4. Continue normal flow
```

## `.compact_state` File

```json
{
  "lastCompact": "2026-05-01T12:00:00Z",
  "fileSizes": {
    "users.jsonl": 1024,
    "sessions.jsonl": 512,
    "conversations/abc123.jsonl": 45000
  }
}
```

- Updated after each compaction
- Used to track which files were already processed
- Prevents repeated compaction in short time windows (min 5 min gap)

## Edge Cases
- If compaction fails, original file is preserved (write to temp file first, then rename)
- Compaction is non-blocking — if it takes too long, defer to next request

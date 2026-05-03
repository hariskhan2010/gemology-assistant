# File-Based Storage System - Overview

## Goal
Replace PostgreSQL/NeonDB with a lightweight file-based storage system for user accounts, sessions, conversations, and agent memory.

## Core Principles
- **No database server needed** — everything lives in local files
- **Separate files for separate concerns**
- **Auto-compact** when files grow too large
- **Full conversation memory** — agent knows the context of any chat the user opens

## Storage Files

| File | Purpose |
|------|---------|
| `data/users.jsonl` | User accounts (email, password hash) |
| `data/sessions.jsonl` | Active login sessions |
| `data/conversations/*.jsonl` | Per-chat message history |
| `data/agent_memory.md` | Long-term notes user tells agent to remember |

## Key Features
1. **User Auth** — signup/signin using file lookup
2. **Conversation Memory** — each chat gets its own file; agent loads the right file when user opens a chat
3. **Note System** — user says "note [something]" → saved to `agent_memory.md`
4. **Auto-Compact** — files cleaned up automatically when they exceed size threshold

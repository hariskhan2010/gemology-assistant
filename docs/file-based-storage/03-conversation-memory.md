# Conversation Memory

## How It Works

Each conversation gets its own JSONL file. The agent loads the correct file when the user opens that chat.

## Flow

### New Chat
1. UI requests new conversation
2. Server creates `data/conversations/{newId}.jsonl`
3. Empty file ready for messages

### Sending a Message
1. User sends message in conversation `{id}`
2. Server appends message to `data/conversations/{id}.jsonl`
3. Server loads last N messages from that file
4. Server loads `agent_memory.md` for long-term context
5. Sends messages + memory to AI agent as context
6. Agent responds with full knowledge of that chat

### Opening an Old Chat
1. User clicks on old conversation `{id}`
2. UI requests `GET /api/conversations/{id}`
3. Server reads `data/conversations/{id}.jsonl`
4. Returns message history to UI
5. When user sends next message, agent loads that file → knows everything said in that chat

### Context Window for Agent

When agent receives a message in a specific chat:

```
System Prompt:
---
You are the GemSage assistant.

LONG-TERM NOTES (user has told you to remember):
- User's name is Haris
- User prefers emerald color theme

CURRENT CONVERSATION CONTEXT (last 50 messages):
User: what did I say earlier?
Assistant: You asked about ruby identification...
...
---
```

## File Size Limits per Conversation
- Each conversation file can grow large
- Auto-compact will trim old messages (see `05-auto-compact.md`)
- Keep last 200 messages, summarize or drop older ones

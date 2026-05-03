# Note System - Agent Memory

## Purpose
When the user says "note [something]", the agent saves that information permanently to `agent_memory.md`. This memory persists across all conversations and sessions.

## Trigger Detection

The word **"note"** triggers note saving. The system detects it in these patterns:

- `"note my name is haris"` → saves "User's name is Haris"
- `"note that I prefer ruby over sapphire"` → saves "User prefers ruby over sapphire"
- `"note this: I work at a gem lab"` → saves "User works at a gem lab"
- `"remember my birthday is March 5"` → saves "User's birthday is March 5" (alternate trigger)

## Where Detection Happens

**Server-side detection** in the message API route (not in the AI prompt):

1. User sends message
2. Server checks if message starts with or contains note trigger words
3. If yes: extract the content after the trigger, append to `agent_memory.md`
4. Continue normal conversation flow

## Note Format in `agent_memory.md`

```markdown
# Agent Memory

- [YYYY-MM-DD HH:MM] <extracted note content>
```

Example:
```markdown
# Agent Memory

- [2026-05-01 12:01] User's name is Haris
- [2026-05-01 14:30] User prefers emerald color theme
- [2026-05-02 09:15] User is working on a gemology project
```

## Trigger Keywords

| Keyword | Example |
|---------|---------|
| `note` | "note my name is Haris" |
| `note this` | "note this: I like rubies" |
| `remember` | "remember I prefer 3D views" |
| `save this` | "save this for later: I'm a jeweler" |

## Duplicate Handling
- Before appending, check if similar note already exists
- Skip if near-duplicate found (simple string similarity check)

## Loading Notes
- On every agent request, load `agent_memory.md`
- Inject notes into system prompt as "LONG-TERM NOTES" section
- Agent uses these notes to personalize responses

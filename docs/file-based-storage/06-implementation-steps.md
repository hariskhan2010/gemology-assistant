# Implementation Steps

## Phase 1: Core File Storage Layer
- [ ] Create `data/` directory structure
- [ ] Create `src/lib/file-store/ensure.ts` — `ensureDataDir()` function
- [ ] Create `src/lib/file-store/users.ts` — append, lookup by email, deduplicate
- [ ] Create `src/lib/file-store/sessions.ts` — create, validate, cleanup expired
- [ ] Create `src/lib/file-store/conversations.ts` — create, append, read by id, list all
- [ ] Create `src/lib/file-store/notes.ts` — append note, read all, detect duplicates

## Phase 2: Update Auth Routes
- [ ] Update `src/app/api/auth/signup/route.ts` — use file store instead of Neon
- [ ] Update `src/app/api/auth/signin/route.ts` — use file store
- [ ] Update `src/app/api/auth/session/route.ts` — use file store
- [ ] Update `src/app/api/auth/signout/route.ts` — invalidate session in file
- [ ] Update `src/app/api/auth/google/callback/route.ts` — use file store
- [ ] Remove `src/lib/db/index.ts` (Neon connection)
- [ ] Remove `src/lib/db/schema.ts` (SQL initialization)

## Phase 3: Note Detection
- [ ] Create `src/lib/file-store/detect-note.ts` — detect "note", "remember", "save this" triggers
- [ ] Integrate into message API route
- [ ] Extract content after trigger keyword
- [ ] Append to `agent_memory.md`
- [ ] Confirm duplicate detection works

## Phase 4: Conversation Context
- [ ] Update conversation API to load correct `{sessionId}.jsonl` on open
- [ ] Inject conversation history into agent system prompt
- [ ] Inject `agent_memory.md` notes into agent system prompt
- [ ] Test: open old chat → send message → agent remembers context

## Phase 5: Auto-Compact
- [ ] Create `src/lib/file-store/compact.ts` — compaction logic
- [ ] Add file size check after each write
- [ ] Implement per-file compaction rules
- [ ] Add `.compact_state` tracking
- [ ] Add 5-minute cooldown between compactions
- [ ] Test: fill a file past 2MB → verify compaction works

## Phase 6: Cleanup
- [ ] Remove all Neon/Postgres dependencies from `package.json`
- [ ] Remove `DATABASE_URL` from `.env.local`
- [ ] Update `AGENTS.md` to reflect new storage system
- [ ] Test full flow: signup → signin → chat → note → old chat → compact

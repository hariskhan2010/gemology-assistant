# StoneWise - Gemology AI Assistant

## Documentation

The product plan has been separated into phased docs for easier execution:

- [Phase Index](docs/implementation-phases.md)
- [Phase 1 - Foundation and Visual System](docs/phases/phase-1-foundation-and-visual-system.md)
- [Phase 2 - Cinematic Auth Experience](docs/phases/phase-2-cinematic-auth-experience.md)
- [Phase 3 - Assistant Shell and Conversation UI](docs/phases/phase-3-assistant-shell-and-conversation-ui.md)
- [Phase 4 - Core AI Text and Faceting Guidance](docs/phases/phase-4-core-ai-text-and-faceting-guidance.md)
- [Phase 5 - Image and Camera Gem Identification](docs/phases/phase-5-image-and-camera-gem-identification.md)
- [Phase 6 - Voice Mode](docs/phases/phase-6-voice-mode.md)
- [Phase 7 - NeonDB User Storage and Sign-In](docs/phases/phase-7-neondb-user-storage-and-sign-in.md)
- [Phase 8 - Hardening and Final Polish](docs/phases/phase-8-hardening-and-final-polish.md)

## Progress

| Phase | Status |
|-------|--------|
| Phase 1 - Foundation & Visual System | ✅ Complete |
| Phase 2 - Cinematic Auth Experience | ✅ Complete |
| Phase 3 - Assistant Shell & Conversation UI | ✅ Complete |
| Phase 4 - Core AI Text & Faceting Guidance | ✅ Complete |
| Phase 5 - Image & Camera Gem Identification | ✅ Complete |
| Phase 6 - Voice Mode | ✅ Complete |
| Phase 7 - NeonDB User Storage & Sign-In | ✅ Complete |
| Phase 8 - AI Accuracy Enhancement | ✅ Complete |
| Phase 9 - Hardening & Final Polish | ✅ Complete |

## AI Accuracy Enhancement (Phase 8)

| Step | Status |
|------|--------|
| 1. System prompt expand (70→357 lines) | ✅ Complete |
| 2. Gemstone data inject (runtime lookup) | ✅ Complete |
| 3. RAG system (pgvector + embeddings) | ✅ 204/204 chunks seeded |
| 4. Test suite (Q&A evaluation) | ✅ 69/69 pass (100%) — expanded with care, advanced treatment, synthetic ID, geographic origin questions |
| 5. Fine-tune | ❌ Pending |

## Key Architecture
- **AI**: Google Gemini 2.5 Flash (free tier) via `@google/generative-ai`
- **Embeddings**: Gemini Embedding (`gemini-embedding-001`, 768d) via REST API
- **Vector DB**: NeonDB + pgvector (HNSW indexes)
- **Knowledge**: 357-line system prompt + 25 gemstone DB + 6 reference docs (RAG, hybrid vector+keyword search)
- **Chat flow**: System prompt → Notes → Gemstone injection → RAG context → Gemini stream
- **Evaluation**: 43-question Q&A suite, independent of LLM, scores on keyword coverage

## Notes

- `seed-all.mjs` has a `DELETE` — do NOT run it, it clears all embeddings
- Use `npm run seed` (runs `seed-incremental.mjs`) — only adds missing chunks, no delete
- Use `npm run evaluate` to verify RAG quality
- Run `seed` first, then `evaluate`, once Gemini daily quota resets

## Theme
- **Color scheme**: Green/emerald tones
- **3D effects**: Rotating gem SVG, card hover transforms, depth shadows, CSS 3D animations

# Phase Index - StoneWise: Gemology AI Assistant

## Overview

StoneWise is an AI-powered gemology assistant that helps users identify gems, learn about gemstone properties, get faceting guidance, and interact via text, image, and voice.

## Phase Breakdown

| Phase | Title | Description | Status |
|-------|-------|-------------|--------|
| 1 | Foundation and Visual System | Project setup, design tokens, theme system, base UI | ✅ Complete |
| 2 | Cinematic Auth Experience | Animated auth flow, login/register pages | ✅ Complete |
| 3 | Assistant Shell and Conversation UI | Chat interface, message components, conversation history | ✅ Complete |
| 4 | Core AI Text and Faceting Guidance | Gemini integration, gemology knowledge base (357-line system prompt) | ✅ Complete |
| 5 | Image and Camera Gem Identification | Image upload, camera capture, visual gem analysis | ✅ Complete |
| 6 | Voice Mode | Speech-to-text, text-to-speech, voice conversation | ✅ Complete |
| 7 | NeonDB User Storage and Sign-In | Database integration, notes, conversation storage | ✅ Complete |
| 8 | AI Accuracy Enhancement | System prompt expansion, gemstone data injection, RAG system (partial) | ✅ Complete |
| 9 | Hardening and Final Polish | Performance, accessibility, testing, deployment | ✅ Complete |

## AI Accuracy Enhancement Progress

| Step | Sub-steps | Status |
|------|-----------|--------|
| 1 | System prompt expand (70→357 lines with full gemological reference) | ✅ Complete |
| 2 | Gemstone data inject (runtime lookup + injection in chat route) | ✅ Complete |
| 3 | RAG system (pgvector, Gemini embeddings, knowledge chunks table, seed/chat integration) | ✅ Complete (204 chunks seeded, 768d HNSW index) |
| 4 | Test suite | ✅ 69/69 pass (100%) |

## Key Files

- `src/lib/knowledge/system-prompt.ts` — 357-line expanded system prompt
- `src/lib/knowledge/gemstones.ts` — 25+ gemstone data objects (RI, SG, Mohs, treatments, origins)
- `src/lib/knowledge/rag.ts` — RAG module (embedding, chunking, vector search)
- `src/app/api/chat/route.ts` — Chat API with gemstone injection + RAG context
- `docs/gemological-reference-data.md` — 762-line professional reference (from GIA, Webster & Read, etc.)

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 + Framer Motion
- **AI Provider:** Google Gemini 2.5 Flash (free tier)
- **Embedding:** Gemini Embedding API (gemini-embedding-001, 768d)
- **Database:** NeonDB (PostgreSQL) + pgvector
- **Auth:** Custom auth flow (bcrypt + jose/JSON Web Tokens)
- **Email:** EmailJS (free tier)

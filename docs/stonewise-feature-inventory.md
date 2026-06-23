# StoneWise Feature Inventory

This document summarizes the features currently present in the StoneWise codebase so it can be used as a clean source for:

1. writing a strong system prompt,
2. describing the product accurately,
3. deciding what still needs to be improved.

---

## 1. Product Summary

StoneWise is a gemology-focused AI assistant for people who want help with:

- identifying gemstones,
- learning gemstone properties,
- asking faceting questions,
- analyzing gem photos,
- speaking with the assistant by voice,
- storing chat history and user-specific notes.

The product is built as a conversational assistant with text, image, camera, and voice interaction modes.

---

## 2. Core User-Facing Features

### A. Gemology chat assistant

Users can ask questions in natural language about:

- gemstone names,
- colors,
- origins,
- hardness,
- refractive index,
- specific gravity,
- crystal systems,
- treatments,
- differences between stones,
- identification guidance,
- faceting guidance.

The current assistant prompt is designed to:

- answer directly,
- avoid unnecessary greetings,
- keep responses concise and factual,
- provide comprehensive gemstone details when a gemstone is mentioned.

### B. Image-based gemstone analysis

Users can:

- upload an image from their device,
- attach an image to a chat message,
- capture a fresh image using their camera,
- open attached images in a larger modal view.

The chat API accepts image data and sends it to the AI model for visual analysis.

### C. Camera capture

Users can:

- open the camera,
- switch between front and rear cameras,
- take a gem photo,
- send the captured photo into the conversation.

### D. Camera Talk mode

This is one of the more distinctive features in the project.

Users can:

- open a full-screen live camera mode,
- speak naturally while the camera is active,
- let the app auto-detect silence,
- capture a camera frame automatically,
- send both the spoken question and current image frame to the assistant,
- hear the assistant answer aloud,
- continue the loop hands-free in auto mode.

In practice, this creates a live “show and ask” experience for gemstones.

### E. Voice features

Users can:

- dictate text into the normal chat input with a microphone button,
- open a dedicated Voice Mode interface,
- use speech-to-text,
- listen to assistant replies through text-to-speech,
- play or stop spoken responses from individual assistant messages.

### F. Conversation interface

Users get:

- a sidebar with previous conversations,
- new-chat creation,
- conversation search,
- delete-conversation controls,
- message timestamps,
- assistant typing/loading state,
- retry support for failed responses,
- markdown-like response rendering for headings, lists, inline code, and code blocks.

### G. Authentication and account flows

Users can:

- sign up with name, email, and password,
- see password-strength feedback during sign-up,
- sign in with email and password,
- sign in with Google OAuth,
- request password reset email,
- reset password,
- sign out,
- remain signed in through stored sessions.

### H. User storage and persistence

The backend includes:

- user accounts,
- session storage,
- conversations,
- messages,
- notes.

The AI can store notes when a user says things like:

- `note: ...`
- `remember: ...`

Those notes are later injected into the assistant prompt and reused in future answers.

---

## 3. Gemology-Specific Knowledge Features

### A. Built-in gemstone information behavior

The current system prompt instructs the assistant to provide, when relevant:

- color,
- origin,
- hardness,
- refractive index,
- specific gravity,
- crystal system,
- treatments.

### B. Faceting guidance data

The repository contains structured faceting reference data for materials including:

- Quartz,
- Sapphire,
- Topaz,
- Emerald,
- Garnet,
- Aquamarine,
- Peridot,
- Tourmaline,
- Ruby,
- Spinel,
- Zircon,
- Alexandrite.

Each entry can include:

- design name,
- cut style,
- crown angle,
- pavilion angle,
- table percentage,
- girdle recommendation,
- total depth,
- cutting notes.

Example supported topics:

- best angles for sapphire,
- how to cut quartz,
- suitable designs for emerald,
- orientation advice for valuable rough.

---

## 4. Visual and UX Features

### A. Brand and design system

The app uses:

- emerald / green gemstone-themed styling,
- 3D card hover effects,
- rotating gemstone hero visual,
- cinematic authentication pages,
- dark polished UI surfaces,
- responsive layouts for desktop and mobile.

### B. Landing page messaging

The home page presents these major product promises:

- Gem Identification,
- Visual Analysis,
- Faceting Guidance,
- Expert Knowledge,
- Authenticated Advice,
- Instant Responses.

Some of those are already represented in the code; some are more aspirational marketing language than fully implemented expert systems.

---

## 5. Important Implementation Notes

These points matter if you want your future system prompt and product copy to stay honest:

### Present in code now

- AI chat through Gemini,
- image input support,
- camera capture,
- Camera Talk,
- speech-to-text,
- text-to-speech,
- sign-up / sign-in / sign-out,
- Google auth routes,
- password reset flow,
- database tables for users, sessions, conversations, messages, and notes,
- note memory behavior.

### Partially implemented or inconsistent

- The phase docs mention Anthropic Claude, but the actual API route currently uses Gemini.
- The landing page claims confidence scores for identification, but the current implementation does not clearly generate or display formal confidence scores.
- The landing page mentions market values, but there is no obvious dedicated market-value dataset or pricing engine in the current code.
- The phase docs mention streaming responses, but the current chat route returns a JSON response rather than true streamed tokens.
- Conversation persistence exists in backend routes, but the chat context currently starts from local mock conversations rather than fully loading saved conversations into the UI.
- The assistant page component itself is empty; the working UI is provided by the assistant layout.

---

## 6. Suggested Feature Categories for a Future System Prompt

When you create a stronger system prompt, these are the most useful capability groups to encode:

### Gem identification

- Ask for observable traits when uncertain.
- Use image evidence carefully.
- Distinguish likely identification from confirmed identification.
- Mention when lab testing is required.

### Gemstone education

- Explain physical and optical properties clearly.
- Compare similar stones.
- Cover common treatments and synthetics.

### Faceting assistant

- Recommend angles and styles by material.
- Explain why a design fits a stone.
- Warn about cleavage, brittleness, zoning, and pleochroism when relevant.

### Memory-aware assistant

- Use saved user notes naturally.
- Respect user preferences and prior context.
- Avoid inventing memories that are not present.

### Multimodal behavior

- For uploaded photos, describe visible evidence first.
- Avoid claiming certainty from appearance alone.
- Suggest next verification steps.

### Safety and trust

- Never present image-only identification as definitive.
- Recommend professional verification for valuation, treatment disclosure, and high-value purchases.
- Be direct, but do not overstate certainty.

---

## 7. Draft Feature List for Product Copy

You can reuse this shorter version in a website, pitch deck, or prompt brief:

1. AI-powered gemology chat for gemstone identification and education  
2. Image upload and camera-based gemstone analysis  
3. Hands-free Camera Talk mode with live camera + voice interaction  
4. Voice input and spoken assistant responses  
5. Faceting guidance with angle recommendations and material-specific notes  
6. Personal memory through saved user notes  
7. Conversation history with search and chat management  
8. User accounts, sign-in, Google auth, and password reset  
9. Polished gemstone-themed interface with mobile-friendly design  

---

## 8. Best One-Sentence Description

StoneWise is a multimodal gemology assistant that helps users identify gemstones, study their properties, receive faceting guidance, and interact through text, images, camera, and voice.


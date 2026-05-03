# Phase 4 - Core AI Text and Faceting Guidance

## Goal

Integrate Anthropic Claude API for real AI-powered gemology responses and implement a comprehensive gemology knowledge base system prompt.

## Tasks

### 4.1 AI API Integration

- Install `@anthropic-ai/sdk`
- Create API route `/api/chat` using Next.js Route Handlers
- Implement streaming responses with `streamText` or manual streaming
- Add environment variable for API key
- Handle errors gracefully

### 4.2 System Prompt Engineering

- Create gemology-specific system prompt
- Include knowledge about gem identification, properties, treatments
- Faceting guidance with angles and techniques
- Reference standards (GIA, AGS)
- Safety disclaimers about professional verification

### 4.3 Chat Context Integration

- Replace mock AI responses with real API calls
- Add streaming state management
- Handle partial message rendering
- Error recovery for failed requests

### 4.4 Faceting Guidance Module

- Structured faceting data for common gems
- Angle recommendations by stone type
- Cut types (brilliant, step, mixed)
- Display formatting for angles and diagrams

### 4.5 Response Formatting

- Markdown rendering for code blocks, lists, bold
- Proper formatting for technical data
- Copy-to-clipboard functionality

## Deliverables

- Working `/api/chat` route with Claude streaming
- Gemology system prompt
- Real AI responses in chat
- Markdown-formatted responses
- Error handling and retry logic

## Success Criteria

- AI responds to gemology questions accurately
- Streaming responses display in real-time
- Build passes with no errors
- Proper error states shown to user

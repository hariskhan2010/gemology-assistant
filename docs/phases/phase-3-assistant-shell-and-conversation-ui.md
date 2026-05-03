# Phase 3 - Assistant Shell and Conversation UI

## Goal

Build the main assistant interface with a chat-like conversation UI, sidebar for conversation history, and message components.

## Tasks

### 3.1 Assistant Layout

- Create `/assistant` route group
- Build `AssistantLayout` with sidebar + main chat area
- Responsive design (collapsible sidebar on mobile)
- Header with user info and settings

### 3.2 Conversation Sidebar

- List of past conversations
- "New Chat" button
- Conversation items with title preview and timestamp
- Active conversation highlighting
- Delete conversation action
- Search conversations

### 3.3 Chat Area

- Welcome screen for new conversations
- Message list with auto-scroll
- Loading indicator for streaming responses
- Timestamps on messages
- Copy message button

### 3.4 Message Components

- `UserMessage` - right-aligned, user avatar, text
- `AssistantMessage` - left-aligned, gem icon avatar, formatted text
- `SystemMessage` - centered, muted styling, info icons
- `MessageActions` - copy, retry, regenerate

### 3.5 Chat Input

- Multi-line textarea with auto-resize
- Send button with loading state
- Attachment button (placeholder for Phase 5)
- Voice button (placeholder for Phase 6)
- Disabled state during response generation
- Keyboard shortcut (Enter to send, Shift+Enter for newline)

### 3.6 State Management

- Client-side conversation state
- Message type definitions
- Mock data for testing
- Conversation context provider

## Deliverables

- `/assistant` main chat page
- Sidebar with conversation history
- Full message component set
- Chat input with all controls
- Responsive layout (mobile-first)
- Mock conversation data

## Success Criteria

- Sidebar collapses on mobile with toggle
- Messages render correctly for all types
- Input auto-resizes with content
- Auto-scroll works on new messages
- Build passes with no errors

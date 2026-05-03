# Phase 6 - Voice Mode

## Goal

Enable voice interaction with the AI assistant through speech-to-text input and text-to-speech output.

## Tasks

### 6.1 Speech-to-Text Hook

- Use Web Speech API (`SpeechRecognition`)
- Real-time transcription display
- Auto-stop on silence detection
- Browser compatibility check
- Permission handling

### 6.2 Text-to-Speech Hook

- Use Web Speech API (`SpeechSynthesis`)
- Voice selection (prefer natural voices)
- Play/pause/stop controls
- Adjustable speed and pitch
- Strip markdown before speaking

### 6.3 Voice Input in Chat

- Microphone button in chat input
- Recording indicator with waveform animation
- Auto-submit on silence
- Manual send option

### 6.4 Voice Response Reading

- Auto-read AI responses toggle
- Speak button on each message
- Stop reading button

### 6.5 Full Voice Mode

- Toggle between text and voice modes
- Full-screen voice interface
- Waveform visualization
- Push-to-talk or hands-free

## Deliverables

- `useSpeechToText` hook
- `useTextToSpeech` hook
- Voice input in chat input bar
- Speak/stop buttons on messages
- Voice mode toggle
- Recording UI overlay

## Success Criteria

- Speech recognition works in supported browsers
- AI responses are read aloud
- Build passes with no errors
- Graceful fallback for unsupported browsers

# Phase 5 - Image and Camera Gem Identification

## Goal

Enable users to upload gem photos or capture images with their camera for AI-powered visual gem identification.

## Tasks

### 5.1 Image Upload Component

- File input with drag-and-drop zone
- Image preview thumbnail
- File validation (type, size limits)
- Remove image button
- Multiple file support (future)

### 5.2 Camera Capture Component

- Camera access via `navigator.mediaDevices`
- Live camera feed preview
- Capture button
- Front/back camera toggle (mobile)
- Permission handling

### 5.3 Image Message Integration

- Image displayed inline in chat messages
- User messages show attached image above text
- Image modal/lightbox for full-size view
- Responsive image sizing

### 5.4 Chat API Update

- Update `/api/chat` to accept base64 images
- Pass images to Claude's vision capabilities
- Use `image_url` content blocks in API calls

### 5.5 Drag and Drop

- Drop zone overlay on chat area
- Visual feedback during drag
- Auto-append to pending message

## Deliverables

- Image upload with preview
- Camera capture modal
- Images in chat messages
- Vision API integration
- Drag-and-drop support

## Success Criteria

- Images upload and preview correctly
- Camera works on mobile and desktop
- AI analyzes images and responds
- Build passes with no errors

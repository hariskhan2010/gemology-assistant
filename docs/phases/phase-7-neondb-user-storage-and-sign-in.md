# Phase 7 - NeonDB User Storage and Sign-In

## Goal

Integrate NeonDB (PostgreSQL) for user authentication, conversation persistence, and user profiles.

## Tasks

### 7.1 Database Setup

- Install `postgres` (node-postgres) or `@neondatabase/serverless`
- Create database schema: users, conversations, messages
- Set up connection pool
- Database migration scripts

### 7.2 User Authentication

- Password hashing with bcrypt
- Sign-up API route: create user, hash password
- Sign-in API route: verify password, create session
- JWT-based session management
- HTTP-only cookies for session storage

### 7.3 Auth Middleware

- Route middleware to protect `/assistant`
- Redirect unauthenticated users to `/auth/signin`
- Attach user info to request context

### 7.4 Update Auth Pages

- Connect sign-up form to API
- Connect sign-in form to API
- Show loading states and errors
- Redirect to `/assistant` on success

### 7.5 Conversation Persistence

- Save conversations to database
- Load user's conversations on login
- Delete conversations
- Associate messages with conversations and users

### 7.6 User Profile

- Display user name in sidebar
- Profile settings page (future)
- Sign out functionality

## Deliverables

- Working NeonDB connection
- User registration and login
- JWT session management
- Protected `/assistant` route
- Conversations persisted in database
- User profile in sidebar

## Success Criteria

- Users can sign up and sign in
- Sessions persist across page reloads
- Conversations load from database
- Unauthenticated users redirected from `/assistant`
- Build passes with no errors

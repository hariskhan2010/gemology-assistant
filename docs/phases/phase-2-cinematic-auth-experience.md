# Phase 2 - Cinematic Auth Experience

## Goal

Create an immersive, animated authentication flow with sign-in and sign-up pages featuring cinematic visuals and smooth transitions.

## Tasks

### 2.1 Auth Layout

- Create `/auth` route group with shared layout
- Build `AuthLayout` component with split-screen design
- Left side: cinematic animated background
- Right side: auth form container

### 2.2 Cinematic Background

- Animated particle/gemstone effect using CSS
- Gradient orbs with slow movement
- Subtle light rays or sparkle effects
- Dark, moody atmosphere with gemstone colors

### 2.3 Sign-In Page

- Email and password fields
- "Remember me" checkbox
- "Forgot password" link
- Social auth buttons (placeholder)
- Link to sign-up page
- Form validation
- Loading states

### 2.4 Sign-Up Page

- Full name, email, password, confirm password fields
- Password strength indicator
- Terms agreement checkbox
- Link to sign-in page
- Form validation with real-time feedback
- Loading states

### 2.5 Auth Form Components

- `AuthInput` - Input with label, icon, validation, error
- `AuthSubmitButton` - Full-width submit button with loading
- `SocialButton` - Social auth button variant
- `PasswordStrength` - Visual password strength meter
- `AuthDivider` - Divider with "or continue with" text

### 2.6 Animations

- Page entrance animations (fade + slide)
- Input focus transitions
- Button hover/active states
- Background particle animation
- Smooth transitions between sign-in and sign-up

## Deliverables

- `/auth/signin` page with full form
- `/auth/signup` page with full form
- Shared cinematic auth layout
- Animated background component
- All auth UI components
- Form validation logic

## Success Criteria

- Both auth pages render correctly
- Forms validate on submit
- Animations are smooth (60fps)
- Mobile responsive
- Accessible form labels and ARIA attributes

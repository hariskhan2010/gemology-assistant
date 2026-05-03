# Phase 1 - Foundation and Visual System

## Goal

Establish the project foundation, configure the tech stack, build the design system, and create the initial landing page.

## Tasks

### 1.1 Project Setup

- Initialize Next.js 14+ project with App Router
- Configure TypeScript with strict mode
- Set up Tailwind CSS with custom theme
- Configure ESLint and Prettier
- Set up project directory structure

### 1.2 Design Tokens

Define the following tokens in Tailwind config:

**Colors:**
- Primary: Deep gemstone purple (#6B21A8), sapphire blue (#1E40AF)
- Accent: Ruby red (#DC2626), emerald green (#059669)
- Background: Dark theme primary (#0A0A0F), secondary (#12121A)
- Surface: Card backgrounds (#1A1A2E), elevated (#252540)
- Text: Primary (#F5F5F7), secondary (#9CA3AF), muted (#6B7280)
- Border: Subtle (#2D2D3F)

**Typography:**
- Headings: Playfair Display (serif, elegant)
- Body: Inter (sans-serif, readable)
- Code: JetBrains Mono

**Spacing:** 4px base unit system

**Border Radius:**
- Small: 4px, Medium: 8px, Large: 16px, Full: 9999px

### 1.3 Base Layout

- Root layout with dark theme
- Font configuration (Google Fonts)
- Metadata and SEO basics
- Global CSS with Tailwind directives

### 1.4 Components

- `Navbar` - Top navigation with logo and auth links
- `Footer` - Bottom footer with links
- `Button` - Primary, secondary, ghost variants
- `Input` - Text input with label and validation states
- `Card` - Glassmorphic card component
- `Badge` - Tag/chip component
- `Icon` - SVG icon wrapper

### 1.5 Landing Page

- Hero section with animated gemstone visual
- Features grid
- Call-to-action section
- Responsive design

## Deliverables

- Fully configured Next.js project
- Design system with tokens
- Reusable component library
- Responsive landing page

## Success Criteria

- `npm run dev` starts without errors
- Tailwind classes compile correctly
- All components render on landing page
- Mobile responsive down to 320px

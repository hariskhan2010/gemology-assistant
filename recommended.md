# GemSage — SEO & Implementation Audit

> GemSage is an AI-powered gemology assistant for gem identification, faceting guidance, and gemstone education.
> Site: gemology-assistant.vercel.app | Repo: github.com/hariskhan2010/gemology-assistant

---

## Status Key
✅ Done & deployed | ⚡ In progress | 🔲 Not started

---

## 1. Critical Technical SEO

| Item | Status | Notes |
|------|--------|-------|
| Unique title tags per page | ✅ | `usePageTitle` hook on 12 client pages (encyclopedia list, detail, compare, gallery, saved, profile, signin, signup, assistant, etc.) |
| OG image (1200×630) | ✅ | `/public/og-image.svg` — green gem theme, configured in root layout |
| Unblock crawler paths | ✅ | `robots.txt` allows `/assistant/` and `/auth/` |
| Expand sitemap | ✅ | 37 URLs including all gem detail pages, static routes, auth pages |
| Twitter Card metadata | ✅ | `summary_large_image` in root layout |
| Complete OG metadata (url, site_name, image dimensions) | ✅ | Added to root layout metadata |

## 2. Structured Data (JSON-LD)

| Schema | Page | Status | Notes |
|--------|------|--------|-------|
| SoftwareApplication | Homepage (`/`) | ✅ | Inside a `<script type="application/ld+json">` block |
| Product | Each gem detail page (`/gems/encyclopedia/[slug]`) | ✅ | Name, category, description, material, brand |
| ItemList | Encyclopedia list | 🔲 | Low priority — list pages seldom get rich results |
| BreadcrumbList | All sub-pages | 🔲 | Breadcrumb component exists but lacks JSON-LD schema; Google can infer breadcrumbs from HTML structure |

## 3. Content & Headings

| Item | Status | Notes |
|------|--------|-------|
| H2 section headings on encyclopedia | ✅ | "Precious Stones", "Semi-Precious Stones", "Organic Gems" with auto-collapse on search |
| H2/H3 on compare page | ✅ | H2 subtitle + H3 property group rows (General, Physical, Treatment, Value, Description) |
| H1 on assistant page | ✅ | Visually-hidden H1 added to layout |
| Proper H1 on reset-password page | ✅ | All three headings changed from H2 to H1 |
| Meta description rewrite | ✅ | Updated root layout + OG description |
| Tutorial/blog articles | ✅ | 5 articles at `/blog/` with listing + detail pages, JSON-LD Article schema |
| Comparison content pages (`/compare/ruby-vs-sapphire`) | ✅ | 5 dedicated comparison pages at `/compare/[pair]` with detailed tables + verdicts; linked from compare tool |

## 4. Performance & Images

| Item | Status | Notes |
|------|--------|-------|
| `next/image` for static logos | ✅ | Navbar, AuthLayout, homepage hero |
| `next/image` for gallery/saved thumbnails | 🔲 | Left as `<img>` — values can be base64 data URIs (not supported by next/image). Added `loading="lazy"`. |
| Install `sharp` | ✅ | `sharp` in dependencies for production image optimization |
| Image dimensions on all `<img>` | ✅ | Gallery images use `aspect-square` container + `object-contain`. Saved gems use `h-32`. No CLS. |

## 5. Internal Linking & Navigation

| Item | Status | Notes |
|------|--------|-------|
| Breadcrumb component | ✅ | `src/components/ui/Breadcrumbs.tsx` — reusable |
| Breadcrumbs on encyclopedia list | ✅ | |
| Breadcrumbs on gem detail | ✅ | |
| Breadcrumbs on compare page | ✅ | |
| Breadcrumbs on gallery page | ✅ | |
| Breadcrumbs on saved gems page | ✅ | |
| Breadcrumbs on profile page | ✅ | |
| Cross-linking ("Similar Gems") on detail pages | ✅ | Shows 3 gems from same category with "Compare" links |
| Fix `/auth` broken CTA on homepage | ✅ | Links to `/auth/signup` |

## 6. Remaining Work

These are the items still open:

### All items complete

---

*Last updated: May 2026*

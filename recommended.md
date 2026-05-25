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
| H2 section headings on encyclopedia | 🔲 | Consider "Precious Stones", "Semi-Precious Stones", "Organic Gems" |
| H2/H3 on compare page | 🔲 | "Compare Properties", property groups |
| H1 on assistant page | 🔲 | Currently no heading at all on core chat page |
| Proper H1 on reset-password page | 🔲 | Currently uses H2 as top heading |
| Meta description rewrite | 🔲 | Current meta description could be more keyword-rich |
| Tutorial/blog articles | 🔲 | Long-term content marketing |
| Comparison content pages (`/compare/ruby-vs-sapphire`) | 🔲 | Long-term — existing compare tool handles dynamic comparisons |

## 4. Performance & Images

| Item | Status | Notes |
|------|--------|-------|
| `next/image` for static logos | ✅ | Navbar, AuthLayout, homepage hero |
| `next/image` for gallery/saved thumbnails | 🔲 | Left as `<img>` because values can be base64 data URIs (not supported by next/image) |
| Install `sharp` | ✅ | `sharp` in dependencies for production image optimization |
| Image dimensions on all `<img>` | 🔲 | Dynamic/gallery images don't have fixed dimensions |

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

### Low effort
- Add H1 heading to `/assistant` page (currently missing entirely)
- Add H2 category headings to `/gems/encyclopedia` page
- Add property group headings on `/gems/compare` page
- Update root layout meta description with more keyword-rich copy

### Medium effort
- Restructure reset-password page to use H1 instead of H2 as top heading

### Long-term
- Create tutorial/blog content (e.g., "How to Identify Gemstones with AI", "Gemstone Hardness Comparison Guide")
- Create dedicated comparison pages (`/compare/ruby-vs-sapphire`, etc.) for search traffic
- Wire up Save Gem button on encyclopedia detail page ✅ (May 2026)

---

*Last updated: May 2026*

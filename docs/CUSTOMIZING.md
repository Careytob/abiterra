# Customizing the site

## Brand name, tagline, contact details
Set the `NEXT_PUBLIC_SITE_NAME`, `..._TAGLINE`, `..._CONTACT_*` and `..._SOCIAL_*` variables (see [CONFIGURATION.md](CONFIGURATION.md)) and redeploy.

## Logo, favicon, hero image
| What | File | Notes |
|---|---|---|
| Logo | `public/logo.svg` | Shown in the top menu. Keep the wide shape; about 2:1 works well |
| Favicon | `app/icon.png` and `app/apple-icon.png` | Placeholders (a teal house). Replace with your own PNGs; Next.js picks them up automatically |
| Home page photo | `public/hero_image.webp` | Also used when the site is shared on social media. Use an image you have the right to use |

## Colours and fonts
The site uses Tailwind's `teal` as its brand colour. The simplest rebrand is a project-wide search and replace of
`teal-` (for example `teal-600`) with another Tailwind colour such as `indigo-` or `emerald-`. Theme settings live in
`tailwind.config.js` (the file Tailwind loads) and global styles in `app/globals.css`. The font is Roboto, loaded in `app/layout.tsx`.

## Pages and wording
| Page | File |
|---|---|
| Home | `app/page.tsx` |
| About | `app/aboutus/page.tsx` |
| Contact | `app/contact/` |
| Privacy policy, Terms | `app/privacy-policy/page.tsx`, `app/terms-and-conditions/page.tsx` (**templates, not legal advice**) |
| Footer, top menu | `app/Footer.tsx`, `app/NavBar.tsx` |

## Blog
Add a Markdown file to `content/blog/`. The file name becomes the address (`my-post.md` is `/blog/my-post`):

```markdown
---
title: "A title (put it in quotes if it contains a colon)"
author: Your Name
publishDate: 'October 1, 2026'
category: Buying Guide
tags:
  - first tag
  - second tag
excerpt: A one or two sentence summary shown on the blog index.
coverImage: /images/blog/my-cover.webp
---

# Heading

Your article in Markdown.
```

Put cover images in `public/images/blog/` and refer to them with a leading `/`. A post with invalid front matter is skipped
and a message is written to the server log; the other posts keep working.

## Sample listings and photos
`npm run seed:demo` uses illustrations from `scripts/seed-assets/`. To use real photos, replace those files (keep the names)
and run `npm run seed:demo -- --reset`.

## Map
The map uses OpenStreetMap's public tile server. That is fine for a demo, but OpenStreetMap's usage policy does not allow heavy or
commercial traffic. Before launching a busy site, switch to a commercial tile provider (MapTiler, Stadia Maps, Mapbox and others) by
changing the `url` and attribution on the `TileLayer` in `app/components/Map.tsx`.

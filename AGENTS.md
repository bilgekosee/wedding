<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Hedef: mobil, dikey, tek seferlik açılış

Bu davetiye **birincil olarak telefonda** açılır (WhatsApp linki → in-app browser → Safari/Chrome). Her karar bu gerçeğe göre verilir:

- **Mobile-first, her zaman.** Önce `base` Tailwind sınıflarını mobil için yaz; `sm:`/`md:`/`lg:` sadece daha büyük ekran iyileştirmesi. Masaüstü "yan ürün"dür, ana hedef değildir.
- **Hedef cihazlar:** iPhone SE (375px) → iPhone 15 Pro Max (430px) → katlanır Android'ler. 360px genişlikte hiçbir şey taşmamalı, yatay scroll **yasak**.
- **Dikey kompozisyon.** İçerik tek sütun akar; çok sütunlu grid'leri sadece `md:` ve üzerinde aç.
- **Dokunma hedefleri ≥ 44×44px** (Apple HIG). Linkler/butonlar arası dikey boşluk en az 8px.
- **Font boyutu ≥ 16px** body için (iOS auto-zoom'u önler). Başlıklar `clamp()` veya `text-*` ölçekleri ile akıcı.
- **Safe-area:** iOS notch/home indicator için `pt-[env(safe-area-inset-top)]` ve `pb-[env(safe-area-inset-bottom)]` köşelerde uygula.
- **WhatsApp in-app browser** kısıtlamaları: pop-up yok, yeni sekme açma, custom font yükleme yavaş — `next/font` ile preload zorunlu, fallback font açıkça belirt.
- **Açılış hedefi:** 4G'de **< 2 sn** ilk anlamlı boya. Hero görseli LCP'yi geçmesin — `priority` ver, `sizes` doğru tanımla, WebP/AVIF tercih et.
- **Tek scroll deneyimi.** İdeal akış: hero (isimler) → tarih sayacı → etkinlikler → harita → RSVP → alt bilgi. Hamburger menü/navbar gerekmez; davetiye bir poster gibidir.
- **Offline-dostu.** Mekân adresleri, tarihler, telefon numaraları HTML'de statik render edilsin — JS başarısız olsa bile görünmeli.
- **Test:** Chrome DevTools'da "iPhone SE" + "Throttling: Slow 4G" altında ve gerçek telefonda kontrol et. Tarayıcıda 1920px'de iyi görünmesi yetmez.

Masaüstünde içerik mobil tasarımın **merkezde 480px max-width kart** halinde gösterilmesi olarak ele alınır; ayrı bir desktop layout yazma.

# Davetiye bilgileri (proje gerçeği)

Bu site **Fatma Nur & Salih**'in düğün davetiyesidir. Aileler: **Şahin Ailesi** ve **Kavuşkan Ailesi**. Slogan: *"Özel günler birlikte güzel."*

Üç etkinlik var — sırayı, tarihi ve adresi **asla değiştirme**, sadece davetiyede yazılan bilgileri kullan:

| Etkinlik | Tarih | Gün | Saat | Mekân | Adres |
|---|---|---|---|---|---|
| Kına | 28.06.2026 | Pazar | 18:30 | Nesli Bey Kına Konağı | Hacettepe Mah. Basamaklı Sk. No:1, Hamamönü Altındağ / Ankara |
| Nikâh | 29.06.2026 | Pazartesi | 14:00 | Nazım Hikmet Kültür Merkezi Nikâh Salonu | Yenimahalle / Ankara |
| Düğün | 04.07.2026 | Cumartesi | 19:00 | Şehit Jandarma Er Recep Çelik Anaokulu Bahçesi | Zeyne Mahallesi, Gülnar / Mersin |

Kına notu (aynen göster, kısaltma): *"Kına hanımlara mahsus olup erkekler için ayrı alan mevcuttur."*

Görsel dil: davetiyedeki estetiği koru — el yazısı (script) başlıklar + ferah serif gövde, beyaz/krem zemin, ince siyah tipografi, suluboya yeşil yaprak motifi. Renk paletini `@theme` içinde tek noktadan tanımla; component'larda hex yazma.

# Stack

- Next.js 16 (App Router) · React 19 · TypeScript 5 · Tailwind CSS 4 (PostCSS) · ESLint 9.
- Package manager: npm. Do not introduce yarn/pnpm/bun lockfiles.
- Node engine: whatever `next@16` requires — do not pin a different one.

# Before writing code

- For any Next.js API (routing, caching, fetch, metadata, fonts, server actions, middleware), open `node_modules/next/dist/docs/` first. Training-data Next.js is wrong here.
- For Tailwind 4 (CSS-first config, `@theme`, `@import "tailwindcss"`), check the installed docs — not v3 habits.
- Run `npm run lint` and `npx tsc --noEmit` before declaring done.

# File layout

- App code lives under `src/app/`. Co-locate route-specific components in the route folder; share via `src/components/` only when used by 2+ routes.
- Server Components by default. Add `"use client"` only when the file truly needs interactivity, browser APIs, or hooks.
- Route handlers in `route.ts`. Server Actions in `actions.ts` next to the route that owns them.
- No `pages/` directory. No `getServerSideProps` / `getStaticProps`.

# React 19 / Components

- Function components only. No `forwardRef` boilerplate — `ref` is a regular prop in React 19.
- Use `use()` for unwrapping promises in Server Components; do not block with `await` in render paths that can stream.
- Prefer Server Components for data fetching; pass serializable props to client islands. Never import server-only modules from a client component.
- Keep client components small and leaf-shaped — push state down, keep layout/data up.

# Styling

- Tailwind utility classes in JSX. Global tokens belong in `src/app/globals.css` under `@theme`.
- No CSS-in-JS libraries (styled-components, emotion). No CSS modules unless the user asks.
- Wedding palette / typography lives in `@theme` — reuse tokens, don't hardcode hex values in components.

# Images & assets

- Use `next/image` for all raster images in `public/`. Provide width/height or `fill` + sized parent.
- SVGs: inline as components when interactive, otherwise `next/image`.
- Fonts: `next/font` only (already wired in `layout.tsx`). Don't add `<link>` tags for Google Fonts.

# Data & forms

- RSVP and any guest input goes through Server Actions, not client `fetch` to a route handler, unless there's a reason.
- Validate on the server. Treat all guest input as untrusted (XSS, oversized payloads, duplicate submissions).
- Never log guest PII (names, contact info) to stdout in production paths.

# Performance (mobil 4G hedefi)

- Tek sayfa davetiye — ilk boya kritik. Her byte misafirin mobil verisinden gidiyor.
- **Bundle bütçesi:** ilk yüklenen JS < 80KB gzipped. Yeni client component eklerken bütçeyi düşün.
- Hero altındaki ağır parçaları (harita iframe, galeri, sayaç animasyonu) `next/dynamic` ile ertele; gerekirse `loading="lazy"`.
- Statik render edilebilen her rotayı statik render et. `revalidate` tercih edilir; `cache: 'no-store'` sadece gerçekten dinamik veri için.
- Görsel: davetiye fotoğrafları `next/image` + AVIF/WebP, `sizes` ile 1x boyut indirilsin (Retina için 2x DPR'yi `next/image` zaten halleder).

# Accessibility (non-negotiable for an invitation)

- Semantic HTML first; ARIA only when semantics fall short.
- All interactive elements reachable by keyboard with visible focus.
- Contrast ≥ WCAG AA against the chosen palette. Test light backgrounds carefully — gold/cream on white fails.
- Provide `alt` for every meaningful image; decorative images get `alt=""`.

# Internationalization

- UI copy in Turkish unless the user says otherwise. Date/time formatting via `Intl.DateTimeFormat("tr-TR", …)` — never hand-roll.
- Set `<html lang>` to match the rendered locale.

# What NOT to do

- No new dependencies without asking — every byte ships to the guest's phone.
- No analytics, trackers, or third-party scripts by default.
- No `any` in TypeScript. No `// @ts-ignore` — use `// @ts-expect-error` with a reason if truly unavoidable.
- No console.log in committed code.
- No commented-out code. Delete it; git remembers.
- Don't scaffold features the user didn't ask for (auth, CMS, admin panel, etc.).

# Commits

- Conventional-ish: `feat:`, `fix:`, `chore:`, `style:`, `refactor:`. Subject in Turkish or English, pick one and stay consistent.
- One logical change per commit. Don't bundle unrelated edits.

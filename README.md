# SPARKTALE showcase

A standalone React + TypeScript + Vite concept showcase. The interactive prototype is maintained separately and is not modified by this project.

## Run locally

```sh
npm install
npm run dev -- --port 5174
```

## Production check

```sh
npm run build
npm run preview
```

The build runs TypeScript checks before producing `dist/`.

## Replace placeholders

Edit `src/config.ts` to set `siteConfig.prototypeUrl` and the four team profiles (name, role, optional image and portfolio URL). Until a prototype URL is set, Open Full Playground remains disabled. The three-step walkthrough uses illustrative sticker compositions. Replace these with real screenshots or videos when available.

Original sticker files were copied from the sibling prototype's `public/art` directory and retain their original appearance. The Quick Create showcase only uses three preset words and has no AI or backend integration. It supports pointer dragging, arrow-key movement, replay, reset, and reduced-motion preferences.

The hero uses a bounded, lightweight gravity simulation with sticker collisions and floor bounces. It stops after settling and presents a static arrangement when reduced motion is enabled. Scroll reveals use IntersectionObserver without scroll hijacking.

Hero stickers use unique PNG artwork, with a viewport-dependent count to keep spacing open. Drag and release to throw; arrow keys move a focused sticker and Space/Enter toss it. Reduced motion keeps direct positioning available without automatic falling or tossing.

## Story gallery

Edit `src/storyGalleryData.ts` to replace the four explicit placeholders with team-created screenshots. Set `screenshot` to a public asset path, supply `imageDescription` and the real Story Event `caption`, and set `placeholder: false`. Images use `object-fit: contain` so story content is preserved. The gallery supports native swipe scrolling, mouse dragging, arrow controls, keyboard browsing, and a native modal preview.

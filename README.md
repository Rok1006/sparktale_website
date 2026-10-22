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

Edit `src/config.ts` to set `siteConfig.prototypeUrl` and the four team profiles (name, role, optional image and portfolio URL). Until a prototype URL is set, Start Creating remains disabled. Product walkthrough previews are illustrative compositions; replace `DemoScene` with real screenshots or videos when available.

Original sticker files were copied from the sibling prototype's `public/art` directory and retain their original appearance. The Quick Create showcase only uses three preset words and has no AI or backend integration. It supports pointer dragging, arrow-key movement, replay, reset, and reduced-motion preferences.

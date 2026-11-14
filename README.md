# Event Server Archive

Downloadable archive of Minecraft Bedrock live event servers: resource packs and world captures.

Live at https://archive.mceventrecreations.net · Discord: https://discord.gg/xMrjxHXuUm

## Adding or editing an event

1. Edit `events.mjs` (newest event goes at the top). Known bugs go in `issues`; what the archive still lacks is worked out automatically, or set it with `missing`.
2. Put downloads in `downloads/<SLUG>/` (or link a GitHub release for large files) and images in `images/`.
3. Run `node build.mjs` to regenerate every page, `tools.html`, `404.html`, `sitemap.xml` and `robots.txt`.
4. Commit the generated files; GitHub Pages serves them as-is.

The first-visit pop-up lives in `js/site.js`. Change `SEEN_KEY` there to show a new announcement to everyone once.

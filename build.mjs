// Generates every page of the site from events.mjs:
//   index.html, one page per event, tools.html, 404.html, sitemap.xml, robots.txt
// The markup matches the classes in css/index.css, so the look stays the same.
// Usage: node build.mjs
import { writeFileSync } from "node:fs";
import { site, events } from "./events.mjs";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const abs = (src) => (/^https?:/.test(src) ? src : `${site.url}/${src}`);
const iconType = (src) => (src.endsWith(".ico") ? "image/x-icon" : "image/png");
const jsonLd = (data) => `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
const ext = `target="_blank" rel="noopener"`;

const TOOLS_SLUG = "tools";

// ---------------------------------------------------------------- shared parts

function head({ title, description, canonical, icon, image, type = "website", schema = [], noindex = false }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="google-site-verification" content="Wtj6zh-oEeYpTUiTC_h-AhU2DPJu8-FoAQ5UI6y1JKc">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  ${canonical ? `<link rel="canonical" href="${canonical}">` : ""}
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
  <link rel="icon" href="${esc(icon)}" type="${iconType(icon)}">
  <meta name="theme-color" content="#2d2d2d">

  <meta property="og:type" content="${type}">
  <meta property="og:site_name" content="${esc(site.title)}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  ${canonical ? `<meta property="og:url" content="${canonical}">` : ""}
  <meta property="og:image" content="${esc(abs(image))}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${esc(abs(image))}">

  <link rel="preconnect" href="https://minecraft.wiki">
  <link rel="preconnect" href="https://raw.githubusercontent.com" crossorigin>
  <link rel="stylesheet" href="css/index.css">
  <script src="js/site.js" defer></script>
${schema.map((s) => `  ${jsonLd(s)}`).join("\n")}
</head>`;
}

function topBar(isHome) {
  const title = isHome ? `<h1 class="title">${esc(site.title)}</h1>` : `<a class="title" href="./">${esc(site.title)}</a>`;
  const button = isHome
    ? `<button class="menu-button" id="menu-button" aria-expanded="false" aria-controls="menu-panel">☰ <span class="menu-label">Menu</span></button>`
    : `<a class="menu-button" href="./">◀ <span class="menu-label">Home</span></a>`;
  const menu = isHome
    ? `
      <nav class="menu-panel" id="menu-panel" aria-label="Events" hidden>
${events.map((e) => `        <a href="${e.slug}">${esc(e.name)}</a>`).join("\n")}
        <a href="${TOOLS_SLUG}" class="menu-divider">Tools</a>
      </nav>`
    : "";
  return `    <header class="top-bar">
      ${title}
      <div class="top-buttons">
        ${button}
      </div>${menu}
    </header>`;
}

const bottom = `    <div class="credit">- ${esc(site.credit)}</div>

    <footer class="bottom-bar">
      <div class="bottom-buttons">
        <a href="${site.discord}" class="discord-button" ${ext}>Discord</a>
        <a href="${TOOLS_SLUG}" class="discord-button tools-button">Tools</a>
      </div>
      <div class="disclaimer">
        ${esc(site.title)} is not associated with Microsoft Corporation or Mojang AB. Mojang and Minecraft are trademarks of Mojang AB.
      </div>
    </footer>
  </div>
</body>
</html>
`;

function page(headArgs, isHome, content) {
  return `${head(headArgs)}
<body>
  <div class="page-wrapper">
${topBar(isHome)}

    <main class="content">
${content}
    </main>

${bottom}`;
}

const crumbs = (items) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map(([name, url], i) => ({ "@type": "ListItem", position: i + 1, name, item: url })),
});

const button = (href, label, extra = "", attrs = "") =>
  `<a href="${esc(href)}" class="download-button${extra}"${attrs ? ` ${attrs}` : ""}>${esc(label)}</a>`;

// ---------------------------------------------------------------- home

const gridItem = (e) => `        <a href="${e.slug}">
          <div class="grid-item">
            <img src="${esc(e.thumb)}" class="map-thumbnail" alt="${esc(e.name)} icon" width="128" height="128">
            <div class="map-name"><strong>${esc(e.name)}</strong></div>
            <div class="map-name">By ${esc(e.by)}</div>
          </div>
        </a>`;

function index() {
  return page(
    {
      title: `${site.title} - Download Minecraft Bedrock Event Servers`,
      description: site.description,
      canonical: `${site.url}/`,
      icon: "images/packs/AMMLE.png",
      image: "images/embed_icon.png",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: site.title,
          url: `${site.url}/`,
          description: site.description,
        },
        {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Archived Minecraft Bedrock event servers",
          itemListElement: events.map((e, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${site.url}/${e.slug}`,
            name: e.name,
          })),
        },
      ],
    },
    true,
    `      <div class="grid-container">
${events.map(gridItem).join("\n\n")}
      </div>`,
  );
}

// ---------------------------------------------------------------- event pages

function screenshotCard(w) {
  // GIF sprites and top-down maps (contain: true) are shown whole instead of cropped
  const pixel = w.contain || (w.images.length && w.images.every((src) => /\.gif$/i.test(src)));
  const frame = w.images.length
    ? w.images.map((src) => `<img src="${esc(src)}" class="screenshot" alt="${esc(w.label)} preview" loading="lazy">`).join("")
    : `<span class="shot-empty">No preview</span>`;
  const kind = w.href.endsWith(".mcworld") ? "World" : "Pack";
  return `          <div class="screenshot-card">
            <div class="shot-frame${pixel ? " pixel" : ""}">${frame}</div>
            <div class="shot-name">${esc(w.label)}</div>
            ${button(w.href, `Download ${kind}`)}
          </div>`;
}

function missingFor(e) {
  if (e.missing) return e.missing;
  const out = [];
  if (!e.pack) out.push("the resource pack");
  if (!e.worlds.some((w) => w.href.endsWith(".mcworld"))) out.push("world captures");
  return out;
}

function infoBoxes(e) {
  const issues = e.issues?.length
    ? `<ul>\n${e.issues.map((i) => `              <li>${i}</li>`).join("\n")}\n            </ul>`
    : `<p>No known issues reported yet.</p>`;
  const missing = missingFor(e);
  const missingText = missing.length
    ? `<p>This archive is still missing <strong>${missing.join(" and ")}</strong> for this event.</p>`
    : `<p>Have a different version, an area we don't have, or a better capture?</p>`;
  return `
        <div class="info-grid">
          <section class="info-box">
            <h2>Known Issues</h2>
            ${issues}
            <p class="info-small">Found a bug in these files? Report it on the Discord so we can fix it.</p>
          </section>
          <section class="info-box">
            <h2>Missing Something?</h2>
            ${missingText}
            <p class="info-small">If you have it, please join the Discord and upload it so we can archive it for everyone to enjoy.</p>
            <a href="${site.discord}" class="discord-button" ${ext}>Join the Discord</a>
          </section>
        </div>
`;
}

function eventDescription(e, title) {
  const worlds = e.worlds.filter((w) => w.href.endsWith(".mcworld")).map((w) => w.label);
  const parts = [];
  if (e.pack) parts.push("the resource pack");
  if (worlds.length) parts.push(worlds.length > 1 ? `${worlds.length} world captures` : "a world capture");
  if (!parts.length)
    return `The ${title} Minecraft Bedrock event server by ${e.by}. Not archived yet: have a capture or pack? Share it on our Discord.`;
  return `Download ${parts.join(" and ")} from the ${title} Minecraft Bedrock event server by ${e.by}. Free to play offline.`;
}

function eventPage(e) {
  const title = e.pageTitle ?? e.name;
  const url = `${site.url}/${e.slug}`;
  const links = e.links.map((l) => button(l.href, l.label, ` ${l.kind}-button`, ext)).join("\n            ");
  const content = `      <article class="world-section">
        <div class="top-row">
          <img src="${esc(e.keyart)}" class="keyart" alt="${esc(title)} key art">

          <div class="world-info">
            <h1>${esc(title)}</h1>
            <p><strong>By ${esc(e.by)}</strong></p>${e.summary ? `\n            <p class="world-description">${e.summary}</p>` : ""}
            <p class="world-description">${e.notes.map((n) => `• ${n}`).join("<br>")}</p>
${e.pack ? `            ${button(e.pack, "Download Resource Pack")}\n` : ""}            <div class="button-row">
            ${links}
            </div>
          </div>
        </div>
${
  e.worlds.length
    ? `
        <div class="screenshot-grid">
${e.worlds.map(screenshotCard).join("\n\n")}
        </div>
`
    : ""
}${infoBoxes(e)}      </article>`;
  return page(
    {
      title: `${title} Download | Minecraft Bedrock Event Server`,
      description: eventDescription(e, title),
      canonical: url,
      icon: e.favicon ?? e.thumb,
      image: e.keyart,
      type: "article",
      schema: [crumbs([[site.title, `${site.url}/`], [title, url]])],
    },
    false,
    content,
  );
}

// ---------------------------------------------------------------- tools page

function toolsPage() {
  const url = `${site.url}/${TOOLS_SLUG}`;
  const title = "BedrockTool: Minecraft Bedrock World & Server Downloader";
  const description =
    "How to download servers on Minecraft Bedrock: BedrockTool is a free, open-source Minecraft Bedrock world downloader that saves worlds, resource packs and skins from servers and Realms.";
  const content = `      <article class="world-section prose">
        <p class="eyebrow">Tools</p>
        <h1>BedrockTool: Minecraft Bedrock World Downloader</h1>
        <p>Most of the worlds and packs in this archive were saved with <strong>BedrockTool</strong>, a free and open-source <strong>Minecraft Bedrock server downloader</strong>. It sits between your game and a server and saves what the server sends you: the world, its resource packs and player skins.</p>
        <div class="button-row">
          ${button(`${site.bedrocktool}/releases`, "Download BedrockTool", "", ext)}
          ${button(site.bedrocktool, "View on GitHub", " archive-button", ext)}
        </div>

        <h2>What it can download</h2>
        <ul>
          <li><strong>Worlds</strong>: saves Bedrock server and Realm worlds as a <code>.mcworld</code> you can open in single player, including entities, maps and the chests you open.</li>
          <li><strong>Resource packs</strong>: a Minecraft server pack downloader that keeps every pack a server sends.</li>
          <li><strong>Skins</strong>: saves the skins of players on the server.</li>
          <li><strong>Menus and scoreboards</strong>: can record a server's menus into the saved world so they still open offline.</li>
          <li><strong>Recordings</strong>: records a session to a file and replays it later, so a world can be saved again with different settings without rejoining.</li>
        </ul>

        <h2>How to download servers on Minecraft Bedrock</h2>
        <ol>
          <li>Download BedrockTool from the <a href="${site.bedrocktool}/releases" ${ext}>releases page</a> and open it.</li>
          <li>Pick <strong>Worlds</strong> (or <strong>Packs</strong> for resource packs), then type a server address or choose a Realm or featured server.</li>
          <li>Press <strong>Start</strong> and sign in with your Microsoft account the first time.</li>
          <li>In Minecraft, go to <strong>Servers → Add Server</strong> and add <code>127.0.0.1</code>, port <code>19132</code>. Join it.</li>
          <li>Play as usual and walk around to load the areas you want to keep.</li>
          <li>Disconnect. Your world is saved as a <code>.mcworld</code>, ready to import.</li>
        </ol>
        <p>The <a href="${site.bedrocktool}#readme" ${ext}>BedrockTool README</a> covers every option, including the command line version.</p>
      </article>`;
  return page(
    {
      title,
      description,
      canonical: url,
      icon: "images/packs/AMMLE.png",
      image: "images/embed_icon.png",
      type: "article",
      schema: [
        {
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "BedrockTool",
          alternateName: [
            "Bedrock World Downloader",
            "Minecraft Bedrock Server Downloader",
            "Minecraft Server Pack Downloader",
            "Minecraft Bedrock World Downloader",
          ],
          description,
          applicationCategory: "UtilitiesApplication",
          url: site.bedrocktool,
          downloadUrl: `${site.bedrocktool}/releases`,
          license: "https://www.gnu.org/licenses/gpl-3.0.html",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        },
        crumbs([[site.title, `${site.url}/`], ["Tools", url]]),
      ],
    },
    false,
    content,
  );
}

// ---------------------------------------------------------------- 404, sitemap, robots

function notFound() {
  return page(
    {
      title: `Page not found | ${site.title}`,
      description: site.description,
      icon: "images/packs/AMMLE.png",
      image: "images/embed_icon.png",
      noindex: true,
    },
    false,
    `      <div class="world-section prose">
        <h1>Page not found</h1>
        <p>That page doesn't exist, or it moved. Every archived event is listed on the home page.</p>
        <a href="./" class="download-button">Back to all events</a>
      </div>`,
  ).replace(/href="(?!https?:|#|\/)([^"]*)"/g, 'href="/$1"').replace(/src="(?!https?:|\/)([^"]*)"/g, 'src="/$1"');
}

function sitemap() {
  const today = new Date().toISOString().slice(0, 10);
  const urls = [`${site.url}/`, ...events.map((e) => `${site.url}/${e.slug}`), `${site.url}/${TOOLS_SLUG}`];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc><lastmod>${today}</lastmod></url>`).join("\n")}
</urlset>
`;
}

const robots = `User-agent: *
Allow: /

Sitemap: ${site.url}/sitemap.xml
`;

writeFileSync("index.html", index());
for (const e of events) writeFileSync(`${e.slug}.html`, eventPage(e));
writeFileSync(`${TOOLS_SLUG}.html`, toolsPage());
writeFileSync("404.html", notFound());
writeFileSync("sitemap.xml", sitemap());
writeFileSync("robots.txt", robots);
console.log(`Built index, ${events.length} event pages, tools, 404, sitemap.xml and robots.txt`);

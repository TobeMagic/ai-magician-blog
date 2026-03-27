import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const user = process.env.GITHUB_HEATMAP_USER?.trim() || "TobeMagic";
const target = resolve("source/medias/github-contributions.svg");

function fallbackSvg(reason = "GitHub heatmap unavailable") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="140" viewBox="0 0 720 140" role="img" aria-label="${reason}">
  <rect width="720" height="140" rx="18" fill="#fff8fb"/>
  <text x="36" y="54" fill="#7a5a68" font-size="20" font-family="PingFang SC, Microsoft YaHei, sans-serif">GitHub 热力图暂时不可用</text>
  <text x="36" y="88" fill="#9a7b88" font-size="14" font-family="PingFang SC, Microsoft YaHei, sans-serif">稍后重新构建站点时会自动刷新官方贡献数据。</text>
</svg>`;
}

function buildSvg(entries) {
  const cell = 10;
  const gap = 3;
  const left = 26;
  const top = 16;
  const width = left + 54 * (cell + gap) + 8;
  const height = top + 7 * (cell + gap) + 8;
  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const rects = entries
    .map(({ week, row, level, date, count }) => {
      const x = left + week * (cell + gap);
      const y = top + row * (cell + gap);
      const fill = colors[Math.max(0, Math.min(colors.length - 1, Number(level) || 0))];
      return `<rect x="${x}" y="${y}" width="${cell}" height="${cell}" rx="2" fill="${fill}">
  <title>${date} · ${count}</title>
</rect>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${user} GitHub contributions heatmap">
  <rect width="${width}" height="${height}" rx="18" fill="#fff8fb"/>
  ${rects}
</svg>`;
}

async function main() {
  try {
    const response = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
      headers: {
        "User-Agent": "ai-magician-blog-heatmap",
        Accept: "text/html",
      },
    });
    const html = await response.text();
    const pattern = /<td[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>([\s\S]*?)<\/td>\s*<tool-tip[\s\S]*?>([^<]+)<\/tool-tip>/g;
    const entries = [];
    let index = 0;
    for (const match of html.matchAll(pattern)) {
      const date = match[1];
      const level = match[2];
      const tooltip = match[4].replace(/\s+/g, " ").trim();
      const countMatch = tooltip.match(/^(.+?) on /);
      const count = countMatch ? countMatch[1] : tooltip;
      entries.push({
        date,
        level,
        count,
        week: Math.floor(index / 7),
        row: index % 7,
      });
      index += 1;
    }
    const svg = entries.length ? buildSvg(entries) : fallbackSvg("GitHub heatmap parse failed");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, svg, "utf8");
  } catch (error) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, fallbackSvg(error instanceof Error ? error.message : "unknown error"), "utf8");
  }
}

await main();

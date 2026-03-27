import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

const user = process.env.GITHUB_HEATMAP_USER?.trim() || "TobeMagic";
const token =
  process.env.GITHUB_HEATMAP_TOKEN?.trim() ||
  process.env.GITHUB_TOKEN?.trim() ||
  "";
const target = resolve("source/medias/github-contributions.svg");

function fallbackSvg(reason = "GitHub heatmap unavailable") {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="720" height="140" viewBox="0 0 720 140" role="img" aria-label="${reason}">
  <rect width="720" height="140" rx="18" fill="#fff8fb"/>
  <text x="36" y="54" fill="#7a5a68" font-size="20" font-family="PingFang SC, Microsoft YaHei, sans-serif">GitHub 热力图暂时不可用</text>
  <text x="36" y="88" fill="#9a7b88" font-size="14" font-family="PingFang SC, Microsoft YaHei, sans-serif">稍后重新构建站点时会自动刷新官方贡献数据。</text>
</svg>`;
}

function buildSvg({ entries, months, totalContributions }) {
  const cell = 11;
  const gap = 4;
  const left = 34;
  const top = 30;
  const legendBottom = 28;
  const cardPadding = 16;
  const gridWidth = 53 * (cell + gap);
  const gridHeight = 7 * (cell + gap) - gap;
  const width = left + gridWidth + cardPadding;
  const height = top + gridHeight + legendBottom + 34;
  const colors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
  const weekdayLabels = [
    { text: "Mon", row: 1 },
    { text: "Wed", row: 3 },
    { text: "Fri", row: 5 },
  ];
  const monthOffsets = new Set();
  const monthLabels = (months || [])
    .map((month) => {
      const monthKey = `${month.year}-${String(new Date(`${month.firstDay}T00:00:00Z`).getUTCMonth() + 1).padStart(2, "0")}`;
      const monthEntry = entries.find((entry) => entry.date.startsWith(monthKey));
      if (!monthEntry || monthOffsets.has(monthEntry.week)) return "";
      monthOffsets.add(monthEntry.week);
      return `<text x="${left + monthEntry.week * (cell + gap)}" y="${top - 10}" fill="#57606a" font-size="10" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${month.name}</text>`;
    })
    .join("\n");
  const weekdayText = weekdayLabels
    .map(
      ({ text, row }) =>
        `<text x="0" y="${top + row * (cell + gap) + cell - 1}" fill="#57606a" font-size="10" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${text}</text>`,
    )
    .join("\n");
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
  const legendX = width - 144;
  const legendY = top + gridHeight + 22;
  const legend = colors
    .map(
      (color, index) =>
        `<rect x="${legendX + 38 + index * 15}" y="${legendY - 9}" width="11" height="11" rx="2" fill="${color}" />`,
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${user} GitHub contributions heatmap">
  <rect width="${width}" height="${height}" rx="16" fill="#ffffff"/>
  <text x="0" y="12" fill="#24292f" font-size="13" font-weight="600" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">${totalContributions} contributions in the last year</text>
  ${monthLabels}
  ${weekdayText}
  ${rects}
  <text x="${legendX}" y="${legendY}" fill="#57606a" font-size="10" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">Less</text>
  ${legend}
  <text x="${legendX + 118}" y="${legendY}" fill="#57606a" font-size="10" font-family="system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica, Arial, sans-serif">More</text>
</svg>`;
}

async function fetchGraphqlEntries() {
  if (!token) return [];
  const query = `
    query($login: String!) {
      user(login: $login) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            months {
              name
              year
              firstDay
            }
            weeks {
              contributionDays {
                contributionCount
                contributionLevel
                date
                weekday
              }
            }
          }
        }
      }
    }
  `;
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "ai-magician-blog-heatmap",
    },
    body: JSON.stringify({
      query,
      variables: { login: user },
    }),
  });
  if (!response.ok) return [];
  const payload = await response.json();
  const calendar = payload?.data?.user?.contributionsCollection?.contributionCalendar;
  const weeks = calendar?.weeks;
  if (!Array.isArray(weeks)) return null;
  return {
    totalContributions: Number(calendar?.totalContributions) || 0,
    months: Array.isArray(calendar?.months) ? calendar.months : [],
    entries: weeks.flatMap((week, weekIndex) =>
      (week.contributionDays || []).map((day) => ({
        date: day.date,
        level: ["NONE", "FIRST_QUARTILE", "SECOND_QUARTILE", "THIRD_QUARTILE", "FOURTH_QUARTILE"].indexOf(day.contributionLevel),
        count: `${day.contributionCount} contribution${day.contributionCount === 1 ? "" : "s"}`,
        week: weekIndex,
        row: Number(day.weekday) || 0,
      })),
    ),
  };
}

async function fetchHtmlEntries() {
  const response = await fetch(`https://github.com/users/${encodeURIComponent(user)}/contributions`, {
    headers: {
      "User-Agent": "ai-magician-blog-heatmap",
      Accept: "text/html",
    },
  });
  const html = await response.text();
  const pattern =
    /<td[^>]*data-date="([^"]+)"[^>]*data-level="([^"]+)"[^>]*>([\s\S]*?)<\/td>\s*<tool-tip[\s\S]*?>([^<]+)<\/tool-tip>/g;
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
  const totals = html.match(/<h2[^>]*>\s*<span[^>]*>\s*([\d,]+)\s*<\/span>\s+contributions/i);
  const months = [];
  const monthSeen = new Set();
  for (const entry of entries) {
    const [year, month] = entry.date.split("-");
    const key = `${year}-${month}`;
    if (monthSeen.has(key)) continue;
    monthSeen.add(key);
    const date = new Date(`${entry.date}T00:00:00Z`);
    months.push({
      name: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
      year: Number(year),
      firstDay: entry.date,
    });
  }
  return {
    totalContributions: totals ? Number(totals[1].replace(/,/g, "")) : entries.filter((item) => !String(item.count).startsWith("0 ")).length,
    months,
    entries,
  };
}

async function main() {
  try {
    let data = await fetchGraphqlEntries();
    if (!data?.entries?.length) {
      data = await fetchHtmlEntries();
    }
    const svg = data?.entries?.length ? buildSvg(data) : fallbackSvg("GitHub heatmap parse failed");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, svg, "utf8");
  } catch (error) {
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, fallbackSvg(error instanceof Error ? error.message : "unknown error"), "utf8");
  }
}

await main();

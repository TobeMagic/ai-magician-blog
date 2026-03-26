import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

function readEnv(name, fallback = "") {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function quote(value) {
  return JSON.stringify(value);
}

const runtimeConfig = {
  url: readEnv("OPENCLAW_HEXO_CANONICAL_URL", readEnv("OPENCLAW_HEXO_URL", "https://blog.example.com")),
  root: readEnv("HEXO_SITE_ROOT", "/"),
  deploy: {
    repository: readEnv("HEXO_DEPLOY_REPO", ""),
    branch: readEnv("HEXO_DEPLOY_BRANCH", "gh-pages"),
    message: readEnv("HEXO_DEPLOY_MESSAGE", "chore(hexo): deploy"),
  },
  algolia: {
    appId: readEnv("ALGOLIA_APP_ID", ""),
    apiKey: readEnv("ALGOLIA_SEARCH_KEY", ""),
    adminApiKey: readEnv("ALGOLIA_ADMIN_KEY", ""),
    indexName: readEnv("ALGOLIA_INDEX_NAME", "aimagician_posts"),
  },
  analytics: {
    umami: {
      script_url: readEnv("UMAMI_SCRIPT_URL", ""),
      website_id: readEnv("UMAMI_SITE_ID", ""),
      share_url: readEnv("UMAMI_SHARE_URL", ""),
    },
  },
  canonical: {
    base: readEnv("OPENCLAW_HEXO_CANONICAL_URL", readEnv("OPENCLAW_HEXO_URL", "https://blog.example.com")),
  },
};

const lines = [
  `url: ${quote(runtimeConfig.url)}`,
  `root: ${quote(runtimeConfig.root)}`,
  "deploy:",
  `  repository: ${quote(runtimeConfig.deploy.repository)}`,
  `  branch: ${quote(runtimeConfig.deploy.branch)}`,
  `  message: ${quote(runtimeConfig.deploy.message)}`,
  "algolia:",
  `  appId: ${quote(runtimeConfig.algolia.appId)}`,
  `  apiKey: ${quote(runtimeConfig.algolia.apiKey)}`,
  `  adminApiKey: ${quote(runtimeConfig.algolia.adminApiKey)}`,
  `  indexName: ${quote(runtimeConfig.algolia.indexName)}`,
  "analytics:",
  "  umami:",
  `    script_url: ${quote(runtimeConfig.analytics.umami.script_url)}`,
  `    website_id: ${quote(runtimeConfig.analytics.umami.website_id)}`,
  `    share_url: ${quote(runtimeConfig.analytics.umami.share_url)}`,
  "import:",
  "  link:",
  `    - ${quote(`<link rel=\"canonical\" href=\"${runtimeConfig.canonical.base}\" />`)}`,
  "",
];

writeFileSync(resolve("_config.runtime.yml"), lines.join("\n"), "utf8");

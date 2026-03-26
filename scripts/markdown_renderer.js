"use strict";

const { marked } = require("marked");

marked.setOptions({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: true,
});

function renderMarkdown(data) {
  return marked.parse(data.text || "");
}

hexo.extend.renderer.register("md", "html", renderMarkdown, true);
hexo.extend.renderer.register("markdown", "html", renderMarkdown, true);

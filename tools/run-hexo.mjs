import Hexo from "hexo";
import { marked } from "marked";

const command = process.argv[2] || "generate";
const cwd = process.cwd();

marked.setOptions({
  gfm: true,
  breaks: false,
  mangle: false,
  headerIds: true,
});

async function main() {
  const hexo = new Hexo(cwd, {
    silent: false,
    config: "_config.yml,_config.runtime.yml,_config.bamboo.yml",
  });
  hexo.env.init = true;
  globalThis.hexo = hexo;
  await import("hexo-renderer-ejs");
  await import("hexo-renderer-stylus");
  await import("hexo-renderer-marked");
  hexo.extend.renderer.register("md", "html", (data) => marked.parse(data.text || ""), true);
  hexo.extend.renderer.register("markdown", "html", (data) => marked.parse(data.text || ""), true);

  await hexo.init();
  await hexo.load();

  if (command === "deploy") {
    await hexo.call("clean");
    await hexo.call("generate");
    await hexo.call("deploy");
    return;
  }

  await hexo.call(command);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

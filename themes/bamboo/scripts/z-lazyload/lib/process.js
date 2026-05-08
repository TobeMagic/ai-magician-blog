'use strict';

function lazyProcess(htmlContent, target) {
  const cfg = this.theme.config.lazyload;
  if (cfg == undefined || cfg.enable != true) {
    return htmlContent;
  }
  if (cfg.onlypost == true) {
    if (target != 'post') {
      return htmlContent;
    }
  }
  const loadingImg = cfg.loadingImg;
  const transparentImg = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAABGdBTUEAALGPC/xhBQAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAAaADAAQAAAABAAAAAQAAAADa6r/EAAAAC0lEQVQIHWNgAAIAAAUAAY27m/MAAAAASUVORK5CYII=';
  return htmlContent.replace(/<img\b([^>]*)\bsrc=(["'])(.*?)\2([^>]*)>/gi, function(str, before, quote, src, after) {
    // might be duplicate
    if (/data-src(set)?=/gi.test(str)) {
      return str;
    }
    if (/src=["']data:image/gi.test(str)) {
      return str;
    }
    if (/no-lazy/gi.test(str)) {
      return str;
    }
    const lazyClasses = loadingImg ? 'lazyload placeholder' : 'lazyload';
    let attrs = `${before || ''}${after || ''}`
      .replace(/\s(?:srcset|data-srcset)=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
    const classMatch = attrs.match(/\bclass=(["'])(.*?)\1/i);
    if (classMatch) {
      const existing = classMatch[2].trim();
      const merged = `${existing} ${lazyClasses}`
        .split(/\s+/)
        .filter((item, index, list) => item && list.indexOf(item) === index)
        .join(' ');
      attrs = attrs.replace(classMatch[0], `class=${classMatch[1]}${merged}${classMatch[1]}`);
    } else {
      attrs = `class="${lazyClasses}" ${attrs}`.trim();
    }
    const placeholderSrc = loadingImg || transparentImg;
    return `<img ${attrs} src="${placeholderSrc}" data-src="${src}">`;

  });
}

module.exports.processPost = function(data) {
  data.content = lazyProcess.call(this, data.content, 'post');
  return data;
};

module.exports.processSite = function(htmlContent) {
  return lazyProcess.call(this, htmlContent, 'site');
};

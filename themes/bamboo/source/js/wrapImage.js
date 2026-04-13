$(document).ready(function () {
  wrapImageWithFancyBox();
});

function normalizeImageCaption(rawCaption) {
  var caption = String(rawCaption || "").replace(/\s+/g, " ").trim();
  if (!caption) {
    return "";
  }
  if (
    caption.startsWith("SVGDIAGRAM::") ||
    /^(正文图解|正文配图)\d*$/.test(caption) ||
    /^(大佬系列表情|程序员反应图|程序员 reaction|reaction|表情包)[:：]/i.test(caption) ||
    ["封面图", "文末收口图", "延伸阅读入口"].includes(caption)
  ) {
    return "";
  }
  return caption;
}

function findCaptionSourceBlock($imageWrapDiv) {
  var $container = $imageWrapDiv.closest("p, figure, li");
  if (!$container.length) {
    $container = $imageWrapDiv.parent();
  }
  if (!$container.length) {
    return $();
  }
  var containerText = String($container.clone().children().remove().end().text() || "")
    .replace(/\s+/g, " ")
    .trim();
  if (containerText) {
    return $();
  }
  var $next = $container.next();
  if ($next.length && $next.is("blockquote")) {
    return $next;
  }
  return $();
}

function resolveAdjacentBlockquoteCaption($imageWrapDiv) {
  var $captionBlock = findCaptionSourceBlock($imageWrapDiv);
  if (!$captionBlock.length) {
    return "";
  }
  var caption = normalizeImageCaption($captionBlock.text());
  $captionBlock.remove();
  return caption;
}

/**
 * Wrap images with fancybox support.
 */
function wrapImageWithFancyBox() {
  $(".post-detail")
    .find("img")
    .not(".swiper-slide img")
    .not(".sidebar-image img")
    .not("#author-avatar img")
    .not(".post-donate img")
    .not(".post-donate img")
    .not(".friend-avatar img")
    .not("[title=notice]")
    .not("#myComment img")
    .not(".social-share .qrcode img")
    .not(".ghcard img")
    .not("img.inline")
    .not(".site-card img")
    .not(".link-card img")
    .not(".btns img")
    .not(".gallery-group-img")
    .not('.getJsonPhoto-api img')
	    .not('.getJsonTalk-api img')
	    .each(function () {
	      var $image = $(this);
	      var imageCaption = normalizeImageCaption($image.attr("alt"));
	      var $imageWrapLink = $image.parent("a");
	      var $linkWrapDiv = $imageWrapLink.parent("div");
      if ($imageWrapLink.length < 1) {
        var src = this.getAttribute("data-src") || this.getAttribute("src");
        var idx = src.lastIndexOf("?");
        if (idx != -1) {
          src = src.substring(0, idx);
        }
        $imageWrapLink = $image
          .wrap('<a href="' + src + '" class="fancybox"></a>')
          .parent("a");
        $linkWrapDiv = $imageWrapLink
          .wrap('<div class="fancybox"></div>')
          .parent("div");
      }

      if (!imageCaption) {
        imageCaption = resolveAdjacentBlockquoteCaption($linkWrapDiv);
      }

      $imageWrapLink.attr("data-fancybox", "images");
      if (imageCaption) {
        $imageWrapLink.attr("data-caption", imageCaption);
        if (!$linkWrapDiv.hasClass('image-caption')) {
          $linkWrapDiv.append(
            '<span class="image-caption">' + imageCaption + "</span>"
          );
        }
      }
    });
  
  Fancybox.bind('[data-fancybox="images"]', {
    Hash: false,
    Toolbar: {
      display: {
        left: ["infobar"],
        middle: [
          "zoomIn",
          "zoomOut",
          "toggle1to1",
          "rotateCCW",
          "rotateCW",
          "flipX",
          "flipY",
        ],
        right: ["slideshow", "thumbs", "close"],
      },
    },
  });
}

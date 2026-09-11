/* PDF / 모바일 HTML / EPUB / Markdown / JSON
   배포 HTML은 한 장씩 넘기는 리더가 아니라, 휴대폰에서 스크롤하는 문서다. */
(function (g) {
  const EB = (g.EB = g.EB || {});

  function tocLabel(project, p) {
    if (p.type === "cover") return (project.meta && project.meta.title) || "표지";
    if (p.type === "chapter") return "CHAPTER " + (p.chapterNo || "") + "  " + (p.title || "");
    return p.title || EB.pageTypeLabel(p.type);
  }

  function stripEditor(html) {
    return String(html || "")
      .replace(/<div class="blk-tools"[\s\S]*?<\/div>/g, "")
      .replace(/\scontenteditable="true"/g, "")
      .replace(/\sspellcheck="false"/g, "")
      .replace(/\sdata-bind="[^"]*"/g, "")
      .replace(/\sdata-field="[^"]*"/g, "")
      .replace(/\sdata-block-id="[^"]*"/g, "")
      .replace(/\sdata-gindex="[^"]*"/g, "")
      .replace(/\sdata-act="[^"]*"/g, "")
      .replace(/\sdata-tools="[^"]*"/g, "");
  }

  function pagesMarkup(project) {
    return project.pages
      .map(function (p, i) {
        const html = EB.Render.pageHtml(project, p, {
          editable: false,
          pageIndex: i,
          total: project.pages.length
        });
        return stripEditor(html).replace(
          /class="ebook-page([^"]*)"/,
          'class="ebook-page$1" id="p' + (i + 1) + '" data-index="' + i + '"'
        );
      })
      .join("");
  }

  function fillPrintRoot(project) {
    const root = document.getElementById("print-root");
    if (!root) return;
    root.innerHTML = pagesMarkup(project);
  }

  function toXhtml(html) {
    return String(html || "")
      .replace(/<img([^>]*?)\/?>/gi, function (_, attrs) {
        const a = attrs.replace(/\/\s*$/, "");
        return "<img" + a + "/>";
      })
      .replace(/<br\s*>/gi, "<br/>")
      .replace(/<hr\s*>/gi, "<hr/>")
      .replace(/<meta([^>]*?)>/gi, function (_, attrs) {
        if (/\/>\s*$/.test(attrs)) return "<meta" + attrs + ">";
        return "<meta" + attrs + "/>";
      })
      .replace(/(<details\b[^>]*?)\sopen(?=[\s>])/gi, '$1 open="open"');
  }

  function mobileCss() {
    return [
      "html,body.mbook{margin:0;background:#dfe7ee;font-family:var(--font);-webkit-text-size-adjust:100%;text-size-adjust:100%;}",
      ".m-top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:8px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));background:#0b1f3a;color:#e8eef4;}",
      ".m-title{flex:1;min-width:0;font-size:14px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".m-top a,.m-top button{flex:0 0 auto;height:34px;padding:0 10px;border:0;border-radius:4px;background:rgba(255,255,255,.1);color:#fff;font-weight:700;font-size:13px;text-decoration:none;display:inline-flex;align-items:center;}",
      ".m-book{max-width:720px;margin:0 auto;padding:12px 12px calc(28px + env(safe-area-inset-bottom));}",
      ".m-toc{background:#fff;border-radius:10px;margin:0 0 12px;padding:2px 14px 8px;box-shadow:0 8px 24px rgba(11,31,58,.08);}",
      ".m-toc summary{cursor:pointer;font-weight:800;padding:12px 0;color:#0b1f3a;list-style:none;}",
      ".m-toc summary::-webkit-details-marker{display:none;}",
      ".m-toc a{display:block;padding:9px 0;border-top:1px solid #e2e6ec;color:#123052;text-decoration:none;font-size:14px;line-height:1.4;}",
      ".m-toc a.ch{font-weight:800;color:#0b1f3a;}",
      "body.mbook .ebook-page{width:auto!important;height:auto!important;max-height:none!important;min-height:0;overflow:visible!important;margin:0 0 12px;box-shadow:0 8px 24px rgba(11,31,58,.08);border-radius:10px;scroll-margin-top:58px;}",
      "body.mbook .page-inner{overflow:visible!important;flex:none!important;padding:18px 16px 14px!important;}",
      "body.mbook .page-footer{padding:0 16px 14px;}",
      "body.mbook .blk.summary-ribbon,body.mbook .blk.learn-box{margin-top:14px!important;}",
      "body.mbook .cover-top{min-height:0!important;padding:28px 18px 20px!important;border-radius:10px 10px 0 0;}",
      "body.mbook .cover-bottom{padding:14px 16px 16px!important;grid-template-columns:1fr 1fr;}",
      "body.mbook .cover-mark{margin:16px 0 12px!important;}",
      "body.mbook .ch-no{font-size:42px!important;}",
      "body.mbook .dodont{grid-template-columns:1fr 1fr;flex:none;min-height:0;}",
      "body.mbook .col-do,body.mbook .col-dont{min-height:0;}",
      "body.mbook .img-block img{max-width:100%;height:auto;}",
      ".blk-tools{display:none!important;}",
      "@media (max-width:640px){body.mbook .dodont,body.mbook .cover-bottom{grid-template-columns:1fr!important;}body.mbook .cover-title{font-size:28px!important;}body.mbook .pg-title{font-size:22px!important;}body.mbook .ch-title{font-size:26px!important;}body.mbook .law-grid{grid-template-columns:1fr!important;}}",
      "@media print{html,body.mbook{background:#fff!important;} .m-top,.m-toc{display:none!important;} .m-book{max-width:none;padding:0;} body.mbook .ebook-page{display:flex!important;width:210mm!important;height:297mm!important;max-height:297mm!important;overflow:hidden!important;margin:0;border-radius:0;box-shadow:none;page-break-after:always;break-after:page;} body.mbook .ebook-page:last-child{page-break-after:auto;} body.mbook .cover-top{min-height:148mm!important;padding:22mm 16mm 16mm!important;border-radius:0;} body.mbook .page-inner{padding:var(--page-pad-y) var(--page-pad-x) 6mm!important;overflow:hidden!important;flex:1 1 0!important;} body.mbook .blk.summary-ribbon,body.mbook .blk.learn-box{margin-top:auto!important;}}"
    ].join("");
  }

  function buildMobileHtml(project, articlesHtml) {
    const title = (project.meta && project.meta.title) || "전자책";
    const items = project.pages
      .map(function (p, i) {
        const cls = p.type === "chapter" ? ' class="ch"' : "";
        return (
          '<a href="#p' +
          (i + 1) +
          '"' +
          cls +
          ">" +
          EB.escapeHtml(tocLabel(project, p)) +
          "</a>"
        );
      })
      .join("");
    return (
      "<!DOCTYPE html>\n<html lang=\"ko\"><head><meta charset=\"UTF-8\">" +
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
      '<meta name="theme-color" content="#0b1f3a">' +
      "<title>" +
      EB.escapeHtml(title) +
      "</title><style>" +
      (EB.EXPORT_CSS || "") +
      mobileCss() +
      "</style></head><body class=\"mbook\">" +
      '<header class="m-top"><div class="m-title">' +
      EB.escapeHtml(title) +
      '</div><a href="#toc">목차</a>' +
      '<button type="button" onclick="window.print()">PDF</button></header>' +
      '<main class="m-book"><details class="m-toc" id="toc"><summary>목차</summary>' +
      items +
      "</details>" +
      articlesHtml +
      "</main></body></html>"
    );
  }

  function epubCss() {
    return (
      (EB.EXPORT_CSS || "") +
      "\n.ebook-page{width:auto!important;height:auto!important;min-height:0;overflow:visible!important;box-shadow:none;page-break-after:always;}" +
      "\n.cover-top{min-height:14em;}" +
      "\n.cover-mark{margin:1.2em 0;}" +
      "\n.dodont{grid-template-columns:1fr 1fr;}" +
      "\n.law-grid{grid-template-columns:1fr;}" +
      "\n.blk-tools{display:none!important;}" +
      "\n.page-footer{margin-top:1.5em;}"
    );
  }

  function xhtmlPage(title, inner) {
    return (
      '<?xml version="1.0" encoding="UTF-8"?>\n' +
      '<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="ko" lang="ko">' +
      "<head><meta charset=\"utf-8\"/><title>" +
      EB.escapeHtml(title) +
      '</title><link rel="stylesheet" type="text/css" href="style.css"/></head><body>' +
      toXhtml(stripEditor(inner)) +
      "</body></html>"
    );
  }

  function mobileHtml(project) {
    return buildMobileHtml(project, pagesMarkup(project));
  }

  function epubBytes(project) {
    if (!EB.zipStore) throw new Error("zip 모듈이 없습니다.");
    const uid = "urn:uuid:" + (project.id || "ebook") + "-" + Date.now();
    const files = [];
    files.push({ name: "mimetype", data: "application/epub+zip" });
    files.push({
      name: "META-INF/container.xml",
      data:
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">' +
        '<rootfiles><rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'
    });
    files.push({ name: "OEBPS/style.css", data: epubCss() });
    const navLis = [];
    const manifest = [
      '<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>',
      '<item id="css" href="style.css" media-type="text/css"/>'
    ];
    const spine = [];
    project.pages.forEach(function (p, i) {
      const href = "p" + (i + 1) + ".xhtml";
      const title = tocLabel(project, p);
      const inner = EB.Render.pageHtml(project, p, {
        editable: false,
        pageIndex: i,
        total: project.pages.length
      });
      files.push({ name: "OEBPS/" + href, data: xhtmlPage(title, inner) });
      manifest.push('<item id="p' + (i + 1) + '" href="' + href + '" media-type="application/xhtml+xml"/>');
      spine.push('<itemref idref="p' + (i + 1) + '"/>');
      navLis.push('<li><a href="' + href + '">' + EB.escapeHtml(title) + "</a></li>");
    });
    files.push({
      name: "OEBPS/nav.xhtml",
      data:
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="ko" lang="ko">' +
        "<head><meta charset=\"utf-8\"/><title>목차</title></head><body><nav epub:type=\"toc\"><h1>목차</h1><ol>" +
        navLis.join("") +
        "</ol></nav></body></html>"
    });
    const modified = new Date().toISOString().replace(/\.\d+Z$/, "Z");
    files.push({
      name: "OEBPS/content.opf",
      data:
        '<?xml version="1.0" encoding="UTF-8"?>' +
        '<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="bid" version="3.0" xml:lang="ko">' +
        '<metadata xmlns:dc="http://purl.org/dc/elements/1.1/">' +
        '<dc:identifier id="bid">' +
        EB.escapeHtml(uid) +
        "</dc:identifier><dc:title>" +
        EB.escapeHtml((project.meta && project.meta.title) || "전자책") +
        "</dc:title><dc:language>ko</dc:language><dc:creator>" +
        EB.escapeHtml((project.meta && project.meta.department) || "내부 교육") +
        '</dc:creator><meta property="dcterms:modified">' +
        modified +
        "</meta></metadata><manifest>" +
        manifest.join("") +
        "</manifest><spine>" +
        spine.join("") +
        "</spine></package>"
    });
    return EB.zipStore(files);
  }

  EB.Export = {
    preparePrint: function (project) {
      fillPrintRoot(project);
    },
    printPdf: function (project) {
      fillPrintRoot(project);
      const title = document.title;
      document.title = (project.meta && project.meta.title) || "전자책";
      window.addEventListener(
        "afterprint",
        function () {
          document.title = title;
          const root = document.getElementById("print-root");
          if (root) root.innerHTML = "";
        },
        { once: true }
      );
      setTimeout(function () {
        window.print();
      }, 60);
    },
    htmlString: mobileHtml,
    html: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".html"),
        mobileHtml(project),
        "text/html;charset=utf-8"
      );
    },
    epubBytes: epubBytes,
    epub: function (project) {
      const zip = epubBytes(project);
      EB.downloadBytes(EB.safeFilename(project.meta.title, ".epub"), zip, "application/epub+zip");
    },
    markdown: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".md"),
        EB.Markdown.toMarkdown(project),
        "text/markdown;charset=utf-8"
      );
    },
    json: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".json"),
        EB.Store.toJSON(project),
        "application/json;charset=utf-8"
      );
    },
    buildMobileHtml: buildMobileHtml,
    stripEditor: stripEditor
  };
})(typeof window !== "undefined" ? window : global);

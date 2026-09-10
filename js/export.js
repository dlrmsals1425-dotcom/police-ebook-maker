/* PDF / 웹 리더 / EPUB / Markdown / JSON
   웹 리더는 한 장씩 넘기는 전자책 (Book Author Digital Web Reader 개념을 현장 핸드북에 맞게 적용) */
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
          'class="ebook-page$1" data-index="' + i + '"'
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

  function readerChromeCss() {
    return [
      "html,body.reader{margin:0;height:100%;background:#0b1f3a;font-family:var(--font);overflow:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;}",
      ".r-top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:6px;padding:8px 10px;padding-top:max(8px,env(safe-area-inset-top));background:#0b1f3a;color:#e8eef4;}",
      ".r-top button{height:34px;padding:0 10px;border:0;border-radius:4px;background:rgba(255,255,255,.08);color:#fff;font-weight:700;font-size:13px;}",
      ".r-title{flex:1;min-width:0;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".r-pg{font-variant-numeric:tabular-nums;font-size:12px;color:#9bb0c4;white-space:nowrap;}",
      ".r-stage{position:relative;height:calc(100dvh - 50px - env(safe-area-inset-top,0px) - env(safe-area-inset-bottom,0px));background:#dfe7ee;}",
      ".r-view{height:100%;overflow:hidden;display:flex;justify-content:center;}",
      ".r-view .ebook-page{display:none;width:min(100%,720px)!important;height:100%!important;max-height:100%!important;margin:0 auto;overflow:auto!important;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-shadow:none;border-radius:0;}",
      ".r-view .ebook-page.is-current{display:flex;}",
      ".r-view .cover-top{min-height:42vh!important;padding:22px 18px 16px!important;}",
      ".r-view .cover-bottom{padding:14px 18px 18px!important;}",
      ".r-view .page-inner{overflow:visible!important;padding:16px 16px 12px!important;}",
      ".r-view .page-footer{padding-bottom:max(12px,env(safe-area-inset-bottom));}",
      ".r-view .ch-no{font-size:48px!important;}",
      ".r-view .cover-mark{margin:18px 0 12px!important;}",
      ".r-prog{position:fixed;left:0;right:0;bottom:0;height:3px;background:#123052;z-index:21;}",
      ".r-prog i{display:block;height:100%;width:0;background:#d4bc6a;}",
      ".r-toc{display:none;position:fixed;inset:0;z-index:30;background:rgba(7,18,33,.45);}",
      "body.toc-open .r-toc{display:block;}",
      ".r-toc nav{position:absolute;left:0;top:0;bottom:0;width:min(86vw,320px);background:#f4f7fa;overflow:auto;padding:16px 12px 32px;padding-top:max(16px,env(safe-area-inset-top));}",
      ".r-toc h2{margin:0 0 10px;font-size:13px;letter-spacing:.08em;color:#6b7687;}",
      ".r-toc button{display:block;width:100%;text-align:left;border:0;background:none;padding:9px 8px;border-radius:4px;font-size:14px;color:#1c2430;}",
      ".r-toc button.is-on{background:#0b1f3a;color:#fff;}",
      ".r-toc .ch{font-weight:800;margin-top:8px;}",
      ".blk-tools{display:none!important;}",
      "body.reader.is-night{background:#071018;}",
      "body.reader.is-night .r-stage{background:#0a1522;}",
      "body.reader.is-night .r-view .ebook-page{background:#101820;color:#e8eef4;}",
      "body.reader.is-night .r-view .ebook-page.is-navy{background:#0b1f3a;}",
      "body.reader.is-night .r-view .cover-bottom{background:#152238;color:#e8eef4;}",
      "body.reader.is-night .r-view .meta-cell .v,body.reader.is-night .r-view .pg-title,body.reader.is-night .r-view .h-block,body.reader.is-night .r-view .p-block{color:#e8eef4;}",
      "body.reader.is-night .r-toc nav{background:#101820;}",
      "body.reader.is-night .r-toc button{color:#e8eef4;}",
      "body.reader.is-night .r-toc button.is-on{background:#d4bc6a;color:#0b1f3a;}",
      "@media (max-width:720px){.r-view .dodont{grid-template-columns:1fr!important;} .r-view .cover-bottom{grid-template-columns:1fr!important;} .r-view .cover-title{font-size:28px!important;} .r-view .pg-title{font-size:22px!important;} .r-view .law-grid{grid-template-columns:1fr!important;}}",
      "@media print{html,body.reader{overflow:visible!important;height:auto!important;background:#fff!important;} .r-top,.r-toc,.r-prog{display:none!important;} .r-stage{height:auto!important;background:#fff!important;} .r-view{display:block;height:auto;} .r-view .ebook-page{display:flex!important;width:210mm!important;height:297mm!important;max-height:297mm!important;overflow:hidden!important;page-break-after:always;break-after:page;} .r-view .ebook-page:last-child{page-break-after:auto;} .r-view .cover-top{min-height:148mm!important;padding:22mm 16mm 16mm!important;} .r-view .page-inner{padding:var(--page-pad-y) var(--page-pad-x) 6mm!important;overflow:hidden!important;}}"
    ].join("");
  }

  function readerScript(storeKey) {
    const key = JSON.stringify(storeKey || "ebook");
    return (
      "<script>(function(){" +
      "var pages=[].slice.call(document.querySelectorAll('.ebook-page'));var i=0;var swiped=false;" +
      "var key='police-ebook-reader:'+" +
      key +
      ";" +
      "function show(n){i=Math.max(0,Math.min(pages.length-1,n));pages.forEach(function(p,k){p.classList.toggle('is-current',k===i);});" +
      "var pg=document.getElementById('r-pg');if(pg)pg.textContent=(i+1)+' / '+pages.length;" +
      "var bar=document.getElementById('r-bar');if(bar)bar.style.width=((i+1)/pages.length*100)+'%';" +
      "var on=document.querySelector('.r-toc button.is-on');if(on)on.classList.remove('is-on');" +
      "var t=document.querySelector('.r-toc button[data-i=\"'+i+'\"]');if(t)t.classList.add('is-on');" +
      "try{history.replaceState(null,'','#p'+(i+1));}catch(e){}" +
      "try{localStorage.setItem(key,String(i));}catch(e){}" +
      "if(pages[i])pages[i].scrollTop=0;document.body.classList.remove('toc-open');}" +
      "document.getElementById('r-prev').onclick=function(){show(i-1);};" +
      "document.getElementById('r-next').onclick=function(){show(i+1);};" +
      "document.getElementById('r-tocbtn').onclick=function(){document.body.classList.toggle('toc-open');};" +
      "document.getElementById('r-night').onclick=function(){document.body.classList.toggle('is-night');try{localStorage.setItem(key+':night',document.body.classList.contains('is-night')?'1':'0');}catch(e){}};" +
      "document.getElementById('r-toc').onclick=function(e){if(e.target.id==='r-toc')document.body.classList.remove('toc-open');" +
      "var b=e.target.closest('button[data-i]');if(b)show(+b.getAttribute('data-i'));};" +
      "document.addEventListener('keydown',function(e){if(e.target&&e.target.closest('input,textarea'))return;" +
      "if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();show(i+1);}" +
      "if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(i-1);}" +
      "if(e.key==='Escape')document.body.classList.remove('toc-open');});" +
      "var x0=0,y0=0;var st=document.getElementById('r-stage');" +
      "st.addEventListener('touchstart',function(e){x0=e.changedTouches[0].clientX;y0=e.changedTouches[0].clientY;},{passive:true});" +
      "st.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-x0;var dy=e.changedTouches[0].clientY-y0;" +
      "if(Math.abs(dx)<56||Math.abs(dx)<Math.abs(dy))return;swiped=true;if(dx>0)show(i-1);else show(i+1);});" +
      "st.addEventListener('click',function(e){if(swiped){swiped=false;return;}" +
      "if(e.target.closest('button,a,details,input,textarea,.box'))return;" +
      "var r=st.getBoundingClientRect();var x=e.clientX-r.left;if(x<r.width*0.22)show(i-1);else if(x>r.width*0.78)show(i+1);});" +
      "try{if(localStorage.getItem(key+':night')==='1')document.body.classList.add('is-night');}catch(e){}" +
      "var h=parseInt((location.hash||'').replace('#p',''),10);var saved=0;" +
      "try{saved=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}" +
      "show(h?h-1:saved);" +
      "})();</script>"
    );
  }

  function buildReaderHtml(project, articlesHtml) {
    const title = (project.meta && project.meta.title) || "전자책";
    const items = project.pages
      .map(function (p, i) {
        const cls = p.type === "chapter" ? " ch" : "";
        return (
          '<button type="button" class="' +
          cls +
          '" data-i="' +
          i +
          '">' +
          EB.escapeHtml(tocLabel(project, p)) +
          "</button>"
        );
      })
      .join("");
    return (
      "<!DOCTYPE html>\n<html lang=\"ko\"><head><meta charset=\"UTF-8\">" +
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
      '<meta name="apple-mobile-web-app-capable" content="yes">' +
      '<meta name="theme-color" content="#0b1f3a">' +
      "<title>" +
      EB.escapeHtml(title) +
      "</title><style>" +
      (EB.EXPORT_CSS || "") +
      readerChromeCss() +
      "</style></head><body class=\"reader\">" +
      '<header class="r-top"><button type="button" id="r-tocbtn">목차</button>' +
      '<div class="r-title">' +
      EB.escapeHtml(title) +
      "</div>" +
      '<span class="r-pg" id="r-pg">1 / 1</span>' +
      '<button type="button" id="r-prev">이전</button>' +
      '<button type="button" id="r-next">다음</button>' +
      '<button type="button" id="r-night">밤</button>' +
      '<button type="button" onclick="window.print()">PDF</button></header>' +
      '<div class="r-toc" id="r-toc"><nav><h2>목차</h2>' +
      items +
      "</nav></div>" +
      '<div class="r-stage" id="r-stage"><div class="r-view" id="r-view">' +
      articlesHtml +
      "</div></div>" +
      '<div class="r-prog"><i id="r-bar"></i></div>' +
      readerScript(title) +
      "</body></html>"
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

  function readerHtml(project) {
    return buildReaderHtml(project, pagesMarkup(project));
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
    htmlString: readerHtml,
    html: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".html"),
        readerHtml(project),
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
    buildReaderHtml: buildReaderHtml,
    stripEditor: stripEditor
  };
})(typeof window !== "undefined" ? window : global);

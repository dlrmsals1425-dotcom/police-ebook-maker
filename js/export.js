/* PDF / 전자책 HTML / EPUB / Markdown / JSON
   배포 HTML은 표지·조판을 유지한 채, 책처럼 한 장씩 넘기는 파일이다. */
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

  function bookCss() {
    return [
      "html,body.ebook{margin:0;height:100%;background:#071018;color:#e8eef4;font-family:var(--font);overflow:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;}",
      ".desk{height:100dvh;display:flex;align-items:center;justify-content:center;padding:22px 18px;padding-top:max(22px,env(safe-area-inset-top));padding-bottom:max(22px,env(safe-area-inset-bottom));background:radial-gradient(ellipse at 50% 28%,#243a58 0%,#0b1a2c 58%,#071018 100%);}",
      ".book{display:flex;align-items:stretch;max-width:100%;filter:drop-shadow(0 28px 70px rgba(0,0,0,.5));}",
      ".spine{width:16px;flex:0 0 16px;border-radius:5px 0 0 5px;background:linear-gradient(90deg,#050b14 0%,#123052 32%,#d4bc6a 50%,#123052 68%,#050b14 100%);box-shadow:inset -2px 0 6px rgba(0,0,0,.35);}",
      ".leaf{background:#fff;position:relative;overflow:hidden;}",
      ".leaf-fit{overflow:hidden;transform-origin:top left;}",
      ".leaf-pages{width:210mm;}",
      ".ebook-page{display:none;box-shadow:none;}",
      ".ebook-page.is-open{display:flex;overflow:auto;-webkit-overflow-scrolling:touch;}",
      "body.ebook .page-inner{overflow:visible;flex:0 0 auto;min-height:min-content;height:auto;}",
      "body.ebook .page-body,body.ebook .page-body .blk,body.ebook .flow,body.ebook .flow-step,body.ebook .flow-card,body.ebook .dodont,body.ebook .law-card,body.ebook .check-group{flex:0 0 auto;min-height:min-content;height:auto;overflow:visible;}",
      "body.ebook .flow{gap:10px;justify-content:flex-start;}",
      "body.ebook .flow-card{overflow:hidden;}",
      "body.ebook .page-end{margin-top:12px;}",
      ".hud{position:fixed;left:0;right:0;top:0;z-index:20;display:flex;align-items:center;gap:8px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));background:linear-gradient(to bottom,rgba(0,0,0,.5),transparent);transition:opacity .25s;}",
      ".hud button{height:34px;padding:0 12px;border:0;border-radius:4px;background:rgba(255,255,255,.12);color:#fff;font-weight:700;font-size:13px;}",
      ".hud-title{flex:1;min-width:0;font-size:13px;font-weight:800;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}",
      ".pg-float{position:fixed;left:50%;bottom:max(10px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:16;font-size:12px;letter-spacing:.14em;color:rgba(255,255,255,.55);font-variant-numeric:tabular-nums;pointer-events:none;}",
      "body.hud-off .hud{opacity:0;pointer-events:none;}",
      ".toc{display:none;position:fixed;inset:0;z-index:30;background:rgba(5,11,20,.55);}",
      "body.toc-open .toc{display:block;}",
      ".toc nav{position:absolute;left:0;top:0;bottom:0;width:min(86vw,340px);background:#f3efe6;color:#1c2430;overflow:auto;padding:18px 14px 32px;padding-top:max(18px,env(safe-area-inset-top));box-shadow:12px 0 40px rgba(0,0,0,.25);}",
      ".toc h2{margin:0 0 12px;font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:#8a7340;}",
      ".toc a{display:block;padding:10px 8px;border-top:1px solid #e6dfd0;color:#1c2430;text-decoration:none;font-size:14px;}",
      ".toc a.ch{font-weight:800;color:#0b1f3a;margin-top:6px;border-top:0;}",
      ".toc a.is-on{background:#0b1f3a;color:#fff;}",
      ".blk-tools{display:none!important;}",
      "@media (max-width:720px){",
      ".desk{padding:0;align-items:stretch;}",
      ".book{width:100%;height:100dvh;filter:none;}",
      ".spine{display:none;}",
      ".leaf,.leaf-fit,.leaf-pages{width:100%!important;height:100%!important;max-height:100%!important;transform:none!important;overflow:hidden!important;}",
      ".ebook-page.is-open{width:100%!important;height:100%!important;max-height:100%!important;}",
      ".cover-top{min-height:0!important;padding:28px 20px 18px!important;flex:none!important;}",
      ".cover-bottom{padding:16px 20px 20px!important;flex:none!important;}",
      ".cover-mark{margin:20px 0 16px!important;}",
      ".cover-title{max-width:none!important;}",
      ".page-inner{padding:18px 16px 10px!important;}",
      ".page-footer{padding:0 16px max(12px,env(safe-area-inset-bottom));}",
      ".ch-title{max-width:none!important;}",
      ".dodont,.cover-bottom{grid-template-columns:1fr!important;}",
      ".law-grid{grid-template-columns:1fr!important;}",
      ".pg-float{display:none;}",
      "}",
      "@media print{html,body.ebook{overflow:visible!important;height:auto!important;background:#fff!important;} .hud,.toc,.spine,.pg-float{display:none!important;} .desk,.book,.leaf,.leaf-fit,.leaf-pages{display:block!important;height:auto!important;width:auto!important;max-width:none!important;transform:none!important;filter:none!important;box-shadow:none!important;background:#fff!important;padding:0!important;} .ebook-page{display:flex!important;width:210mm!important;height:297mm!important;max-height:297mm!important;overflow:hidden!important;page-break-after:always;break-after:page;} .ebook-page:last-child{page-break-after:auto;} .cover-top{min-height:148mm!important;padding:22mm 16mm 16mm!important;} .page-inner{padding:var(--page-pad-y) var(--page-pad-x) 6mm!important;overflow:hidden!important;}}"
    ].join("");
  }

  function bookScript(storeKey) {
    const key = JSON.stringify(storeKey || "ebook");
    return (
      "<script>(function(){" +
      "var pages=[].slice.call(document.querySelectorAll('.ebook-page'));var i=0;var swiped=false;" +
      "var key='police-ebook:'+" +
      key +
      ";" +
      "var fitEl=document.getElementById('leaf-fit');var pagesEl=document.getElementById('leaf-pages');" +
      "function phone(){return window.matchMedia('(max-width:720px)').matches;}" +
      "function fit(){if(!fitEl||!pagesEl||!pages.length)return;if(phone()){fitEl.style.width='';fitEl.style.height='';pagesEl.style.transform='';return;}" +
      "pagesEl.style.transform='none';var p=pages[i]||pages[0];var pw=p.offsetWidth||1,ph=p.offsetHeight||1;" +
      "var desk=document.getElementById('desk');var aw=desk.clientWidth-56,ah=desk.clientHeight-36;" +
      "var s=Math.min(aw/pw,ah/ph,1);fitEl.style.width=Math.round(pw*s)+'px';fitEl.style.height=Math.round(ph*s)+'px';" +
      "pagesEl.style.transformOrigin='top left';pagesEl.style.transform='scale('+s+')';}" +
      "function show(n){i=Math.max(0,Math.min(pages.length-1,n));pages.forEach(function(p,k){p.classList.toggle('is-open',k===i);});" +
      "var pg=document.getElementById('pg');if(pg)pg.textContent=(i+1)+' / '+pages.length;" +
      "var on=document.querySelector('.toc a.is-on');if(on)on.classList.remove('is-on');" +
      "var t=document.querySelector('.toc a[data-i=\"'+i+'\"]');if(t)t.classList.add('is-on');" +
      "try{history.replaceState(null,'','#p'+(i+1));}catch(e){}" +
      "try{localStorage.setItem(key,String(i));}catch(e){}" +
      "if(pages[i])pages[i].scrollTop=0;document.body.classList.remove('toc-open');fit();}" +
      "document.getElementById('tocbtn').onclick=function(){document.body.classList.toggle('toc-open');};" +
      "document.getElementById('toc').onclick=function(e){if(e.target.id==='toc')document.body.classList.remove('toc-open');" +
      "var a=e.target.closest('a[data-i]');if(a){e.preventDefault();show(+a.getAttribute('data-i'));}};" +
      "document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();show(i+1);}" +
      "if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();show(i-1);}" +
      "if(e.key==='Escape')document.body.classList.remove('toc-open');});" +
      "var x0=0,y0=0,st=document.getElementById('desk');" +
      "st.addEventListener('touchstart',function(e){x0=e.changedTouches[0].clientX;y0=e.changedTouches[0].clientY;},{passive:true});" +
      "st.addEventListener('touchend',function(e){var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;" +
      "if(Math.abs(dx)<56||Math.abs(dx)<Math.abs(dy))return;swiped=true;if(dx>0)show(i-1);else show(i+1);});" +
      "st.addEventListener('click',function(e){if(swiped){swiped=false;return;}" +
      "if(e.target.closest('button,a,details,.box'))return;" +
      "var r=st.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;" +
      "if(x<0.22)show(i-1);else if(x>0.78)show(i+1);else document.body.classList.toggle('hud-off');});" +
      "window.addEventListener('resize',fit);" +
      "var h=parseInt((location.hash||'').replace('#p',''),10);var saved=0;" +
      "try{saved=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}" +
      "show(h?h-1:saved);" +
      "})();</script>"
    );
  }

  function buildBookHtml(project, articlesHtml) {
    const title = (project.meta && project.meta.title) || "전자책";
    const items = project.pages
      .map(function (p, i) {
        const cls = p.type === "chapter" ? " ch" : "";
        return (
          '<a href="#p' +
          (i + 1) +
          '" class="' +
          cls +
          '" data-i="' +
          i +
          '">' +
          EB.escapeHtml(tocLabel(project, p)) +
          "</a>"
        );
      })
      .join("");
    const opened = articlesHtml.replace('class="ebook-page', 'class="ebook-page is-open');
    return (
      "<!DOCTYPE html>\n<html lang=\"ko\"><head><meta charset=\"UTF-8\">" +
      '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">' +
      '<meta name="theme-color" content="#071018">' +
      '<meta name="apple-mobile-web-app-capable" content="yes">' +
      "<title>" +
      EB.escapeHtml(title) +
      "</title><style>" +
      (EB.EXPORT_CSS || "") +
      bookCss() +
      "</style></head><body class=\"ebook\">" +
      '<header class="hud"><button type="button" id="tocbtn">목차</button>' +
      '<div class="hud-title">' +
      EB.escapeHtml(title) +
      "</div></header>" +
      '<div class="toc" id="toc"><nav><h2>목차</h2>' +
      items +
      "</nav></div>" +
      '<div class="desk" id="desk"><div class="book" id="book"><div class="spine" aria-hidden="true"></div>' +
      '<div class="leaf"><div class="leaf-fit" id="leaf-fit"><div class="leaf-pages" id="leaf-pages">' +
      opened +
      "</div></div></div></div></div>" +
      '<div class="pg-float" id="pg">1 / 1</div>' +
      bookScript(title) +
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

  function bookHtml(project) {
    return buildBookHtml(project, pagesMarkup(project));
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
    htmlString: bookHtml,
    html: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".html"),
        bookHtml(project),
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
    buildBookHtml: buildBookHtml,
    stripEditor: stripEditor
  };
})(typeof window !== "undefined" ? window : global);

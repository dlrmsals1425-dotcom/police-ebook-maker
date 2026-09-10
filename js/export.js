/* PDF / HTML / Markdown / JSON 내보내기 */
(function (g) {
  const EB = (g.EB = g.EB || {});

  function pagesHtml(project, editable) {
    const wrap = document.createElement("div");
    project.pages.forEach(function (p, i) {
      const el = EB.Render.page(project, p, {
        editable: !!editable,
        pageIndex: i,
        total: project.pages.length,
        print: true
      });
      wrap.appendChild(el);
    });
    return wrap;
  }

  function fillPrintRoot(project) {
    const root = document.getElementById("print-root");
    root.innerHTML = "";
    const frag = pagesHtml(project, false);
    while (frag.firstChild) root.appendChild(frag.firstChild);
  }

  function readerCss() {
    return (
      (EB.EXPORT_CSS || "") +
      "\nhtml,body.reader{margin:0;background:#dfe7ee;font-family:var(--font);overflow-x:hidden;max-width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;}" +
      "\n.reader-bar{position:sticky;top:0;z-index:5;display:flex;align-items:center;flex-wrap:wrap;gap:8px 12px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));background:#0b1f3a;color:#fff;font-size:13px;}" +
      "\n.reader-bar strong{flex:0 1 auto;}" +
      "\n.reader-bar .meta{font-size:12px;opacity:.85;}" +
      "\n.reader-bar button{height:32px;padding:0 12px;border:0;background:#2e6aa6;color:#fff;font-weight:700;cursor:pointer;}" +
      "\n.reader-book{display:flex;flex-direction:column;align-items:center;gap:16px;padding:12px 12px 40px;width:100%;box-sizing:border-box;}" +
      "\n.page-fit{overflow:hidden;max-width:100%;}" +
      "\n.reader-book .ebook-page{box-shadow:var(--shadow-page);transform-origin:top left;}" +
      "\n.blk-tools{display:none !important;}" +
      "\n@media print{ .reader-bar{display:none !important;} body.reader{background:#fff;} .reader-book{padding:0;gap:0;} .page-fit{width:210mm !important;height:297mm !important;overflow:visible !important;} .reader-book .ebook-page{box-shadow:none;margin:0;transform:none !important;page-break-after:always;break-after:page;width:210mm;height:297mm;overflow:hidden;-webkit-print-color-adjust:exact;print-color-adjust:exact;} .reader-book .ebook-page:last-child{page-break-after:auto;} }"
    );
  }

  function readerFitScript() {
    return (
      "<script>(function(){function fit(){var book=document.querySelector('.reader-book');if(!book)return;" +
      "var kids=[].slice.call(book.children);for(var i=0;i<kids.length;i++){var p=kids[i];if(!p.classList||!p.classList.contains('ebook-page'))continue;" +
      "if(p.parentElement&&p.parentElement.classList.contains('page-fit'))continue;var w=document.createElement('div');" +
      "w.className='page-fit';book.insertBefore(w,p);w.appendChild(p);}var avail=book.clientWidth;" +
      "var fits=book.querySelectorAll('.page-fit');for(var j=0;j<fits.length;j++){var wrap=fits[j];var page=wrap.querySelector('.ebook-page');if(!page)continue;" +
      "page.style.transform='none';wrap.style.width='';wrap.style.height='';var pw=page.offsetWidth||1;var ph=page.offsetHeight||1;" +
      "var scale=Math.min(1,avail/pw);wrap.style.width=Math.round(pw*scale)+'px';wrap.style.height=Math.round(ph*scale)+'px';" +
      "page.style.transformOrigin='top left';page.style.transform='scale('+scale+')';}}" +
      "function go(){fit();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();" +
      "window.addEventListener('resize',go);window.addEventListener('orientationchange',function(){setTimeout(go,250);});})();</script>"
    );
  }

  EB.Export = {
    preparePrint: function (project) {
      fillPrintRoot(project);
    },
    printPdf: function (project) {
      fillPrintRoot(project);
      const title = document.title;
      document.title = project.meta.title || "전자책";
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
    html: function (project) {
      const frag = pagesHtml(project, false);
      const book = document.createElement("div");
      book.className = "reader-book";
      while (frag.firstChild) {
        const fit = document.createElement("div");
        fit.className = "page-fit";
        fit.appendChild(frag.firstChild);
        book.appendChild(fit);
      }
      const html =
        "<!DOCTYPE html>\n<html lang=\"ko\"><head><meta charset=\"UTF-8\">" +
        "<meta name=\"viewport\" content=\"width=device-width, initial-scale=1, viewport-fit=cover\">" +
        "<title>" +
        EB.escapeHtml(project.meta.title || "전자책") +
        "</title><style>" +
        readerCss() +
        "</style></head><body class=\"reader\">" +
        "<header class=\"reader-bar\"><strong>" +
        EB.escapeHtml(project.meta.title || "") +
        "</strong><span class=\"meta\">" +
        EB.escapeHtml(project.meta.department || "") +
        " · " +
        EB.escapeHtml(project.meta.version || "") +
        '</span><span style="flex:1"></span>' +
        "<button type=\"button\" onclick=\"window.print()\">PDF 저장</button></header>" +
        book.outerHTML +
        readerFitScript() +
        "</body></html>";
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".html"),
        html,
        "text/html;charset=utf-8"
      );
    },
    markdown: function (project) {
      const md = EB.Markdown.toMarkdown(project);
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".md"),
        md,
        "text/markdown;charset=utf-8"
      );
    },
    json: function (project) {
      EB.downloadText(
        EB.safeFilename(project.meta.title, ".json"),
        EB.Store.toJSON(project),
        "application/json;charset=utf-8"
      );
    }
  };
})(window);

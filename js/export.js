/* PDF / 전자책 HTML / Markdown / JSON
   배포 HTML은 표지·조판을 유지한 채 책처럼 넘기는 파일 하나다.
   휴대폰에서는 한 쪽씩 꽉 차게, PC에서는 두 쪽 펼침으로 보인다. */
(function (g) {
  const EB = (g.EB = g.EB || {});

  function tocLabel(project, p) {
    if (p.type === "cover") return (project.meta && project.meta.title) || "표지";
    if (p.type === "chapter") return "제" + (p.chapterNo || "") + "장  " + (p.title || "");
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

  function bookCss() {
    return [
      /* ——— 책상 ——— */
      "html,body.ebook{margin:0;height:100%;background:#17130f;color:#e8e2d6;font-family:var(--font);overflow:hidden;-webkit-text-size-adjust:100%;text-size-adjust:100%;touch-action:manipulation;}",
      ".desk{height:100dvh;display:flex;padding:52px 24px 60px;box-sizing:border-box;background:radial-gradient(ellipse at 50% 24%,#413a31 0%,#26211b 56%,#16120e 100%);}",
      ".stage{flex:1 1 auto;min-width:0;min-height:0;display:flex;align-items:center;justify-content:center;}",
      ".book{display:flex;align-items:stretch;max-width:100%;max-height:100%;}",
      /* 책배(page edge) — 두께가 있는 책으로 보이게 */
      ".book::before,.book::after{content:'';width:7px;flex:0 0 7px;align-self:stretch;background:repeating-linear-gradient(90deg,#efe9db 0 1px,#d8cfbc 1px 2px);}",
      ".book::before{border-radius:3px 0 0 3px;box-shadow:inset -3px 0 6px rgba(0,0,0,.22);}",
      ".book::after{border-radius:0 3px 3px 0;box-shadow:inset 3px 0 6px rgba(0,0,0,.22);}",
      ".leaf{background:var(--paper);position:relative;overflow:hidden;box-shadow:0 26px 64px rgba(0,0,0,.6);}",
      ".leaf-fit{overflow:hidden;transform-origin:top left;}",
      ".leaf-pages{display:flex;align-items:stretch;width:max-content;transform-origin:top left;}",
      ".leaf-pages>.ebook-page{flex:0 0 auto;}",
      /* ——— 쪽 ——— */
      ".ebook-page{display:none;box-shadow:none;}",
      ".ebook-page.is-open{display:flex;overflow:auto;-webkit-overflow-scrolling:touch;animation:leaf-in .26s ease-out;}",
      ".ebook-page.is-open{scrollbar-width:thin;scrollbar-color:rgba(150,118,58,.45) transparent;}",
      ".ebook-page.is-open::-webkit-scrollbar{width:6px;}",
      ".ebook-page.is-open::-webkit-scrollbar-thumb{background:rgba(150,118,58,.4);border-radius:3px;}",
      "@keyframes leaf-in{from{opacity:.25;}to{opacity:1;}}",
      "@media (prefers-reduced-motion:reduce){.ebook-page.is-open{animation:none;}}",
      "body.is-spread .ebook-page.is-left{box-shadow:inset -16px 0 26px -16px rgba(58,44,22,.5);}",
      "body.is-spread .ebook-page.is-right{box-shadow:inset 16px 0 26px -16px rgba(58,44,22,.5);}",
      "body.ebook .page-inner{overflow:visible;flex:1 0 auto;min-height:min-content;height:auto;}",
      "body.ebook .page-body,body.ebook .page-body .blk,body.ebook .flow,body.ebook .flow-step,body.ebook .flow-card,body.ebook .dodont,body.ebook .law-card,body.ebook .check-group{flex:0 0 auto;min-height:min-content;height:auto;overflow:visible;}",
      "body.ebook .flow{gap:0;justify-content:flex-start;}",
      "body.ebook .flow-card{overflow:hidden;}",
      "body.ebook .page-end{margin-top:12px;}",
      /* ——— 위 막대 ——— */
      ".hud{position:fixed;left:0;right:0;top:0;z-index:20;display:flex;align-items:center;gap:6px;padding:9px 12px;padding-top:max(9px,env(safe-area-inset-top));background:linear-gradient(to bottom,rgba(10,7,4,.72),rgba(10,7,4,0));transition:opacity .25s;}",
      ".hud button{height:34px;min-width:34px;padding:0 11px;border:1px solid rgba(255,255,255,.16);border-radius:6px;background:rgba(255,255,255,.1);color:#f2ece1;font-family:var(--font);font-weight:600;font-size:13px;cursor:pointer;}",
      ".hud button:hover{background:rgba(255,255,255,.18);}",
      ".hud-title{flex:1;min-width:0;font-size:13px;font-weight:600;letter-spacing:.02em;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#f2ece1;text-align:center;padding:0 4px;}",
      "body.hud-off .hud{background:transparent;}",
      "body.hud-off .hud-title{opacity:0;}",
      /* ——— 차례 서랍 ——— */
      ".toc{display:none;position:fixed;inset:0;z-index:30;background:rgba(12,9,6,.6);}",
      "body.toc-open .toc{display:block;}",
      ".toc nav{position:absolute;left:0;top:0;bottom:0;width:min(88vw,360px);background:var(--paper);color:var(--ink);overflow:auto;padding:16px 16px 32px;padding-top:max(16px,env(safe-area-inset-top));box-shadow:12px 0 40px rgba(0,0,0,.35);}",
      ".toc h2{margin:14px 0 10px;font-family:var(--font-serif);font-size:15px;letter-spacing:.5em;text-indent:.5em;color:var(--navy-900);text-align:center;}",
      ".toc h2::after{content:'';display:block;width:28px;height:1px;background:var(--gold);margin:10px auto 0;}",
      ".toc a{display:block;padding:11px 6px;border-bottom:1px solid var(--line-soft);color:var(--ink-2);text-decoration:none;font-size:14.5px;line-height:1.45;}",
      ".toc a.ch{font-family:var(--font);font-weight:700;color:var(--navy-900);margin-top:10px;border-bottom:1px solid var(--line);}",
      ".toc a.is-on{color:var(--gold);font-weight:700;}",
      ".toc a.is-on::before{content:'▸ ';}",
      ".blk-tools{display:none!important;}",
      /* ——— 아래 막대 ——— */
      ".reader-controls{position:fixed;bottom:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:center;gap:18px;padding:9px 16px max(9px,env(safe-area-inset-bottom));background:rgba(18,14,10,.94);border-top:1px solid rgba(255,255,255,.1);}",
      ".reader-controls button,.toc-close{min-height:38px;padding:0 16px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:rgba(255,255,255,.08);color:#f2ece1;font:inherit;font-family:var(--font);font-size:13px;cursor:pointer;}",
      ".reader-controls button:disabled{opacity:.3;cursor:default;}",
      ".reader-controls #pg{min-width:84px;text-align:center;font-size:12px;letter-spacing:.06em;font-variant-numeric:tabular-nums;color:#cfc6b6;}",
      ".progress{position:fixed;left:0;right:0;bottom:calc(57px + env(safe-area-inset-bottom));height:2px;background:rgba(255,255,255,.1);z-index:21;}",
      ".progress i{display:block;height:100%;background:var(--gold-soft);transition:width .25s ease;}",
      ".toc-close{background:var(--navy-900);color:#fff;border-color:transparent;margin-bottom:8px;width:100%;}",
      ".fs-note{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;padding:12px 20px;border-radius:8px;background:rgba(18,14,10,.92);color:#f2ece1;font-size:14px;opacity:0;pointer-events:none;transition:opacity .2s;}",
      ".fs-note.show{opacity:1;}",
      "body.ebook :is(button,a):focus-visible{outline:3px solid var(--gold-soft);outline-offset:3px;}",
      /* ——— 휴대폰: 한 쪽이 화면을 꽉 채운다 ——— */
      "@media (max-width:720px){",
      ":root{--fs-body:calc(16.5px * var(--fs-scale));--page-pad-bottom:10px;}",
      ".desk{padding:48px 0 calc(54px + env(safe-area-inset-bottom));background:#16120e;}",
      ".stage{align-items:stretch;}",
      ".book{width:100%;height:100%;}",
      ".book::before,.book::after{display:none;}",
      ".leaf,.leaf-fit,.leaf-pages{width:100%!important;height:100%!important;max-height:100%!important;transform:none!important;overflow:hidden!important;}",
      ".leaf{box-shadow:none;}",
      ".ebook-page.is-open{width:100%!important;height:100%!important;max-height:100%!important;box-shadow:none!important;}",
      ".cover-top{min-height:52dvh!important;padding:26px 22px 22px!important;flex:1.45 1 0!important;}",
      ".cover-top::after{inset:12px!important;}",
      ".cover-bottom{padding:18px 22px 22px!important;flex:none!important;}",
      ".cover-photo{object-position:center 36%!important;}",
      ".cover-emblem,.cover-mark{width:66px!important;height:66px!important;margin:6px auto 0!important;}",
      ".page-inner{padding:20px 20px 6px!important;}",
      ".chapter-page .page-inner{padding-top:56px!important;}",
      ".page-footer{padding:0 20px 14px!important;}",
      ".dodont{grid-template-columns:1fr!important;}",
      ".law-grid{grid-template-columns:1fr!important;}",
      ".toc-head{margin-bottom:20px!important;}",
      "}",
      /* 아주 좁은 화면 */
      "@media (max-width:380px){.hud button{padding:0 8px;font-size:12px;}.reader-controls{gap:10px;}.reader-controls button{padding:0 12px;}}",
      /* ——— 인쇄: 한 쪽씩 낱장으로 ——— */
      "@media print{",
      "html,body.ebook{overflow:visible!important;height:auto!important;background:#fff!important;}",
      ".hud,.toc,.reader-controls,.progress,.fs-note{display:none!important;}",
      ".desk,.stage,.book,.leaf,.leaf-fit,.leaf-pages{display:block!important;height:auto!important;width:auto!important;max-width:none!important;transform:none!important;filter:none!important;box-shadow:none!important;background:#fff!important;padding:0!important;}",
      ".book::before,.book::after{display:none!important;}",
      ".ebook-page{display:flex!important;width:var(--page-w)!important;height:var(--page-h)!important;max-height:var(--page-h)!important;overflow:hidden!important;box-shadow:none!important;animation:none!important;page-break-after:always;break-after:page;}",
      ".ebook-page:last-child{page-break-after:auto;}",
      ".page-inner{padding:var(--page-pad-y) var(--page-pad-x) 6mm!important;overflow:hidden!important;}",
      "}"
    ].join("");
  }

  function bookScript(storeKey) {
    const key = JSON.stringify(storeKey || "ebook").replace(/</g, "\\u003c");
    return (
      "<script>(function(){\n" +
      [
        "var pages=[].slice.call(document.querySelectorAll('.ebook-page'));",
        "if(!pages.length)return;",
        "var i=0,open=[0],swiped=false;",
        "var key='police-ebook:'+" + key + ";",
        "var fitEl=document.getElementById('leaf-fit');",
        "var pagesEl=document.getElementById('leaf-pages');",
        "var deskEl=document.getElementById('desk');var stageEl=document.getElementById('stage')||deskEl;",
        "var root=document.documentElement;",
        "var STEPS=[0.88,1,1.14,1.32];var NAMES=['작게','보통','크게','아주 크게'];var fsi=1;",
        "function mq(q){return !!(window.matchMedia&&window.matchMedia(q).matches);}",
        "function phone(){return mq('(max-width:720px)');}",
        /* 두 쪽 펼침은 넓은 화면에서만. 표지는 한 쪽으로 세우고 그다음부터 짝을 짓는다. */
        "function spread(){return mq('(min-width:1000px)')&&mq('(min-height:560px)');}",
        "function views(){var v=[],k;",
        "if(!spread()){for(k=0;k<pages.length;k++)v.push([k]);return v;}",
        "v.push([0]);for(k=1;k<pages.length;k+=2){v.push(pages[k+1]?[k,k+1]:[k]);}return v;}",
        "function viewOf(list,n){for(var k=0;k<list.length;k++){if(list[k].indexOf(n)>=0)return k;}return 0;}",
        "function fit(){if(!fitEl||!pagesEl)return;",
        "if(phone()){fitEl.style.width='';fitEl.style.height='';pagesEl.style.transform='';return;}",
        "pagesEl.style.transform='none';",
        "var pw=pagesEl.offsetWidth||1,ph=pagesEl.offsetHeight||1;",
        "var aw=Math.max(1,(stageEl?stageEl.clientWidth:pw)-8),ah=Math.max(1,(stageEl?stageEl.clientHeight:ph)-8);",
        "var s=Math.min(aw/pw,ah/ph,1);",
        "fitEl.style.width=Math.round(pw*s)+'px';fitEl.style.height=Math.round(ph*s)+'px';",
        "pagesEl.style.transformOrigin='top left';pagesEl.style.transform='scale('+s+')';}",
        "function show(n){",
        "n=Math.max(0,Math.min(pages.length-1,Number.isFinite(n)?n:0));",
        "var list=views();var vi=viewOf(list,n);open=list[vi];i=open[0];",
        "pages.forEach(function(p,k){var on=open.indexOf(k)>=0;",
        "p.classList.toggle('is-open',on);",
        "p.classList.toggle('is-left',on&&open.length>1&&k===open[0]);",
        "p.classList.toggle('is-right',on&&open.length>1&&k===open[open.length-1]);",
        "if(on)p.scrollTop=0;});",
        "document.body.classList.toggle('is-spread',open.length>1);",
        "var pg=document.getElementById('pg');",
        "if(pg)pg.textContent=(open.length>1?(open[0]+1)+'-'+(open[1]+1):(i+1))+' / '+pages.length;",
        "var bar=document.getElementById('bar');",
        "if(bar)bar.style.width=Math.round((open[open.length-1]+1)/pages.length*100)+'%';",
        "document.getElementById('reader-prev').disabled=vi===0;",
        "document.getElementById('reader-next').disabled=vi===list.length-1;",
        "var on2=document.querySelector('.toc a.is-on');if(on2)on2.classList.remove('is-on');",
        "var t=document.querySelector('.toc a[data-i=\"'+i+'\"]');if(t)t.classList.add('is-on');",
        "try{history.replaceState(null,'','#p'+(i+1));}catch(e){}",
        "try{localStorage.setItem(key,String(i));}catch(e){}",
        "closeToc();fit();}",
        "function nextView(){show(open[open.length-1]+1);}",
        "function prevView(){show(open[0]-1);}",
        "function closeToc(){var opened=document.body.classList.contains('toc-open');",
        "document.body.classList.remove('toc-open');",
        "document.getElementById('tocbtn').setAttribute('aria-expanded','false');",
        "if(opened)document.getElementById('tocbtn').focus();}",
        /* 글자 크기 — 휴대폰에서 오래 읽을 때 쓴다 */
        "function applyFs(note){",
        "if(root&&root.style&&root.style.setProperty)root.style.setProperty('--fs-scale',String(STEPS[fsi]));",
        "try{localStorage.setItem(key+':fs',String(fsi));}catch(e){}",
        "var el=document.getElementById('fs-note');",
        "if(el&&note){el.textContent='글자 크기 '+NAMES[fsi];el.className='fs-note show';",
        "clearTimeout(el._t);el._t=setTimeout(function(){el.className='fs-note';},900);}",
        "fit();}",
        "document.getElementById('tocbtn').onclick=function(){",
        "var opened=document.body.classList.toggle('toc-open');",
        "this.setAttribute('aria-expanded',String(opened));",
        "if(opened)document.getElementById('toc-close').focus();};",
        "document.getElementById('toc-close').onclick=closeToc;",
        "document.getElementById('reader-prev').onclick=prevView;",
        "document.getElementById('reader-next').onclick=nextView;",
        "document.getElementById('fontbtn').onclick=function(){fsi=(fsi+1)%STEPS.length;applyFs(true);};",
        "document.getElementById('resetbtn').onclick=function(){try{localStorage.removeItem(key);}catch(e){}show(0);};",
        "document.getElementById('toc').onclick=function(e){if(e.target.id==='toc')closeToc();",
        "var a=e.target.closest('a[data-i]');if(a){e.preventDefault();show(+a.getAttribute('data-i'));}};",
        "document.addEventListener('keydown',function(e){",
        "if(e.key==='Escape'){closeToc();return;}",
        "if(document.body.classList.contains('toc-open')||e.target.closest('button,a,input,textarea,select,summary,[contenteditable]'))return;",
        "if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();nextView();}",
        "if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prevView();}});",
        "var x0=0,y0=0,st=deskEl;",
        "st.addEventListener('touchstart',function(e){x0=e.changedTouches[0].clientX;y0=e.changedTouches[0].clientY;},{passive:true});",
        "st.addEventListener('touchend',function(e){",
        "var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;",
        "if(Math.abs(dx)<48||Math.abs(dx)<Math.abs(dy))return;",
        "swiped=true;if(dx>0)prevView();else nextView();});",
        "st.addEventListener('click',function(e){",
        "if(swiped){swiped=false;return;}",
        "if(e.target.closest('button,a,details,.box'))return;",
        "var r=st.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;",
        "if(x<0.24)prevView();else if(x>0.76)nextView();else document.body.classList.toggle('hud-off');});",
        "window.addEventListener('resize',function(){show(i);});",
        "window.addEventListener('orientationchange',function(){setTimeout(function(){show(i);},120);});",
        "try{var sf=parseInt(localStorage.getItem(key+':fs'),10);if(sf>=0&&sf<STEPS.length)fsi=sf;}catch(e){}",
        "applyFs(false);",
        "var h=parseInt((location.hash||'').replace('#p',''),10);var saved=0;",
        "try{saved=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}",
        "show(h?h-1:saved);"
      ].join("\n") +
      "\n})();</script>"
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
      '<meta name="theme-color" content="#17130f">' +
      '<meta name="apple-mobile-web-app-capable" content="yes">' +
      "<title>" +
      EB.escapeHtml(title) +
      "</title><style>" +
      (EB.EXPORT_CSS || "") +
      bookCss() +
      "</style></head><body class=\"ebook\">" +
      '<header class="hud"><button type="button" id="tocbtn" aria-controls="toc" aria-expanded="false">차례</button>' +
      '<div class="hud-title">' +
      EB.escapeHtml(title) +
      "</div>" +
      '<button type="button" id="fontbtn" aria-label="글자 크기 바꾸기">가</button>' +
      '<button type="button" id="resetbtn" aria-label="처음으로 돌아가기">처음</button></header>' +
      '<div class="toc" id="toc"><nav aria-label="전자책 차례"><button type="button" class="toc-close" id="toc-close">닫기</button><h2>차 례</h2>' +
      items +
      "</nav></div>" +
      '<div class="desk" id="desk"><div class="stage" id="stage"><div class="book" id="book">' +
      '<div class="leaf"><div class="leaf-fit" id="leaf-fit"><div class="leaf-pages" id="leaf-pages">' +
      opened +
      "</div></div></div></div></div></div>" +
      '<div class="progress" aria-hidden="true"><i id="bar"></i></div>' +
      '<nav class="reader-controls" aria-label="전자책 페이지 이동"><button type="button" id="reader-prev">← 이전</button><span id="pg" role="status">1 / 1</span><button type="button" id="reader-next">다음 →</button></nav>' +
      '<div class="fs-note" id="fs-note" role="status"></div>' +
      bookScript(title) +
      "</body></html>"
    );
  }

  function bookHtml(project) {
    return buildBookHtml(project, pagesMarkup(project));
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

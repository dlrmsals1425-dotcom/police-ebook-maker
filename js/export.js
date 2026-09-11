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
      ".leaf-pages{position:relative;display:flex;align-items:stretch;width:max-content;transform-origin:top left;}",
      ".leaf-pages>.ebook-page{flex:0 0 auto;}",
      /* ——— 쪽 ——— */
      ".ebook-page{display:none;box-shadow:none;}",
      ".ebook-page.is-open{display:flex;overflow:auto;-webkit-overflow-scrolling:touch;}",
      ".ebook-page.is-open{scrollbar-width:thin;scrollbar-color:rgba(150,118,58,.45) transparent;}",
      ".ebook-page.is-open::-webkit-scrollbar{width:6px;}",
      ".ebook-page.is-open::-webkit-scrollbar-thumb{background:rgba(150,118,58,.4);border-radius:3px;}",
      /* 넘길 때만 두 쪽을 겹친다. 원래 본문과 스크롤은 건드리지 않는다. */
      ".desk{touch-action:pan-y pinch-zoom;}",
      "@media (hover:hover) and (pointer:fine){.desk{cursor:grab;}.desk.is-dragging{cursor:grabbing;}.desk :is(a,button,input,textarea,select,details){cursor:auto;}}",
      ".turn-layer{position:absolute;inset:0;z-index:10;perspective:1500px;perspective-origin:left center;pointer-events:none;user-select:none;-webkit-user-select:none;}",
      ".turn-base,.turn-sheet{position:absolute;inset:0;overflow:hidden;background:var(--paper);}",
      /* page-end 등의 z-index가 다른 책장 위로 빠져나오지 않게 각각 묶는다. */
      ".turn-base{z-index:0;}",
      ".turn-sheet{z-index:1;transform-origin:left center;backface-visibility:hidden;-webkit-backface-visibility:hidden;will-change:transform;box-shadow:12px 0 28px rgba(18,14,10,.24);}",
      ".turn-sheet::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(90deg,rgba(18,14,10,.3),transparent 18%,rgba(255,255,255,.2) 80%,rgba(18,14,10,.12));opacity:var(--turn-shade,0);}",
      ".turn-shadow{position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,14,10,.6),rgba(18,14,10,.12));opacity:0;}",
      ".turn-layer .ebook-page{width:100%;height:100%;max-height:100%;margin:0;animation:none!important;scrollbar-width:none;}",
      ".turn-layer .ebook-page::-webkit-scrollbar{display:none;}",
      "@media (prefers-reduced-motion:reduce){body:not(.motion-enabled) .turn-layer{display:none;}.progress i{transition:none;}}",
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
      ".toc nav{box-sizing:border-box;position:absolute;left:0;top:0;bottom:0;width:min(88vw,360px);background:var(--paper);color:var(--ink);overflow:auto;overscroll-behavior:contain;padding:16px 16px 32px;padding-top:max(16px,env(safe-area-inset-top));box-shadow:12px 0 40px rgba(0,0,0,.35);}",
      ".toc-tools{position:sticky;top:0;z-index:1;display:flex;gap:8px;padding:8px 0;background:var(--paper);}",
      ".toc-tools button{min-height:44px;flex:1;margin:0;border:1px solid var(--line);border-radius:7px;font:inherit;font-size:14px;cursor:pointer;}",
      ".toc h2{margin:14px 0 10px;font-family:var(--font-serif);font-size:15px;letter-spacing:.5em;text-indent:.5em;color:var(--navy-900);text-align:center;}",
      ".toc h2::after{content:'';display:block;width:28px;height:1px;background:var(--gold);margin:10px auto 0;}",
      ".toc a{display:block;padding:11px 6px;border-bottom:1px solid var(--line-soft);color:var(--ink-2);text-decoration:none;font-size:14.5px;line-height:1.45;}",
      ".toc a.ch{font-family:var(--font);font-weight:700;color:var(--navy-900);margin-top:10px;border-bottom:1px solid var(--line);}",
      ".toc a.is-on{color:var(--gold);font-weight:700;}",
      ".toc a.is-on::before{content:'▸ ';}",
      ".toc a[hidden]{display:none;}",
      ".toc-search-label{display:block;margin:18px 0 6px;font-size:13px;font-weight:700;}",
      ".toc input{box-sizing:border-box;width:100%;min-height:44px;padding:10px 12px;border:1px solid var(--line);border-radius:7px;background:#fff;color:var(--ink);font:inherit;font-size:16px;}",
      ".toc-status,.toc-excerpt{font-size:12px;line-height:1.6;color:var(--ink-2);letter-spacing:0;}",
      ".toc-status{margin:8px 0 12px;}",
      ".toc-excerpt{display:block;margin-top:5px;font-weight:400;overflow-wrap:anywhere;}",
      ".toc-excerpt:empty{display:none;}",
      ".blk-tools{display:none!important;}",
      /* ——— 아래 막대 ——— */
      ".reader-controls{position:fixed;bottom:0;left:0;right:0;z-index:20;display:flex;align-items:center;justify-content:center;gap:18px;padding:9px 16px max(9px,env(safe-area-inset-bottom));background:rgba(18,14,10,.94);border-top:1px solid rgba(255,255,255,.1);}",
      ".reader-controls button,.toc-close{min-height:38px;padding:0 16px;border:1px solid rgba(255,255,255,.2);border-radius:7px;background:rgba(255,255,255,.08);color:#f2ece1;font:inherit;font-family:var(--font);font-size:13px;cursor:pointer;}",
      ".reader-controls button:disabled{opacity:.3;cursor:default;}",
      "#pg{flex:none;min-width:62px;text-align:center;font-size:12px;font-variant-numeric:tabular-nums;color:#cfc6b6;}",
      ".progress{position:fixed;left:0;right:0;bottom:calc(57px + env(safe-area-inset-bottom));height:2px;background:rgba(255,255,255,.1);z-index:21;}",
      ".progress i{display:block;height:100%;background:var(--gold-soft);transition:width .25s ease;}",
      ".toc-close{background:var(--navy-900);color:#fff;border-color:transparent;margin-bottom:8px;width:100%;}",
      ".fs-note{position:fixed;left:50%;top:50%;transform:translate(-50%,-50%);z-index:40;padding:12px 20px;border-radius:8px;background:rgba(18,14,10,.92);color:#f2ece1;font-size:14px;opacity:0;pointer-events:none;transition:opacity .2s;}",
      ".fs-note.show{opacity:1;}",
      "body.ebook :is(button,a,input):focus-visible{outline:3px solid var(--gold-soft);outline-offset:3px;}",
      /* ——— 휴대폰: 한 쪽이 화면을 꽉 채운다 ——— */
      "@media screen and (max-width:720px),screen and (max-width:1000px) and (pointer:coarse){",
      ":root{--fs-body:calc(17px * var(--fs-scale));--page-pad-bottom:10px;--reader-top:calc(56px + env(safe-area-inset-top));--reader-bottom:calc(61px + env(safe-area-inset-bottom));}",
      ".desk{height:100vh;height:100dvh;padding:var(--reader-top) env(safe-area-inset-right) var(--reader-bottom) env(safe-area-inset-left);background:var(--paper);}",
      ".hud{box-sizing:border-box;height:var(--reader-top);padding:6px max(12px,env(safe-area-inset-right)) 6px max(12px,env(safe-area-inset-left));padding-top:calc(6px + env(safe-area-inset-top));background:var(--navy-950);gap:8px;}",
      ".hud button{height:44px;min-width:44px;font-size:16px;}",
      ".hud-title{text-align:left;font-size:13px;}",
      ".reader-controls{box-sizing:border-box;height:var(--reader-bottom);display:grid;grid-template-columns:1fr 1.25fr 1fr;gap:8px;padding:8px max(12px,env(safe-area-inset-right)) calc(8px + env(safe-area-inset-bottom)) max(12px,env(safe-area-inset-left));background:var(--navy-950);}",
      ".reader-controls button{min-height:44px;padding:0 8px;font-size:14px;}",
      ".reader-controls #tocbtn{background:var(--navy-800);border-color:var(--navy-700);font-weight:700;}",
      ".progress{bottom:var(--reader-bottom);}",
      ".toc nav{width:100%;padding:env(safe-area-inset-top) max(20px,env(safe-area-inset-right)) calc(24px + env(safe-area-inset-bottom)) max(20px,env(safe-area-inset-left));}",
      ".toc-tools{padding:8px 0;}",
      ".toc h2{margin:12px 0;}.toc a{min-height:48px;box-sizing:border-box;font-size:16px;padding:13px 4px;}.toc-excerpt{font-size:14px;}",
      ".stage{align-items:stretch;}",
      ".book{width:100%;height:100%;}",
      ".book::before,.book::after{display:none;}",
      ".leaf,.leaf-fit,.leaf-pages{width:100%!important;height:100%!important;max-height:100%!important;transform:none!important;overflow:hidden!important;}",
      ".leaf{box-shadow:none;}",
      ".ebook-page.is-open{width:100%!important;height:100%!important;max-height:100%!important;box-shadow:none!important;font-family:var(--font);overflow-x:hidden;overscroll-behavior-y:contain;overflow-wrap:anywhere;}",
      ".page-head{margin-bottom:20px;padding-bottom:14px;}.pg-title{font-size:1.5em;line-height:1.4;}.page-body{gap:18px;}",
      ".cover-top{min-height:240px!important;min-height:min(42dvh,360px)!important;padding:26px 22px 22px!important;flex:1 0 auto!important;}",
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
      "@media (max-width:380px){.reader-controls{gap:6px;}.reader-controls button{padding:0 6px;}}",
      /* ——— 인쇄: 한 쪽씩 낱장으로 ——— */
      "@media print{",
      "html,body.ebook{overflow:visible!important;height:auto!important;background:#fff!important;}",
      ".hud,.toc,.reader-controls,.progress,.fs-note,.turn-layer{display:none!important;}",
      ".desk,.stage,.book,.leaf,.leaf-fit,.leaf-pages{display:block!important;height:auto!important;width:auto!important;max-width:none!important;transform:none!important;filter:none!important;box-shadow:none!important;background:#fff!important;padding:0!important;}",
      ".book::before,.book::after{display:none!important;}",
      ".ebook-page{display:flex!important;width:var(--page-w)!important;height:var(--page-h)!important;max-height:var(--page-h)!important;overflow:hidden!important;box-shadow:none!important;animation:none!important;page-break-after:always;break-after:page;}",
      ".ebook-page:last-child{page-break-after:auto;}",
      ".page-inner{padding:var(--page-pad-y) var(--page-pad-x) 6mm!important;overflow:hidden!important;}",
      "}"
    ].join("");
  }

  function bookScript(storeKey, startIndex, preview) {
    const key = JSON.stringify(storeKey || "ebook").replace(/</g, "\\u003c");
    const initial = Number.isInteger(startIndex) && startIndex >= 0 ? String(startIndex) : "null";
    return (
      "<script>(function(){\n" +
      [
        "var pages=[].slice.call(document.querySelectorAll('.ebook-page'));",
        "if(!pages.length)return;",
        "var i=0,open=[0],ignoreClickUntil=0,turn=null;",
        "var preview=" + (preview === true ? "true" : "false") + ";",
        "var key='police-ebook:'+" + key + ";",
        "var fitEl=document.getElementById('leaf-fit');",
        "var pagesEl=document.getElementById('leaf-pages');",
        "var deskEl=document.getElementById('desk');var stageEl=document.getElementById('stage')||deskEl;",
        "var root=document.documentElement;",
        "var tocLinks=[].slice.call(document.querySelectorAll('.toc a[data-i]'));",
        "var searchEl=document.getElementById('toc-search');",
        "var searchText=pages.map(function(p){return (p.textContent||'').replace(/\\s+/g,' ').trim();});",
        "function searchToc(){var q=searchEl.value.replace(/\\s+/g,' ').trim().toLocaleLowerCase();var count=0;",
        "tocLinks.forEach(function(a,k){var text=searchText[k];var at=text.toLocaleLowerCase().indexOf(q);var hit=!q||at>=0;a.hidden=!hit;if(hit)count++;",
        "var excerpt=a.querySelector('.toc-excerpt');if(excerpt)excerpt.textContent=q&&hit?(at>35?'…':'')+text.slice(Math.max(0,at-35),at+q.length+70)+(at+q.length+70<text.length?'…':''):'';});",
        "document.getElementById('toc-status').textContent=q?(count?'검색 결과 '+count+'쪽 · 항목을 누르면 해당 쪽으로 이동합니다.':'검색 결과가 없습니다. 다른 단어로 찾아보세요.'):'제목과 본문을 검색할 수 있습니다. 전체 '+pages.length+'쪽';}",
        "searchEl.addEventListener('input',searchToc);searchToc();",
        "var STEPS=[0.88,1,1.14,1.32];var NAMES=['작게','보통','크게','아주 크게'];var fsi=1;",
        "function mq(q){return !!(window.matchMedia&&window.matchMedia(q).matches);}",
        "function reducedMotion(){return !preview&&mq('(prefers-reduced-motion:reduce)');}",
        "function phone(){return mq('(max-width:720px)')||mq('(max-width:1000px) and (pointer:coarse)');}",
        /* 두 쪽 펼침은 넓은 화면에서만. 표지는 한 쪽으로 세우고 그다음부터 짝을 짓는다. */
        "function spread(){return !preview&&!phone()&&mq('(min-width:1000px)')&&mq('(min-height:560px)');}",
        "function views(){var v=[],k;",
        "if(!spread()){for(k=0;k<pages.length;k++)v.push([k]);return v;}",
        "v.push([0]);for(k=1;k<pages.length;k+=2){v.push(pages[k+1]?[k,k+1]:[k]);}return v;}",
        "function viewOf(list,n){for(var k=0;k<list.length;k++){if(list[k].indexOf(n)>=0)return k;}return 0;}",
        /* 한 쪽 보기용 책장 회전. 차례 점프와 두 쪽 펼침은 즉시 이동한다. */
        "function cancelTurn(){mouseTracking=false;if(deskEl)deskEl.classList.remove('is-dragging');if(!turn)return;var t=turn;turn=null;if(t.frame)window.cancelAnimationFrame(t.frame);t.layer.remove();}",
        "function paintTurn(t,p){t.progress=Math.max(0,Math.min(1,p));var angle=-92*(t.dir>0?t.progress:1-t.progress);",
        "t.sheet.style.transform='rotateY('+angle+'deg)';var shade=Math.sin(Math.PI*t.progress);t.sheet.style.setProperty('--turn-shade',String(shade));t.shadow.style.opacity=String(shade*.65);}",
        "function startTurn(dir){var target=i+dir;",
        "if(turn||document.body.classList.contains('toc-open')||target<0||target>=pages.length||open.length!==1||views()[viewOf(views(),target)].length!==1||reducedMotion()||!window.requestAnimationFrame)return false;",
        "var layer=document.createElement('div'),base=document.createElement('div'),sheet=document.createElement('div'),shadow=document.createElement('div');",
        "layer.className='turn-layer';layer.setAttribute('aria-hidden','true');layer.inert=true;base.className='turn-base';sheet.className='turn-sheet';shadow.className='turn-shadow';",
        "function copyPage(n){var copy=pages[n].cloneNode(true);copy.removeAttribute('id');copy.querySelectorAll('[id]').forEach(function(el){el.removeAttribute('id');});copy.classList.add('is-open');return copy;}",
        "var baseIndex=dir>0?target:i,sheetIndex=dir>0?i:target;var baseCopy=copyPage(baseIndex),sheetCopy=copyPage(sheetIndex);",
        "base.appendChild(baseCopy);base.appendChild(shadow);sheet.appendChild(sheetCopy);layer.appendChild(base);layer.appendChild(sheet);pagesEl.appendChild(layer);",
        "baseCopy.scrollTop=baseIndex===i?pages[i].scrollTop:0;sheetCopy.scrollTop=sheetIndex===i?pages[i].scrollTop:0;",
        "turn={dir:dir,target:target,layer:layer,sheet:sheet,shadow:shadow,progress:0,frame:0,animating:false,width:Math.max(1,pagesEl.getBoundingClientRect().width)};paintTurn(turn,0);return true;}",
        "function settleTurn(commit){var t=turn;if(!t||t.animating)return;t.animating=true;var from=t.progress,to=commit?1:0,duration=Math.max(140,360*Math.abs(to-from)),started=null;",
        "function tick(now){if(turn!==t)return;if(started===null)started=now;var p=Math.min(1,(now-started)/duration);if(reducedMotion())p=1;paintTurn(t,from+(to-from)*(1-Math.pow(1-p,3)));",
        "if(p<1){t.frame=window.requestAnimationFrame(tick);}else{cancelTurn();if(commit)show(t.target);}}t.frame=window.requestAnimationFrame(tick);}",
        "function turnPage(dir){if(turn)return;var target=dir>0?open[open.length-1]+1:open[0]-1;if(target<0||target>=pages.length)return;if(startTurn(dir))settleTurn(true);else show(target);}",
        "function fit(){if(!fitEl||!pagesEl)return;",
        "if(phone()){fitEl.style.width='';fitEl.style.height='';pagesEl.style.transform='';return;}",
        "pagesEl.style.transform='none';",
        "var pw=pagesEl.offsetWidth||1,ph=pagesEl.offsetHeight||1;",
        "var aw=Math.max(1,(stageEl?stageEl.clientWidth:pw)-8),ah=Math.max(1,(stageEl?stageEl.clientHeight:ph)-8);",
        "var s=Math.min(aw/pw,ah/ph,1);",
        "fitEl.style.width=Math.round(pw*s)+'px';fitEl.style.height=Math.round(ph*s)+'px';",
        "pagesEl.style.transformOrigin='top left';pagesEl.style.transform='scale('+s+')';}",
        "function show(n,keepScroll){",
        "cancelTurn();tracking=false;",
        "n=Math.max(0,Math.min(pages.length-1,Number.isFinite(n)?n:0));",
        "var list=views();var vi=viewOf(list,n);open=list[vi];i=open[0];",
        "pages.forEach(function(p,k){var on=open.indexOf(k)>=0;",
        "p.classList.toggle('is-open',on);",
        "p.classList.toggle('is-left',on&&open.length>1&&k===open[0]);",
        "p.classList.toggle('is-right',on&&open.length>1&&k===open[open.length-1]);",
        "if(on&&!keepScroll)p.scrollTop=0;});",
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
        "if(!keepScroll)closeToc();fit();}",
        "function nextView(){turnPage(1);}",
        "function prevView(){turnPage(-1);}",
        "function closeToc(){var opened=document.body.classList.contains('toc-open');",
        "document.body.classList.remove('toc-open');",
        "setBackgroundInert(false);",
        "document.getElementById('tocbtn').setAttribute('aria-expanded','false');",
        "if(opened)document.getElementById('tocbtn').focus();}",
        "function setBackgroundInert(value){['desk','reader-hud','reader-controls'].forEach(function(id){var el=document.getElementById(id);if(el)el.inert=value;});}",
        /* 글자 크기 — 휴대폰에서 오래 읽을 때 쓴다 */
        "function applyFs(note){",
        "cancelTurn();tracking=false;",
        "if(root&&root.style&&root.style.setProperty)root.style.setProperty('--fs-scale',String(STEPS[fsi]));",
        "document.getElementById('fontbtn').setAttribute('aria-label','글자 크기 '+NAMES[fsi]+', 누르면 다음 크기');",
        "try{localStorage.setItem(key+':fs',String(fsi));}catch(e){}",
        "var el=document.getElementById('fs-note');",
        "if(el&&note){el.textContent='글자 크기 '+NAMES[fsi];el.className='fs-note show';",
        "clearTimeout(el._t);el._t=setTimeout(function(){el.className='fs-note';},900);}",
        "fit();}",
        "document.getElementById('tocbtn').onclick=function(){",
        "cancelTurn();tracking=false;",
        "var opened=document.body.classList.toggle('toc-open');",
        "this.setAttribute('aria-expanded',String(opened));",
        "setBackgroundInert(opened);if(opened)(phone()?document.getElementById('toc-close'):searchEl).focus();};",
        "document.getElementById('toc-close').onclick=closeToc;",
        "document.getElementById('reader-prev').onclick=prevView;",
        "document.getElementById('reader-next').onclick=nextView;",
        "document.getElementById('fontbtn').onclick=function(){fsi=(fsi+1)%STEPS.length;applyFs(true);};",
        "document.getElementById('resetbtn').onclick=function(){try{localStorage.removeItem(key);}catch(e){}show(0);};",
        "document.getElementById('toc').onclick=function(e){if(e.target.id==='toc')closeToc();",
        "var a=e.target.closest('a[data-i]');if(a){e.preventDefault();show(+a.getAttribute('data-i'));}};",
        "document.addEventListener('keydown',function(e){",
        "if(e.key==='Escape'){closeToc();return;}",
        "if(e.key==='Tab'&&document.body.classList.contains('toc-open')){var stops=[document.getElementById('toc-close'),document.getElementById('resetbtn'),searchEl].concat(tocLinks.filter(function(a){return !a.hidden;}));var first=stops[0],last=stops[stops.length-1];if(e.shiftKey&&e.target===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&e.target===last){e.preventDefault();first.focus();}return;}",
        "if(document.body.classList.contains('toc-open')||e.target.closest('button,a,input,textarea,select,summary,[contenteditable]'))return;",
        "if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();nextView();}",
        "if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prevView();}});",
        "var x0=0,y0=0,tracking=false,st=deskEl;",
        "function selected(){return !!(window.getSelection&&String(window.getSelection()).trim());}",
        "st.addEventListener('touchstart',function(e){if(turn){tracking=false;if(!turn.animating)settleTurn(false);return;}tracking=e.touches.length===1&&!selected()&&!e.target.closest('button,a,input,textarea,select,details,table,[contenteditable]');if(!tracking)return;x0=e.touches[0].clientX;y0=e.touches[0].clientY;},{passive:true});",
        "st.addEventListener('touchmove',function(e){if(!tracking)return;",
        "if(e.touches.length!==1||selected()||Math.abs(e.touches[0].clientY-y0)>24){tracking=false;if(turn)settleTurn(false);return;}",
        "var dx=e.touches[0].clientX-x0,dy=e.touches[0].clientY-y0;if(!turn&&(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy)*1.6))return;",
        "if(!e.cancelable){tracking=false;cancelTurn();return;}if(!turn)startTurn(dx<0?1:-1);if(turn){e.preventDefault();paintTurn(turn,(turn.dir>0?-dx:dx)/turn.width);}",
        "},{passive:false});",
        "st.addEventListener('touchcancel',function(){tracking=false;ignoreClickUntil=Date.now()+500;if(turn)settleTurn(false);},{passive:true});",
        "st.addEventListener('touchend',function(e){",
        "var dx=e.changedTouches[0].clientX-x0,dy=e.changedTouches[0].clientY-y0;if(Math.abs(dx)>10||Math.abs(dy)>10)ignoreClickUntil=Date.now()+500;",
        "if(!tracking)return;tracking=false;if(selected()){if(turn)settleTurn(false);return;}",
        "if(turn){ignoreClickUntil=Date.now()+500;var distance=turn.dir>0?-dx:dx;paintTurn(turn,distance/turn.width);settleTurn(distance>=Math.max(64,turn.width*.22)&&Math.abs(dy)<=24);return;}",
        "var minSwipe=Math.max(64,(pagesEl.getBoundingClientRect?pagesEl.getBoundingClientRect().width:320)*.22);if(Math.abs(dx)<minSwipe||Math.abs(dy)>24||Math.abs(dx)<Math.abs(dy)*1.6)return;",
        "ignoreClickUntil=Date.now()+500;if(dx>0)prevView();else nextView();},{passive:true});",
        /* 마우스는 문서 전체에서 이동/놓기를 받아 책 밖에서 놓아도 종료한다. */
        "var mouseTracking=false,mx0=0,my0=0;",
        "st.addEventListener('mousedown',function(e){if(e.button!==0||e.ctrlKey||e.metaKey||e.shiftKey||turn||selected()||Date.now()<ignoreClickUntil||e.target.closest('button,a,input,textarea,select,details,table,[contenteditable]'))return;",
        "mouseTracking=true;mx0=e.clientX;my0=e.clientY;e.preventDefault();});",
        "document.addEventListener('mousemove',function(e){if(!mouseTracking)return;var dx=e.clientX-mx0,dy=e.clientY-my0;",
        "if(Math.abs(dy)>40){mouseTracking=false;st.classList.remove('is-dragging');if(turn)settleTurn(false);return;}",
        "if(!turn&&(Math.abs(dx)<12||Math.abs(dx)<Math.abs(dy)*1.6))return;if(!turn)startTurn(dx<0?1:-1);",
        "if(turn){e.preventDefault();st.classList.add('is-dragging');paintTurn(turn,(turn.dir>0?-dx:dx)/turn.width);}});",
        "document.addEventListener('mouseup',function(e){if(!mouseTracking||e.button!==0)return;mouseTracking=false;st.classList.remove('is-dragging');var dx=e.clientX-mx0,dy=e.clientY-my0;",
        "if(turn){ignoreClickUntil=Date.now()+500;var distance=turn.dir>0?-dx:dx;paintTurn(turn,distance/turn.width);settleTurn(distance>=Math.max(64,turn.width*.22)&&Math.abs(dy)<=40);return;}",
        "var minDrag=Math.max(64,(pagesEl.getBoundingClientRect?pagesEl.getBoundingClientRect().width:320)*.22);if(Math.abs(dx)>=minDrag&&Math.abs(dy)<=40){ignoreClickUntil=Date.now()+500;if(dx<0)nextView();else prevView();}});",
        "st.addEventListener('dragstart',function(e){if(mouseTracking)e.preventDefault();});",
        "window.addEventListener('blur',function(){mouseTracking=false;st.classList.remove('is-dragging');if(turn&&!turn.animating)settleTurn(false);});",
        "st.addEventListener('click',function(e){",
        "if(Date.now()<ignoreClickUntil||selected())return;",
        "if(e.target.closest('button,a,details,.box'))return;",
        "var r=st.getBoundingClientRect();var x=(e.clientX-r.left)/r.width;",
        "if(x<0.2)prevView();else if(x>0.8)nextView();else if(!phone())document.body.classList.toggle('hud-off');});",
        "window.addEventListener('resize',function(){show(i,true);});",
        "window.addEventListener('beforeprint',function(){cancelTurn();tracking=false;});",
        "document.addEventListener('visibilitychange',function(){if(document.hidden){cancelTurn();tracking=false;}});",
        "window.addEventListener('orientationchange',function(){cancelTurn();tracking=false;setTimeout(function(){show(i,true);},120);});",
        "window.addEventListener('hashchange',function(){var match=(location.hash||'').match(/^#p([1-9]\\d*)$/);if(match)show(Number(match[1])-1);});",
        "try{var sf=parseInt(localStorage.getItem(key+':fs'),10);if(sf>=0&&sf<STEPS.length)fsi=sf;}catch(e){}",
        "applyFs(false);",
        "var h=parseInt((location.hash||'').replace('#p',''),10);var saved=0;",
        "try{saved=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}",
        "var initial=" + initial + ";show(initial===null?(h?h-1:saved):initial);"
      ].join("\n") +
      "\n})();</script>"
    );
  }

  function buildBookHtml(project, articlesHtml, options) {
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
          '<small class="toc-excerpt"></small></a>'
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
      '</style></head><body class="ebook' + (options && options.preview === true ? ' motion-enabled' : '') + '">' +
      '<header class="hud" id="reader-hud">' +
      '<div class="hud-title">' +
      EB.escapeHtml(title) +
      "</div>" +
      '<span id="pg" role="status" aria-label="현재 쪽">1 / 1</span>' +
      '<button type="button" id="fontbtn" aria-label="글자 크기 바꾸기">가</button>' +
      '</header>' +
      '<div class="toc" id="toc" role="dialog" aria-modal="true" aria-label="차례와 본문 검색"><nav aria-label="전자책 차례"><div class="toc-tools"><button type="button" class="toc-close" id="toc-close">닫기</button><button type="button" id="resetbtn" aria-label="처음으로 돌아가기">처음</button></div><h2>차 례</h2>' +
      '<label class="toc-search-label" for="toc-search">책 내용 찾기</label><input type="search" id="toc-search" placeholder="단어를 입력하세요" autocomplete="off" aria-describedby="toc-status"><p class="toc-status" id="toc-status" role="status" aria-live="polite"></p>' +
      items +
      "</nav></div>" +
      '<div class="desk" id="desk"><div class="stage" id="stage"><div class="book" id="book">' +
      '<div class="leaf"><div class="leaf-fit" id="leaf-fit"><div class="leaf-pages" id="leaf-pages">' +
      opened +
      "</div></div></div></div></div></div>" +
      '<div class="progress" aria-hidden="true"><i id="bar"></i></div>' +
      '<nav class="reader-controls" id="reader-controls" aria-label="전자책 페이지 이동"><button type="button" id="reader-prev">← 이전</button><button type="button" id="tocbtn" aria-controls="toc" aria-expanded="false">차례·검색</button><button type="button" id="reader-next">다음 →</button></nav>' +
      '<div class="fs-note" id="fs-note" role="status"></div>' +
      bookScript(title, options && options.startIndex, options && options.preview) +
      "</body></html>"
    );
  }

  function bookHtml(project, options) {
    return buildBookHtml(project, pagesMarkup(project), options);
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

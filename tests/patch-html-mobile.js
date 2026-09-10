const fs = require("fs");

const src = process.argv[2] || "C:/Users/이근민/Downloads/현장조치_교훈_카드.html";
let html = fs.readFileSync(src, "utf8");

const css = [
  "html,body.reader{overflow-x:hidden;max-width:100%;-webkit-text-size-adjust:100%;text-size-adjust:100%;}",
  ".reader-bar{flex-wrap:wrap;gap:8px 12px;padding:10px 12px;padding-top:max(10px,env(safe-area-inset-top));}",
  ".reader-book{width:100%;box-sizing:border-box;padding:12px 12px 40px;gap:16px;}",
  ".page-fit{overflow:hidden;max-width:100%;}",
  ".reader-book .ebook-page{transform-origin:top left;}",
  "@media print{.page-fit{width:210mm !important;height:297mm !important;overflow:visible !important;} .reader-book .ebook-page{transform:none !important;}}"
].join("");

const script =
  "<script>(function(){function fit(){var book=document.querySelector('.reader-book');if(!book)return;" +
  "var kids=[].slice.call(book.children);kids.forEach(function(p){if(!p.classList||!p.classList.contains('ebook-page'))return;" +
  "var w=document.createElement('div');w.className='page-fit';book.insertBefore(w,p);w.appendChild(p);});" +
  "var avail=book.clientWidth;var fits=book.querySelectorAll('.page-fit');" +
  "for(var j=0;j<fits.length;j++){var wrap=fits[j];var page=wrap.querySelector('.ebook-page');if(!page)continue;" +
  "page.style.transform='none';wrap.style.width='';wrap.style.height='';" +
  "var pw=page.offsetWidth||1;var ph=page.offsetHeight||1;var scale=Math.min(1,avail/pw);" +
  "wrap.style.width=Math.round(pw*scale)+'px';wrap.style.height=Math.round(ph*scale)+'px';" +
  "page.style.transformOrigin='top left';page.style.transform='scale('+scale+')';}}" +
  "function go(){fit();}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();" +
  "window.addEventListener('resize',go);window.addEventListener('orientationchange',function(){setTimeout(go,250);});})();</script>";

html = html.replace(
  '<meta name="viewport" content="width=device-width, initial-scale=1">',
  '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">'
);
if (html.indexOf("page-fit{overflow:hidden") === -1) {
  html = html.replace("</style>", css + "</style>");
}
if (html.indexOf("function fit()") === -1) {
  html = html.replace("</body></html>", script + "</body></html>");
}

fs.writeFileSync(src, html, "utf8");
const copies = [
  "C:/Users/이근민/police-ebook-maker/samples/현장조치_교훈_카드.html",
  "D:/지역/현장조치_교훈_카드.html"
];
copies.forEach(function (p) {
  try {
    fs.writeFileSync(p, html, "utf8");
    console.log("wrote", p);
  } catch (e) {
    console.log("skip", p, e.message);
  }
});
console.log("ok", html.length);

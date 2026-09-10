/* 공통 유틸 — 네트워크 호출 없음 */
(function (g) {
  const EB = (g.EB = g.EB || {});

  EB.uid = function (prefix) {
    return (
      (prefix || "id") +
      "_" +
      Math.random().toString(36).slice(2, 8) +
      Date.now().toString(36).slice(-3)
    );
  };

  EB.clone = function (obj) {
    return JSON.parse(JSON.stringify(obj));
  };

  EB.stripBom = function (s) {
    if (!s) return "";
    return String(s).replace(/^\uFEFF/, "");
  };

  EB.escapeHtml = function (s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  };

  EB.inlineHtml = function (s) {
    const esc = EB.escapeHtml(s);
    return esc
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.+?)__/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\*)(.+?)\*(?!\*)/g, "$1<em>$2</em>");
  };

  EB.debounce = function (fn, ms) {
    let t = null;
    return function () {
      const ctx = this;
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(ctx, args);
      }, ms);
    };
  };

  EB.$ = function (sel, root) {
    return (root || document).querySelector(sel);
  };

  EB.$$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  EB.toast = function (msg, isError) {
    const el = document.getElementById("toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.toggle("is-error", !!isError);
    el.classList.add("show");
    clearTimeout(EB._toastTimer);
    EB._toastTimer = setTimeout(function () {
      el.classList.remove("show");
    }, 2600);
  };

  EB.downloadText = function (filename, text, mime) {
    const blob = new Blob([text], { type: mime || "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () {
      URL.revokeObjectURL(url);
    }, 800);
  };

  EB.readFileAsText = function (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(EB.stripBom(String(reader.result || "")));
      };
      reader.onerror = function () {
        reject(new Error("파일을 읽지 못했습니다."));
      };
      reader.readAsText(file, "UTF-8");
    });
  };

  EB.readFileAsDataURL = function (file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onload = function () {
        resolve(String(reader.result || ""));
      };
      reader.onerror = function () {
        reject(new Error("이미지를 읽지 못했습니다."));
      };
      reader.readAsDataURL(file);
    });
  };

  EB.pad2 = function (n) {
    n = Number(n) || 0;
    return n < 10 ? "0" + n : String(n);
  };

  EB.today = function () {
    const d = new Date();
    return d.getFullYear() + "." + EB.pad2(d.getMonth() + 1) + "." + EB.pad2(d.getDate());
  };

  EB.safeFilename = function (title, ext) {
    const base = String(title || "전자책")
      .replace(/[\\/:*?"<>|]/g, "")
      .replace(/\s+/g, "_")
      .slice(0, 40);
    return (base || "ebook") + (ext || "");
  };

  EB.nowTime = function () {
    const d = new Date();
    return EB.pad2(d.getHours()) + ":" + EB.pad2(d.getMinutes());
  };

  EB.copyText = function (text) {
    const str = String(text || "");
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(str).catch(function () {
        return EB._copyFallback(str);
      });
    }
    return EB._copyFallback(str);
  };

  EB._copyFallback = function (str) {
    return new Promise(function (resolve, reject) {
      const ta = document.createElement("textarea");
      ta.value = str;
      ta.setAttribute("readonly", "readonly");
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      try {
        const ok = document.execCommand("copy");
        ta.remove();
        if (ok) resolve();
        else reject(new Error("copy"));
      } catch (e) {
        ta.remove();
        reject(e);
      }
    });
  };
})(window);

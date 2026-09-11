(function (global) {
  const LANGS = [
    { id: "ko", label: "한국어", native: "한국어" },
    { id: "en", label: "English", native: "English" },
    { id: "zh-CN", label: "中文（简体）", native: "中文" },
    { id: "th", label: "ภาษาไทย", native: "ไทย" },
    { id: "ms", label: "Bahasa Melayu", native: "Melayu" },
    { id: "vi", label: "Tiếng Việt", native: "Tiếng Việt" }
  ];

  const I18N = {
    langs: LANGS,
    current: "en",
    dict: {},
    koDict: {},
    storageKey: "safe112_lang",

    detect: function () {
      try {
        const saved = localStorage.getItem(this.storageKey);
        if (saved && LANGS.some(function (l) { return l.id === saved; })) return saved;
      } catch (e) { /* private mode */ }

      const nav = (navigator.languages && navigator.languages[0]) || navigator.language || "en";
      const low = String(nav).toLowerCase();
      if (low.startsWith("ko")) return "ko";
      if (low.startsWith("zh")) return "zh-CN";
      if (low.startsWith("th")) return "th";
      if (low.startsWith("ms")) return "ms";
      if (low.startsWith("vi")) return "vi";
      return "en";
    },

    get: function (obj, path) {
      if (!obj || !path) return undefined;
      const parts = path.split(".");
      let cur = obj;
      for (let i = 0; i < parts.length; i++) {
        if (cur == null || typeof cur !== "object") return undefined;
        cur = cur[parts[i]];
      }
      return cur;
    },

    t: function (path) {
      const v = this.get(this.dict, path);
      if (v !== undefined) return v;
      const k = this.get(this.koDict, path);
      if (k !== undefined) return k;
      return path;
    },

    tKo: function (path) {
      const k = this.get(this.koDict, path);
      if (k !== undefined) return k;
      return this.t(path);
    },

    langMeta: function (id) {
      return LANGS.find(function (l) { return l.id === id; }) || LANGS[1];
    }
  };

  global.SAFE112_I18N = I18N;
})(window);

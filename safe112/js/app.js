(function () {
  const I18N = window.SAFE112_I18N;
  const state = {
    ready: false,
    config: null,
    crimes: [],
    contacts: null,
    show: null,
    checklist: null,
    jobs: null,
    embassies: null,
    checkAnswers: {},
    toastTimer: null,
    overlayReturn: null
  };

  const $app = function () { return document.getElementById("app"); };

  function getJSON(url) {
    return fetch(url, { cache: "no-cache" }).then(function (res) {
      if (!res.ok) throw new Error(url + " " + res.status);
      return res.json();
    });
  }

  function escapeHtml(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function t(path) { return I18N.t(path); }
  function tKo(path) { return I18N.tKo(path); }

  function route() {
    const raw = (location.hash || "#/").replace(/^#/, "");
    const path = raw.split("?")[0];
    const parts = path.split("/").filter(Boolean);
    if (parts.length === 0) return { name: "home" };
    if (parts[0] === "check") return { name: "check" };
    if (parts[0] === "jobs") return { name: "jobs" };
    if (parts[0] === "show") return { name: "show" };
    if (parts[0] === "report") return { name: "report" };
    if (parts[0] === "embassy") return { name: "embassy" };
    if (parts[0] === "search") return { name: "search", q: decodeQuery() };
    if (parts[0] === "crime" && parts[1]) return { name: "crime", id: decodeURIComponent(parts[1]) };
    return { name: "home" };
  }

  function decodeQuery() {
    const s = location.hash.split("?")[1] || "";
    const p = new URLSearchParams(s);
    return p.get("q") || "";
  }

  function crimeById(id) {
    return state.crimes.find(function (c) { return c.id === id; });
  }

  function navActive(name) {
    const r = route();
    if (name === "home") return r.name === "home" || r.name === "crime" || r.name === "search";
    return r.name === name;
  }

  function icon(name) {
    const paths = {
      home: '<path d="m3 10 9-7 9 7v10H3Z"/><path d="M9 20v-7h6v7"/>',
      check: '<rect x="5" y="4" width="14" height="17" rx="3"/><path d="M9 3h6v4H9zM9 14l2 2 4-5"/>',
      show: '<path d="M21 11a8 8 0 0 1-8 8H7l-4 3V11a9 9 0 0 1 18 0Z"/><path d="M7 10h10M7 14h6"/>',
      report: '<path d="M5 3h4l2 5-3 2a15 15 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
      shield: '<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6Z"/><path d="m8 12 3 3 5-6"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      globe: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/>',
      jobs: '<rect x="3" y="7" width="18" height="14" rx="3"/><path d="M8 7V3h8v4M3 12h18M10 12v3h4v-3"/>'
    };
    return '<svg class="ui-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (paths[name] || paths.shield) + '</svg>';
  }

  function header() {
    const meta = I18N.langMeta(I18N.current);
    return (
      '<header class="header">' +
        '<a class="brand" href="#/" aria-label="' + escapeHtml(t("app.shortName")) + '">' +
          '<span class="brand-mark">' + icon('shield') + '</span>' + '<span class="brand-text">' +
            '<span class="brand-name">' + escapeHtml(t("app.shortName")) + '</span>' +
          "</span>" +
        "</a>" +
        '<button class="lang-btn" type="button" data-open-lang aria-haspopup="dialog" aria-label="' +
          escapeHtml(t("lang.choose")) + '">' +
          icon('globe') + escapeHtml(meta.native) +
        "</button>" +
      "</header>"
    );
  }

  function nav() {
    return (
      '<nav class="nav" aria-label="' + escapeHtml(t("nav.menu")) + '">' +
        navItem("#/", "home", "", t("nav.home")) +
        navItem("#/check", "check", "", t("nav.check")) +
        '<a class="nav-112" href="tel:112" aria-label="112">' +
          '<span class="bubble">112</span>' +
        "</a>" +
        navItem("#/show", "show", "", t("nav.show")) +
        navItem("#/report", "report", "", t("nav.report")) +
      "</nav>"
    );
  }

  function navItem(href, name, ico, label) {
    return (
      '<a href="' + href + '"' + (navActive(name) ? ' aria-current="page"' : '') + ' class="' + (navActive(name) ? "active" : "") + '">' +
        '<span class="ico" aria-hidden="true">' + icon(name) + "</span>" +
        "<span>" + escapeHtml(label) + "</span>" +
      "</a>"
    );
  }

  function updatedLine(date) {
    if (!date) return "";
    const pretty = String(date).replace(/-/g, ".");
    return '<p class="update">' + escapeHtml(t("app.updated")) + " " + escapeHtml(pretty) + "</p>";
  }

  function renderHome() {
    const cards = state.crimes.map(function (c, i) {
      const n = String(i + 1).padStart(2, "0");
      return (
        '<a class="crime-row" href="#/crime/' + encodeURIComponent(c.id) + '">' +
          '<span class="crime-n">' + n + "</span>" +
          '<span class="crime-ico" aria-hidden="true">' + c.icon + "</span>" +
          "<span><strong>" + escapeHtml(t("crimes." + c.id + ".title")) + "</strong>" +
          "<em>" + escapeHtml(t("crimes." + c.id + ".short")) + "</em></span>" +
        "</a>"
      );
    }).join("");

    return (
      '<section class="hero">' +
        '<div class="hero-copy"><div class="hero-label">' + icon('shield') + escapeHtml(t('home.subtitle')) + '</div>' +
        '<h1>' + escapeHtml(t('home.title')) + '</h1>' +
        '<a class="hero-check" href="#/check">' + escapeHtml(t('home.checkTitle')) + '<span aria-hidden="true"> ↗</span></a></div>' +
        '<div class="hero-art" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="shield-art">' + icon('shield') + '</div><span class="art-star">✦</span><span class="art-dot"></span></div>' +
      '</section>' +
      '<a class="emergency-strip" href="tel:112"><span class="emergency-icon">' + icon('report') + '</span><strong>' + escapeHtml(t('home.call112')) + '</strong><span class="emergency-number" aria-hidden="true">112 ↗</span></a>' +
      '<form class="search" data-search-form><label class="skip" for="q">' + escapeHtml(t('app.searchPlaceholder')) + '</label>' +
        '<input id="q" name="q" type="search" enterkeyhint="search" placeholder="' + escapeHtml(t('app.searchPlaceholder')) + '" autocomplete="off">' +
        '<button type="submit" aria-label="' + escapeHtml(t('app.searchPlaceholder')) + '">' + icon('search') + '</button></form>' +
      '<div class="section-title"><h2>' + escapeHtml(t('home.quick')) + '</h2><span aria-hidden="true">↗</span></div>' +
      '<div class="quick-row">' +
        panel('#/check', t('home.checkTitle'), t('home.checkDesc')) +
        panel('#/show', t('home.showTitle'), t('home.showDesc')) +
        panel('#/jobs', t('home.jobsTitle'), t('home.jobsDesc')) +
        panel('#/report', t('home.reportTitle'), t('home.reportDesc')) +
        panel('#/embassy', t('home.embassyTitle'), t('home.embassyDesc')) + '</div>' +
      '<section class="essentials"><div class="section-title"><h2>' + escapeHtml(t('home.knowTitle')) + '</h2></div>' +
        '<ol class="know-list">' + [1,2,3].map(function (n) { return '<li><span class="know-number">0' + n + '</span><span>' + escapeHtml(t('home.know' + n)) + '</span></li>'; }).join('') + '</ol></section>' +
      '<div class="section-title"><h2>' + escapeHtml(t('home.recentCrimes')) + '</h2><span class="count">' + state.crimes.length + '</span></div>' +
      '<div class="crime-list">' + cards + '</div>' +
      '<p class="footer-note">' + icon('shield') + '<span>' + escapeHtml(t('app.noPersonalData')) + '<br>' + escapeHtml(t('app.notLegalAdvice')) + '</span></p>' +
      updatedLine(state.config && state.config.updatedAt)
    );
  }

  function panel(href, title, desc) {
    return (
      '<a class="panel panel-link" href="' + href + '">' + '<span class="panel-ico">' + icon(href === '#/embassy' ? 'globe' : href.slice(2)) + '</span>' +
        "<div><h3>" + escapeHtml(title) + "</h3><p class=\"muted\" style=\"margin:0\">" +
          escapeHtml(desc) + "</p></div>" +
        '<span class="chev" aria-hidden="true">›</span>' +
      "</a>"
    );
  }

  function renderCheck() {
    const qs = (state.checklist && state.checklist.questions) || [];
    const anyYes = qs.some(function (id) { return state.checkAnswers[id] === "yes"; });
    const allNo = qs.length > 0 && qs.every(function (id) { return state.checkAnswers[id] === "no"; });

    let result = "";
    if (anyYes) {
      result =
        '<div class="stop-box q-result-sticky">' +
          '<div class="big">' + escapeHtml(t("check.stopTitle")) + "</div>" +
          "<p>" + escapeHtml(t("check.stopBody")) + "</p>" +
          '<a class="btn btn-block btn-112" href="tel:112">112</a>' +
        "</div>";
    } else if (allNo) {
      result = '<div class="safe-box q-result-sticky">' + escapeHtml(t("check.okBody")) + "</div>";
    }

    const cards = qs.map(function (id) {
      const ans = state.checkAnswers[id];
      return (
        '<div class="q-card">' +
          "<p>" + escapeHtml(t("check.q." + id)) + "</p>" +
          '<div class="yesno">' +
            '<button type="button" class="yes" data-ans="' + id + ':yes" aria-pressed="' + (ans === "yes") + '">' +
              escapeHtml(t("app.yes")) + "</button>" +
            '<button type="button" class="no" data-ans="' + id + ':no" aria-pressed="' + (ans === "no") + '">' +
              escapeHtml(t("app.no")) + "</button>" +
          "</div>" +
        "</div>"
      );
    }).join("");

    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("check.title")) + "</h1>" +
        '<p class="muted">' + escapeHtml(t("check.lead")) + "</p>" +
      "</div>" +
      result + cards
    );
  }

  function renderJobs() {
    const ids = (state.jobs && state.jobs.cards) || [];
    const cards = ids.map(function (id) {
      return (
        '<button class="job-card" type="button" data-job="' + id + '">' +
          "<strong>" + escapeHtml(t("jobs.cards." + id + ".title")) + "</strong>" +
          "<small>" + escapeHtml(t("jobs.risk")) + " · " + escapeHtml(t("jobs.cards." + id + ".risk")) + "</small>" +
        "</button>"
      );
    }).join("");

    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("jobs.title")) + "</h1>" +
        '<p class="muted">' + escapeHtml(t("jobs.lead")) + "</p>" +
      "</div>" +
      '<div class="banner-strong">' + escapeHtml(t("jobs.banner")) + "</div>" +
      '<div class="job-grid">' + cards + "</div>" +
      '<div class="block">' +
        '<div class="tip"><strong>' + escapeHtml(t("jobs.ifAlready")) + "</strong>" +
          escapeHtml(t("jobs.ifAlreadyBody")) + "</div>" +
      "</div>" +
      '<a class="btn btn-112 btn-block" href="tel:112">112</a>'
    );
  }

  function renderShow() {
    const phrases = (state.show && state.show.phrases) || [];
    const items = phrases.map(function (p) {
      const local = t("show.phrases." + p.id);
      const ko = tKo("show.phrases." + p.id);
      return (
        '<article class="phrase">' +
          '<div class="local">' + escapeHtml(local) + "</div>" +
          '<div class="ko">' + escapeHtml(ko) + "</div>" +
          '<div class="phrase-actions">' +
            '<button type="button" data-huge="' + escapeHtml(ko) + '">' + escapeHtml(t("show.bigKo")) + "</button>" +
            '<button type="button" data-copy="' + escapeHtml(ko) + '">' + escapeHtml(t("show.copy")) + "</button>" +
          "</div>" +
        "</article>"
      );
    }).join("");

    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("show.title")) + "</h1>" +
        '<p class="muted">' + escapeHtml(t("show.lead")) + "</p>" +
      "</div>" +
      items
    );
  }

  function contactRow(id, tel) {
    return (
      '<a class="contact-card" href="tel:' + tel + '">' +
        "<div><strong>" + escapeHtml(t("report.c" + id + ".name")) + "</strong><br>" +
        "<em>" + escapeHtml(t("report.c" + id + ".desc")) + "</em></div>" +
        '<span class="tel-pill">' + tel + "</span>" +
      "</a>"
    );
  }

  function renderReport() {
    const steps112 = list(t("report.how112Steps"), "act");
    const money = list(t("report.moneySentSteps"), "act");
    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("report.title")) + "</h1>" +
        '<p class="muted">' + escapeHtml(t("report.lead")) + "</p>" +
      "</div>" +
      '<div class="stop-box">' +
        "<p style=\"margin:0 0 8px;font-weight:800\">" + escapeHtml(t("report.emergency")) + "</p>" +
        '<div class="big">112</div>' +
        "<p>" + escapeHtml(t("report.emergencyBody")) + "</p>" +
        '<a class="btn btn-block btn-112" href="tel:112">' +
          escapeHtml(t("home.call112")) + "</a>" +
      "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.how112")) + "</h2>" + steps112 + "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.interpreter")) + "</h2>" +
        '<div class="tip">' + escapeHtml(t("report.interpreterBody")) + "</div></div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.ifSilent")) + "</h2>" +
        '<div class="tip">' + escapeHtml(t("report.ifSilentBody")) + "</div></div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.moneySent")) + "</h2>" + money + "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.contactsTitle")) + "</h2>" +
        contactRow("112", "112") +
        contactRow("119", "119") +
        contactRow("1332", "1332") +
        contactRow("118", "118") +
        contactRow("117", "117") +
      "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("report.appsTitle")) + "</h2>" +
        '<p class="muted">' + escapeHtml(t("report.appsBody")) + "</p></div>" +
      panel("#/embassy", t("home.embassyTitle"), t("home.embassyDesc")) +
      '<p class="footer-note">' + escapeHtml(t("app.noPersonalData")) + "</p>"
    );
  }

  function list(items, kind) {
    if (!Array.isArray(items)) return "";
    const cls = kind === "x" ? "list-x" : kind === "ok" ? "list-ok" : "list-act";
    const mark = kind === "x" ? "×" : kind === "ok" ? "·" : "";
    const html = items.map(function (item, i) {
      const prefix = kind === "act"
        ? '<span class="num">' + (i + 1) + "</span>"
        : "<span>" + mark + "</span>";
      return "<li>" + prefix + "<span>" + escapeHtml(item) + "</span></li>";
    }).join("");
    return "<ul class=\"" + cls + "\">" + html + "</ul>";
  }

  function chips(items) {
    if (!Array.isArray(items)) return "";
    return '<div class="chips">' + items.map(function (s) {
      return '<span class="chip">' + escapeHtml(s) + "</span>";
    }).join("") + "</div>";
  }

  function examplesHtml(examples) {
    if (!Array.isArray(examples)) return "";
    return examples.map(function (ex) {
      const lines = (ex.lines || []).map(function (line) {
        return '<div class="msg">' + escapeHtml(line) + "</div>";
      }).join("");
      return (
        '<div class="chat">' +
          lines +
          (ex.stop ? '<div class="stop-inline">' + escapeHtml(ex.stop) + "</div>" : "") +
          (ex.dont ? list(ex.dont, "x") : "") +
          (ex.do ? list(ex.do, "ok") : "") +
        "</div>"
      );
    }).join("");
  }

  function stepsHtml(steps) {
    if (!Array.isArray(steps)) return "";
    return '<div class="steps">' + steps.map(function (s, i) {
      const bad = i === steps.length - 1;
      return (
        '<div class="step' + (bad ? " bad" : "") + '">' +
          '<div class="step-n">' + (i + 1) + "</div>" +
          '<div class="step-body">' + escapeHtml(s) + "</div>" +
        "</div>"
      );
    }).join("") + "</div>";
  }

  function renderCrime(id) {
    const meta = crimeById(id);
    if (!meta) {
      return '<div class="page-head"><h1>Not found</h1><a class="back" href="#/">← Home</a></div>';
    }
    const base = "crimes." + id;
    const q = t(base + ".question");
    const a = t(base + ".questionAnswer");
    const banner = t(base + ".banner");
    const legal = t(base + ".legalLine");

    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + meta.icon + " " + escapeHtml(t(base + ".title")) + "</h1>" +
      "</div>" +
      (banner && banner !== base + ".banner" ? '<div class="banner-strong">' + escapeHtml(banner) + "</div>" : "") +
      '<div class="block"><h2>① ' + escapeHtml(t("crimePage.what")) + "</h2>" +
        '<p class="detail-lead">' + escapeHtml(t(base + ".what")) + "</p></div>" +
      '<div class="block"><h2>② ' + escapeHtml(t("crimePage.approach")) + "</h2>" +
        examplesHtml(t(base + ".examples")) +
        stepsHtml(t(base + ".steps")) +
      "</div>" +
      (q && q !== base + ".question"
        ? '<div class="block"><h2>' + escapeHtml(q) + "</h2><div class=\"tip\">" + escapeHtml(a) + "</div></div>"
        : "") +
      '<div class="block"><h2>③ ' + escapeHtml(t("crimePage.suspect")) + "</h2>" +
        chips(t(base + ".warningSigns")) + "</div>" +
      '<div class="block"><h2>④ ' + escapeHtml(t("crimePage.dont")) + "</h2>" +
        list(t(base + ".dont"), "x") + "</div>" +
      '<div class="block"><h2>⑤ ' + escapeHtml(t("crimePage.ifHarmed")) + "</h2>" +
        list(t(base + ".actions"), "act") + "</div>" +
      (legal && legal !== base + ".legalLine" ? '<div class="tip">' + escapeHtml(legal) + "</div>" : "") +
      '<div class="block"><h2>⑥ ' + escapeHtml(t("crimePage.callPolice")) + "</h2>" +
        '<a class="btn btn-112 btn-block" href="tel:112">112</a></div>' +
      '<div class="tip"><strong>' + escapeHtml(t("crimePage.policeTip")) + "</strong>" +
        escapeHtml(t(base + ".policeTip")) + "</div>" +
      updatedLine(meta.updatedAt)
    );
  }

  function renderSearch(q) {
    const query = (q || "").trim().toLowerCase();
    const hits = state.crimes.filter(function (c) {
      const blob = [
        c.id, (c.tags || []).join(" "),
        t("crimes." + c.id + ".title"),
        t("crimes." + c.id + ".short"),
        t("crimes." + c.id + ".what"),
        (t("crimes." + c.id + ".warningSigns") || []).join(" ")
      ].join(" ").toLowerCase();
      return !query || blob.indexOf(query) !== -1;
    });
    const cards = hits.map(function (c) {
      return (
        '<a class="crime-row" href="#/crime/' + encodeURIComponent(c.id) + '">' +
          '<span class="crime-n"></span>' +
          '<span class="crime-ico">' + c.icon + "</span>" +
          "<span><strong>" + escapeHtml(t("crimes." + c.id + ".title")) + "</strong>" +
          "<em>" + escapeHtml(t("crimes." + c.id + ".short")) + "</em></span>" +
        "</a>"
      );
    }).join("");
    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("app.searchPlaceholder")) + "</h1>" +
      "</div>" +
      '<form class="search" data-search-form>' +
        '<label class="skip" for="q">' + escapeHtml(t("app.searchPlaceholder")) + '</label>' +
        '<input id="q" name="q" type="search" enterkeyhint="search" value="' + escapeHtml(q || "") + '" placeholder="' +
          escapeHtml(t("app.searchPlaceholder")) + '">' +
        '<button type="submit" aria-label="' + escapeHtml(t("app.searchPlaceholder")) + '">' + icon('search') + '</button>' +
      "</form>" +
      (hits.length ? '<div class="crime-list">' + cards + "</div>"
        : '<p class="muted">' + escapeHtml(t("app.searchEmpty")) + "</p>")
    );
  }

  function overlayLang() {
    const btns = I18N.langs.map(function (l) {
      return (
        '<button type="button" data-set-lang="' + l.id + '"' +
          (I18N.current === l.id ? ' aria-current="true"' : "") + ">" +
          escapeHtml(l.label) +
          (I18N.current === l.id ? " ✓" : "") +
        "</button>"
      );
    }).join("");
    return (
      '<div class="sheet" data-close-overlay role="dialog" aria-modal="true" aria-label="' +
        escapeHtml(t("lang.choose")) + '">' +
        '<div class="sheet-card" data-stop>' +
          "<h2>" + escapeHtml(t("lang.choose")) + "</h2>" +
          '<div class="lang-list">' + btns + "</div>" +
          '<button class="btn btn-line btn-block" style="margin-top:12px" type="button" data-close-overlay>' +
            escapeHtml(t("app.close")) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function overlayHuge(text) {
    return (
      '<div class="modal" data-close-overlay role="dialog" aria-modal="true">' +
        '<div class="modal-card" data-stop>' +
          '<div class="ko-huge">' + escapeHtml(text) + "</div>" +
          '<button class="btn btn-navy btn-block" type="button" data-copy="' + escapeHtml(text) + '">' +
            escapeHtml(t("show.copy")) + "</button>" +
          '<button class="btn btn-line btn-block" style="margin-top:8px" type="button" data-close-overlay>' +
            escapeHtml(t("app.close")) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function renderEmbassy() {
    const data = state.embassies || {};
    const missions = data.missions || [];
    const lang = I18N.current;
    const sorted = missions.slice().sort(function (a, b) {
      const am = (a.langs || []).indexOf(lang) >= 0 ? 0 : 1;
      const bm = (b.langs || []).indexOf(lang) >= 0 ? 0 : 1;
      return am - bm;
    });
    const cards = sorted.map(function (m) {
      const preferred = (m.langs || []).indexOf(lang) >= 0;
      const phones = (m.phones || []).map(function (p) {
        return (
          '<a href="tel:' + p.tel + '">' +
            "<span>" + escapeHtml(t("embassy.missions." + m.id + ".phones." + p.id)) +
            "<br><small>" + escapeHtml(t("embassy.hours." + p.hours)) + "</small></span>" +
            "<span>" + escapeHtml(p.display) + "</span>" +
          "</a>"
        );
      }).join("");
      const warn = t("embassy.missions." + m.id + ".warn");
      const warnHtml = warn && warn !== "embassy.missions." + m.id + ".warn"
        ? '<div class="tip" style="margin-top:10px">' + escapeHtml(warn) + "</div>"
        : "";
      return (
        '<article class="embassy-card' + (preferred ? " preferred" : "") + '">' +
          "<h3>" + escapeHtml(t("embassy.missions." + m.id + ".name")) + "</h3>" +
          '<p class="embassy-meta">' + escapeHtml(t("embassy.missions." + m.id + ".help")) + "</p>" +
          '<div class="embassy-phones">' + phones + "</div>" +
          (m.web ? '<a class="web-link" href="' + m.web + '" rel="noopener noreferrer" target="_blank">' +
            escapeHtml(t("embassy.website")) + "</a>" : "") +
          warnHtml +
        "</article>"
      );
    }).join("");

    return (
      '<div class="page-head">' +
        '<a class="back" href="#/">← ' + escapeHtml(t("app.back")) + "</a>" +
        "<h1>" + escapeHtml(t("embassy.title")) + "</h1>" +
        '<p class="muted">' + escapeHtml(t("embassy.lead")) + "</p>" +
      "</div>" +
      '<div class="stop-box">' +
        '<div class="big">112</div>' +
        "<p>" + escapeHtml(t("embassy.first112")) + "</p>" +
        '<a class="btn btn-block btn-112" href="tel:112">112</a>' +
      "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("embassy.can")) + "</h2>" +
        list(t("embassy.canItems"), "ok") + "</div>" +
      '<div class="block"><h2>' + escapeHtml(t("embassy.cannot")) + "</h2>" +
        list(t("embassy.cannotItems"), "x") + "</div>" +
      cards +
      (data.findOthersUrl
        ? '<p class="muted">' + escapeHtml(t("embassy.findOthers")) +
          ' <a class="web-link" href="' + data.findOthersUrl + '" rel="noopener noreferrer" target="_blank">mofa.go.kr</a></p>'
        : "") +
      updatedLine(data.updatedAt)
    );
  }

  function overlayJob(id) {
    return (
      '<div class="sheet" data-close-overlay role="dialog" aria-modal="true">' +
        '<div class="sheet-card" data-stop>' +
          "<h2>" + escapeHtml(t("jobs.cards." + id + ".title")) + "</h2>" +
          '<div class="block"><h2>' + escapeHtml(t("jobs.risk")) + "</h2><p>" +
            escapeHtml(t("jobs.cards." + id + ".risk")) + "</p></div>" +
          '<div class="block"><h2>' + escapeHtml(t("jobs.why")) + "</h2><p>" +
            escapeHtml(t("jobs.cards." + id + ".why")) + "</p></div>" +
          '<div class="block"><h2>' + escapeHtml(t("jobs.refuse")) + "</h2><p>" +
            escapeHtml(t("jobs.cards." + id + ".refuse")) + "</p></div>" +
          '<a class="btn btn-112 btn-block" href="tel:112">112</a>' +
          '<button class="btn btn-line btn-block" style="margin-top:8px" type="button" data-close-overlay>' +
            escapeHtml(t("app.close")) + "</button>" +
        "</div>" +
      "</div>"
    );
  }

  function render(extra) {
    if (!state.ready) return;
    const r = route();
    let body = "";
    if (r.name === "check") body = renderCheck();
    else if (r.name === "jobs") body = renderJobs();
    else if (r.name === "show") body = renderShow();
    else if (r.name === "report") body = renderReport();
    else if (r.name === "embassy") body = renderEmbassy();
    else if (r.name === "crime") body = renderCrime(r.id);
    else if (r.name === "search") body = renderSearch(r.q);
    else body = renderHome();

    $app().innerHTML =
      header() +
      '<main class="main page-' + r.name + '" id="main" tabindex="-1">' + body + "</main>" +
      nav() +
      (extra || "");

    document.documentElement.lang = I18N.current === "zh-CN" ? "zh-CN" : I18N.current;
    document.title = t("app.shortName") + " · " + t("home.subtitle");
    const dialog = document.querySelector('[role="dialog"]');
    document.body.style.overflow = dialog ? "hidden" : "";
    if (dialog) {
      ['.header', '.main', '.nav'].forEach(function (selector) {
        document.querySelector(selector).inert = true;
      });
      dialog.querySelector('button, a[href]').focus();
    }
  }

  function openOverlay(html, trigger) {
    const attr = ['data-open-lang', 'data-job', 'data-huge'].find(function (name) { return trigger.hasAttribute(name); });
    state.overlayReturn = { attr: attr, value: trigger.getAttribute(attr) };
    render(html);
  }

  function closeOverlay() {
    render();
    const previous = state.overlayReturn;
    if (previous) {
      const trigger = Array.from(document.querySelectorAll('[' + previous.attr + ']')).find(function (el) {
        return el.getAttribute(previous.attr) === previous.value;
      });
      if (trigger) trigger.focus();
    }
    state.overlayReturn = null;
  }

  function onKeydown(e) {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return;
    if (e.key === 'Escape') { e.preventDefault(); closeOverlay(); return; }
    if (e.key !== 'Tab') return;
    const items = dialog.querySelectorAll('button, a[href], input');
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function toast(msg) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const el = document.createElement("div");
    el.className = "toast";
    el.setAttribute("role", "status");
    el.textContent = msg;
    document.body.appendChild(el);
    clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(function () { el.remove(); }, 1800);
  }

  function copyText(text) {
    const done = function () { toast(t("app.copied")); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text, done); });
    } else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { toast(text); }
    ta.remove();
  }

  async function setLang(id) {
    if (!I18N.langs.some(function (l) { return l.id === id; })) return;
    const data = await getJSON("./i18n/" + id + ".json");
    I18N.current = id;
    I18N.dict = data;
    try { localStorage.setItem(I18N.storageKey, id); } catch (e) { /* ignore */ }
    closeOverlay();
  }

  function onClick(e) {
    const openLang = e.target.closest("[data-open-lang]");
    if (openLang) { openOverlay(overlayLang(), openLang); return; }

    const close = e.target.closest("[data-close-overlay]");
    if (close && !e.target.closest("[data-stop]")) { closeOverlay(); return; }
    if (close && e.target.hasAttribute("data-close-overlay")) { closeOverlay(); return; }

    const setLangBtn = e.target.closest("[data-set-lang]");
    if (setLangBtn) { setLang(setLangBtn.getAttribute("data-set-lang")); return; }

    const ans = e.target.closest("[data-ans]");
    if (ans) {
      const parts = ans.getAttribute("data-ans").split(":");
      state.checkAnswers[parts[0]] = parts[1];
      render();
      document.querySelector('[data-ans="' + ans.getAttribute('data-ans') + '"]').focus({ preventScroll: true });
      return;
    }

    const job = e.target.closest("[data-job]");
    if (job) { openOverlay(overlayJob(job.getAttribute("data-job")), job); return; }

    const huge = e.target.closest("[data-huge]");
    if (huge) { openOverlay(overlayHuge(huge.getAttribute("data-huge")), huge); return; }

    const copy = e.target.closest("[data-copy]");
    if (copy) { copyText(copy.getAttribute("data-copy")); }
  }

  function onSubmit(e) {
    const form = e.target.closest("[data-search-form]");
    if (!form) return;
    e.preventDefault();
    const q = (form.q && form.q.value) || "";
    location.hash = "#/search?q=" + encodeURIComponent(q);
  }

  async function boot() {
    try {
      const lang = I18N.detect();
      const pack = await Promise.all([
        getJSON("./data/config.json"),
        getJSON("./data/crimes.json"),
        getJSON("./data/contacts.json"),
        getJSON("./data/show.json"),
        getJSON("./data/checklist.json"),
        getJSON("./data/jobs.json"),
        getJSON("./data/embassies.json"),
        getJSON("./i18n/ko.json"),
        getJSON("./i18n/" + lang + ".json")
      ]);
      state.config = pack[0];
      state.crimes = (pack[1].order || []).map(function (id) {
        return (pack[1].crimes || []).find(function (c) { return c.id === id; });
      }).filter(Boolean);
      state.contacts = pack[2];
      state.show = pack[3];
      state.checklist = pack[4];
      state.jobs = pack[5];
      state.embassies = pack[6];
      I18N.koDict = pack[7];
      I18N.current = lang;
      I18N.dict = pack[8];
      I18N.storageKey = (state.config && state.config.storageKey) || "safe112_lang";
      state.ready = true;
      render();

      $app().addEventListener("click", onClick);
      $app().addEventListener("submit", onSubmit);
      $app().addEventListener("keydown", onKeydown);
      window.addEventListener("hashchange", function () { render(); window.scrollTo(0, 0); });

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("./sw.js").catch(function () { /* offline optional */ });
      }
    } catch (err) {
      $app().innerHTML =
        '<main class="main"><h1>SAFE112</h1>' +
        "<p>Could not load the guide. Please use a local web server, not a file:// path.</p>" +
        '<p><a class="btn btn-112" href="tel:112">112</a></p>' +
        "<pre style=\"white-space:pre-wrap;color:#5b6773\">" + escapeHtml(String(err)) + "</pre></main>";
    }
  }

  boot();
})();

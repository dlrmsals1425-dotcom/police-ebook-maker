/* 전자책 분량·구성 검사. 외부 전송 없음. */
(function (g) {
  const EB = (g.EB = g.EB || {});

  const LIMIT = {
    titleWarn: 22,
    titleError: 36,
    pointWarn: 90,
    pointError: 140,
    summaryWarn: 80,
    summaryError: 120,
    paraWarn: 140,
    paraError: 240,
    bulletWarn: 48,
    bulletError: 80,
    tipWarn: 100,
    tipError: 160,
    flowWarn: 120,
    flowError: 180,
    weightWarn: 28,
    weightError: 38,
    bulletsMax: 6,
    rememberMax: 6,
    rememberMin: 3
  };

  const PLACEHOLDERS = [
    /내용을 입력/,
    /입력하세요/,
    /핵심을 한두/,
    /한 문장으로 적/,
    /중간 제목/,
    /새 전자책/,
    /새 Chapter/,
    /제목 없음/,
    /핵심 1$/,
    /핵심 2$/,
    /핵심 3$/,
    /관련 법령명/,
    /이미지를 오른쪽/,
    /원문이 있으면/,
    /\(작성\)/,
    /TODO/i,
    /lorem/i
  ];

  function nchars(s) {
    return String(s || "")
      .replace(/\s+/g, " ")
      .replace(/^\s+|\s+$/g, "").length;
  }

  function issue(level, page, index, code, message, fix) {
    return {
      level: level,
      pageId: page.id,
      pageIndex: index,
      pageTitle: page.type === "cover" ? "표지" : page.title || EB.pageTypeLabel(page.type),
      code: code,
      message: message,
      fix: fix || ""
    };
  }

  function isPlaceholder(s) {
    const t = String(s || "");
    for (let i = 0; i < PLACEHOLDERS.length; i++) {
      if (PLACEHOLDERS[i].test(t)) return true;
    }
    return false;
  }

  function lengthIssue(page, index, label, text, warnAt, errorAt, where) {
    const n = nchars(text);
    if (!n) return null;
    if (n >= errorAt) {
      return issue(
        "error",
        page,
        index,
        "too-long",
        label + "이(가) " + n + "자로 너무 깁니다. " + errorAt + "자 안으로 줄이세요.",
        where
      );
    }
    if (n >= warnAt) {
      return issue(
        "warn",
        page,
        index,
        "long",
        label + "이(가) " + n + "자로 긴 편입니다. " + warnAt + "자 안쪽이 읽기 좋습니다.",
        where
      );
    }
    return null;
  }

  function pageWeight(page) {
    let w = 0;
    (page.blocks || []).forEach(function (b) {
      w += EB.Markdown.blockWeight(b);
    });
    return w;
  }

  function hasType(page, type) {
    return (page.blocks || []).some(function (b) {
      return b.type === type;
    });
  }

  function analyzePage(project, page, index) {
    const out = [];
    const type = page.type;
    const title = page.title || "";

    if (type === "toc") return out;

    if (type === "cover") {
      const m = project.meta || {};
      if (!nchars(m.title) || isPlaceholder(m.title)) {
        out.push(issue("error", page, index, "cover-title", "표지 제목이 비어 있거나 임시 문구입니다.", "표지 큰 제목을 클릭해 고치세요."));
      } else {
        const t = lengthIssue(page, index, "표지 제목", m.title, 28, 40, "표지 제목을 더 짧게 줄이세요.");
        if (t) out.push(t);
      }
      if (!nchars(m.department) || m.department === "○○경찰서 ○○과") {
        out.push(issue("warn", page, index, "cover-dept", "제작부서를 실제 부서명으로 바꿔 주세요.", "표지 하단 「제작부서」를 클릭하세요."));
      }
      if (!nchars(m.date)) {
        out.push(issue("warn", page, index, "cover-date", "제작일이 없습니다.", "표지 하단 「제작일」을 클릭하세요."));
      }
      return out;
    }

    if (type !== "cover") {
      const ti = lengthIssue(page, index, "페이지 제목", title, LIMIT.titleWarn, LIMIT.titleError, "왼쪽 제목 또는 페이지 맨 위 제목을 짧게 줄이세요.");
      if (ti) out.push(ti);
      if (!nchars(title) || isPlaceholder(title)) {
        out.push(issue("error", page, index, "no-title", "페이지 제목이 없습니다.", "페이지 맨 위 제목을 클릭해 넣으세요."));
      }
    }

    if (/ \(계속\)$/.test(title)) {
      out.push(
        issue(
          "info",
          page,
          index,
          "split",
          "원문이 길어 이 페이지가 자동으로 나뉘었습니다.",
          "이 페이지 제목과 핵심포인트를 이 쪽 내용에 맞게 다시 적으세요."
        )
      );
    }

    const w = pageWeight(page);
    if (w >= LIMIT.weightError) {
      out.push(
        issue(
          "error",
          page,
          index,
          "heavy",
          "한 페이지에 내용이 너무 많습니다. 인쇄하면 아래가 잘립니다.",
          "「페이지 복제」한 뒤 블록을 나눠 담으세요. 한 페이지에 핵심 하나만 남깁니다."
        )
      );
    } else if (w >= LIMIT.weightWarn) {
      out.push(
        issue(
          "warn",
          page,
          index,
          "heavy",
          "한 페이지 분량을 넘기고 있습니다.",
          "목록을 줄이거나 페이지를 복제해 내용을 나누세요."
        )
      );
    }

    if (type === "content" || type === "case") {
      if (!hasType(page, "point")) {
        out.push(
          issue("warn", page, index, "no-point", "핵심포인트가 없습니다.", "오른쪽 「핵심포인트」를 눌러 한두 문장을 넣으세요.")
        );
      }
      if (!hasType(page, "summary")) {
        out.push(
          issue("warn", page, index, "no-summary", "한줄 요약이 없습니다.", "오른쪽 「요약」을 눌러 페이지 맨 아래 한 줄을 넣으세요.")
        );
      }
    }

    if (type === "chapter") {
      const learn = (page.blocks || []).filter(function (b) {
        return b.type === "learn";
      })[0];
      const items = (learn && learn.items) || [];
      const filled = items.filter(function (t) {
        return nchars(t) && !isPlaceholder(t);
      });
      if (filled.length < 2) {
        out.push(
          issue("warn", page, index, "chapter-learn", "이 Chapter에서 배울 내용을 2~3개 적어 주세요.", "페이지 하단 노란 목록을 클릭해 수정하세요.")
        );
      }
    }

    if (type === "case" && !hasType(page, "flow")) {
      out.push(
        issue("warn", page, index, "no-flow", "사례 타임라인이 없습니다.", "오른쪽 「타임라인」을 추가하거나 페이지 유형을 기본 교육으로 바꾸세요.")
      );
    }

    if (type === "dodont") {
      const box = (page.blocks || []).filter(function (b) {
        return b.type === "dodont";
      })[0];
      const dos = ((box && box.doItems) || []).filter(function (t) {
        return nchars(t);
      });
      const donts = ((box && box.dontItems) || []).filter(function (t) {
        return nchars(t);
      });
      if (dos.length < 2 || donts.length < 2) {
        out.push(
          issue("warn", page, index, "dodont-few", "DO와 DON'T를 각각 2개 이상 채워 주세요.", "초록/빨간 칸의 목록을 클릭해 수정하세요.")
        );
      }
    }

    if (type === "summary") {
      const bullets = (page.blocks || []).filter(function (b) {
        return b.type === "bullets";
      })[0];
      const items = ((bullets && bullets.items) || []).filter(function (t) {
        return nchars(t) && !isPlaceholder(t);
      });
      if (items.length < LIMIT.rememberMin) {
        out.push(
          issue("warn", page, index, "remember-few", "기억할 항목을 3~5개로 정리하세요.", "번호 카드의 문장을 클릭해 채우세요.")
        );
      }
      if (items.length > LIMIT.rememberMax) {
        out.push(
          issue("warn", page, index, "remember-many", "기억 항목이 많습니다. 5개 안쪽이 좋습니다.", "덜 중요한 항목을 지우세요.")
        );
      }
    }

    if (type === "law") {
      const law = (page.blocks || []).filter(function (b) {
        return b.type === "law";
      })[0];
      if (law) {
        if (nchars(law.original) > 400) {
          out.push(
            issue("warn", page, index, "law-original", "법령 원문이 깁니다. 원문은 접어 두고, 핵심만 본문에 남기세요.", "원문 칸을 줄이거나 비우세요.")
          );
        }
        if (!nchars(law.apply)) {
          out.push(
            issue("warn", page, index, "law-apply", "「현장에서는 이렇게 적용」이 비어 있습니다.", "법령 카드의 중간 칸을 채우세요.")
          );
        }
      }
    }

    (page.blocks || []).forEach(function (b) {
      if (b.type === "point") {
        if (!nchars(b.text) || isPlaceholder(b.text)) {
          out.push(issue("warn", page, index, "point-empty", "핵심포인트가 비어 있습니다.", "파란 POINT 칸을 클릭해 1~2문장으로 적으세요."));
        } else {
          const it = lengthIssue(page, index, "핵심포인트", b.text, LIMIT.pointWarn, LIMIT.pointError, "POINT 칸을 클릭해 문장을 줄이세요.");
          if (it) out.push(it);
        }
      }
      if (b.type === "summary") {
        if (!nchars(b.text) || isPlaceholder(b.text)) {
          out.push(issue("warn", page, index, "summary-empty", "한줄 요약이 비어 있습니다.", "페이지 맨 아래 요약 줄을 클릭하세요."));
        } else {
          const it = lengthIssue(page, index, "한줄 요약", b.text, LIMIT.summaryWarn, LIMIT.summaryError, "요약 줄을 한 문장으로 줄이세요.");
          if (it) out.push(it);
        }
      }
      if (b.type === "paragraph") {
        if (isPlaceholder(b.text)) {
          out.push(issue("info", page, index, "placeholder", "아직 임시 문구가 남아 있습니다.", "본문을 클릭해 실제 교육 내용으로 바꾸세요."));
        }
        const it = lengthIssue(page, index, "본문", b.text, LIMIT.paraWarn, LIMIT.paraError, "본문을 불릿 2~4개로 나누세요.");
        if (it) out.push(it);
      }
      if (b.type === "tip" || b.type === "warning" || b.type === "example") {
        const label = b.type === "tip" ? "TIP" : b.type === "warning" ? "주의사항" : "사례";
        const it = lengthIssue(page, index, label, b.text, LIMIT.tipWarn, LIMIT.tipError, label + " 칸을 1~2문장으로 줄이세요.");
        if (it) out.push(it);
      }
      if (b.type === "heading" && isPlaceholder(b.text)) {
        out.push(issue("info", page, index, "placeholder", "중간 제목이 임시 문구입니다.", "중간 제목을 클릭해 바꾸세요."));
      }
      if (b.type === "bullets" || b.type === "learn") {
        const items = b.items || [];
        if (b.type === "bullets" && items.length > LIMIT.bulletsMax) {
          out.push(
            issue("warn", page, index, "bullets-many", "목록이 " + items.length + "개입니다. 5개 안쪽이 한눈에 들어옵니다.", "중요 항목만 남기거나 다음 페이지로 나누세요.")
          );
        }
        items.forEach(function (it) {
          const text = typeof it === "string" ? it : it.text;
          const li = lengthIssue(page, index, "목록 항목", text, LIMIT.bulletWarn, LIMIT.bulletError, "긴 항목을 두 줄이 아니라 두 개 항목으로 나누세요.");
          if (li) out.push(li);
        });
      }
      if (b.type === "flow") {
        (b.items || []).forEach(function (it) {
          const li = lengthIssue(page, index, it.label || "타임라인", it.text, LIMIT.flowWarn, LIMIT.flowError, "타임라인 칸을 1~2문장으로 줄이세요.");
          if (li) out.push(li);
        });
      }
      if (b.type === "dodont") {
        (b.doItems || []).concat(b.dontItems || []).forEach(function (t) {
          const li = lengthIssue(page, index, "DO/DON'T 항목", t, LIMIT.bulletWarn, LIMIT.bulletError, "한 줄에 행동 하나만 남기세요.");
          if (li) out.push(li);
        });
      }
      if (b.type === "checklist") {
        (b.groups || []).forEach(function (gr) {
          (gr.items || []).forEach(function (it) {
            const li = lengthIssue(page, index, "체크 항목", it.text, 55, 90, "체크 항목을 한 줄 질문으로 줄이세요.");
            if (li) out.push(li);
          });
        });
      }
      if (b.type === "law") {
        const li = lengthIssue(page, index, "법령 핵심", b.text, 140, 220, "법령 핵심을 2~3문장으로 줄이세요.");
        if (li) out.push(li);
      }
    });

    return out;
  }

  function analyze(project) {
    const issues = [];
    const byPage = {};
    if (!project || !project.pages) {
      return { issues: issues, byPage: byPage, errorCount: 0, warnCount: 0, infoCount: 0 };
    }
    project.pages.forEach(function (p, i) {
      const list = analyzePage(project, p, i);
      byPage[p.id] = list;
      list.forEach(function (x) {
        issues.push(x);
      });
    });
    let errorCount = 0;
    let warnCount = 0;
    let infoCount = 0;
    issues.forEach(function (x) {
      if (x.level === "error") errorCount += 1;
      else if (x.level === "warn") warnCount += 1;
      else infoCount += 1;
    });
    return {
      issues: issues,
      byPage: byPage,
      errorCount: errorCount,
      warnCount: warnCount,
      infoCount: infoCount
    };
  }

  function worstLevel(list) {
    if (!list || !list.length) return "";
    if (list.some(function (x) { return x.level === "error"; })) return "error";
    if (list.some(function (x) { return x.level === "warn"; })) return "warn";
    return "info";
  }

  EB.Lint = {
    LIMIT: LIMIT,
    analyze: analyze,
    analyzePage: analyzePage,
    worstLevel: worstLevel,
    chars: nchars
  };
})(window);

/* 전자책 데이터 모델 */
(function (g) {
  const EB = (g.EB = g.EB || {});

  EB.PAGE_TYPES = [
    { id: "cover", label: "표지" },
    { id: "toc", label: "목차" },
    { id: "chapter", label: "Chapter 시작" },
    { id: "content", label: "기본 교육" },
    { id: "case", label: "사건 사례" },
    { id: "dodont", label: "DO / DON'T" },
    { id: "checklist", label: "체크리스트" },
    { id: "law", label: "법령 / 참고" },
    { id: "summary", label: "핵심 요약" }
  ];

  EB.BLOCK_TYPES = [
    { id: "point", label: "핵심포인트" },
    { id: "heading", label: "제목" },
    { id: "paragraph", label: "본문" },
    { id: "bullets", label: "목록" },
    { id: "checklist", label: "체크리스트" },
    { id: "tip", label: "TIP" },
    { id: "warning", label: "주의사항" },
    { id: "law", label: "법령" },
    { id: "example", label: "사례" },
    { id: "summary", label: "요약" },
    { id: "image", label: "이미지" },
    { id: "flow", label: "타임라인" },
    { id: "dodont", label: "DO / DON'T" },
    { id: "learn", label: "배울 내용" },
    { id: "quote", label: "인용" }
  ];

  EB.FLOW_LABELS = [
    "사건 발생",
    "현장 상황",
    "경찰관 판단",
    "조치",
    "결과",
    "LESSON LEARNED"
  ];

  EB.CHECK_GROUPS = ["확인사항", "조치사항", "보고사항", "증거확보", "후속조치"];

  EB.createBlock = function (type, extra) {
    const b = { id: EB.uid("blk"), type: type };
    switch (type) {
      case "heading":
        b.level = 2;
        b.text = "";
        break;
      case "paragraph":
      case "point":
      case "tip":
      case "warning":
      case "example":
      case "summary":
      case "quote":
        b.text = "";
        break;
      case "bullets":
        b.items = [""];
        break;
      case "checklist":
        b.groups = EB.CHECK_GROUPS.map(function (title) {
          return { title: title, items: [{ text: "", checked: false }] };
        });
        break;
      case "law":
        b.title = "";
        b.text = "";
        b.apply = "";
        b.caution = "";
        b.original = "";
        b.collapsed = true;
        break;
      case "image":
        b.src = "";
        b.alt = "";
        break;
      case "flow":
        b.items = EB.FLOW_LABELS.map(function (label) {
          return { label: label, text: "" };
        });
        break;
      case "dodont":
        b.doItems = [""];
        b.dontItems = [""];
        break;
      case "learn":
        b.items = ["", "", ""];
        break;
      default:
        b.text = "";
    }
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        b[k] = extra[k];
      });
    }
    return b;
  };

  EB.createPage = function (type, title) {
    const page = {
      id: EB.uid("page"),
      type: type || "content",
      title: title || "",
      subtitle: "",
      chapterNo: "",
      showPageNumber: true,
      background: type === "cover" || type === "chapter" ? "navy" : "white",
      titleSize: "md",
      emphasis: "none",
      blocks: []
    };
    return page;
  };

  EB.defaultBlocksFor = function (type) {
    switch (type) {
      case "chapter":
        return [
          EB.createBlock("learn", {
            items: ["핵심 원칙을 확인한다.", "현장 적용 순서를 익힌다.", "보고 포인트를 점검한다."]
          })
        ];
      case "content":
        return [
          EB.createBlock("point", { text: "이 페이지에서 반드시 기억할 핵심을 한 문장으로 적습니다." }),
          EB.createBlock("heading", { text: "중간 제목", level: 2 }),
          EB.createBlock("paragraph", { text: "핵심 내용을 짧고 명확한 문장으로 적습니다." }),
          EB.createBlock("bullets", { items: ["첫 번째 요점", "두 번째 요점"] }),
          EB.createBlock("tip", { text: "현장에서 바로 쓰는 팁을 적습니다." }),
          EB.createBlock("summary", { text: "한 줄로 다시 정리합니다." })
        ];
      case "case":
        return [
          EB.createBlock("point", { text: "이 사례에서 배울 판단 기준을 한 문장으로 적습니다." }),
          EB.createBlock("flow"),
          EB.createBlock("summary", { text: "같은 상황에서 반복해서 적용할 원칙을 적습니다." })
        ];
      case "dodont":
        return [
          EB.createBlock("heading", { text: "현장 판단 기준", level: 2 }),
          EB.createBlock("dodont", {
            doItems: ["피해자 안전을 먼저 확보한다.", "현장을 분리·보존한다."],
            dontItems: ["피해자 의사만으로 종결하지 않는다.", "현장 증거를 임의로 정리하지 않는다."]
          }),
          EB.createBlock("summary", { text: "해야 할 일과 하지 말아야 할 일을 한눈에 비교한다." })
        ];
      case "checklist":
        return [
          EB.createBlock("heading", { text: "현장 즉시 확인", level: 2 }),
          EB.createBlock("checklist"),
          EB.createBlock("summary", { text: "빠진 항목이 있으면 현장을 떠나지 않는다." })
        ];
      case "law":
        return [
          EB.createBlock("heading", { text: "관련 법령 핵심", level: 2 }),
          EB.createBlock("law", {
            title: "관련 법령명과 조문을 적습니다.",
            text: "현장에서 필요한 핵심만 2~3문장으로 정리합니다.",
            apply: "이 조문을 현장에 어떻게 적용할지 적습니다.",
            caution: "오해하기 쉬운 점을 적습니다.",
            original: ""
          }),
          EB.createBlock("summary", { text: "법령의 취지를 현장 판단 한 줄로 남깁니다." })
        ];
      case "summary":
        return [
          EB.createBlock("heading", { text: "이것만은 기억하세요", level: 2 }),
          EB.createBlock("bullets", {
            items: ["핵심 1", "핵심 2", "핵심 3"]
          })
        ];
      default:
        return [];
    }
  };

  EB.createBlankProject = function () {
    const cover = EB.createPage("cover", "새 교육 전자책");
    const toc = EB.createPage("toc", "목차");
    const ch = EB.createPage("chapter", "현장조치");
    ch.chapterNo = "01";
    ch.blocks = EB.defaultBlocksFor("chapter");
    const body = EB.createPage("content", "핵심 교육");
    body.blocks = EB.defaultBlocksFor("content");
    return {
      id: EB.uid("book"),
      meta: {
        title: "새 교육 전자책",
        subtitle: "직원 교육용 디지털 핸드북",
        category: "내부 교육자료",
        department: "○○경찰서 ○○과",
        date: EB.today(),
        version: "1.0"
      },
      pages: [cover, toc, ch, body],
      updatedAt: Date.now()
    };
  };

  EB.pageTypeLabel = function (type) {
    const found = EB.PAGE_TYPES.filter(function (t) {
      return t.id === type;
    })[0];
    return found ? found.label : type;
  };

  EB.ensureProjectShape = function (raw) {
    if (!raw || typeof raw !== "object") {
      throw new Error("전자책 데이터가 올바르지 않습니다.");
    }
    if (!raw.meta || !Array.isArray(raw.pages)) {
      throw new Error("백업 파일에 제목 또는 페이지 정보가 없습니다.");
    }
    raw.id = raw.id || EB.uid("book");
    raw.meta.title = raw.meta.title || "제목 없음";
    raw.meta.subtitle = raw.meta.subtitle || "";
    raw.meta.category = raw.meta.category || "내부 교육자료";
    raw.meta.department = raw.meta.department || "";
    raw.meta.date = raw.meta.date || EB.today();
    raw.meta.version = raw.meta.version || "1.0";
    raw.pages.forEach(function (p) {
      p.id = p.id || EB.uid("page");
      p.type = p.type || "content";
      p.title = p.title || "";
      p.subtitle = p.subtitle || "";
      p.chapterNo = p.chapterNo || "";
      p.showPageNumber = p.showPageNumber !== false;
      p.background = p.background || (p.type === "cover" || p.type === "chapter" ? "navy" : "white");
      p.titleSize = p.titleSize || "md";
      p.emphasis = p.emphasis || "none";
      p.blocks = Array.isArray(p.blocks) ? p.blocks : [];
      p.blocks.forEach(function (b) {
        b.id = b.id || EB.uid("blk");
        b.type = b.type || "paragraph";
      });
    });
    return raw;
  };
})(window);

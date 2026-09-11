/* 가상 샘플 전자책 — 실제 사건·개인정보 없음 */
(function (g) {
  const EB = (g.EB = g.EB || {});

  function page(type, title, extra, blocks) {
    const p = EB.createPage(type, title);
    if (extra) {
      Object.keys(extra).forEach(function (k) {
        p[k] = extra[k];
      });
    }
    p.blocks = blocks || [];
    return p;
  }

  EB.buildSampleProject = function () {
    const cover = page("cover", "112 중요사건 현장조치 가이드");
    const toc = page("toc", "목차");

    const ch01 = page(
      "chapter",
      "현장 도착 전",
      { chapterNo: "01", background: "navy" },
      [
        EB.createBlock("learn", {
          items: [
            "출동 전 확인할 최소 정보를 고정한다.",
            "현장 접근 전 안전 태세를 갖춘다.",
            "무전으로 역할 분담을 미리 정한다."
          ]
        })
      ]
    );

    const p1 = page("content", "출동 전 확인사항", {}, [
      EB.createBlock("point", {
        text: "차를 출발시키기 전에 ‘누가, 어디서, 무엇이 위험한가’를 한 줄로 고정한다."
      }),
      EB.createBlock("heading", { text: "출발 전 30초 점검", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "신고 요지: 폭행·흉기·인질·화재 등 위험 유형",
          "장소: 공동주택 / 단독 / 상가 / 도로·차량",
          "사람: 피해자·가해자·목격자 위치와 인원",
          "시간: 진행 중인지, 이미 종료되었는지"
        ]
      }),
      EB.createBlock("tip", {
        text: "정보가 부족하면 추측으로 메우지 말고, 부족한 항목을 무전으로 다시 묻는다."
      }),
      EB.createBlock("summary", {
        text: "모르는 상태로 현장에 들어가는 것이 가장 큰 위험이다."
      })
    ]);

    const p2 = page("content", "무전 정보와 역할 분담", {}, [
      EB.createBlock("point", {
        text: "도착 전에 선착 역할과 지원 역할을 나눠 두면 현장 혼란이 줄어든다."
      }),
      EB.createBlock("heading", { text: "무전으로 고정할 세 가지", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "선착 팀: 안전 확보와 사람 분리",
          "지원 팀: 출입구·도주로 차단과 증거 보존",
          "보고 담당: 상황실·지구대 근무자와 공유"
        ]
      }),
      EB.createBlock("warning", {
        text: "현장 도착 후 즉흥적으로 역할을 정하면 피해자 보호와 도주 차단이 동시에 비게 된다."
      }),
      EB.createBlock("summary", {
        text: "역할이 비어 있는 채로 현장에 서지 않는다."
      })
    ]);

    const p3 = page("content", "접근 전 안전 태세", {}, [
      EB.createBlock("point", {
        text: "현장은 ‘사람을 돕는 곳’이기 전에 ‘위험이 남아 있는 곳’으로 본다."
      }),
      EB.createBlock("heading", { text: "도착 직전 체크", level: 2 }),
      EB.createBlock("paragraph", {
        text: "차량을 현장 정면에 세우지 않는다. 출구가 보이는 위치, 도주 차량을 막을 수 있는 각도를 먼저 고른다."
      }),
      EB.createBlock("bullets", {
        items: [
          "흉기·폭발·다수 인원 정보가 있으면 지원 요청을 미루지 않는다.",
          "단독 진입이 필요한 상황인지, 대기 후 동시 진입인지 구분한다.",
          "휴대장비·수갑·응급처치 키트를 손 닿는 위치에 둔다."
        ]
      }),
      EB.createBlock("tip", {
        text: "공동주택은 엘리베이터보다 계단 접근을 기본값으로 두고, 막다른 복도를 먼저 확인한다."
      }),
      EB.createBlock("summary", {
        text: "빠르게 들어가는 것보다 안전하게 들어가는 것이 초동조치다."
      })
    ]);

    const ch02 = page(
      "chapter",
      "초기 현장조치",
      { chapterNo: "02", background: "navy" },
      [
        EB.createBlock("learn", {
          items: [
            "도착 직후 순서를 고정한다.",
            "사람과 장소를 분리한다.",
            "가정폭력 가상 사례로 판단 흐름을 익힌다."
          ]
        })
      ]
    );

    const p4 = page("content", "도착 직후 원칙", {}, [
      EB.createBlock("point", {
        text: "현장의 첫 질문은 ‘누가 맞았는가’가 아니라 ‘지금 누가 위험한가’이다."
      }),
      EB.createBlock("heading", { text: "초동 5동작", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "1. 시야 확보: 출입구·사람·위험물을 한눈에 본다.",
          "2. 분리: 가해 가능자와 피해 가능자를 즉시 떨어뜨린다.",
          "3. 안전: 흉기·화기·추락 위험을 먼저 제거하거나 차단한다.",
          "4. 상태: 부상·의식·아동 동반 여부를 확인한다.",
          "5. 보존: 현장 물건을 임의로 치우지 않는다."
        ]
      }),
      EB.createBlock("warning", {
        text: "신고자가 가해자를 지목해도, 현장 위험은 별도로 판단한다. 지목만으로 현장을 닫지 않는다."
      }),
      EB.createBlock("summary", {
        text: "사람 분리 → 위험 제거 → 상태 확인 순서를 건너뛰지 않는다."
      })
    ]);

    const p5 = page("content", "피해자 안전 확보", {}, [
      EB.createBlock("point", {
        text: "피해자의 ‘처벌 의사’보다 ‘현재 안전’을 먼저 본다."
      }),
      EB.createBlock("heading", { text: "분리 이후 바로 할 일", level: 2 }),
      EB.createBlock("paragraph", {
        text: "피해자를 가해자의 시선·청각이 닿지 않는 공간으로 이동한다. 아동이 있으면 아동의 시선 차단과 인솔자를 따로 정한다."
      }),
      EB.createBlock("bullets", {
        items: [
          "외관 상처, 호흡, 통증 부위를 짧게 확인한다.",
          "응급이 필요하면 즉시 구급을 요청하고 위치를 고정한다.",
          "피해자가 진술을 거부해도 안전조치 자체는 중단하지 않는다."
        ]
      }),
      EB.createBlock("tip", {
        text: "‘괜찮으세요?’보다 ‘지금 바로 안전한 곳으로 이동하겠습니다.’가 현장 문장이다."
      }),
      EB.createBlock("summary", {
        text: "의사 확인은 안전 확보 다음이다."
      })
    ]);

    const p6 = page("content", "현장 보존의 최소선", {}, [
      EB.createBlock("point", {
        text: "초동 경찰관이 만진 물건은 나중에 설명이 필요해진다. 필요한 것만 만진다."
      }),
      EB.createBlock("heading", { text: "보존과 수습의 구분", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "생명·안전에 필요한 이동은 한다. 그 사실을 기록한다.",
          "흉기·휴대폰·출입카드는 위치를 메모하거나 사진으로 남긴다.",
          "목격자 연락처는 현장에서 받는다. 돌려보내지 않는다."
        ]
      }),
      EB.createBlock("example", {
        text: "가상 사례: 거실 컵이 깨져 있어도, 통행에 방해되지 않으면 치우지 않는다. 치웠다면 ‘왜, 누가, 어디로’를 남긴다."
      }),
      EB.createBlock("summary", {
        text: "현장을 깨끗하게 만드는 것이 초동조치가 아니다."
      })
    ]);

    const p7 = page("case", "가상 사례 · 가정폭력 신고", {}, [
      EB.createBlock("point", {
        text: "피해자가 처벌을 원하지 않는다고 해도, 현장 위험은 별도 판단 대상이다."
      }),
      EB.createBlock("flow", {
        items: [
          {
            label: "사건 발생",
            text: "야간, 공동주택에서 ‘배우자 폭행’ 112 신고. 아동 1명 동반 정보가 있었다."
          },
          {
            label: "현장 상황",
            text: "출입문 앞에서 고성이 들렸다. 피해자는 문을 열고, 상대는 거실에 서 있었다. 파손된 물건이 바닥에 있었다."
          },
          {
            label: "경찰관 판단",
            text: "진행 중 다툼으로 보고 즉시 공간을 분리했다. 아동은 다른 공간으로 인솔했다. 처벌 의사보다 재발 위험과 상해 여부를 먼저 보았다."
          },
          {
            label: "조치",
            text: "쌍방을 분리 조사했다. 상처와 파손 상태를 기록했다. 긴급임시조치 필요성을 검토하고 보호시설·상담 안내를 제공했다."
          },
          {
            label: "결과",
            text: "현장 위험을 이유로 분리 상태를 유지한 채 보고했다. 단순 합의 종결로 처리하지 않았다."
          },
          {
            label: "LESSON LEARNED",
            text: "‘처벌을 원하지 않는다’는 현장 종결 신호가 아니다. 위험성 판단과 보호 조치는 별개다."
          }
        ]
      }),
      EB.createBlock("summary", {
        text: "가정폭력 현장의 첫 목표는 합의가 아니라 분리와 안전이다."
      })
    ]);

    const p8 = page("dodont", "초동조치 DO / DON'T", {}, [
      EB.createBlock("heading", { text: "가정폭력·중요사건 공통", level: 2 }),
      EB.createBlock("dodont", {
        doItems: [
          "가해 가능자와 피해 가능자를 즉시 분리한다.",
          "아동·고령자가 있으면 별도 공간과 인솔자를 정한다.",
          "부상 여부를 눈으로 확인하고 필요 시 구급을 요청한다.",
          "현장 파손·흉기 위치를 기록한다.",
          "상황실에 현재 위험 상태를 짧게 보고한다."
        ],
        dontItems: [
          "당사자 합의만 확인하고 현장을 떠나지 않는다.",
          "가해자와 피해자를 같은 공간에서 동시에 진술받지 않는다.",
          "‘이번만 참으라’는 중재 멘트를 하지 않는다.",
          "증거를 임의로 정리하거나 폐기하지 않는다.",
          "신고자가 가해자일 가능성을 배제하지 않는다."
        ]
      }),
      EB.createBlock("summary", {
        text: "현장 문장은 중재가 아니라 분리·보호·기록이다."
      })
    ]);

    const ch03 = page(
      "chapter",
      "사건별 대응",
      { chapterNo: "03", background: "navy" },
      [
        EB.createBlock("learn", {
          items: [
            "가정폭력·스토킹·주취 난동의 판단 차이를 구분한다.",
            "법령은 원문이 아니라 현장 적용문으로 기억한다."
          ]
        })
      ]
    );

    const p9 = page("content", "가정폭력 현장 요령", {}, [
      EB.createBlock("point", {
        text: "가정 내부라는 이유로 개입을 약하게 하지 않는다. 공간의 폐쇄성이 위험을 키운다."
      }),
      EB.createBlock("heading", { text: "반드시 확인할 항목", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "동거 여부, 과거 폭행 반복, 오늘 흉기 사용 여부",
          "아동 목격·직접 피해 여부",
          "피해자의 현재 거소 안전(지금 귀가해도 되는가)",
          "가해자의 음주·흥분·추가 폭행 가능성"
        ]
      }),
      EB.createBlock("tip", {
        text: "피해자가 낮게 말하는 것은 공포일 수 있다. 작은 목소리 = 경미한 사건으로 해석하지 않는다."
      }),
      EB.createBlock("summary", {
        text: "가정이라는 장소는 완화 사유가 아니라 위험 가중 사유로 본다."
      })
    ]);

    const p10 = page("content", "스토킹 의심 신고", {}, [
      EB.createBlock("point", {
        text: "일회성 시비가 아니라 ‘반복·대기·감시’가 보이면 스토킹 관점으로 전환한다."
      }),
      EB.createBlock("heading", { text: "현장에서 찾는 신호", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "같은 장소에서의 반복 방문·대기",
          "메시지·전화의 횟수와 시간대",
          "피해자 일정을 알고 나타나는 패턴",
          "동행을 거부하는데도 따라오는 행위"
        ]
      }),
      EB.createBlock("warning", {
        text: "당사자가 ‘전 연인’이라는 이유만으로 사적 분쟁으로 넘기지 않는다. 접근 자체를 위험으로 평가한다."
      }),
      EB.createBlock("summary", {
        text: "한 번의 만남이 아니라 패턴을 기록한다."
      })
    ]);

    const p11 = page("content", "주취 난동·폭력", {}, [
      EB.createBlock("point", {
        text: "주취는 양형 사유가 아니라 현장 위험 요소다. 말이 통한다고 위험이 사라진 것은 아니다."
      }),
      EB.createBlock("heading", { text: "대응 순서", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "주변 사람·차량·유리 등 2차 피해 공간을 먼저 비운다.",
          "거리와 각도를 유지하고, 혼자 붙잡지 않는다.",
          "의무적으로 말다툼을 이기려 하지 않는다. 제지와 분리가 목적이다.",
          "의료 필요가 있으면 제지와 동시에 구급을 요청한다."
        ]
      }),
      EB.createBlock("tip", {
        text: "‘취해서 그렇다’는 설명을 받아 적어도, 현장 조치는 취하지 않은 폭력과 같은 위험 기준으로 한다."
      }),
      EB.createBlock("summary", {
        text: "주취 현장의 목표는 설득이 아니라 위해 차단이다."
      })
    ]);

    const p12 = page("law", "법령을 현장에 적용하는 법", {}, [
      EB.createBlock("heading", { text: "가정폭력 현장과 긴급임시조치", level: 2 }),
      EB.createBlock("law", {
        title: "가정폭력범죄의 처벌 등에 관한 특례법 — 긴급임시조치 취지 (교육용 요약)",
        text: "피해자의 보호를 위해, 가해자의 접근·연락·주거 출입을 신속히 제한할 필요가 있는 경우 현장 경찰관은 긴급한 조치를 검토한다. 이 페이지는 교육용 요약이며 조문 원문 전체를 대체하지 않는다.",
        apply: "현장에서 ‘지금 이 공간에 남겨두면 추가 피해가 예상되는가’를 기준으로 본다. 피해자가 처벌을 원하지 않아도 보호 조치 검토는 별개다.",
        caution: "조문 번호와 요건은 개정될 수 있다. 실제 적용 전에는 최신 조문과 내부 매뉴얼을 확인한다. 이 전자책은 법령 해석의 최종 근거가 아니다.",
        original:
          "(교육용 가상 정리) 긴급임시조치는 피해자 보호를 위한 신속 조치로서, 접근 금지·전기통신 금지 등 필요한 범위를 현장에서 검토한다. 원문 전문은 법제처 또는 내부 법령집을 따른다.",
        collapsed: true
      }),
      EB.createBlock("summary", {
        text: "법령은 ‘외울 문장’이 아니라 ‘현장에서 꺼낼 판단 질문’으로 기억한다."
      })
    ]);

    const ch04 = page(
      "chapter",
      "보고 및 후속조치",
      { chapterNo: "04", background: "navy" },
      [
        EB.createBlock("learn", {
          items: [
            "보고는 소설이 아니라 시간 순 사실이다.",
            "현장을 떠나기 전 체크리스트를 닫는다."
          ]
        })
      ]
    );

    const p13 = page("content", "보고는 짧게, 사실만", {}, [
      EB.createBlock("point", {
        text: "보고의 뼈대는 시간·장소·사람·위험·조치·요청 여섯 칸이다."
      }),
      EB.createBlock("heading", { text: "무전·서면 공통 골격", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "언제: 도착 시각과 현재 시각",
          "어디서: 동·호수 또는 도로명, 출입 위치",
          "누가: 확인된 인원, 미확인 인원",
          "무엇이 위험한가: 흉기·부상·도주·재범 우려",
          "무엇을 했는가: 분리·구급·보존",
          "무엇이 필요한가: 지원·여성·형사·구급"
        ]
      }),
      EB.createBlock("warning", {
        text: "추측(‘아마 부부싸움’)을 사실처럼 보고하지 않는다. 판단이면 판단이라고 말한다."
      }),
      EB.createBlock("summary", {
        text: "형용사보다 숫자와 행동이 좋은 보고다."
      })
    ]);

    const p14 = page("checklist", "현장 즉시 체크리스트", {}, [
      EB.createBlock("heading", { text: "떠나기 전에 닫을 항목", level: 2 }),
      EB.createBlock("checklist", {
        groups: [
          {
            title: "확인사항",
            items: [
              { text: "현재 위험 인원과 위치를 파악했는가", checked: false },
              { text: "아동·고령자 등 취약 인원을 확인했는가", checked: false },
              { text: "흉기·화기·도주 차량을 확인했는가", checked: false }
            ]
          },
          {
            title: "조치사항",
            items: [
              { text: "사람과 공간을 분리했는가", checked: false },
              { text: "부상자에게 구급을 요청했는가", checked: false },
              { text: "추가 폭행·접근을 차단했는가", checked: false }
            ]
          },
          {
            title: "보고사항",
            items: [
              { text: "상황실에 현재 상태를 보고했는가", checked: false },
              { text: "지원 필요 여부를 명확히 했는가", checked: false }
            ]
          },
          {
            title: "증거확보",
            items: [
              { text: "현장 파손·흉기 위치를 남겼는가", checked: false },
              { text: "목격자 연락처를 확보했는가", checked: false }
            ]
          },
          {
            title: "후속조치",
            items: [
              { text: "보호·상담·관련 안내를 제공했는가", checked: false },
              { text: "인계 사항이 다음 근무자에게 전달되었는가", checked: false }
            ]
          }
        ]
      }),
      EB.createBlock("summary", {
        text: "체크하지 않은 항목이 있으면 현장을 닫지 않는다."
      })
    ]);

    const p15 = page("summary", "이것만은 기억하세요", {}, [
      EB.createBlock("heading", { text: "112 중요사건 초동 5원칙", level: 2 }),
      EB.createBlock("bullets", {
        items: [
          "현장은 종료된 이야기가 아니라 남은 위험으로 본다.",
          "사람부터 분리하고, 그다음 사실을 듣는다.",
          "피해자의 처벌 의사와 보호 필요성은 별개다.",
          "추측을 보고하지 말고, 시간·사람·조치를 보고한다.",
          "체크리스트가 닫히기 전에 현장을 떠나지 않는다."
        ]
      })
    ]);

    const p16 = page("law", "참고자료 · 관련 규정", {}, [
      EB.createBlock("heading", { text: "이 전자책의 위치", level: 2 }),
      EB.createBlock("paragraph", {
        text: "이 자료는 가상 교육용 핸드북이다. 실제 사건 정보와 개인정보를 담고 있지 않다. 현장 적용 시 최신 법령, 청 훈령, 서 매뉴얼이 우선한다."
      }),
      EB.createBlock("law", {
        title: "우선 확인 순서",
        text: "① 생명·안전  ② 내부 현장매뉴얼  ③ 관련 특별법 취지  ④ 일반 형법·형사소송법 원칙",
        apply: "교육 장면에서는 조문을 암기시키기보다, ‘이 상황에서 어떤 질문을 던질 것인가’를 반복 훈련한다.",
        caution: "본 전자책 문장만으로 강제수사·긴급조치의 적법성을 단정하지 않는다.",
        original: "",
        collapsed: true
      }),
      EB.createBlock("tip", {
        text: "배포 전 제작부서·버전·날짜를 표지에서 확인한다. 구버전 자료는 회수한다."
      }),
      EB.createBlock("summary", {
        text: "교육자료는 현장 판단의 보조이다. 최종 근거는 현행 법령과 내부 매뉴얼이다."
      })
    ]);

    return {
      id: EB.uid("book"),
      meta: {
        title: "112 중요사건 현장조치 가이드",
        subtitle: "지역경찰 초동조치 핵심 핸드북",
        category: "내부 교육자료 · 현장조치",
        department: "고양경찰서 지역경찰과",
        date: "2026.03.01",
        version: "1.0"
      },
      pages: [
        cover, toc,
        ch01, p1, p2, p3,
        ch02, p4, p5, p6, p7, p8,
        ch03, p9, p10, p11, p12,
        ch04, p13, p14, p15, p16
      ],
      updatedAt: Date.now()
    };
  };
})(window);

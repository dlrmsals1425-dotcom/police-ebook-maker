---
name: police-ebook
description: Convert police training notes, 우수사례, manuals, or reports into ebook-maker Markdown. Use when the user asks to 전자책 각색, 마스터 프롬프트에 맞게 변환, 우수사례를 교훈 카드로, Markdown 전자책, or runs /police-ebook.
---

# 경찰 교육 전자책 변환

문법·분량 제한의 원본은 `prompts/경찰교육전자책_마스터프롬프트.md`다. 여기에 다시 적지 말고 그 파일을 읽는다.

앱은 이 저장소의 `index.html`이다. 서버 없이 동작한다.

## 변환 절차

1. 원본을 읽는다. 없는 사실을 만들지 않는다.
2. 마스터 프롬프트 문법으로 `.md`를 쓴다. YAML 표지, `CHAPTER`, `> point:` / `> summary:`, 필요 시 `<!-- page: case -->` 등.
3. 한 페이지 = 하나의 핵심. 길면 페이지를 나눈다.
4. 실명·사건번호·연락처를 뺀다. 실사례는 `교육사례 ·` 제목으로 재구성한다.
5. `node`로 util/model/markdown/lint를 불러 파싱한 뒤 `EB.Lint.analyze` 오류가 0인지 확인한다. 경고가 있으면 문장을 줄인다.
6. 결과 경로를 사용자에게 알린다. 제작기에서 Markdown 불러오기로 열라고 안내한다.
7. 배포는 제작기 **보내기 → HTML 저장**이다. 휴대폰 브라우저에서 스크롤하는 문서다. 책 앱·페이지 넘김 리더를 만들지 않는다.

## 공개 배포

`외부유출금지` 원문, 실사례 재구성 MD/HTML/EPUB은 공개 GitHub에 올리지 않는다. 로컬 또는 사용자 USB에만 둔다. 가상 샘플(`samples/가정폭력_현장조치.md`, `samples/전자책_활용가이드.md`, `book.html`)만 저장소에 둔다.

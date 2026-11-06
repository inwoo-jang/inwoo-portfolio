# inwoo-portfolio

장인우 채용 지원용 포트폴리오. **Inwoo.log 디자인**을 그대로 쓰되 포트폴리오에 필요한 내용만 담았다.

**첫 줄: “구현 중에 판단할 것들이 문서에 다 정리돼 있어 편하다” — 함께 일한 개발자들에게 들은 말.**
내가 주장하지 않고 남의 말로 시작한다(career-docs 3-1). 만든 것과 검증한 것을 앞에 두고 기획을 뒤에 붙인다. 개발 직무와 기획 직무에 같은 문서를 쓴다.

- 배포: https://inwoo-jang.github.io/inwoo-portfolio/
- 원본 사이트 Inwoo.log(SKALA 과제, 캘린더·여행·독서·방명록 포함): https://inwoo-jang.github.io/SKALA-FRONT/

## 페이지

| 파일 | 내용 |
|---|---|
| `index.html` | 홈 — 벤토 히어로(워드마크 + 배포 화면 슬라이더 4장) · 바로가기 · Now 사이드바 |
| `profile.html` | Basic · Skills · Timeline |
| `portfolio.html` | Quick View(카드·필터·읽기 화면) / Book View 연습장 4권 — 실무(지킴) 6장 / SKALA 교육 4장 / 팀 3장 / 개인 5장 |
| `how.html` | 긴 글 + 목차 — 01 기획 · 02 개발 · 03 협업 · 04 AI 활용. 새 디자인 시스템(`css/ds.css`)을 처음 적용한 페이지 |
| `storybook/index.html` | 디자인 시스템 시안 — 원칙 · 기초 요소 · 컴포넌트 · 템플릿 (내부용, 메뉴에 없음) |
| `notes.html` | Dev Notes — 개발 도구·기술 개념·실습·트러블슈팅 (Markdown) |

### Portfolio 보기 방식

- **Quick View(기본)** — 프로젝트 카드 18개를 분류(Work/SKALA/Team/Solo)·유형(Product/Operations/AI Engineering/Frontend/Backend/Tool)으로 거른다.
  카드를 누르면 읽기 화면(`#p-<id>`)이 열린다: 요약(개요→문제→역할→설계·구현→결과→스택·링크) 뒤에 연습장 본문을 그대로 보여 준다.
- **Book View** — 기존 책장·연습장. `#skala` · `#team` · `#solo` 주소는 그대로 Book View로 열린다.
- 카드 요약은 `script/projects-data.js`, 상세 본문의 원본은 `portfolio.html`의 연습장 장이다(id = `data-project-gallery` 값).
  요약에는 본문에 적힌 사실만 쓰고, 팀 결과·설계 목표·추정치는 `metrics[].scope`에 범위를 적는다.

### Dev Notes 추가

1. `notes/_template.md`를 복사해 `notes/영문-슬러그.md`로 저장하고 front matter(title · category · tags · date · summary · sample)를 채운다.
2. `node tools/build-notes-index.mjs` — `notes/index.json`(목록)을 다시 만든다. GitHub Pages는 폴더 목록을 주지 않아서 필요하다.
3. 본문은 브라우저에서 `script/markdown.js`가 렌더링한다. 원문 HTML은 쓰지 않고 모두 이스케이프하며, 링크는 http(s)·mailto·상대 경로만 허용한다.
4. `fetch`를 쓰므로 로컬 확인은 파일 더블클릭이 아니라 `python3 -m http.server`로 연다.

연습장은 표지(목차)에서 항목을 누르면 해당 장이 펼쳐진다.
종이 오른쪽 절반을 누르면 다음 장, 왼쪽 절반을 누르면 이전 장. 방향키(← →)로도 넘긴다.

## 원본에서 뺀 것

Calendar · Trip · Reading · Guestbook · 로그인/회원가입 · 날씨/미니게임 사이드바.
`auth.js`는 싣지 않는다. 히어로 슬라이더는 여행 사진 대신 실제 배포 화면(16:10)을 담는다.

## 사실 기준

내용은 `포트폴리오_전체_프로젝트_소재집_20261106.md`(비공개 작업 자료)와 `~/Desktop/자기계발/지원/자소서&포트폴리오/자소서_작성가이드.md` 팩트시트의 최신 정정을 따른다. 내부 프로젝트(ADchecky)·내부 정책 수치·고객 자료는 싣지 않는다.
L2 기술(Docker·Supabase·MSA)은 스킬 태그에 넣지 않고, 프로젝트 안에서 한계와 함께만 언급한다.

## 파일

```
index.html · profile.html · portfolio.html · how.html · notes.html
css/style.css        Inwoo.log 원본 스타일 (+ 연습장 3권 배치·슬라이더 비율·앵커 여백 몇 줄)
css/flags.css
script/nav.js        모바일 햄버거 메뉴
script/slider.js     히어로 슬라이더
script/portfolio.js  연습장 넘기기
script/portfolio-quick.js  Quick View · 필터 · 읽기 화면 · 보기 전환
script/projects-data.js    Quick View 카드 요약 데이터
script/markdown.js   노트용 안전한 경량 Markdown 렌더러
script/notes.js      노트 목록 · 검색 · 카테고리 · 상세
notes/               노트 Markdown + index.json
tools/build-notes-index.mjs  notes/index.json 생성
media/
```

## 프로젝트 이미지 추가

`script/project-images.js`에서 해당 프로젝트 배열에 아래 항목을 추가합니다. 이미지는 `media/portfolio/`에 저장합니다. 빈 배열은 화면에 나오지 않으며, 파일을 불러오지 못한 이미지도 숨깁니다.

```js
"taxdesk": [
  {
    src: "media/portfolio/taxdesk-chat.png",
    alt: "세무상담 데스크의 법령 근거와 계산 결과 화면",
    caption: "교육·개인 프로젝트 · 테스트 질문으로 확인한 응답"
  }
]
```

이미지를 누르면 확대되고 닫기 버튼이나 Escape로 돌아옵니다. 실제 고객정보·연락처·인증키를 포함하지 않은 공개용 화면만 넣으세요. 가상 데이터는 캡션에 표시합니다. 캡처에 없는 기능이나 성과를 캡션으로 추가하지 않습니다.

현재 등록: 퀴켓 출시 페이지, 관계부 UI 흐름도·ERD, 바이브코딩 가이드. 관계부 연락처 화면과 에이링크 로그인 화면은 공개용 데이터인지 확인한 뒤 등록하도록 제외했습니다. 원본 파일은 보존합니다. 세무상담 데스크, 마켓데스크, ClassTrack, 라벨링 도구는 안전한 실제 화면을 준비한 뒤 각각의 빈 배열에 추가할 수 있습니다.

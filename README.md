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
| `portfolio.html` | Quick View(카드·필터·읽기 화면) / Book View 연습장 4권 — 실무(지킴) 7장 / SKALA 교육 5장 / 팀 3장 / 개인 7장 |
| `how.html` | 긴 글 + 목차 — 01 기획 · 02 개발 · 03 협업 · 04 AI 활용. 새 디자인 시스템(`css/ds.css`)을 처음 적용한 페이지 |
| `storybook/index.html` | 디자인 시스템 시안 — 원칙 · 기초 요소 · 컴포넌트 · 템플릿 (내부용, 메뉴에 없음) |
| `notes.html` | Dev Notes — 기획·기술 선택 기준, 개발 도구·AI 구현·검증 기록 (Markdown) |

### Portfolio 보기 방식

- 페이지 오른쪽 위의 9칸 카드·책 아이콘으로 Quick View와 Book View를 전환한다. 보기 전환은 높이 32px의 화이트 바탕에 선택한 버튼만 블랙으로 표시한다. Dev Notes에도 같은 스타일을 쓴다. 아이콘에 마우스를 올리면 보기 이름을 확인할 수 있다.
- **먼저 볼 프로젝트** — 목록 맨 위에 대표 4개(주문 연동 · 급여명세서 · 퀴켓 · TaxDesk)를 `script/projects-data.js`의 `window.FEATURED`로 보여 준다. 카드는 프로젝트명 → 판단 → 결과·현재 상태 순서이고, 홈(`index.html`)의 대표 프로젝트와 같은 문장을 쓴다.
- **Quick View(기본)** — 프로젝트 카드 22개를 분류(Work/SKALA/Team/Solo)·유형(Product/Operations/AI Engineering/Frontend/Backend/Tool)으로 거른다.
  카드를 누르면 읽기 화면(`#p-<id>`)이 열린다: 프로젝트명 → 한 줄 설명 → 기간·팀·내 역할·현재 상태 → 문제·내 판단·확인한 결과 → 화면과 자료 → 상세 과정(연습장 본문) → 기술과 관련 자료 순서. 역할은 상단 메타에서 한 번만 말한다.
- **Book View** — 기존 책장·연습장. `#skala` · `#team` · `#solo` 주소는 그대로 Book View로 열린다.
- 카드 요약은 `script/projects-data.js`, 상세 본문의 원본은 `portfolio.html`의 연습장 장이다(id = `data-project-gallery` 값).
  요약에는 본문에 적힌 사실만 쓰고, 팀 결과·설계 목표·추정치는 `metrics[].scope`에 범위를 적는다.

### Dev Notes 추가

페이지 오른쪽 위의 9칸 카드·리스트 아이콘으로 보기 방식을 바꾼다. 카드 보기는 기존 포스트잇 형태, 리스트 보기는 날짜·분류와 제목·요약·키워드를 행으로 정돈한다. 선택은 브라우저에 저장되며, 검색·분류 필터와 상세에서 목록으로 돌아올 때도 유지된다.

1. `notes/_template.md`를 복사해 `notes/영문-슬러그.md`로 저장하고 front matter(title · category · tags · date · summary · sample)를 채운다.
2. `node tools/build-notes-index.mjs` — `notes/index.json`과 `notes.html`의 내장 목록을 함께 갱신한다. 본문 내용의 해시를 캐시 버전으로 기록하므로 글 수정 후에도 반드시 실행한다. 영어판은 `node tools/build-notes-index.mjs en`으로 갱신한다.
3. 본문은 브라우저에서 `script/markdown.js`가 렌더링한다. 원문 HTML은 쓰지 않고 모두 이스케이프하며, 링크는 http(s)·mailto·상대 경로만 허용한다.
4. `fetch`를 쓰므로 로컬 확인은 파일 더블클릭이 아니라 `python3 -m http.server`로 연다.

분류 이름·범위·색상은 `notes/categories.json`에서 함께 관리한다. 수정 후 인덱스를 다시 생성하면 필터·분류 안내·카드·본문에 같은 기준과 색상이 적용된다. 글이 없는 분류도 표시한다.

| 분류 | ID | 색상 | 다룰 내용 |
|---|---|---|---|
| 기획 | `planning` | 앰버 | 문제 정의, AI 도입 판단, 모델·구조 선택 기준 |
| AI·에이전트 | `ai` | 퍼플 | 프롬프트, RAG, 메모리, 가드레일 등 AI 기능과 에이전트 구현 |
| 데이터·ML | `data` | 틸 | 데이터 전처리·분석, 모델 학습과 예측 검증 |
| 서비스 개발 | `dev` | 블루 | 서비스 구조, 화면·서버·DB 설계와 구현 |
| 인프라·개발 | `infra` | 오렌지 | 개발 도구, 실행 환경, CI·배포와 코드 관리 |
| 테스트·운영 | `ops` | 올리브 | 평가·테스트, 관측과 장애 추적, 운영 품질 |
| AX | `ax` | 로즈 | 조직의 AI 전환 — 거버넌스, 성과 측정, 산업별 도입 |
| 신기술·트렌드 | `emerging` | 시안 | 새로 등장한 기술 자체의 이해 — Physical AI, 디지털 트윈, 양자 컴퓨팅 등. 기술 이름은 태그로, 연재는 시리즈로 |

### 시리즈

순서가 있는 연속 글은 front matter에 `series: domain-ax`, `seriesOrder: 1`을 적는다. 시리즈의 영문 라벨·한국어 제목·기획 회차는 `notes/series.json`(영어판은 `notes/en/series.json`)에서 관리한다.
카드 위에는 `AX FIELD NOTES · 01` 라벨이, 상세 하단에는 목차(현재 글 강조, 게시되지 않은 회차는 링크 없이 “준비 중”)와 이전·다음 글이 나온다. 없는 시리즈 ID, 같은 회차 중복은 인덱스 생성 단계에서 오류로 멈춘다.

`category`에는 대표 분류 하나를 적는다. 그 분야를 찾는 독자가 이 글에서 실제로 답을 얻을 수 있으면 `categories: [planning, data, ai]`처럼 대표를 맨 앞에 포함한 배열로 추가 분류를 적는다(대표 포함 서로 다른 분류 3개 이하). 생성기는 `category`와 `categories`를 합쳐 대표가 맨 앞인 중복 없는 집합으로 정규화하고, 3개 초과·알 수 없는 분류는 오류로 멈춘다. 검사: `node tools/test-notes-index.mjs`. 카드 상단에는 분류별 색상의 세로 테이프를 나란히 표시하고, 마우스를 올리면 분류명이 나온다. 스크린리더에는 분류명을 함께 전달한다. 카드 아래에는 분류 라벨 대신 기술 키워드를 표시한다. 글은 연결한 모든 분류에서 검색된다. 전체 글 수는 중복을 제거하고, 분류별 글 수에는 중복을 허용한다.

기술 선택 이유는 `planning`, 구현 과정은 해당 기술 분류를 주 분류로 둔다. ML·DL·LLM 비교 글은 `planning`을 주 분류로, `data`와 `ai`를 추가 분류로 둔다. 에이전트 평가 글은 `ai`와 `testing`, 앱에서 CLI를 실행하는 글은 `ai`·`tools`·`backend`에 함께 표시한다. 비교·사용 가이드·오류 해결은 태그로 구분한다.

기획 글의 가정 예시와 실제 프로젝트 경험을 구분하고, 기술 설명에는 확인한 공식 자료를 연결한다.

연습장은 표지(목차)에서 항목을 누르면 해당 장이 펼쳐진다.
종이 오른쪽 절반을 누르면 다음 장, 왼쪽 절반을 누르면 이전 장. 방향키(← →)로도 넘긴다.

## 원본에서 뺀 것

Calendar · Trip · Reading · Guestbook · 로그인/회원가입 · 날씨/미니게임 사이드바.
`auth.js`는 싣지 않는다. 히어로 슬라이더는 여행 사진 대신 실제 배포 화면(16:10)을 담는다.

## 사실 기준

내용은 `포트폴리오_전체_프로젝트_소재집_20261106.md`(비공개 작업 자료)와 `~/Desktop/자기계발/지원/자소서&포트폴리오/자소서_작성가이드.md` 팩트시트의 최신 정정을 따른다. 표시광고 프로젝트는 사용자가 승인한 가칭·개요·담당 역할·출품 준비 상태만 공개하며, 실제 명칭·내부 구현 자료·고객 자료는 싣지 않는다. POSSESSED는 승인된 개요와 기획·설계·풀스택 개발·AI 엔지니어링 담당 범위, 초기 구현·검증 중인 상태를 짧게 공개한다. 표시광고 프로젝트의 썸네일은 ‘진행 중’ 표시를 사용한다. POSSESSED는 사용자가 제공한 기획 흐름도를 썸네일·연습장·상세 이미지로 사용하며, 초기 구현 단계와 검증 전 범위를 캡션에 표시한다. 내부 정책 수치와 기획 원문 링크는 공개하지 않는다.
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

프로필의 프로젝트 썸네일은 `script/projects-data.js`의 `image`·`imageAlt`를 Portfolio Quick View와 함께 사용한다. `data-project-thumbnail="프로젝트 ID"`로 연결하며, 이미지 정보는 페이지를 열 때 반영된다. 이미지가 없거나 로딩에 실패하면 프로젝트의 요약 문구를 표시한다. 실제 화면 갤러리의 이미지 목록은 아래 `script/project-images.js`에서 관리한다.

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

기획 문서는 원문 링크 대신 `how.html`의 요약 예시로 소개합니다. 퀴켓 와이어프레임은 `media/portfolio/wireframe-1.png`~`wireframe-3.png`의 내용 비우기 처리본만 공개합니다. 원본 PNG와 OCR 작업 자료는 저장소에 포함하지 않습니다.

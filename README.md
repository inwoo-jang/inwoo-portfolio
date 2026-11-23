# 장인우 | B2B 제품 기획 · 업무 자동화 · AI 서비스 개발

서비스를 기획할 때 고객이 보는 화면과 그 뒤의 업무 흐름을 함께 살핍니다.
실무에서 맡은 기획·운영 사례와 직접 구현한 프로젝트, 판단과 검증 과정을 기록한 개인 포트폴리오입니다.

[포트폴리오 보기](https://inwoo-jang.github.io/inwoo-portfolio/) · [프로젝트](https://inwoo-jang.github.io/inwoo-portfolio/portfolio.html) · [Dev Notes](https://inwoo-jang.github.io/inwoo-portfolio/notes.html) · [English](https://inwoo-jang.github.io/inwoo-portfolio/index.en.html)

## 둘러보기

| 페이지 | 내용 |
| --- | --- |
| [Home](https://inwoo-jang.github.io/inwoo-portfolio/) | 대표 프로젝트, 모션 데모, 최신 Dev Notes 세 편 |
| [Profile](https://inwoo-jang.github.io/inwoo-portfolio/profile.html) | 경력·학력, 기술을 실제로 사용한 프로젝트 |
| [Portfolio](https://inwoo-jang.github.io/inwoo-portfolio/portfolio.html) | 실무·교육·팀·개인 프로젝트의 역할, 판단, 결과·현재 상태 |
| [How I Work](https://inwoo-jang.github.io/inwoo-portfolio/how.html) | 업무 흐름을 이해하고 기획·협업·구현을 진행한 사례 |
| [Dev Notes](https://inwoo-jang.github.io/inwoo-portfolio/notes.html) | AI 도입 판단, UX, 에이전트, 데이터, 구현·검증 기록 |

프로젝트는 카드·필터로 탐색하는 Quick View와 연습장 형태의 Book View를 지원합니다. 노트는 카드·목록 보기, 검색, 분류, 시리즈별 탐색을 지원합니다. 한국어·영어 페이지를 제공합니다.

홈의 프로젝트 데모는 버튼을 눌러 한 번 재생하며, 진행바로 장면을 이동할 수 있습니다. 주문·인증 사례는 실제 업무 흐름을 재현하고, 표시광고는 가상 광고로 OCR·VLM 분석 구조를 설명합니다. 개인 기여, 팀 결과, 실무 적용, 실습·로컬 구현의 범위를 구분해 적습니다.

## 구현

HTML·CSS·JavaScript로 만든 정적 사이트이며 GitHub Pages로 배포합니다. 사이트 실행에 프레임워크 빌드나 npm 설치는 필요하지 않습니다.

- 공통 스타일: [css/ds.css](css/ds.css)
- 프로젝트 요약: [script/projects-data.js](script/projects-data.js), [영어판](script/projects-data.en.js)
- 프로젝트 상세: [portfolio.html](portfolio.html), [영어판](portfolio.en.html)
- 데모: [css/demo-motion.css](css/demo-motion.css), [script/demo-motion.js](script/demo-motion.js)
- 노트: [notes/](notes/), [notes/en/](notes/en/)
- UI 컴포넌트 확인: 별도 [Storybook 프로젝트](storybook/)

기존 [Inwoo.log 학습 사이트](https://github.com/inwoo-jang/SKALA-FRONT)를 바탕으로 포트폴리오를 구성했습니다.

## 로컬에서 보기

Python 3가 필요합니다.

```bash
git clone https://github.com/inwoo-jang/inwoo-portfolio.git
cd inwoo-portfolio
python3 -m http.server 8000
```

[http://localhost:8000](http://localhost:8000)에서 확인합니다. 노트 본문을 `fetch`로 읽으므로 HTML 파일을 직접 열기보다 로컬 서버를 사용합니다.

## 노트 추가·갱신

1. [노트 템플릿](notes/_template.md)을 복사하고 제목·분류·날짜·요약 등 front matter를 작성합니다.
2. Node.js로 해당 언어의 인덱스를 생성합니다. 홈의 최신 세 글도 목록과 동일한 제목·날짜·요약으로 함께 갱신됩니다.

```bash
node tools/build-notes-index.mjs
node tools/build-notes-index.mjs en
node tools/test-notes-index.mjs
```

이 검사는 노트 분류·시리즈·정렬 등 인덱스 계약을 확인합니다. 화면 전체의 동작이나 프로젝트 데모의 재생 검사를 대신하지 않습니다.

분류·시리즈 설정, 이미지 추가, 콘텐츠 작성 기준은 [유지보수 문서](docs/maintenance.md)에 정리했습니다.

## Storybook

사이트 배포와 별개로 UI 컴포넌트와 화면 시안을 확인하는 개발 도구입니다.

```bash
cd storybook
npm ci
npm run storybook
```

실행 명령은 [storybook/package.json](storybook/package.json)을 기준으로 합니다. 정적 결과물은 `npm run build-storybook`으로 생성하며 Git 추적에서 제외합니다.

## 배포

GitHub Pages는 `main` 브랜치의 저장소 루트를 게시합니다. 정적 사이트 파일을 커밋·푸시하면 Pages 빌드 후 반영됩니다. 노트를 수정했다면 인덱스와 홈 미리보기를 생성한 결과도 함께 커밋합니다.

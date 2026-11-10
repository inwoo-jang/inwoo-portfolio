/* ==========================================================
   스토리용 데이터 — 사이트(portfolio.html·projects-data.js)와 같은 사실만 쓴다.
   기준: 포트폴리오_전체_프로젝트_소재집_20261106 + 팩트시트 최신 정정.
   이미지는 README에 공개용으로 등록된 것만 사용한다.
   ========================================================== */

export const HERO = {
  name: "장인우",
  role: "서비스 기획 · IT 기획 · AX",
  title: "현장을 직접 해 보고 규칙으로 만드는 서비스 기획자",
  summary: [
    "도메인을 알려고 거래처 30곳의 기장을 직접 한 서비스 기획자입니다.",
    "주문 연동에서 ‘주문’과 ‘박스’의 단위 차이를 찾아 담당자 수기 입력을 하루 1시간에서 10분으로 줄였습니다.",
    "배포 후에도 쓰이지 않던 급여 기능을 쓰이게 만들었고, 지금은 RAG·Tool Calling으로 AI 서비스를 직접 구현합니다.",
  ],
  actions: [
    { label: "대표 프로젝트 보기", href: "portfolio.html", variant: "primary" },
    { label: "일하는 방식", href: "how.html", variant: "quiet" },
  ],
  profile: {
    initial: "프로필",
    rows: [
      ["경력", "지킴컴퍼니 서비스 기획·운영 · 2024.10 – 2026.06"],
      ["지금", "AI 서비스 개발 교육 과정 · 2026.07 –"],
      ["이전", "온라인 쇼핑몰 1인 창업 · 2021.12 – 2024.06"],
      ["언어", "영어 Business · 중국어 Business"],
      ["연락", "roseprincess0331@gmail.com"],
    ],
  },
};

const live = (label) => ({ label, kind: "live" });
const edu = (label = "교육 실습") => ({ label, kind: "edu" });
const other = (label) => ({ label, kind: "other" });

export const PROJECTS = [
  { id: "order-sync", group: "실무", kind: "실무 · 지킴컴퍼니", period: "2026.01 – 02", status: live("운영 적용"),
    title: "의약품 도매몰 주문·박스 상태 연동", headline: "약 1시간 → 10분", headlineScope: "담당자 주문 수기 입력(하루) · 본인 확인 기록",
    result: "주문 단위와 박스 단위의 차이를 연동 정책으로 정리하고, 양쪽 데이터를 대조해 오류 두 가지를 찾아 전달했습니다.",
    role: "본인: 연동 정책 기획·데이터 대조 · 구현: 개발팀", tags: ["API 정의서 검토", "상태 정책", "QA"] },
  { id: "payroll", group: "실무", kind: "실무 · 지킴컴퍼니", period: "2025.12 – 2026.05", status: live("내부 사용 · 시범 운영"),
    title: "급여명세서 서비스 기획", headline: "쓰이지 않던 기능을 실제 사용까지", headlineScope: "계산 기준 재정의 · 담당자 교육",
    result: "위하고 결과와 계산식을 대조하고 Apps Script 기준 코드로 전달했습니다. 설명·가이드 후 실제 급여 계산에 쓰이기 시작했습니다.",
    role: "본인: 계산 기준·정책·화면 기획 · 구현: 개발팀", tags: ["계산 기준", "현업 적용"] },
  { id: "samil", group: "실무", kind: "실무 · 지킴컴퍼니", period: "2026.01 – 06", status: other("베타 테스트 단계"),
    title: "약국 AI 세무 상담 — 삼일회계법인 협업", headline: "답할 것과 넘길 것의 경계", headlineScope: "AI 서비스 정책 · 예외 처리",
    result: "범위 밖 질문·응답 불가·시스템 오류를 나누고 경우마다 다음 행동을 정의했습니다. 베타 단계에서 FAQ 응답을 확인했습니다.",
    role: "본인: 화면·서비스 정책 · 모델·DB: 협력사", tags: ["AI 정책", "외부 협업"] },
  { id: "quiket", group: "팀", kind: "사이드 프로젝트 · 7인 팀", period: "2026.03 – 07", status: other("출시 후 운영 중단"),
    title: "퀴켓 — AI 퀴즈 학습 앱", image: "media/portfolio/quiket-card.png", imageAlt: "App Store에 출시된 퀴켓 소개 화면",
    result: "미니 버전으로 문항 수 기준을 먼저 정하고, MoSCoW로 첫 출시 범위를 조율해 App Store·Google Play에 출시했습니다(팀 결과).",
    role: "본인: PM·기획 · 정식 앱 구현: 개발팀", tags: ["PM", "사용자 테스트", "PM MVP"] },
  { id: "taxdesk", group: "교육", kind: "교육 실습 · 1인", period: "2026.08", status: edu(),
    title: "SKALA증권 세무상담 데스크", headline: "숫자는 코드가 계산", headlineScope: "RAG + Tool Calling · Spring AI",
    result: "법령 근거는 검색으로, 세액은 계산 코드로 나눴습니다. 오류 주입 시험 7종 중 6종을 테스트가 검출했습니다(주입은 AI 도구).",
    role: "1인 설계·구현·검증 · AI 코딩 도구 활용", tags: ["Spring AI", "RAG", "Tool Calling"] },
  { id: "marketdesk", group: "개인", kind: "개인 프로젝트", period: "2026.06 –", status: other("개인 사용"),
    title: "마켓데스크 — AI 리포트 분석", headline: "목적별 리포트 요약", headlineScope: "태스크 46개 · 결정 기록 15건",
    result: "스펙을 태스크 6항목으로 정하고, AI 구현 뒤 화면에서 다시 확인했습니다. 발간일을 지어내던 문제를 찾아 고쳤습니다.",
    role: "1인 기획·AI 활용 구현·검증", tags: ["Next.js", "PostgreSQL", "가드레일"] },
  { id: "relationship-design", group: "교육", kind: "교육 미니프로젝트 · 1인", period: "2026.09", status: edu("교육 · 프로토타입"),
    title: "관계부 — 기능·화면·ERD·API 설계", image: "media/portfolio/gwangyebu-uiflow.png", imageAlt: "관계부 화면 11개의 이동 흐름도",
    result: "페인 포인트 4개를 기능 18 · 화면 11 · 테이블 6 · API 33으로 연결하고, Vue 3 화면 10개로 흐름을 확인했습니다.",
    role: "본인: 설계·프론트엔드 프로토타입", tags: ["요구사항 정의", "ERD", "Vue 3"] },
  { id: "dacon", group: "팀", kind: "대회 · 팀", period: "2026.08 – 09", status: other("대회 종료"),
    title: "데이콘 블랙박스 대회", headline: "320팀 중 24위", headlineScope: "팀 결과 · 개인 중간 16위",
    result: "합성 학습셋의 데이터 누출(836건 중 336건)을 찾아 제거하고, 팀원을 위한 라벨링 도구를 직접 만들었습니다.",
    role: "본인: Stage 1 실험·라벨링 도구 · 인프라: 팀원", tags: ["데이터 누출 점검", "Python"] },
  { id: "triage", group: "개인", kind: "해커톤 · 개인", period: "2026.06", status: other("데모"),
    title: "일경험 운영 트리아지 어드민", image: "media/portfolio/demo-triage.png", imageAlt: "트리아지 어드민 데모 첫 화면",
    result: "6시간 안에 기획·구현·발표. 계산은 코드, 문구는 AI, 확정은 사람으로 역할을 나눴습니다.",
    role: "1인 기획·데모 구현·발표", tags: ["역할 분리", "Python"] },
];

export const FEATURED = ["order-sync", "payroll", "quiket"].map((id) => PROJECTS.find((p) => p.id === id));

export const WAYS = [
  { no: "01", title: "기획", text: "업무를 직접 해 보고 문제를 찾습니다. 기장 30곳, 원격지원, 담당자 관찰에서 시작한 기획이 많습니다." },
  { no: "02", title: "개발", text: "스펙을 태스크 6항목으로 먼저 정하고, AI로 구현한 뒤 화면과 테스트로 확인합니다." },
  { no: "03", title: "협업", text: "디자이너·개발자·현업마다 필요한 정보로 넘기고, 실제로 쓰일 때까지 확인합니다." },
];

export const NOTES = [
  { date: "2026.11.06", title: "AI 개발 도구 비교 — VS Code vs Kiro vs Cursor", summary: "세 도구의 AI 기능을 같은 기준으로 비교 — 작업 방식, 프로젝트 규칙 파일, MCP, 모델 선택.", tags: ["Tools & IDE", "AI 코딩"] },
  { date: "2026.07.15", title: "프롬프트 기법 정리", summary: "자주 쓰는 프롬프트 기법 10가지 — 언제 쓰는지, 한 줄 예시, 쓸 때 주의점.", tags: ["AI Engineering", "Prompt Engineering"] },
];

export const TIMELINE = [
  { when: "2026.07 – 진행 중", title: "AI 서비스 개발 교육 과정 (SKALA 4기)", desc: "풀스택 기초, 데이터 분석, 클라우드, 생성형 AI, 프로젝트 방법론. 11월부터 팀 프로젝트 진행 중." },
  { when: "2024.10 – 2026.06", title: "(주)지킴컴퍼니 · 프로덕트팀 서비스 기획·운영", desc: "약국 대상 세무·급여·처방전 보관 서비스. 5인 팀의 유일한 기획자로 정책·예외를 정리하고 구현 결과를 대조했습니다. 처방전 스캔센터 운영." },
  { when: "2021.12 – 2024.06", title: "제이머메이드 · 온라인 쇼핑몰 1인 창업", desc: "소싱·촬영·상세페이지·CS·물류. 중국 도매업체와 중국어로 직접 협상." },
  { when: "2016 – 2020", title: "복단대학교 법학", desc: "중국 상하이." },
];

export const SKILLS = [
  ["기획", "PRD · IA · 유저플로우 · 기능명세 · Figma", "지킴컴퍼니 서비스 기획, 퀴켓"],
  ["AI", "Spring AI (RAG · Tool Calling), LLM API", "세무상담 데스크, 퀴켓 미니 버전"],
  ["백엔드", "Java · Spring Boot · JPA", "세무상담 데스크, ClassTrack"],
  ["데이터", "SQL · PostgreSQL · Python", "마켓데스크, 라벨링 도구, 해커톤 데모"],
  ["프론트엔드", "Vue 3 · React · TypeScript · Next.js", "EDU:UP, 관계부 설계, 에이링크, 마켓데스크"],
  ["협업", "Notion · Figma · Git/GitHub", "태스크·결정 기록, 화면 설계, 팀 코드 관리"],
];

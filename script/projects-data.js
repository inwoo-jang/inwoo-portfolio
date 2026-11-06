/* ==========================================================
   script/projects-data.js — Quick View 카드·요약용 데이터
   - 상세 본문은 portfolio.html의 연습장(<article class="note__page">)이 원본이다.
     여기에는 한눈에 보기 위한 요약만 둔다.
   - id는 각 장의 data-project-gallery 값과 같다(연습장 장과 연결하는 키).
   - 문장은 연습장 본문에 이미 적힌 사실에서만 가져온다. 새 수치·역할을 추가하지 않는다.
   - metrics[].scope: 팀 결과·설계 목표·추정치처럼 맥락이 필요한 수치에 반드시 적는다.
   ========================================================== */
window.PROJECT_TYPES = ["AI Engineering", "Product", "Frontend", "Backend", "Tool"];

window.PROJECTS = [
  /* ---------- SKALA ---------- */
  {
    id: "taxdesk",
    book: "skala",
    title: "SKALA증권 세무상담 데스크",
    scope: "Solo · 교육·개인 프로젝트",
    period: "2026.08",
    types: ["AI Engineering", "Backend"],
    overview: "금융소득 종합과세 대상인지와 세액을 법령 근거와 함께 답하는 상담 AI.",
    problem: "세액 상담 답변에 법령 근거와 계산 결과를 함께 내놓아야 했습니다. 법령을 찾는 과정과 세액을 계산하는 과정을 나눠 구현했습니다.",
    role: "1인 설계·개발·검증",
    build: [
      "법령 근거는 RAG, 세액 계산은 Tool Calling으로 나눠 두 결과를 함께 산출",
      "세법 문서 9종을 조문 경계로 잘라 청크 39개를 만들고 조문 번호를 실어 인용",
      "범위 밖 질문은 규칙·모델 2단 라우팅으로 분류해 상담 응답 생성 전에 안내"
    ],
    metrics: [
      { value: "6 / 7", label: "계산 코드에 넣은 버그 7종 중 테스트가 검출한 종류" },
      { value: "39", label: "세법 문서 9종을 조문 경계로 나눈 청크" }
    ],
    resultNote: "검출하지 못한 경계값 조건은 추가 테스트가 필요한 항목으로 기록했습니다.",
    stack: ["Java", "Spring Boot", "Spring AI", "RAG", "Tool Calling"]
  },
  {
    id: "gtsrb",
    book: "skala",
    title: "차량용 교통표지판 인식 모델 경량화",
    scope: "Team · 2인 과제",
    period: "2026.09",
    types: ["AI Engineering"],
    overview: "GTSRB 43클래스 표지판 인식 모델을 차량 탑재 기준으로 경량화.",
    problem: "정확도는 이미 98.5%였습니다. 차량에서는 여러 인식 모듈이 메모리를 함께 쓰므로 정확도를 더 올리기보다 크기를 줄이는 편이 탑재 관점에서 이득이라고 봤습니다.",
    role: "2인 과제 · 모델 구조 분석으로 목표를 경량화로 전환, 추론 시간 측정, Test 사용 원칙에 대한 팀 의견 조율",
    build: [
      "파라미터 218만 개 중 연결만 담당하는 한 층이 96%를 차지하는 것을 확인",
      "실험 21종을 비교해 최종 모델 선택",
      "같은 표지판 연속 촬영 묶음 888개가 학습·검증에 걸쳐 있는 데이터 분할 문제를 찾음"
    ],
    metrics: [
      { value: "8.33MB → 2.10MB", label: "모델 크기" },
      { value: "0.09%p", label: "3개 시드 평균 정확도 차이 (시드 변동폭과 비슷한 수준)" },
      { value: "25.2%", label: "원래 대비 최종 파라미터 비율" }
    ],
    resultNote: "한 장씩 추론하면 작은 모델이 오히려 느렸고(0.174ms vs 0.099ms) 배치로는 빨랐습니다(0.080ms vs 0.216ms). 야간·역광·우천은 미검증 항목으로 명시했습니다.",
    stack: ["PyTorch", "CNN", "모델 경량화", "실험 설계"]
  },
  {
    id: "edu-up",
    book: "skala",
    title: "EDU:UP — 교육복지포인트 플랫폼",
    scope: "SKALA · 4인 팀 · 프론트엔드",
    period: "2026.08",
    types: ["Frontend"],
    overview: "직무·관심 분야를 한 번 답하면 강의 2개와 도서 2권을 추천하는 교육복지포인트 플랫폼.",
    problem: "목록이 수백 개라 고르기가 부담이 되어 미루다 분기 말에 포인트가 소멸됩니다. 같은 원인이 직원에게는 미사용으로, 회사에는 편중으로 보였습니다.",
    role: "4인 팀 프론트엔드 · Gateway 뒤 다섯 개 서비스를 화면에 연결. MSA 구조는 제공된 템플릿이며 직접 설계하지 않음",
    build: [
      "신청과 확정을 분리 — 차감이 끝났다는 소식을 받은 뒤에만 확정",
      "결과를 모르는 것과 실패를 다르게 처리",
      "같은 사람의 동시 신청을 막아 잔액이 음수가 되지 않게 함"
    ],
    metrics: [
      { value: "5개", label: "화면에 연결한 Gateway 뒤 서비스" }
    ],
    resultNote: "성과 지표는 배정 교육비 사용 비율과 추천→신청 비율로 정의했습니다(측정 결과가 아니라 정의). 취소 처리는 다음 스프린트로 미룬다고 명시했습니다.",
    stack: ["프론트엔드", "MSA 실습", "이벤트 설계", "Agile · Scrum"]
  },
  {
    id: "relationship-design",
    book: "skala",
    title: "관계부 — 기능·화면·ERD·API 설계",
    scope: "Solo · 3일 미니프로젝트",
    period: "2026.09",
    types: ["Product", "Frontend"],
    overview: "매일 쓰던 관계부를 과제로 다시 설계하고 Vue 3로 프론트엔드를 구현.",
    problem: "페인 포인트와 기능을 맞춰 보니 AI 관계 분석, 카톡 가져오기, 리마인더는 연결되는 곳이 없었습니다. 기록과 조회면 충분해서 뺐습니다.",
    role: "1인 · 설계 + 프론트엔드 구현(Vue 3)",
    build: [
      "API마다 어느 화면에서 부르는지 명시하고, 저장하지 않는 표시값은 따로 정리",
      "중복 입력은 화면과 DB 양쪽에서 차단",
      "다른 사람의 기록 접근에는 403이 아니라 404를 반환"
    ],
    metrics: [
      { value: "18", label: "기능" },
      { value: "11", label: "화면" },
      { value: "6", label: "테이블" },
      { value: "33", label: "API" }
    ],
    resultNote: "페인 포인트 4개 → 기능 18개 → 화면 11개 → 테이블 6개 → API 33개로 연결했습니다.",
    stack: ["Vue 3", "Pinia", "ERD · dbml", "OpenAPI 3"]
  },

  /* ---------- Team ---------- */
  {
    id: "quiket",
    book: "team",
    title: "퀴켓 — AI 퀴즈 학습 앱",
    scope: "Team · 7인 · PM",
    period: "2026.03–07",
    types: ["Product"],
    overview: "내 필기를 넣으면 AI가 문제를 만들어 주는 학습 앱.",
    problem: "개발자 4명, 디자이너 2명의 일정 안에서 출시 범위를 정해야 했습니다. MoSCoW로 우선순위를 정하고 준비되지 않은 기능은 출시 화면에서 뺐습니다.",
    role: "PM(요구사항·사용자 흐름·출시 범위 조율) + 검증용 퀴즈 생성 미니 버전 직접 구현. 정식 앱 구현은 개발팀 담당",
    build: [
      "설문과 사용자 테스트 2회로 사용 흐름 확인",
      "PRD·IA·기능명세·유저플로우 작성, 와이어프레임 100화면 이상",
      "Next.js·Gemini 미니 버전으로 입력 글자 수별 생성 문항 수 기준 결정"
    ],
    metrics: [
      { value: "3개월", label: "App Store·Google Play 동시 출시", scope: "7인 팀 결과 · 정식 앱은 개발팀 구현" },
      { value: "100+", label: "작성한 와이어프레임 화면" }
    ],
    resultNote: "동아리 PM MVP로 선정됐습니다.",
    stack: ["기획", "사용자 조사", "Next.js · Gemini (미니 버전)"]
  },
  {
    id: "archivelink",
    book: "team",
    title: "에이링크 — AI 링크·QR 북마크",
    scope: "Team · 2인 · 프로토타입(미출시)",
    period: "2026",
    types: ["Product", "Frontend"],
    overview: "링크를 넣으면 AI가 폴더·이름·설명·태그를 채우는 북마크 서비스 프로토타입.",
    problem: "로그인 벽과 봇 차단으로 AI가 읽지 못하는 링크가 많았습니다. 자동 분류 실패를 예외로만 두면 사용자가 그 자리에서 막힙니다.",
    role: "기획 전반 + 프론트엔드 프로토타입. 서버·DB 구조와 인프라는 팀 백엔드 개발자 설계",
    build: [
      "분석하지 못한 링크도 사용자가 정보를 직접 입력해 저장하는 흐름 설계",
      "프로토타입을 먼저 배포해 요구사항 기준으로 고정한 뒤 React 19·TypeScript로 이관"
    ],
    metrics: [],
    resultNote: "프로토타입 단계(미출시)이며 링크에서 직접 눌러 볼 수 있습니다.",
    stack: ["React 19", "TypeScript", "PWA", "AI 자동 분류"]
  },
  {
    id: "dacon",
    book: "team",
    title: "데이콘 블랙박스 대회 — 팀 라벨링 도구",
    scope: "Team · 라벨링 도구 담당",
    period: "2026.09–진행 중",
    types: ["Tool"],
    overview: "팀이 주행 영상을 보고 키보드만으로 라벨을 입력하는 GUI.",
    problem: "팀원이 클립마다 재촬영 여부·사고 시점·주행 상태를 판정해 라벨로 쌓아야 했습니다.",
    role: "라벨링 GUI 설계·구현",
    build: [
      "충돌·진입 프레임은 ±7프레임 미세 조정 모드와 0.25× 슬로우 재생으로 확정",
      "fps를 메타데이터 대신 프레임수 ÷ 실제 길이로 다시 계산",
      "판정마다 CSV 저장, 다시 실행하면 완료한 클립을 건너뛰어 이어서 작업"
    ],
    metrics: [
      { value: "±7프레임", label: "충돌·진입 프레임 미세 조정 범위" },
      { value: "20~30초", label: "클립당 판정 목표", scope: "설계 목표 · 실측 아님" }
    ],
    resultNote: "AI 초벌 라벨은 회색 참고 오버레이로만 띄우고 자동으로 채우지 않았습니다.",
    stack: ["Python", "OpenCV", "키보드 UX"]
  },
  {
    id: "samil",
    book: "team",
    title: "AI 세무 챗봇 — 삼일회계법인 협업",
    scope: "Team · 외부 협업 · 지킴컴퍼니",
    period: "2026",
    types: ["Product"],
    overview: "약국 운영자가 세무·노무·행정을 물어보는 상담 챗봇.",
    problem: "모델이 답해도 되는 질문과 전문가 상담으로 넘길 질문의 경계를 정해야 했습니다.",
    role: "상담 범위·서비스 정책·화면·사용자 흐름 설계. 모델 개발과 Q&A DB는 협력사 담당",
    build: [
      "3단계 응답 로직 — 예상 Q&A DB 매칭 → 에이전트 탐색 → 전문가 연결",
      "응답 불가 4가지 경우의 처리, AI 면책 고지와 근거 조문 표시 규칙",
      "대화 이력 7일 자동 삭제 정책, 토큰 사용량 하드캡 요구사항 정의"
    ],
    metrics: [],
    resultNote: "FAQ 응답 테스트까지 확인했고, 베타 테스트 시점에 퇴사했습니다.",
    stack: ["AI 정책 설계", "UX 설계", "외부 협업"]
  },
  {
    id: "payroll",
    book: "team",
    title: "급여명세서 작성 자동화",
    scope: "Team · 재기획 · 지킴컴퍼니",
    period: "2025–2026",
    types: ["Product"],
    overview: "약국 급여명세서 작성·전달 과정을 줄이기 위한 자동화 서비스 재기획.",
    problem: "약국장은 명세서를 요청해 받아 전달해야 했고, 내부 담당자는 계산과 보험 고지액을 반복 확인했습니다. 고용 형태마다 계산식이 다르고 4대보험·간이세액표가 얽혀 있었습니다.",
    role: "서비스 기획 — 계산 로직·예외 규칙 정의, 유저·어드민 화면 흐름과 데이터 필드 정의, 개발 테스트, ERD 대조 검토",
    build: [
      "기획 전 약 30개 거래처의 세무 기장을 직접 수행하며 규칙 문서화",
      "현업 과장님과 계산 규칙·예외를 검토하고 개발팀과 구현 진행"
    ],
    metrics: [
      { value: "약 30곳", label: "기획 전 직접 수행한 거래처 세무 기장" }
    ],
    resultNote: "베타 운영까지 참여했고, 현업 관리자에게 계산 로직과 보험 고지액 확인 부담을 줄인 부분에 긍정적인 피드백을 받았습니다.",
    stack: ["서비스 기획", "계산 로직", "도메인 실무"]
  },

  /* ---------- Solo ---------- */
  {
    id: "marketdesk",
    book: "solo",
    title: "마켓데스크 — AI 리포트 분석·종목 관리",
    scope: "Solo · 매일 실사용(미출시)",
    period: "2026–진행 중",
    types: ["AI Engineering", "Backend"],
    overview: "읽는 목적(렌즈)별로 리포트를 AI가 구조화 요약하고 산업별 흐름으로 누적하는 도구.",
    problem: "같은 산업 리포트도 취업 준비생과 투자자가 다르게 읽습니다. 구현 중에는 PDF 파싱이 업로드 응답을 막는 문제가 있었습니다.",
    role: "1인 기획~구현",
    build: [
      "API 서버와 파싱 워커를 분리해 큐로 연결",
      "내용 SHA-256으로 중복 차단, SimHash로 유사본을 잡아 병합 제안",
      "모든 추출 호출에 “리포트에 없는 숫자·전망을 지어내지 말라”는 기준 적용"
    ],
    metrics: [
      { value: "219", label: "커밋 · 직접 만든 것 중 가장 큰 규모" },
      { value: "6항목", label: "렌즈별 구조화 요약" }
    ],
    resultNote: "추출 숫자를 원문과 대조하는 검증 도구는 만들었지만 아직 업로드 파이프라인에 붙이지 않았습니다.",
    stack: ["Next.js", "Hono", "PostgreSQL", "큐 · 워커 분리"]
  },
  {
    id: "triage",
    book: "solo",
    title: "일경험 운영 트리아지 어드민",
    scope: "Solo · AX 해커톤 개인 참가",
    period: "2026.06",
    types: ["Product", "AI Engineering"],
    overview: "참여자 출결 점검 우선순위를 정렬하는 운영 어드민 데모.",
    problem: "운영자 한 명이 참여자 300명의 8주치 출결을 수기로 점검하는 시나리오를 바탕으로 했습니다.",
    role: "개인 참가 · 6시간 안에 기획·데모 구현·발표",
    build: [
      "“지금 개입하면 추가로 지킬 수 있는 수당”을 개입가치로 정의해 점검 대상을 자동 정렬",
      "남은 주차 출석을 넣으면 수당이 재계산되는 What-if 시뮬레이터",
      "계산과 임계 판정은 코드, 요약·안내 문구는 AI, 최종 확정은 사람"
    ],
    metrics: [
      { value: "6시간", label: "기획·데모 구현·발표 완주" },
      { value: "15~25시간", label: "수기 점검 규모 (300명 × 건당 3~5분)", scope: "문제 규모 추정 · 실측 아님" }
    ],
    resultNote: "",
    stack: ["Python", "프롬프트 설계", "역할 분리"]
  },
  {
    id: "classtrack",
    book: "solo",
    title: "ClassTrack — 강의·과제 추적 웹앱",
    scope: "Solo · 구현·배포 실습",
    period: "2026.08",
    types: ["Backend", "Frontend"],
    overview: "듣고 있는 강의와 과제, 결과물 링크를 한곳에서 추적하는 웹앱.",
    problem: "화면·서버·데이터를 직접 연결하고 컨테이너 기반 배포를 실습하는 것이 목표였습니다.",
    role: "1인 설계·구현·배포 실습",
    build: [
      "주말·공휴일을 뺀 수업일 캘린더를 종료일을 저장하지 않고 규칙으로 계산",
      "API·서비스·DB 구조와 로그를 뽑아내는 dev 화면",
      "AOP 로깅, 비동기 링크 검증, 멀티스테이지 빌드"
    ],
    metrics: [],
    resultNote: "",
    stack: ["Spring Boot", "Vue 3", "AOP", "Docker"]
  },
  {
    id: "relationship",
    book: "solo",
    title: "관계부 — 관계 기록·AI 분석",
    scope: "Solo · 매일 실사용(미출시)",
    period: "2026–진행 중",
    types: ["Frontend"],
    overview: "사람마다 필요한 정보를 한곳에 기록하고, 카톡 대화를 AI가 날짜별로 요약하는 앱.",
    problem: "소중한 관계를 놓치지 않도록 사람마다 필요한 것을 한곳에 기록하고 싶었습니다.",
    role: "1인 개발",
    build: [
      "인물 카드 — MBTI·인스타·명함·못 먹는 음식 등 자유 메모",
      "경조사비·빌려준 돈 기록, 주고받은 잔액 자동 계산",
      "AI 관계 건강도 분석, 연락 리마인더·경조사 D-day 알림"
    ],
    metrics: [],
    resultNote: "",
    stack: ["Next.js", "Supabase", "Capacitor", "Claude · Gemini API"]
  },
  {
    id: "personal-tools",
    book: "solo",
    title: "개인용 툴",
    scope: "Solo · 대부분 매일 사용",
    period: "2026",
    types: ["Tool"],
    overview: "템플릿 허브, 이메일 요약봇, 바이브코딩 가이드, 학습용 AI 코치 웹앱.",
    problem: "반복해서 확인하던 일을 줄이고, AI 결과물이 매번 같게 나오도록 만들고 싶었습니다.",
    role: "1인 제작",
    build: [
      "템플릿을 고르면 AI에 던질 프롬프트를 만들어 주는 허브",
      "Gmail을 IMAP으로 수집해 중요도별로 요약 후 Discord로 전송 (GitHub Actions)",
      "빌드가 키 유출 검사를 통과해야 산출물이 나오게 막은 바이브코딩 가이드",
      "AI가 주관식 질문을 던지고 채점해 DB에 남기는 학습 코치 (과목별 네 건)"
    ],
    metrics: [],
    resultNote: "",
    stack: ["Python", "Spring Boot · Vue", "GitHub Actions", "프롬프트 설계"]
  }
];

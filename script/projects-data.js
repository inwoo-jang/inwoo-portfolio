/* ==========================================================
   script/projects-data.js — Quick View 카드·요약용 데이터
   - 상세 본문의 원본은 portfolio.html의 연습장 장(<article class="note__page">)이다.
   - id는 각 장의 data-project-gallery 값과 같다(연습장 장과 연결하는 키).
   - 기준 자료: 포트폴리오_전체_프로젝트_소재집_20261106 + 최신 팩트시트 정정.
     본문에 적힌 사실에서만 가져오고, 새 수치·역할을 추가하지 않는다.
   - metrics[].scope: 팀 결과·목표·추정·본인 확인 기록처럼 맥락이 필요한 수치에 반드시 적는다.
   - 기획/구현, 테스트/운영, 팀 성과/개인 기여를 role·scope에서 구분한다.
   ========================================================== */
window.PROJECT_TYPES = ["Product", "Operations", "AI Engineering", "Frontend", "Backend", "Tool"];

window.PROJECTS = [
  /* ---------- 실무 — 지킴컴퍼니 ---------- */
  {
    id: "order-sync",
    status: "운영 적용",
    statusKind: "live",
    image: "media/portfolio/order-sync-diagram.svg",
    imageAlt: "주문·상품 단위와 박스 단위를 연결하는 구조 설명도(직접 작성)",
    book: "work",
    title: "의약품 도매몰 주문·박스 상태 연동",
    scope: "(주)지킴컴퍼니 · 운영 적용",
    period: "2026.01–02",
    types: ["Product", "Operations"],
    overview: "외부 도매몰 주문과 내부 박스 단위 운영을 잇는 연동 정책을 기획하고 데이터를 대조해 검증.",
    problem: "담당자가 도매몰 주문을 Excel로 내려받아 어드민에 직접 입력했습니다. 도매몰은 주문·상품 단위, 내부는 박스 단위라 부분 수거·수거 연기 때 상태와 배송정보가 어긋났습니다.",
    role: "API 정의서 검토, 매핑·상태 정책 기획, API 호출 결과 대조와 QA 등록. 구현은 개발팀",
    build: [
      "외부 주문번호·상품 정보를 내부 박스 식별자와 연결하는 기준",
      "부분 수거·수거 연기를 별도 상태로 구분하고 도매몰의 ‘부분배송’ 상태에 대응",
      "양쪽 데이터를 대조해 시간 경계의 주문 누락, 첫 박스에만 배송정보가 적용되는 오류를 찾아 전달"
    ],
    metrics: [
      { value: "약 1시간 → 10분", label: "담당자의 주문 수기 입력 업무(하루)", scope: "해당 업무 한정 · 본인 확인 기록" }
    ],
    resultNote: "부분 수거 건이 정산에 반영되고 상태 불일치 문의가 줄었습니다(본인 확인 기준).",
    stack: ["API 정의서 검토", "상태 정책", "데이터 대조", "QA"]
  },
  {
    id: "payroll",
    image: "media/portfolio/payroll-slip.jpg",
    imageAlt: "급여명세서 화면 예시(회사 공개 소개 이미지, 예시 데이터)",
    status: "내부 사용 · 시범 운영",
    statusKind: "live",
    headline: "쓰이지 않던 기능을 실제 사용까지",
    headlineScope: "계산 기준 재정의 · 담당자 교육",
    book: "work",
    title: "급여명세서 서비스 기획",
    scope: "(주)지킴컴퍼니 · 내부 사용·고객 시범 운영",
    period: "2025.12–2026.05",
    types: ["Product"],
    overview: "실제 신고 기준에 맞춘 급여 계산 기준을 정의해 쓰이지 않던 급여명세서 기능을 다시 기획.",
    problem: "기존 기능은 계산이 맞지 않아 쓰이지 않았고, 담당자는 세후 금액을 보며 입력값을 맞춰 작성했습니다. 담당자가 바뀌면 산정 기준이 남지 않았습니다.",
    role: "계산 기준·정책·데이터 필드·화면 기획, 개발 테스트, 담당자 교육. 구현은 개발팀",
    build: [
      "약 30개 거래처의 기장을 직접 해 보며 계산 규칙과 예외 정리",
      "급여 유형별 시나리오로 세무 프로그램(위하고) 결과와 계산식을 대조",
      "Excel 계산 로직을 Google Apps Script 기준 코드로 옮겨 개발팀에 전달"
    ],
    metrics: [],
    resultNote: "설명·가이드 전달 후 내부에서 실제 급여 계산에 쓰이기 시작했고 고객 시범 운영까지 확인했습니다. 시범 운영 단계에서 퇴사했습니다.",
    stack: ["계산 기준 정의", "위하고 대조", "Apps Script", "현업 적용"]
  },
  {
    id: "samil",
    status: "베타 테스트 단계",
    statusKind: "other",
    headline: "답할 것과 넘길 것의 경계",
    headlineScope: "AI 서비스 정책 · 예외 처리",
    book: "work",
    title: "약국 AI 세무 상담 — 삼일회계법인 협업",
    scope: "(주)지킴컴퍼니 · 베타 테스트 단계",
    period: "2026.01–06",
    types: ["Product", "AI Engineering"],
    overview: "약국 운영자의 세무·노무·행정 질문에 답하는 AI 상담의 화면과 서비스 정책 기획.",
    problem: "모델이 답할 질문과 전문가에게 넘길 질문의 경계, 답하지 못할 때의 다음 행동이 필요했습니다.",
    role: "화면·서비스 정책, 상담 자료·Q&A 검토, 협력사 협의. 모델·Q&A DB·API는 협력사",
    build: [
      "범위 밖 질문·응답 불가·시스템 오류를 구분하고 경우별 안내와 전문가 연결 정의",
      "FAQ를 먼저 쓰고 없으면 기존 생성 방식으로 잇는 방안을 협력사와 합의",
      "근거 조문 표시, 면책 고지, 대화 이력·북마크 보관 정책, 토큰 사용량 상한 요구사항"
    ],
    metrics: [],
    resultNote: "베타 테스트에 참여해 FAQ 응답을 확인했고, 베타 단계에서 퇴사했습니다.",
    stack: ["AI 서비스 정책", "예외 처리", "외부 협업", "화면 설계"]
  },
  {
    id: "pharmacy-link",
    status: "운영 적용",
    statusKind: "live",
    headline: "기관 연결을 인증 방식별로",
    headlineScope: "연결 흐름 · 예외 정의",
    book: "work",
    title: "약국가계부 연결 흐름 개선 · 제휴 사이트 연동",
    scope: "(주)지킴컴퍼니 · 운영 적용",
    period: "2024.10–2026.06 중",
    types: ["Product", "Operations"],
    overview: "기관별로 따로 하던 연결을 인증 방식에 따라 정리하고, 제휴 사이트 안에서 리포트를 보이게 기획.",
    problem: "원격지원에서 약국이 홈택스·여신금융·요양기관·4대보험을 각각 따로 연결해야 하는 불편을 확인했습니다.",
    role: "연결 흐름·예외 기획, 운영 확인. 인증 기능 개발·보안 설계는 하지 않음",
    build: [
      "홈택스·요양기관·4대보험은 인증서 하나로, 여신금융은 별도 계정 연결로 구분",
      "홈택스 인증서가 맞지 않는 경우의 예외 정의",
      "제휴사 웹사이트에서 손익리포트·청구정보를 보는 iframe 연동 기획"
    ],
    metrics: [],
    resultNote: "개선한 연결 흐름과 iframe 연동이 실제 서비스에 반영됐습니다.",
    stack: ["연결 흐름", "예외 정의", "제휴 연동", "원격지원"]
  },
  {
    id: "rx-ops",
    status: "현장 운영",
    statusKind: "live",
    book: "work",
    title: "처방전 보관 서비스 운영 · 스캔센터",
    scope: "(주)지킴컴퍼니",
    period: "2024.10–2026.06 중",
    types: ["Operations"],
    overview: "처방전 수거·스캔·보관 업무의 반복 작업 자동화를 기획하고, 새로 연 스캔센터를 운영.",
    problem: "주문·수거·스캔·보관 단계에서 같은 박스를 추적하기 어려웠고, 스캔 업로드가 주문번호와 어긋나는 경우가 있었습니다.",
    role: "운영 자동화 기획(구현은 개발팀), 스캔센터 운영·작업 기준 수립",
    build: [
      "송장번호 매칭·수거접수·발주 리스트 자동화 기획",
      "송장에 주문번호가 들어가도록 데이터 필드 수정, 박스 라벨 도입",
      "목표 작업량·체크리스트·입출고 기준·매뉴얼, 작업 배치·교육·품질관리"
    ],
    metrics: [
      { value: "10명 · 하루 약 15만 장", label: "운영 당시 스캔센터 규모", scope: "서비스 규모 · 본인이 늘린 처리량 아님" }
    ],
    resultNote: "",
    stack: ["운영 자동화", "현장 운영", "작업 기준", "물류 체계"]
  },
  {
    id: "jikim-etc",
    status: "기획",
    statusKind: "other",
    headline: "사업자번호 없는 고객부터",
    headlineScope: "종합소득세 · 거래처 · 수임예정 고객",
    book: "work",
    title: "그 밖의 기획 — 종합소득세 · 거래처 · 수임예정 고객",
    scope: "(주)지킴컴퍼니",
    period: "2025–2026",
    types: ["Product"],
    overview: "홈택스 API 응답 매핑, 거래처 상태 관리, 사업자번호 없는 수임예정 고객 관리 기획.",
    problem: "거래처 현황을 여러 사람이 Excel로 함께 고치다 변경이 누락됐고, 계약 준비는 사업자번호가 생기기 전부터 시작됐습니다.",
    role: "기획·ERD 검토. 구현은 개발팀. 수임예정 고객·CMS는 기획·디자인 검토까지",
    build: [
      "홈택스 API 응답 항목을 내부 데이터 구조와 소득유형별 계산 흐름에 연결",
      "사업자 유형·업종·단계별 항목 정리, 역할별 권한·데이터 분리, 백엔드 ERD 대조",
      "입력·출력·API 규격·정책·예외를 나눈 명세 양식"
    ],
    metrics: [],
    resultNote: "개발자와 디자이너에게 “구현 중에 판단해야 할 것들이 문서에 정리되어 있어 편하다”는 말을 들었습니다.",
    stack: ["API 응답 매핑", "권한·데이터 분리", "ERD 검토", "명세 양식"]
  },

  /* ---------- SKALA 교육 과정 ---------- */
  {
    id: "taxdesk",
    image: "media/portfolio/taxdesk-answer.png",
    imageAlt: "근거 조문과 도구 호출을 함께 보여 주는 세무상담 응답 화면(가상 고객)",
    status: "교육 실습",
    statusKind: "edu",
    headline: "숫자는 코드가 계산",
    headlineScope: "RAG + Tool Calling · Spring AI",
    book: "skala",
    title: "SKALA증권 세무상담 데스크",
    scope: "교육 실습 · 1인",
    period: "2026.08",
    types: ["AI Engineering", "Backend"],
    overview: "가상 증권사 고객의 배당·이자소득 세금 상담 AI. 회사에서 정한 답변 범위 정책이 코드에서 어떻게 지켜지는지 직접 만들어 봄.",
    problem: "상담 답변에는 법령 근거와 세액 계산이 함께 필요한데, 모델이 숫자를 추측하면 근거와 계산이 어긋납니다.",
    role: "1인 설계·구현·검증(AI 코딩 도구 활용)",
    build: [
      "법령 근거는 RAG, 세액은 Tool Calling으로 계산 코드가 맡아 숫자를 모델이 만들지 않게 함",
      "세법 문서 9종을 조문 경계로 잘라 청크 39개, 조문 번호를 실어 인용",
      "범위 밖 질문은 규칙·모델 2단 라우팅으로 응답 생성 전에 안내"
    ],
    metrics: [
      { value: "6 / 7", label: "계산 코드에 넣은 오류 중 테스트가 검출한 종류", scope: "오류 주입은 AI 코딩 도구가 수행" }
    ],
    resultNote: "세법 원문과 대조해 적용 연도가 다른 배당 가산율(11% → 10%)을 고쳤습니다. 운영 서비스는 아닙니다.",
    stack: ["Java", "Spring Boot", "Spring AI", "RAG", "Tool Calling"]
  },
  {
    id: "gtsrb",
    image: "media/portfolio/gtsrb-tradeoff.png",
    imageAlt: "후보 모델별 정확도와 파라미터 수 비교 그래프",
    status: "교육 과제",
    statusKind: "edu",
    book: "skala",
    title: "차량용 교통표지판 인식 모델 경량화",
    scope: "교육 과제 · 2인",
    period: "2026.09",
    types: ["AI Engineering"],
    overview: "GTSRB 43클래스 표지판 인식 모델을 차량 탑재 기준으로 경량화.",
    problem: "정확도는 이미 98.5%였습니다. 과제가 제시한 방향 중 경량화를 골랐습니다. 차량에서는 여러 인식 모듈이 메모리를 함께 쓰기 때문입니다.",
    role: "경량화 방향 선택, 개인 실험, 팀 결과 대조, 발표",
    build: [
      "파라미터의 96%를 차지하는 연결층을 확인하고 이를 줄이는 후보 비교",
      "통제 실험 21종을 시드 3개로 비교",
      "연속 촬영 묶음 888개가 학습·검증에 걸친 것을 확인, Test는 후보 선택 점수로 쓰지 않음"
    ],
    metrics: [
      { value: "8.33MB → 2.10MB", label: "모델 크기" },
      { value: "0.09%p", label: "최종 후보 두 개(4.12MB·2.10MB)의 Valid 정확도 차이", scope: "시드 변동폭과 비슷한 수준" }
    ],
    resultNote: "한 장씩 추론하면 작은 모델이 오히려 느렸고 배치로는 빨랐습니다. 야간·역광·우천은 미검증 항목으로 명시했습니다.",
    stack: ["PyTorch", "CNN", "모델 경량화", "실험 설계"]
  },
  {
    id: "edu-up",
    image: "media/portfolio/eduup-home.png",
    imageAlt: "EDU:UP 메인 화면 — 맞춤 추천 강의와 도서(모의 데이터)",
    status: "교육 실습",
    statusKind: "edu",
    headline: "Gateway 하나로 5개 서비스",
    headlineScope: "4인 팀 · 프론트엔드",
    book: "skala",
    title: "EDU:UP — 교육복지포인트 플랫폼",
    scope: "교육 실습 · 4인 팀 · 프론트엔드",
    period: "2026.08",
    types: ["Frontend"],
    overview: "직무·관심 분야를 한 번 답하면 강의 2개·도서 2권을 추천하고 신청까지 잇는 교육복지포인트 플랫폼.",
    problem: "목록이 수백 개라 고르기가 부담이 되어 미루다 분기 말에 포인트가 소멸됩니다.",
    role: "프론트엔드, 문제 정의·PM 문서 지원. 서버와 MSA 구조는 팀원(제공 템플릿)",
    build: [
      "Gateway 한 곳을 통해 다섯 개 서비스를 화면에 연결",
      "신청 상태를 접수(PENDING)·확정(ACTIVE)으로 나누고 결과 모름과 실패를 다르게 표시",
      "추천 실패 시 2단계 대체 화면, 신청 중 버튼을 막아 화면의 중복 신청 방지"
    ],
    metrics: [],
    resultNote: "포인트 잔액은 모의 데이터였고, 동시 신청·이중 차감 검증과 취소 처리는 다음 스프린트 범위로 남겼습니다.",
    stack: ["Vue 3", "프론트엔드", "MSA 실습", "Agile · Scrum"]
  },
  {
    id: "relationship-design",
    status: "교육 · 프로토타입",
    statusKind: "edu",
    image: "media/portfolio/gwangyebu-uiflow.png",
    imageAlt: "관계부 화면 11개의 이동 흐름도",
    book: "skala",
    title: "관계부 — 기능·화면·ERD·API 설계",
    scope: "교육 미니프로젝트 · 1인 · 3일",
    period: "2026.09",
    types: ["Product", "Frontend"],
    overview: "직접 쓰던 관계부를 과제로 다시 설계하고, Vue 3 프로토타입으로 흐름을 확인.",
    problem: "페인 포인트와 기능을 맞춰 보니 AI 관계 분석, 카톡 가져오기, 리마인더는 연결되는 곳이 없었습니다. 기록과 조회면 충분해서 뺐습니다.",
    role: "1인 설계 + 프론트엔드 프로토타입(목업 API). 서버·DB는 설계 문서까지",
    build: [
      "API마다 호출 화면을 적고, 저장하지 않는 표시값은 따로 정리",
      "중복 입력은 화면·DB 두 겹, 타인 기록은 404로 설계하고 목업 API로 동작 확인",
      "Vue 3로 화면 10개 구현"
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

  /* ---------- 팀 ---------- */
  {
    id: "quiket",
    status: "출시 후 운영 중단",
    statusKind: "other",
    image: "media/portfolio/quiket-card.png",
    imageAlt: "App Store에 출시된 퀴켓 소개 화면",
    book: "team",
    title: "퀴켓 — AI 퀴즈 학습 앱",
    scope: "사이드 프로젝트 · 7인 팀 · PM",
    period: "2026.03–07",
    types: ["Product"],
    overview: "공부 자료를 올리면 AI가 문제를 만들고 오답을 다시 풀게 하는 학습 앱.",
    problem: "학습자는 강의 노트·필기를 복습 문제로 바꾸는 데 부담이 있었습니다. 출시 과정에서는 개발자 4명·디자이너 2명의 일정 안에서 첫 출시 범위를 정해야 했습니다.",
    role: "PM·기획·사용자 테스트, 검증용 미니 버전 직접 구현. 정식 앱 구현은 개발팀",
    build: [
      "미니 버전으로 짧은 자료에서 문항이 과도하게 생성되는 것을 확인해 입력 분량별 문항 수 기준을 정함",
      "MoSCoW 우선순위를 PRD·와이어프레임·명세·스프린트에 같은 기준으로 적용",
      "준비 안 된 메뉴는 컨셉에 맞는 대기 안내로 처리, 데이터 구조는 설계대로 남김"
    ],
    metrics: [
      { value: "2026.07.10", label: "App Store 출시 (Google Play 함께 출시)", scope: "7인 팀 결과 · 정식 앱은 개발팀 구현" },
      { value: "12건 · 2회", label: "사용자 인터뷰 · 사용자 테스트" }
    ],
    resultNote: "동아리 PM MVP로 선정됐습니다. 출시 후 팀원들의 재직 상황으로 현재는 서버 운영을 중단했습니다.",
    stack: ["기획", "사용자 조사", "Next.js · Gemini (미니 버전)"]
  },
  {
    id: "archivelink",
    image: "media/portfolio/qlink-web.png",
    imageAlt: "에이링크 웹 프로토타입 화면(샘플 링크)",
    status: "프로토타입",
    statusKind: "other",
    headline: "분석 실패를 기본 흐름으로",
    headlineScope: "2인 팀 · 미출시",
    book: "team",
    title: "에이링크 — AI 링크·QR 북마크",
    scope: "2인 팀 · 미출시 프로토타입",
    period: "2026.05–06",
    types: ["Product", "Frontend"],
    overview: "링크를 넣으면 AI가 폴더·이름·설명·태그를 채우는 북마크 서비스 프로토타입.",
    problem: "로그인 벽과 봇 차단으로 AI가 읽지 못하는 링크가 많았습니다. 자동 분류 실패를 예외로만 두면 사용자가 그 자리에서 막힙니다.",
    role: "기획 전반 + 프론트엔드 프로토타입. 서버·DB·인프라는 팀 백엔드 개발자",
    build: [
      "분석하지 못한 링크도 사용자가 직접 입력해 저장하는 흐름을 기본으로 설계",
      "프로토타입을 먼저 배포해 요구사항 기준으로 고정한 뒤 React·TypeScript로 이관"
    ],
    metrics: [],
    resultNote: "미출시 프로토타입이며 링크에서 직접 눌러 볼 수 있습니다.",
    stack: ["React", "TypeScript", "PWA", "AI 자동 분류"]
  },
  {
    id: "dacon",
    status: "대회 종료",
    statusKind: "other",
    book: "team",
    title: "데이콘 블랙박스 대회 — 재촬영 판별 실험 · 라벨링 도구",
    scope: "팀 참가 · 대회",
    period: "2026.08–09",
    types: ["AI Engineering", "Tool"],
    overview: "주행 영상 3단계 분석 대회. Stage 1 재촬영 판별 실험과 팀 라벨링 도구를 맡음.",
    problem: "합성 데이터로 학습한 모델이 직접 수집한 실촬영 재촬영 13건을 모두 놓쳤고, 팀원은 인당 1,000건 넘는 라벨링을 손으로 해야 했습니다.",
    role: "Stage 1 실험, 라벨링 도구 제작(AI 코딩 도구 활용). 팀 학습 인프라는 팀원",
    build: [
      "합성 학습셋 836건 중 336건이 평가용 원본에서 파생된 누출임을 찾아 제거",
      "딥러닝 대신 영상 포렌식 피처 + 로지스틱 회귀로 전환",
      "키보드 판정·±7프레임 미세 조정·CSV 이어하기 라벨링 도구, AI 초벌 라벨은 참고 표시만"
    ],
    metrics: [
      { value: "320팀 중 24위", label: "대회 최종 순위", scope: "팀 결과 · 개인 제출 중간 순위는 16위" },
      { value: "20~30초", label: "클립당 판정 목표", scope: "설계 목표 · 실측 아님" }
    ],
    resultNote: "",
    stack: ["Python", "OpenCV", "데이터 누출 점검", "키보드 UX"]
  },

  /* ---------- 개인 ---------- */
  {
    id: "marketdesk",
    status: "개인 사용",
    statusKind: "other",
    headline: "목적별 리포트 요약",
    headlineScope: "태스크 46개 · 결정 기록 15건",
    book: "solo",
    title: "마켓데스크 — AI 리포트 분석·종목 관리",
    scope: "개인 사용(미출시)",
    period: "2026.06–진행 중",
    types: ["AI Engineering", "Backend"],
    overview: "읽는 목적(렌즈)별로 리포트를 AI가 구조화 요약하고 산업별 흐름으로 쌓는 도구.",
    problem: "리포트 한 편도 길어 읽기 힘들었고, 산업 리포트와 기업 리포트가 연결되지 않아 흐름으로 이어지지 않았습니다.",
    role: "1인 기획·AI 활용 구현·화면 검증",
    build: [
      "태스크를 목적·범위·예외·테스트·완료 기준으로 쓰고, AI 구현 후 화면에서 다시 확인",
      "API 서버와 파싱 워커를 분리해 큐로 연결, SHA-256 중복 차단·SimHash 유사본 탐지",
      "발간일을 업로드일로 채우던 문제를 찾아 모르는 값은 직접 입력하도록 수정"
    ],
    metrics: [],
    resultNote: "숫자를 인용 페이지와 대조하는 함수는 만들었지만 아직 업로드 흐름에는 연결하지 않았습니다.",
    stack: ["Next.js", "Hono", "PostgreSQL", "큐 · 워커 분리"]
  },
  {
    id: "triage",
    status: "데모",
    statusKind: "other",
    image: "media/portfolio/demo-triage.png",
    imageAlt: "트리아지 어드민 데모 첫 화면",
    book: "solo",
    title: "일경험 운영 트리아지 어드민",
    scope: "AX 해커톤 개인 참가 · 데모",
    period: "2026.06",
    types: ["Product", "AI Engineering"],
    overview: "참여자 출결 점검 우선순위를 정렬하는 운영 어드민 데모.",
    problem: "운영자 한 명이 참여자 300명의 8주치 출결을 수기로 점검하는 시나리오를 바탕으로 했습니다.",
    role: "6시간 안에 기획·데모 구현·발표",
    build: [
      "“지금 개입하면 추가로 지킬 수 있는 수당”을 개입가치로 정의해 점검 대상을 자동 정렬",
      "남은 주차 출석을 넣으면 수당이 재계산되는 What-if 시뮬레이터",
      "계산과 임계 판정은 코드, 요약·안내 문구는 AI, 최종 확정은 사람"
    ],
    metrics: [
      { value: "15~25시간", label: "수기 점검 규모 (300명 × 건당 3~5분)", scope: "문제 규모 추정 · 실측 아님" }
    ],
    resultNote: "",
    stack: ["Python", "프롬프트 설계", "역할 분리"]
  },
  {
    id: "classtrack",
    status: "배포 실습",
    statusKind: "other",
    headline: "종료일 없이 규칙으로 계산",
    headlineScope: "Spring Boot · Vue 3",
    book: "solo",
    title: "ClassTrack — 강의·과제 추적 웹앱",
    scope: "구현·배포 실습",
    period: "2026.08",
    types: ["Backend", "Frontend"],
    overview: "듣고 있는 강의와 과제, 결과물 링크를 한곳에서 추적하는 웹앱.",
    problem: "화면·서버·데이터를 직접 연결하고 컨테이너 기반 배포를 실습하는 것이 목표였습니다.",
    role: "1인 설계·구현·배포 실습",
    build: [
      "수업일 캘린더를 종료일 저장 없이 규칙으로 계산",
      "API·서비스·DB 구조와 로그를 보는 dev 화면",
      "AOP 로깅, 비동기 링크 검증, 멀티스테이지 빌드"
    ],
    metrics: [],
    resultNote: "1인으로 배포 실습까지 진행했습니다. 지금은 배포 주소가 열리지 않습니다(2026-11 확인).",
    stack: ["Spring Boot", "Vue 3", "AOP", "Docker"]
  },
  {
    id: "relationship",
    status: "개인 사용",
    statusKind: "other",
    headline: "사람별 기록과 AI 요약",
    headlineScope: "개인 앱 · 미출시",
    book: "solo",
    title: "관계부 — 관계 기록·AI 분석",
    scope: "개인 사용(미출시)",
    period: "2026.05–",
    types: ["Frontend"],
    overview: "사람마다 필요한 정보를 한곳에 기록하고, 카톡 대화를 AI가 날짜별로 요약하는 앱.",
    problem: "인물별 연락·경조사·선물 기록을 놓치지 않고 한곳에 남기고 싶었습니다.",
    role: "1인 개발",
    build: [
      "인물 카드 — MBTI·인스타·명함·못 먹는 음식 등 자유 메모",
      "경조사비·빌려준 돈 기록과 잔액 계산",
      "AI 관계 분석, 연락 리마인더·경조사 D-day 알림"
    ],
    metrics: [],
    resultNote: "직접 쓰려고 만든 앱이며 출시하지 않았습니다. 개인 기록이 담긴 앱이라 화면은 싣지 않았습니다.",
    stack: ["Next.js", "Supabase", "Capacitor", "Claude · Gemini API"]
  },
  {
    id: "personal-tools",
    status: "개인 사용",
    statusKind: "other",
    image: "media/portfolio/demo-vibe.png",
    imageAlt: "바이브코딩 가이드 첫 화면",
    book: "solo",
    title: "개인용 툴",
    scope: "작은 도구",
    period: "2026",
    types: ["Tool"],
    overview: "템플릿 허브, 메일 요약봇, 바이브코딩 가이드, 학습용 AI 코치 웹앱.",
    problem: "반복해서 확인하던 일을 줄이고, AI 결과물이 매번 같게 나오도록 만들고 싶었습니다.",
    role: "1인 제작(AI 코딩 도구 활용)",
    build: [
      "템플릿을 고르면 AI에 줄 프롬프트를 만들어 주는 허브",
      "메일을 수집해 중요도별로 요약하고 Discord로 보내는 봇",
      "API 키는 서버리스 함수에서만 쓰고 빌드 전 키 유출 검사를 거치는 바이브코딩 가이드"
    ],
    metrics: [],
    resultNote: "템플릿 허브와 바이브코딩 가이드는 공개 주소에서 열립니다(2026-11 확인). 메일 요약봇이 지금도 자동 실행되는지는 확인하지 않았습니다.",
    stack: ["Python", "Spring Boot · Vue", "GitHub Actions", "프롬프트 설계"]
  }
];

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
/* 내 역할 키워드 — 기획 / 프로덕트 매니징 / 엔지니어링 구분 */
window.PROJECT_ROLES = ["기획", "PM", "프론트엔드", "백엔드", "풀스택 개발", "AI 엔지니어링"];

/* 먼저 볼 프로젝트 — 프로젝트명 → 내가 한 핵심 판단 → 결과·현재 상태.
   홈(index.html)의 대표 프로젝트와 같은 순서·문장을 쓴다. */
window.FEATURED = [
  {
    id: "order-sync",
    decision: "주문번호와 상품 순번으로 처리 대상을 식별해 내부 박스와 연결하고, 부분 수거·수거 연기 기준을 정했습니다.",
    result: "해당 수기 입력 하루 약 1시간 → 10분(본인 확인 기록) · 구현 후 양쪽 데이터를 대조해 오류 2건 QA 전달",
    split: "연동 정책·데이터 대조·QA: 본인 · 구현: 개발팀"
  },
  {
    id: "payroll",
    decision: "급여 유형별 계산 기준과 예외를 정리하고, 세무 프로그램 결과와 대조해 기준 코드로 개발팀에 전달했습니다.",
    result: "내부 실제 급여 계산에 사용 · 고객 시범 운영 단계에서 퇴사",
    split: "기획·기준 검증: 본인 · 구현: 개발팀"
  },
  {
    id: "quiket",
    decision: "7인 팀 PM으로 첫 출시 범위를 조율하고, 사용자 테스트 의견을 반영해 과목명 입력 → 자료 업로드 → AI가 나눈 챕터·파트 확인·수정 흐름으로 바꿨습니다.",
    result: "App Store·Google Play 출시(팀 결과) · 바뀐 흐름은 내부 QA로 확인 · 현재 서버 운영 중단",
    split: "PM·기획·사용자 테스트: 본인 · 정식 앱 구현: 개발팀"
  },
  {
    id: "taxdesk",
    decision: "서버가 소득 조회·과세 판정·계산 순서를 제어하고, 모델은 질문 분류와 답변 설명에만 썼습니다. 확인되지 않은 소득은 계산하지 않고 되묻습니다.",
    result: "8월 실패 사례(0원 가정 세액)를 고친 뒤 같은 위험 조건에서 되묻기 확인 · 세무 전문가 검토 전 데모",
    split: "1인 설계 · AI 코딩 도구를 활용한 구현·검증"
  }
];

window.PROJECTS = [
  /* ---------- 실무 — 지킴컴퍼니 ---------- */
  {
    id: "order-sync",
    roles: ["기획", "PM"],
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
    role: "연동 정책 기획·데이터 대조·QA(본인) · 구현: 개발팀",
    build: [
      "주문번호와 상품 순번(주문 안의 상품 항목)으로 처리 대상을 식별해 내부 박스와 연결하는 기준",
      "부분 수거·수거 연기를 별도 상태로 구분하고 도매몰의 ‘부분배송’ 상태에 대응",
      "양쪽 데이터를 대조해 시간 경계의 주문 누락, 첫 박스에만 배송정보가 적용되는 오류를 찾아 전달"
    ],
    metrics: [
      { value: "약 1시간 → 10분", label: "담당자의 주문 수기 입력 업무(하루)", scope: "해당 업무 한정 · 본인 확인 기록" }
    ],
    resultNote: "부분 수거 건이 정산에 반영되고 상태 불일치 문의가 줄었습니다(본인 확인 기준).",
    summary: {
      problem: "외부 주문을 내부 시스템에 다시 입력해야 했고, 외부 주문·상품과 내부 박스의 처리 단위가 달라 부분 수거·수거 연기 때 상태와 배송정보가 어긋났습니다.",
      decision: "주문번호와 상품 순번으로 처리 대상을 식별해 내부 박스와 연결하고, 부분 수거는 도매몰의 ‘부분배송’ 상태에, 수거 연기는 별도 상태로 대응하는 기준을 정했습니다.",
      result: "구현 후 양쪽 데이터를 대조해 시간 경계의 주문 누락, 첫 박스에만 배송정보가 적용되는 오류를 QA로 전달했습니다."
    },
    stack: ["API 정의서 검토", "상태 정책", "데이터 대조", "QA"]
  },
  {
    id: "payroll",
    roles: ["기획", "PM"],
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
    role: "계산 기준·정책·화면 기획, 기준 검증, 담당자 교육(본인) · 구현: 개발팀",
    build: [
      "약 30개 거래처의 기장을 직접 해 보며 계산 규칙과 예외 정리",
      "급여 유형별 시나리오로 세무 프로그램(위하고) 결과와 계산식을 대조",
      "Excel 계산 로직을 Google Apps Script 기준 코드로 옮겨 개발팀에 전달"
    ],
    metrics: [],
    resultNote: "설명·가이드 전달 후 내부에서 실제 급여 계산에 쓰이기 시작했고 고객 시범 운영까지 확인했습니다. 시범 운영 단계에서 퇴사했습니다.",
    summary: {
      problem: "기존 급여명세서 기능은 계산이 맞지 않아 쓰이지 않았고, 담당자는 세후 금액을 보며 입력값을 맞춰 작성했습니다. 담당자가 바뀌면 산정 기준이 남지 않았습니다.",
      decision: "약 30개 거래처의 기장을 직접 하며 급여 유형별 계산 기준과 예외를 정리하고, 시나리오별로 세무 프로그램(위하고) 결과와 대조한 뒤 Apps Script 기준 코드로 개발팀에 전달했습니다.",
      result: "계산 기준 설명과 사용 가이드를 전달한 뒤 내부 실제 급여 계산에 쓰이기 시작했고, 고객 시범 운영까지 확인했습니다. 시범 운영 단계에서 퇴사했습니다."
    },
    stack: ["계산 기준 정의", "위하고 대조", "Apps Script", "현업 적용"]
  },
  {
    id: "samil",
    image: "media/portfolio/jikim-tile-samil.jpg",
    imageAlt: "지킴 로고",
    roles: ["기획", "PM"],
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
      "튜닝 전에 FAQ를 RAG로 먼저 활용해 응답 흐름을 확인하는 방향을 협력사와 협의",
      "범위 밖 질문·응답 불가·시스템 오류를 구분하고 경우별 안내와 전문가 연결 정의",
      "근거 조문 표시, 면책 고지, 대화 이력·북마크 보관 정책, 토큰 사용량 상한 요구사항"
    ],
    metrics: [],
    resultNote: "베타 테스트에 참여해 FAQ 응답을 확인했고, 베타 단계에서 퇴사했습니다.",
    summary: {
      problem: "기존 모델을 빠르게 적용할 수 있을 것으로 예상했지만, 협력사는 튜닝에 한 달 이상이 필요하다고 안내했습니다. 어떤 데이터가 효과적일지도 정해지지 않았습니다.",
      role: "화면·답변 정책, 상담 자료 정리·제공과 Q&A 검토, 협력사 협의, 베타 확인. 모델·Q&A DB·API는 협력 회계법인이 맡았습니다.",
      decision: "바로 준비할 수 있는 FAQ를 RAG로 먼저 활용해 응답 흐름을 확인하고, 필요하면 튜닝하는 방향을 협력사와 협의했습니다. 상담 음성자료는 수집·정제·분류가 필요해 1차 확인 뒤 고도화 단계에서 쓰자고 제안했습니다(제안 단계).",
      result: "베타에서 일부 FAQ 질문에 10초 이내로 답하는 것을 직접 확인했습니다(일부 질문의 관찰값). 베타 단계에서 퇴사해 정식 운영 성과는 확인하지 못했습니다."
    },
    related: ["taxdesk"],
    stack: ["AI 서비스 정책", "예외 처리", "외부 협업", "화면 설계"]
  },
  {
    id: "pharmacy-link",
    image: "media/portfolio/jikim-home-card.jpg",
    imageAlt: "지킴 앱 홈 화면 — 약국 가계부와 손익",
    roles: ["기획", "PM"],
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
    image: "media/portfolio/jikim-rx-card.jpg",
    imageAlt: "지킴 앱 처방전 자동입력 화면(환자 정보 흐림 처리)",
    roles: ["기획", "PM"],
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
    id: "income-tax",
    image: "media/portfolio/jikim-tile-tax.jpg",
    imageAlt: "지킴 로고",
    roles: ["기획", "PM"],
    status: "운영 적용 · 홍보용",
    statusKind: "live",
    book: "work",
    title: "종합소득세 예측 기획",
    scope: "(주)지킴컴퍼니",
    period: "2025.01–03",
    types: ["Product"],
    overview: "홈택스 API 응답을 내부 데이터 구조와 소득유형별 계산 흐름에 연결한 종합소득세 예측 기능 기획.",
    problem: "홈택스 API로 받은 항목을 내부 데이터와 소득유형별 계산 흐름에 맞게 연결해야 했습니다.",
    role: "기획. 구현은 개발팀",
    build: [
      "홈택스 API 응답 항목을 내부 데이터 구조에 연결",
      "소득유형별 계산 흐름과 화면 표시 항목 정리",
      "각 필드와 계산 결과의 의미를 개발자·디자이너에게 설명"
    ],
    metrics: [],
    resultNote: "실제 서비스에 적용해 홍보용 기능으로 운영했습니다.",
    stack: ["홈택스 API", "API 응답 매핑", "계산 흐름 정리"]
  },
  {
    id: "client-contract",
    image: "media/portfolio/jikim-tile-client.jpg",
    imageAlt: "지킴 로고",
    roles: ["기획", "PM"],
    status: "기획 · 디자인",
    statusKind: "other",
    headline: "사업자번호 없는 고객부터",
    headlineScope: "거래처 관리 · 수임계약",
    book: "work",
    title: "거래처 관리 개선 · 수임계약 자동화",
    scope: "(주)지킴컴퍼니",
    period: "2025–2026.06",
    types: ["Product"],
    overview: "거래처 상태 관리와, 사업자번호가 없는 수임예정 고객부터 계약·CMS 결제로 이어지는 흐름 기획.",
    problem: "거래처 현황을 여러 사람이 Excel로 함께 고치다 변경이 누락됐고, 계약 준비는 사업자번호가 생기기 전부터 시작됐습니다.",
    role: "기획·ERD 검토, 디자인 반영까지",
    build: [
      "사업자 유형·업종·단계별 추적 항목 정리, 역할별 권한·데이터 분리, 백엔드 ERD 대조",
      "사업자번호 없는 수임예정 고객을 별도 리스트로 관리, CMS 결제 연결까지 기획",
      "입력·출력·API 규격·정책·예외를 나눈 명세 양식"
    ],
    metrics: [],
    resultNote: "개발자와 디자이너에게 “구현 중에 판단해야 할 것들이 문서에 정리되어 있어 편하다”는 말을 들었습니다.",
    stack: ["권한·데이터 분리", "ERD 검토", "CMS 결제", "명세 양식"]
  },

  /* ---------- SKALA 교육 과정 ---------- */
  {
    id: "taxdesk",
    roles: ["기획", "AI 엔지니어링", "백엔드"],
    image: "media/portfolio/taxdesk-hold-2611-crop.jpg",
    imageAlt: "다른 종합소득이 확인되지 않아 세액을 계산하지 않고 소득금액을 되묻는 상담 화면(합성 데이터)",
    status: "교육 실습",
    statusKind: "edu",
    headline: "숫자는 코드가 계산",
    headlineScope: "서버 제어 흐름 · RAG · Spring AI",
    book: "skala",
    title: "TaxDesk — 금융소득 세무상담",
    scope: "교육 실습에서 시작한 개인 프로젝트 · 1인",
    period: "2026.08 구축 · 2026.11 개선",
    types: ["AI Engineering", "Backend"],
    overview: "가상 증권사(SKALA증권) 고객의 배당·이자소득 세금 상담 데모. 서버가 처리 순서를 정하고, 모델은 질문 분류와 답변 설명에 씀.",
    problem: "상담 답변에는 법령 근거와 세액 계산이 함께 필요한데, 모델이 숫자를 추측하면 근거와 계산이 어긋납니다.",
    role: "1인 설계 · AI 코딩 도구를 활용한 구현 · 검증",
    build: [
      "처리 순서는 서버가 정하고 소득 조회·과세 판정·계산은 코드가 맡아, 숫자를 모델이 만들지 않게 함",
      "확인되지 않은 값이 있으면 계산하지 않고 되묻거나 보류",
      "범위 밖 질문은 규칙으로 먼저 거절해 모델을 부르지 않음"
    ],
    metrics: [],
    resultNote: "실습용 데모이며 운영 서비스는 아닙니다.",
    summary: {
      problem: "세금 상담 답변에는 법령 근거와 세액 계산이 함께 필요합니다. 8월 수동 실험에서 다른 종합소득을 0원으로 둔 세액이 확정 답처럼 나간 사례가 있었습니다.",
      decision: "서버가 소득 조회 → 과세 판정 → 계산 순서를 제어하고, 모델에는 도구를 등록하지 않았습니다. 계산에 필요한 값이 확인되지 않으면 계산하지 않고 되묻고, 조회 실패나 근거 없음이면 판정·답변을 보류합니다.",
      result: "같은 위험 조건(종합과세 대상 + 다른 종합소득 미입력)을 다시 확인해 계산 결과 없이 소득금액을 되묻는 것을 확인했습니다(2026-11-10, 모의 모델). 판정·세액 15건은 독립 계산과 일치하지만 세무 전문가 검토 전이고, 실제 모델이 필요한 조문 인용 6건은 실행하지 않았습니다."
    },
    related: ["samil"],
    stack: ["Java", "Spring Boot", "Spring AI", "RAG", "오프라인 평가"]
  },
  {
    id: "gtsrb",
    roles: ["AI 엔지니어링"],
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
    roles: ["프론트엔드"],
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
    role: "프론트엔드(Vue 3 화면·Gateway 경유 API 연동), 스펙 충돌·백엔드 요청 문서 정리. 문제 정의(SRS)는 PM, 서버·MSA는 팀원(제공 템플릿), LLM 추천 서비스는 팀원",
    build: [
      "Gateway 한 곳을 통해 다섯 개 서비스를 화면에 연결",
      "신청 상태를 접수(PENDING)·확정(ACTIVE)으로 나누고 결과 모름과 실패를 다르게 표시",
      "추천 실패 시 2단계 대체 화면, 신청 중 버튼을 막아 화면의 중복 신청 방지"
    ],
    metrics: [],
    resultNote: "포인트 잔액은 모의 데이터였고, 동시 신청·이중 차감 검증과 취소 처리는 다음 스프린트 범위로 남겼습니다.",
    stack: ["Vue 3 · Pinia (담당)", "Spring Boot MSA (팀)", "FastAPI · LLM 추천 (팀)", "Agile · Scrum"]
  },
  {
    id: "relationship-design",
    roles: ["기획", "프론트엔드"],
    status: "교육 · 프로토타입",
    statusKind: "edu",
    image: "media/portfolio/gwangyebu-uiflow.png",
    imageAlt: "관계부 화면 11개의 이동 흐름도",
    book: "skala",
    title: "관계부 — 기능·화면·ERD·API 설계",
    scope: "교육 미니프로젝트 · 1인 · 3일",
    period: "2026.09",
    types: ["Product", "Frontend"],
    overview: "2026.05부터 직접 쓰던 관계 기록 앱을 과제로 다시 설계하고, Vue 3 프로토타입으로 흐름을 확인.",
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
    resultNote: "페인 포인트 4개 → 기능 18개 → 화면 11개 → 테이블 6개 → API 33개로 연결했습니다. 처음 만든 앱(Next.js · Supabase)은 직접 쓰려고 만든 것으로, 출시하지 않았습니다.",
    stack: ["Vue 3", "Pinia", "ERD · dbml", "OpenAPI 3"]
  },

  /* ---------- 팀 ---------- */
  {
    id: "quiket",
    roles: ["기획", "PM"],
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
    summary: {
      problem: "2차 사용자 테스트(6명, 가설 8개)에서 ‘파트’를 ‘챕터’로 바꾼 뒤에도 자료 구조를 헷갈려 했고, 자료를 먼저 올리고 제목은 나중에 정하고 싶다는 의견이 나왔습니다.",
      role: "PM·기획(IA·사용 흐름·기능명세·와이어프레임), 사용자 테스트 운영, 검증용 미니 버전 직접 구현. 정식 앱은 팀 개발자가 구현했습니다.",
      decision: "챕터 구조와 입력 순서를 우선 개선 항목으로 정했습니다. 과목명만 먼저 입력하고, 자료를 올린 뒤 AI가 나눈 챕터·파트 이름을 확인·수정하는 흐름으로 바꿨습니다.",
      result: "바뀐 흐름은 최종 내부 QA와 최종 발표 시연에서 확인했고, 변경 후 사용자 테스트는 하지 않았습니다. 팀은 App Store·Google Play에 출시했고, 현재는 서버 운영을 중단했습니다."
    },
    stack: ["기획", "사용자 조사", "Next.js · Gemini (미니 버전)"]
  },
  {
    id: "archivelink",
    roles: ["기획", "PM"],
    image: "media/portfolio/qlink-web.png",
    imageAlt: "에이링크 웹 프로토타입 화면(샘플 링크)",
    status: "웹 · iOS 출시",
    statusKind: "live",
    headline: "분석 실패를 기본 흐름으로",
    headlineScope: "2인 팀 · 웹 · App Store",
    book: "team",
    title: "에이링크 — AI 링크·QR 북마크",
    scope: "2인 팀 · 웹 · iOS 출시",
    period: "2026.05–06",
    types: ["Product", "Frontend"],
    overview: "링크를 넣으면 AI가 폴더·이름·설명·태그를 채우는 북마크 서비스.",
    problem: "로그인 벽과 봇 차단으로 AI가 읽지 못하는 링크가 많았습니다. 자동 분류 실패를 예외로만 두면 사용자가 그 자리에서 막힙니다.",
    role: "기획 전반 + 프론트엔드 프로토타입. 서버·DB·인프라는 팀 백엔드 개발자",
    build: [
      "분석하지 못한 링크도 사용자가 직접 입력해 저장하는 흐름을 기본으로 설계",
      "프로토타입을 먼저 배포해 요구사항 기준으로 고정한 뒤 React·TypeScript로 이관"
    ],
    metrics: [],
    resultNote: "웹(archivelink.app)으로 배포했고, iOS 앱은 App Store에 올라가 있습니다(2026.07.30 등록).",
    stack: ["React", "TypeScript", "PWA", "AI 자동 분류"]
  },
  {
    id: "dacon",
    image: "media/portfolio/dacon-labeling-marked.jpg",
    imageAlt: "라벨링 도구 Stage 2 화면 — 충돌·진입 프레임, 진입 방향, 회피 공간을 표시한 상태",
    roles: ["AI 엔지니어링"],
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
    image: "media/portfolio/marketdesk-flow-card.jpg",
    imageAlt: "마켓데스크 흐름 보드 — AI 산업의 한 달 흐름 요약",
    roles: ["기획", "풀스택 개발", "AI 엔지니어링"],
    status: "개발 완료 · 개인 사용 중",
    statusKind: "other",
    headline: "목적별 리포트 요약",
    headlineScope: "태스크 46개 · 결정 기록 15건",
    book: "solo",
    title: "마켓데스크 — AI 리포트 분석·종목 관리",
    scope: "본인 개인 사용(미출시)",
    period: "2026.06 시작",
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
    resultNote: "개발을 완료해 본인이 개인적으로 사용하고 있습니다. 숫자를 인용 페이지와 대조하는 함수는 구현했으며, 업로드 흐름에는 연결하지 않았습니다.",
    stack: ["Next.js", "Hono", "PostgreSQL", "큐 · 워커 분리"]
  },
  {
    id: "triage",
    roles: ["기획", "AI 엔지니어링"],
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
    roles: ["풀스택 개발"],
    image: "media/portfolio/classtrack-dashboard.jpg",
    imageAlt: "ClassTrack 대시보드 — 강의·과제 집계와 수업일 캘린더",
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
    id: "templets-hub",
    roles: ["기획", "프론트엔드"],
    status: "공개 중",
    statusKind: "other",
    image: "media/portfolio/templets-hub-home.jpg",
    imageAlt: "템플릿 허브 첫 화면 — 분류별 디자인 프롬프트 목록",
    book: "solo",
    title: "템플릿 허브 — 문서 디자인 프롬프트 모음",
    scope: "작은 도구",
    period: "2026",
    types: ["Tool"],
    overview: "PPT·보고서·이력서·포트폴리오 템플릿을 분류별로 모아 두고, 고르면 AI에 줄 프롬프트가 만들어지는 허브.",
    problem: "프롬프트는 한 번 잘 나오기보다 매번 같게 나오기가 어렵다는 걸 퀴켓 홍보 이미지를 만들며 알았습니다.",
    role: "1인 제작(AI 코딩 도구 활용)",
    build: [
      "템플릿을 고르면 AI에 줄 프롬프트가 만들어지는 구조",
      "템플릿과 오픈소스를 문서 종류·분위기별로 분류",
      "이름·분위기·색으로 검색, 사용 빈도순 정렬"
    ],
    metrics: [],
    resultNote: "공개 주소에서 열립니다. 2026-11 기준 PPT 305 · 보고서 27 · 이력서 18 · 포트폴리오 14개 템플릿이 있습니다.",
    stack: ["프롬프트 설계", "GitHub Pages"]
  },
  {
    id: "vibe-guide",
    roles: ["기획", "프론트엔드"],
    status: "공개 중",
    statusKind: "other",
    image: "media/portfolio/demo-vibe.png",
    imageAlt: "바이브코딩 가이드 첫 화면",
    book: "solo",
    title: "바이브코딩 가이드",
    scope: "작은 도구",
    period: "2026",
    types: ["Tool"],
    overview: "코딩을 처음 시작하는 사람이 기획부터 배포까지 8단계를 한 사이클 완주하도록 돕는 웹.",
    problem: "처음 시작하는 사람이 기획부터 배포까지 한 번 끝까지 가 보게 하는 것이 목표였습니다.",
    role: "1인 제작(AI 코딩 도구 활용)",
    build: [
      "기획부터 배포까지 8단계 — 단계마다 AI에 줄 프롬프트와 쓸 만한 오픈소스",
      "API 키는 서버리스 함수에서만 사용",
      "빌드 전에 키 유출 검사를 통과하도록 설정"
    ],
    metrics: [],
    resultNote: "공개 주소에서 열립니다(2026-11 확인).",
    stack: ["Vercel 서버리스 함수", "프롬프트 설계"]
  },
  {
    id: "personal-tools",
    image: "media/portfolio/study-note-serving.jpg",
    imageAlt: "과목별 학습 노트 — 모델 서빙 & AIOps 구성 첫 화면",
    roles: ["풀스택 개발", "AI 엔지니어링"],
    status: "개인 사용",
    statusKind: "other",
    book: "solo",
    title: "개인용 툴 — 기타",
    scope: "작은 도구",
    period: "2026",
    types: ["Tool"],
    overview: "메일 요약봇과 학습용 AI 코치 웹앱 — 직접 쓰려고 만든 작은 도구.",
    problem: "매일 반복해서 확인하던 메일을 줄이고, AI에게 물어본 내용이 남지 않는 문제를 풀고 싶었습니다.",
    role: "1인 제작(AI 코딩 도구 활용)",
    build: [
      "메일 요약봇 — Gmail을 IMAP으로 수집해 중요도별로 요약하고 Discord로 전송, GitHub Actions로 매일 아침 실행",
      "학습용 AI 코치 — 교재 옆 질문 패널, AI가 주관식 질문을 내고 서술형 답을 채점해 답안·통과 여부를 DB에 저장"
    ],
    metrics: [],
    resultNote: "직접 쓰려고 만든 도구입니다. 학습용 AI 코치는 과목별로 만들어 썼습니다.",
    stack: ["Python", "GitHub Actions", "Vue 3", "SQLite"]
  }
];

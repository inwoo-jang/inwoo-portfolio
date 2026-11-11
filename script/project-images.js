// 실제 프로젝트 이미지 목록. 캡션 앞에 실제 화면 · 팀 결과물 · 예시 데이터 · 설명도를 구분해 적습니다. 빈 배열은 화면에 표시되지 않습니다.
window.PROJECT_IMAGES = {
  "possessed": [
    {
      "src": "media/portfolio/possessed-flow.png",
      "alt": "POSSESSED 기획 흐름도 — 도구 호출 제안, 정책 검사, 차단과 모의 실행",
      "caption": "기획·설계 흐름도 · 초기 구현 단계 · 전체 흐름 및 실제 LLM 실험 결과 검증 전"
    }
  ],
  "order-sync": [
    {
      "src": "media/portfolio/order-sync-diagram.svg",
      "alt": "주문·상품 단위와 박스 단위를 연결하는 구조 설명도",
      "caption": "설명도(직접 작성) · 주문·상품을 박스와 연결하는 기준"
    }
  ],
  "pharmacy-link": [
    {
      "src": "media/portfolio/jikim-home.jpg",
      "alt": "지킴 앱 홈 — 손익과 약국 가계부",
      "caption": "회사 앱 소개 이미지 · 홈 화면(손익·약국 가계부)"
    },
    {
      "src": "media/portfolio/jikim-tax-tab.jpg",
      "alt": "지킴 앱 세무 탭 — 매출·입금 현황",
      "caption": "회사 앱 소개 이미지 · 세무 탭(매출·입금 현황)"
    }
  ],
  "rx-ops": [
    {
      "src": "media/portfolio/jikim-rx-ocr.jpg",
      "alt": "지킴 앱 처방전 자동입력 화면",
      "caption": "회사 앱 소개 이미지 · 처방전 자동입력 화면"
    }
  ],
  "income-tax": [],
  "client-contract": [],
  "taxdesk": [
    {
      "src": "media/portfolio/taxdesk-hold-2611.jpg",
      "alt": "다른 종합소득이 확인되지 않아 세액을 계산하지 않고 소득금액을 되묻는 상담 화면",
      "caption": "실제 화면(11월) · 다른 소득을 모르면 세액 대신 소득금액을 되물음"
    },
    {
      "src": "media/portfolio/taxdesk-income-panel-2611.jpg",
      "alt": "내 금융소득 패널 — 자사·연동 과세대상, 판정 제외 금액, 타사 미확인을 나눠 보여 줌",
      "caption": "실제 화면(11월) · 확인된 소득과 확인 안 된 소득을 나눠 보여 주는 패널"
    },
    {
      "src": "media/portfolio/taxdesk-answer.png",
      "alt": "종합과세 대상 여부 질문에 근거 조문과 서버가 호출한 도구를 함께 보여 주는 응답",
      "caption": "실제 화면(8월) · 답변과 근거 조문을 함께 표시"
    },
    {
      "src": "media/portfolio/taxdesk-calc.png",
      "alt": "세액 질문에 계산 도구가 단계별 계산 전개와 결정세액을 보여 주는 응답",
      "caption": "실제 화면(8월) · 세액 계산 과정을 단계별로 표시"
    },
    {
      "src": "media/portfolio/taxdesk-reask.png",
      "alt": "계산에 필요한 다른 소득 정보가 없을 때 다시 묻는 응답",
      "caption": "실제 화면(8월) · 정보가 부족하면 계산하지 않고 되물음"
    },
    {
      "src": "media/portfolio/taxdesk-no-source.png",
      "alt": "제공된 근거에서 확인되지 않는 질문에 답하지 않고 안내하는 응답",
      "caption": "실제 화면(8월) · 근거가 없으면 답하지 않고 안내"
    }
  ],
  "gtsrb": [
    {
      "src": "media/portfolio/gtsrb-tradeoff.png",
      "alt": "정확도와 파라미터 수의 관계를 비교한 산점도",
      "caption": "실험 결과(2인 과제) · 후보별 정확도와 모델 크기"
    },
    {
      "src": "media/portfolio/gtsrb-experiments.png",
      "alt": "실험별 정확도·손실·복잡도 비교 그래프",
      "caption": "실험 결과(2인 과제) · 실험 전체 비교"
    }
  ],
  "edu-up": [
    {
      "src": "media/portfolio/eduup-home.png",
      "alt": "EDU:UP 메인 화면 — 맞춤 추천 강의와 도서",
      "caption": "실제 화면 · 담당한 메인 화면(모의 데이터)"
    },
    {
      "src": "media/portfolio/eduup-spec-conflicts.jpg",
      "alt": "스펙 충돌 항목과 결정 내용을 정리한 문서",
      "caption": "팀 문서 · 스펙 충돌 결정 기록"
    }
  ],
  "relationship-design": [
    {
      "src": "media/portfolio/gwangyebu-flow-deck.png",
      "alt": "관계부 핵심 흐름 발표 슬라이드",
      "caption": "발표자료(직접 제작) · 핵심 화면 흐름"
    },
    {
      "src": "media/portfolio/gwangyebu-uiflow.png",
      "alt": "관계부 화면 흐름도",
      "caption": "설계 산출물 · 화면 11개의 이동 흐름"
    },
    {
      "src": "media/portfolio/gwangyebu-erd.png",
      "alt": "관계부 데이터 구조 설계",
      "caption": "설계 산출물 · ERD"
    },
    {
      "src": "media/portfolio/gwangyebu-app-home.png",
      "alt": "관계부 홈 — 다가오는 경조사와 생일",
      "caption": "실제 화면 · 프로토타입 홈(샘플 데이터)"
    },
    {
      "src": "media/portfolio/gwangyebu-app-persons.png",
      "alt": "관계부 인물 목록 — 관계와 태그로 찾기",
      "caption": "실제 화면 · 프로토타입 인물 목록(샘플 데이터)"
    },
    {
      "src": "media/portfolio/gwangyebu-app-ledger.png",
      "alt": "관계부 장부 — 보낸 것과 받은 것 합계",
      "caption": "실제 화면 · 프로토타입 장부(샘플 데이터)"
    }
  ],
  "quiket": [
    {
      "src": "media/portfolio/quiket-demo-upload.jpg",
      "alt": "퀴켓 자료 추가 화면 — 챕터명을 먼저 쓰지 않고 파일을 고르는 단계",
      "caption": "최종 발표 시연 화면 · ① 자료 올리기 · 팀 결과물"
    },
    {
      "src": "media/portfolio/quiket-demo-chapters.jpg",
      "alt": "퀴켓 자료 확인 화면 — AI가 나눈 챕터명과 파트 4개를 확인하고 수정하는 단계",
      "caption": "최종 발표 시연 화면 · ② AI가 나눈 챕터·파트 확인·수정 · 팀 결과물"
    },
    {
      "src": "media/portfolio/quiket-card.png",
      "alt": "퀴켓 App Store 출시 페이지",
      "caption": "스토어 페이지 · App Store에 출시된 퀴켓"
    },
    {
      "src": "media/portfolio/quiket-app-upload.png",
      "alt": "퀴켓 자료 추가 화면이 담긴 스토어 소개 이미지",
      "caption": "스토어 소개 이미지(팀 결과물)"
    },
    {
      "src": "media/portfolio/quiket-app-archive.png",
      "alt": "퀴켓 과목 아카이브 화면이 담긴 스토어 소개 이미지",
      "caption": "스토어 소개 이미지(팀 결과물)"
    }
  ],
  "archivelink": [
    {
      "src": "media/portfolio/qlink-web.png",
      "alt": "에이링크 웹 프로토타입 — 링크 목록과 AI 태그",
      "caption": "실제 화면 · 담당한 웹 프로토타입(샘플 링크)"
    },
    {
      "src": "media/portfolio/qlink-mobile.png",
      "alt": "에이링크 모바일 프로토타입 화면",
      "caption": "실제 화면 · 모바일 화면(샘플 링크)"
    }
  ],
  "dacon": [
    {
      "src": "media/portfolio/dacon-labeling-marked.jpg",
      "alt": "라벨링 도구 Stage 2 화면 — 충돌·진입 프레임, 진입 방향, 회피 공간을 표시한 상태",
      "caption": "실제 화면 · 키보드로 충돌 프레임과 방향 표시(합성 영상)"
    },
    {
      "src": "media/portfolio/dacon-labeling-adjust.jpg",
      "alt": "라벨링 도구 정밀 조정 화면 — 진입 프레임을 1프레임씩 조정",
      "caption": "실제 화면 · 표시 직후 ±7프레임 조정(합성 영상)"
    }
  ],
  "samil": [],
  "payroll": [
    {
      "src": "media/portfolio/payroll-slip.jpg",
      "alt": "급여명세서 화면 예시 — 지급내역, 공제내역, 실지급액",
      "caption": "회사 소개 이미지(예시 데이터) · 급여명세서"
    },
    {
      "src": "media/portfolio/payroll-calc.jpg",
      "alt": "직원정보와 급여 항목으로 계산 결과를 만드는 흐름",
      "caption": "회사 소개 이미지(예시 데이터) · 직원 정보와 급여 항목으로 계산"
    },
    {
      "src": "media/portfolio/payroll-types.jpg",
      "alt": "정규직·프리랜서·일용직 직원 카드 예시",
      "caption": "회사 소개 이미지(예시 데이터) · 고용 형태별 직원 관리"
    },
    {
      "src": "media/portfolio/payroll-flow.jpg",
      "alt": "직원정보 등록, 급여 자동 계산, 명세서 확인, 직원 전송의 4단계 흐름",
      "caption": "회사 소개 이미지(예시 데이터) · 매월 급여 업무 4단계"
    }
  ],
  "marketdesk": [
    {
      "src": "media/portfolio/marketdesk-flow.jpg",
      "alt": "마켓데스크 흐름 보드 — 핵심·엇갈림·흐름 위험 신호로 나눈 월별 요약",
      "caption": "실제 화면 · 리포트를 월별로 쌓아 흐름으로 요약"
    },
    {
      "src": "media/portfolio/marketdesk-home.jpg",
      "alt": "마켓데스크 홈 — 렌즈, 내 산업, 관심 기업",
      "caption": "실제 화면 · 읽는 목적과 관심 기업을 정하고 리포트 올리기"
    }
  ],
  "triage": [
    {
      "src": "media/portfolio/demo-triage.png",
      "alt": "일경험 운영 트리아지 어드민 데모 첫 화면",
      "caption": "데모 화면 · 가상 시나리오 데이터"
    }
  ],
  "classtrack": [
    {
      "src": "media/portfolio/classtrack-dashboard.jpg",
      "alt": "ClassTrack 대시보드 — 강의·과제 집계와 수업일 캘린더",
      "caption": "실제 화면 · 수업일만 표시하는 대시보드(예시 데이터)"
    },
    {
      "src": "media/portfolio/classtrack-dev.jpg",
      "alt": "ClassTrack dev 화면 — 실행 중인 앱에서 읽어 온 API 목록과 AOP 적용 여부",
      "caption": "실제 화면 · API 목록과 로깅 적용 여부를 보는 dev 화면"
    }
  ],
  "templets-hub": [
    {
      "src": "media/portfolio/templets-hub-home.jpg",
      "alt": "템플릿 허브 첫 화면 — 분류별 디자인 프롬프트 목록",
      "caption": "실제 화면 · 템플릿 허브 첫 화면"
    }
  ],
  "vibe-guide": [
    {
      "src": "media/portfolio/demo-vibe.png",
      "alt": "바이브코딩 가이드 첫 화면",
      "caption": "실제 화면 · 학습 단계와 프로젝트 시작"
    }
  ],
  "personal-tools": [
    {
      "src": "media/portfolio/study-note-serving.jpg",
      "alt": "과목별 학습 노트 — 모델 서빙 · AIOps 3일 과정을 Day별 카드로 정리한 첫 화면",
      "caption": "실제 화면 · 과목별 학습 노트"
    },
    {
      "src": "media/portfolio/mailbot-discord.jpg",
      "alt": "메일 요약봇이 Discord로 보낸 하루 메일 요약",
      "caption": "실제 화면 · Discord로 받은 메일 요약"
    },
    {
      "src": "media/portfolio/ai-coach-side.jpg",
      "alt": "학습용 AI 코치 — 교재 본문 옆 질문 패널에 AI 설명이 펼쳐진 화면",
      "caption": "실제 화면 · 교재 옆에서 묻는 AI 코치"
    }
  ]
};

---
title: AI 에이전트의 KPI는 어떻게 설계해야 하는가?
category: ax
categories: [ax, planning, ai]
tags: [Agent Evaluation, Product KPI, Business Impact]
date: 2026-11-06
summary: 정확하게 작동하는 에이전트와 업무를 실제로 개선하는 에이전트는 다르다. 해결할 업무와 성공의 기준을 먼저 정하고, 완료율뿐 아니라 검토·재작업 시간과 비용, 권한 준수 여부도 함께 봐야 한다. 목표 → 성공 기준 → KPI → 측정·검증 → 개선 순서로 지표를 고르는 기준을 정리했다.
sample: false
related: [agent-eval, agent-autonomy, multi-agent-vs-single, why-ai-service]
---

> AI 서비스 기획자의 역할은 성공률을 높이는 데 그치지 않고, 무엇을 성공으로 볼지 정의하고 그 성과를 검증 가능한 구조로 만드는 것이라고 생각한다.

## 문제 제기: AI 에이전트의 성공은 무엇으로 판단할까?

AI 에이전트의 성능을 평가할 때 가장 먼저 떠오르는 지표는 답변 정확도와 작업 성공률이다. 하지만 **에이전트가 정확하게 작동하는 것과 사용자의 업무가 실제로 개선되는 것은 별개**다.

예를 들어 답변 정확도가 95%인 에이전트라도 실제 사용률이 낮거나, 사용자가 결과를 검토하고 고치는 데 더 많은 시간을 쓴다면 성공적인 제품이라고 보기 어렵다.

그렇다면 AI 에이전트의 성과는 무엇으로 정의해야 할까? KPI를 나열하는 것을 넘어, 어떤 지표를 핵심 성과로 정하고 어떻게 측정·검증할지 살펴봤다.

## 리서치: AI 에이전트는 어떻게 평가하고 있는가?

### Google Cloud — 운영 환경의 KPI 프레임워크

Google Cloud는 2026년 2월 *The KPIs that actually matter for production AI agents*에서 운영 환경의 AI 에이전트 KPI를 세 영역으로 나눴다.

| 평가 영역 | 핵심 질문 | 주요 지표 |
|---|---|---|
| Reliability & Operational Efficiency | 안정적이고 효율적으로 수행하는가? | Tool Selection Accuracy, Cost per Successful Task |
| Adoption & Usage | 실제 업무에 도입되고 활용되는가? | Active Users, Acceptance Rate |
| Business Value | 생산성과 비즈니스 성과가 개선되는가? | Time-to-Value, OpEx Reduction |

특히 주목한 지표는 **Cost per Successful Task(성공 업무당 비용)** 다. AI 호출 비용이 싼지를 보는 게 아니라, 실제로 성공한 업무를 기준으로 비용이 얼마나 들었는지 확인하는 방식이다. 또한 AI가 작업을 끝낸 시간뿐 아니라, 사람이 결과를 검토하고 승인하기까지 걸린 시간도 중요하게 다룬다.

### Google Cloud — 목적 중심의 에이전트 평가

2025년 11월 *A methodical approach to agent evaluation*에서는 평가 설계의 출발점으로 에이전트의 명확한 성공 조건을 강조한다. 평가 기준은 크게 세 가지다.

1. **Agent Success & Quality:** 최종 결과와 사용자 경험
2. **Process & Trajectory:** 도구 선택과 실행 과정의 적절성
3. **Trust & Safety:** 예외 상황에서의 안정성과 보안

에이전트는 올바른 답을 만들었더라도 잘못된 데이터를 조회했거나 불필요한 도구를 호출했을 수 있다. 그래서 최종 결과뿐 아니라 **어떤 과정을 거쳐 그 결과에 도달했는지**도 평가해야 한다.

### ACL 2026 — A Survey on Evaluation of LLM-based Agents

에이전트 평가 방법과 벤치마크를 종합적으로 조사한 연구다. 에이전트 평가가 정적인 정답 비교에서 실제 환경의 복잡한 업무 수행 평가로 넓어지고 있고, 특히 비용 효율성·안전성·강건성 평가에는 아직 풀어야 할 과제가 있다고 지적한다.

이를 통해 에이전트의 성공 여부를 하나의 정확도 지표만으로 판단하기는 어렵다는 점을 확인했다.

## AI 에이전트의 KPI는 어떻게 설계해야 할까?

Google Cloud의 목적 중심 평가 방법론과 KPI 프레임워크를 참고해, 서비스 기획 관점에서 이런 순서로 재구성했다.

| 단계 | 설계 질문 |
|---|---|
| 목표 정의 | 에이전트가 해결해야 할 업무 문제는 무엇인가? |
| 성공 기준 정의 | 어떤 상태를 업무의 성공으로 판단할 것인가? |
| KPI 선정 | 성공을 대표할 핵심 지표와 보조·안전 지표는 무엇인가? |
| 측정 및 검증 | 어떤 데이터와 평가 방법으로 성과를 확인할 것인가? |
| 개선 | 측정 결과를 바탕으로 무엇을 개선할 것인가? |

특정 연구의 공식 5단계가 아니라, 참고 자료를 바탕으로 내가 재구성한 설계 절차다.

### KPI를 고를 때 볼 평가 영역

| 평가 영역 | KPI 예시 |
|---|---|
| 기술적 품질 | Task Success Rate, Tool Selection Accuracy |
| 업무 성과 | 업무 완료 시간, 재작업률 |
| 사용자 가치 | Adoption Rate, Output Acceptance Rate |
| 경제성 | Cost per Successful Task, ROI |
| 안전·통제 | Unsafe Execution Rate, Approval Compliance Rate |

모든 지표를 같은 비중으로 관리할 필요는 없다. 정보 검색을 돕는 에이전트라면 정확도와 업무 시간 절감이 중요할 수 있지만, 실제 데이터를 수정하거나 외부 시스템에서 작업을 실행하는 에이전트라면 권한 준수와 안전성이 더 중요한 제약 조건이 될 수 있다.

그래서 핵심 KPI는 업무의 목적에 따라 고르되, **안전성처럼 타협하기 어려운 조건은 별도의 Guardrail Metric으로 관리하는 게 적절할 수 있다.**

## KPI 설계에서 더 고려할 점

- **업무 성공의 판정 기준을 명확히 한다.** 에이전트가 작업 완료를 선언했다고 실제 업무가 끝난 것은 아니다. 자동 검증, 외부 시스템의 결과, 사람의 승인 등 어떤 증거로 성공을 판정할지 정해야 한다
- **측정 조건을 통일한다.** 난이도와 유형이 다른 업무를 수행한 에이전트를 전체 성공률만으로 비교하면 잘못된 결론이 나올 수 있다. 평가 대상과 기간, 업무 난이도를 함께 봐야 한다
- **지표 간 상충관계를 고려한다.** 자율 완료율을 높이면 사람의 개입은 줄겠지만 위험한 행동이 실행될 가능성도 커질 수 있다. 성과를 높이는 동안 반드시 유지할 지표를 정해야 한다
- **AI의 기여도를 구분한다.** 업무 시간이 줄었다고 모든 개선을 AI의 성과로 볼 수는 없다. 도입 전 기준선과 비교하고, 가능하면 비슷한 업무 조건에서 효과를 검증해야 한다

## 현재의 생각

AI 에이전트의 KPI는 모델의 기술적 성능만으로 정하기보다 **해결하려는 업무와 사용자가 얻어야 할 가치를 먼저 정의하는 것**에서 시작해야 한다고 생각한다. 모든 제품에 공통으로 적용되는 하나의 핵심 지표를 찾기보다는, 업무 특성과 위험 수준에 맞는 지표를 고르는 게 중요해 보인다.

KPI를 측정할 때도 에이전트가 선언한 성공과 실제 업무 완료를 구분해야 하고, 최종 결과뿐 아니라 실행 과정과 비용까지 함께 검증해야 한다.

결국 AI 서비스 기획자의 역할은 성공률을 높이는 데 그치지 않고, **무엇을 성공으로 볼지 정의하고 그 성과를 검증 가능한 구조로 만드는 것**이라고 생각한다.

## 남은 질문

- **North Star Metric:** 에이전트의 핵심 성과를 대표하는 지표는 무엇이어야 할까?
- **Success Criteria:** 사람이 고친 결과도 AI의 업무 성공으로 평가할 수 있을까?
- **Measurement:** 업무 성공 여부를 누가, 어떤 방법으로 검증해야 할까?
- **Trade-off:** 완료율·비용·안전성이 충돌하면 어떤 기준으로 우선순위를 정할까?
- **Business Impact:** AI 도입으로 인한 업무 개선 효과를 어떻게 분리해서 측정할 수 있을까?

## 참고

- Google Cloud (2026.02.26). [The KPIs that actually matter for production AI agents](https://cloud.google.com/transform/the-kpis-that-actually-matter-for-production-ai-agents)
- Google Cloud (2025.11.17). [A methodical approach to agent evaluation: Building a robust quality gate](https://cloud.google.com/blog/topics/developers-practitioners/a-methodical-approach-to-agent-evaluation/)
- Yehudai et al. (2026.07). [A Survey on Evaluation of LLM-based Agents](https://aclanthology.org/2026.findings-acl.1330/), Findings of ACL 2026.

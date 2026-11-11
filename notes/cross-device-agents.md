---
title: AI 에이전트의 작업은 기기가 바뀌어도 어떻게 이어질까?
status: published
published: true
category: ux
categories: [ux, ai, backend, infra]
date: 2026-11-05
created: 2026-11-05
updated: 2026-11-11
tags: [Cloud Agent, Session Persistence, Context Management, Cross-Device UX, Agent Analytics]
summary: 기기를 바꿔도 작업을 이어가려면 대화 기록뿐 아니라 진행 상태와 실행 환경을 함께 관리해야 한다. 같은 작업 상태를 공유하되, 기기별로 확인하고 조작할 범위도 정해야 한다. Copilot 사례를 바탕으로 작업 재개와 승인·권한, 기기별 UX와 사용량 측정 시 주의할 점을 정리했다.
sample: false
related: [context-engineering, agent-memory, agent-hitl, agent-kpi]
---

> AI 에이전트가 여러 기기에서 작업을 이어가려면 단순히 대화 기록을 동기화하는 것만으로 충분할까? 실행 환경과 작업 상태를 유지하고, 사용자가 언제 어디서든 같은 작업을 확인하고 제어할 수 있어야 한다고 생각한다.

## 문제 제기

최근 휴대폰에서 AI 에이전트에게 개발 작업을 맡기고, 나중에 PC에서 결과를 확인하거나 이어서 지시하는 방식이 가능해지고 있다.

그런데 휴대폰에서 시작한 작업을 PC에서 그대로 이어갈 수 있는 원리는 무엇일까?

처음에는 대화 기록을 서버에 저장하고 다른 기기에서 불러오는 방식이라고 생각할 수 있다.

하지만 실제 코딩 에이전트는 대화만 수행하지 않는다. 코드를 수정하고, 명령어를 실행하고, 테스트를 진행하며, 여러 파일의 상태를 변경한다.

따라서 기기가 바뀌어도 작업을 이어가려면 대화 기록뿐 아니라 **현재 어떤 작업을 수행하고 있고, 어디까지 실행됐으며, 어떤 결과물이 만들어졌는지** 관리해야 한다.

## GitHub Copilot의 연결된 클라우드 작업 환경

GitHub는 2026년 10월 28일 모바일·웹·IDE·CLI·협업 도구에서 동일한 클라우드 에이전트 세션을 이어갈 수 있는 기능을 발표했다.

GitHub Mobile에서 작업을 시작하고, VS Code에서 진행 내역을 확인하거나 추가 지시를 내릴 수 있다. 클라우드에서 실행되는 작업이므로 개인 PC를 계속 켜둘 필요도 없다.

GitHub의 기본 실행 환경은 Cloud Sandbox다.

사용자의 로컬 컴퓨터와 분리된 클라우드 환경에서 작업을 수행하고, 샌드박스가 종료될 때 스냅샷을 저장해 나중에 세션을 재개할 수 있도록 한다.

이 사례에서 중요한 것은 단순한 멀티디바이스 지원이 아니라 **작업을 수행하는 환경과 사용자가 작업을 조작하는 인터페이스가 분리되어 있다는 점**이다.

참고: [GitHub — Work from Anywhere with a Connected Copilot Cloud Experience (2026.10.28)](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/)

## 대화 기록과 작업 상태는 무엇이 다를까?

AI 서비스에서 저장해야 할 정보를 세 가지로 구분해 볼 수 있다.

| 구분 | 저장할 정보 | 목적 |
| :--- | :--- | :--- |
| 대화 상태 | 사용자 요청, AI 응답, 대화 맥락 | 이전 대화 이어가기 |
| 작업 상태 | 현재 단계, 진행 결과, 실패 지점, 승인 대기 여부 | 진행 상황 확인 및 작업 재개 |
| 실행 환경 | 파일 변경사항, 실행 설정, 의존성, 작업 환경 스냅샷 | 실제 작업 환경 복원 |

이 구분은 GitHub의 공식 내부 데이터 구조가 아니라, 클라우드 에이전트 설계를 이해하기 위해 정리한 개념적 분류다.

예를 들어 AI에게 코드 수정을 요청한 뒤 휴대폰 앱을 종료했다고 가정해 보자.

클라우드에서 작업이 계속 실행된다면 앱이 종료되어도 작업은 진행될 수 있다.

반면 클라우드 실행 환경 자체가 중단됐다면, 대화 기록만 복원해서는 이전 작업을 그대로 이어가기 어렵다.

이미 수정한 파일과 완료한 단계, 실패한 지점까지 확인해야 한다.

즉, **사용자 화면의 세션을 유지하는 것과 실제 에이전트 실행을 복구하는 것은 서로 다른 문제**다.

## 기기가 달라지면 어떤 UX를 고려해야 할까?

같은 에이전트 작업이라도 사용 환경에 따라 필요한 인터페이스는 달라질 수 있다.

모바일에서는 작업 요청, 진행 상황 확인, 간단한 승인이나 취소가 중요할 수 있다.

반면 PC에서는 변경된 파일 비교, 코드 리뷰, 테스트 결과 확인처럼 복잡한 작업에 더 많은 화면 공간이 필요하다.

따라서 모든 기기에서 동일한 화면을 제공하기보다, **동일한 작업 상태를 공유하면서 기기별로 적절한 조작 방식을 제공하는 것**이 중요하다고 생각한다.

또한 작업이 여러 환경에서 이어지면 다음과 같은 상황도 고려해야 한다.

- 휴대폰과 PC에서 동시에 서로 다른 지시를 내리면 어떻게 처리할까?
- 에이전트가 사람의 승인을 기다리는 동안 다른 기기에서 승인할 수 있을까?
- 네트워크 연결이 끊겨도 작업은 계속 진행될까?
- 세션을 이어받는 사용자가 기존 작업의 권한을 그대로 가져도 될까?
- 작업이 완료되었을 때 어떤 기기로 알림을 보내야 할까?

이는 단순한 화면 동기화보다 작업 상태, 권한, 사용자 인터랙션을 함께 설계해야 하는 문제라고 볼 수 있다.

## 여러 기기에서 사용한 AI는 어떻게 측정해야 할까?

GitHub는 2026년 11월 6일 Copilot Impact Dashboard에 Chat과 VS Code Agents 사용 지표를 추가했다.

기존에 'Passive users'로 분류되던 그룹의 명칭도 'Chat-first users'로 변경했다.

이는 Copilot Chat을 사용하고 있더라도 기존 분류 기준에서는 활용 정도가 제대로 드러나지 않을 수 있다는 점을 반영한 변화다.

다만 기존 AI 도입 단계의 계산 규칙 자체는 바뀌지 않았다.

참고: [GitHub — Copilot Impact Dashboard Update (2026.11.06)](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)

멀티디바이스 환경에서는 무엇을 하나의 사용으로 계산할지도 중요하다.

예를 들어 사용자가 모바일에서 작업을 요청하고 PC에서 결과를 확인했다면 이것은 두 번의 사용일까, 아니면 하나의 작업일까?

측정 목적에 따라 답이 달라질 수 있다.

- 사용자 수: 중복을 제거한 실제 이용자 수
- 세션 수: 생성된 작업 세션의 수
- 기기별 사용: 모바일·웹·IDE에서 발생한 상호작용
- 작업 완료율: 요청된 작업이 정상적으로 완료된 비율
- 사람 개입 횟수: 승인·수정·재지시가 발생한 횟수
- 작업 완료 시간: 요청부터 최종 완료까지 소요된 시간

이 지표들은 서비스 설계 시 고려할 수 있는 예시이며 GitHub가 모두 같은 방식으로 제공하는 공식 지표는 아니다.

## 지표 자체가 잘못 수집될 수도 있다

GitHub는 2026년 10월 일부 IDE의 Copilot SDK 전환 과정에서 에이전트 사용 기록이 정상적으로 집계되지 않은 문제를 공개했다.

일부 에이전트 활동이 누락되거나 Copilot CLI 사용량으로 잘못 분류됐으며, 누락된 과거 데이터는 복구할 수 없다고 밝혔다.

이 사례는 사용량 분석에서 중요한 점을 보여준다.

**사용자가 실제로 기능을 사용하지 않은 것인지, 측정 시스템이 사용 기록을 수집하지 못한 것인지 구분해야 한다.**

특히 여러 플랫폼에서 동일한 기능을 제공한다면 이벤트 정의와 수집 기준을 일관되게 관리할 필요가 있다.

참고: [GitHub — Restore Agent Activity in Copilot Usage Metrics (2026.10.06)](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)

## 현재의 생각

AI 에이전트 서비스가 여러 기기로 확장된다는 것은 단순히 모바일 앱을 추가하는 문제가 아니라고 생각한다.

사용자가 어느 기기에서 요청했는지와 관계없이 하나의 작업을 지속적으로 관리할 수 있어야 하고, 현재 상태와 실행 결과를 일관되게 확인할 수 있어야 한다.

이를 위해서는 대화 맥락, 작업 진행 상태, 실행 환경을 구분해 관리할 필요가 있다.

또한 사용자의 행동을 측정할 때도 접속 기기나 대화 횟수만 보는 것이 아니라 실제로 어떤 작업을 요청했고, 어디까지 완료했는지 확인해야 한다.

결국 **AI 에이전트의 사용자 경험은 하나의 화면에서 완성되는 것이 아니라, 여러 환경에 걸쳐 하나의 작업을 지속적으로 수행하는 경험**으로 발전하고 있다고 생각한다.

## 남은 질문

- 클라우드 에이전트의 작업 상태는 어느 수준까지 저장해야 할까?
- 실행 환경을 스냅샷으로 저장하는 것과 작업 단계만 기록하는 방식은 어떻게 다를까?
- 여러 기기에서 동시에 지시하면 작업 충돌을 어떻게 방지할 수 있을까?
- 모바일에서는 어떤 작업까지 승인·수정할 수 있도록 설계하는 것이 적절할까?
- 세션 수와 실제 완료 작업 수 중 무엇을 AI 서비스 활용의 핵심 지표로 삼아야 할까?

## 참고 자료

- [GitHub — Connected Copilot Cloud Experience (2026.10.28)](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/)
- [GitHub — Copilot Impact Dashboard Update (2026.11.06)](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)
- [GitHub — Copilot Usage Metrics API: AI Adoption Cohorts (2026.05.29)](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/)
- [GitHub — Restore Agent Activity in Usage Metrics (2026.10.06)](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)
- [GitHub Docs — Using Copilot in the Cloud on GitHub Mobile](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-mobile)
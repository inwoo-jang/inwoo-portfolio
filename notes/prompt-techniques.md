---
title: 프롬프트 기법 정리
category: ai
tags: [Prompt Engineering, RICE, CoT, Few-shot]
date: 2026-07-15
summary: 자주 쓰는 프롬프트 기법 10가지 — 언제 쓰는지, 한 줄 예시, 쓸 때 주의점.
sample: false
---

> 7/15 수업(Prompt 설계와 Context) 정리

## 기법 한눈에

| 기법 | 언제 | 핵심 |
|---|---|---|
| RICE | 기본 틀 | 역할 · 지시 · 배경 · 예시 나눠 쓰기 |
| Zero / One / Few-shot | 출력 형식 맞출 때 | 예시 0 · 1 · 3~5개 |
| CoT | 단계 있는 문제(원인 분석·계산) | “단계적으로 생각해 줘” |
| Self-Consistency | 답이 흔들릴 때 | 여러 번 추론 → 다수결 |
| Step-back | 문제를 좁게 볼 때 | 근본 질문 먼저 |
| Devil’s Advocate | 기획안 검증 | “이미 실패했다” 가정 → 이유 찾기 |
| Multi-Persona | 관점 여러 개 필요 | 역할 여럿 주고 토론 |
| Meta Prompting | 프롬프트가 막막할 때 | AI가 프롬프트를 쓰게 |
| Socratic | 배경이 정리 안 됐을 때 | AI가 나에게 질문 |
| Markdown | 긴 프롬프트 | 제목 · 목록 · 표로 구역 나누기 |

## RICE 템플릿

```markdown
[Role]        누가 — 예: 10년 차 B2B 전략 컨설턴트
[Instruction] 무엇을 — 결과물 · 범위 · 우선순위
[Context]     상황 — 회사 · 문제 · 목표 (구체적일수록 환각 ↓)
[Examples]    모양 — 예시 또는 출력 목차
+ 규칙 · 말투 · 제약(글자 수) · 형식(표·JSON)
```

## 예시

```text
[Few-shot]
문장을 긍정/부정으로 분류해.
"정말 감동적이었어요" -> 긍정
"지루해서 졸았어요" -> 부정
"연기가 훌륭했어요" ->

[CoT]
원인을 단계적으로 생각해 줘: 증상 → 원인 후보 → 근거 대조·순위 → 검증 방법 → 즉시 조치 / 근본 대책

[Step-back]
보고서 쓰기 전에 먼저 답해: 이 서비스가 안 팔리는 근본 원인은?

[Devil's Advocate]
이 제안서가 부결됐다고 가정해. 거절 이유 5개 + 각각 보완할 근거.

[Multi-Persona]
CFO와 COO로서 찬반 토론 → 최종 결정과 승인 조건 정리.
```

## 메모

- CoT: 큰 모델에서 효과. 작은 모델은 오히려 떨어지기도 함
- Few-shot: 예시 내용보다 **형식 일관성**이 중요
- Temperature: API 설정값. 프롬프트로는 말투로 흉내만 가능
- 공손함·감정 자극 효과: 모델·과제마다 다름 → 필수 아님
- 기법은 겹쳐 쓰기 (예: RICE + Step-back)

## 참고

- [A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications (arXiv 2402.07927)](https://arxiv.org/abs/2402.07927)

---
title: AI 에이전트에 사용자 승인 추가하기 — LangChain HITL 설정과 재개
category: ai
tags: [AI Agent, HITL, LangChain, create_agent]
date: 2026-09-11
summary: 도구 실행 전에 멈춰 사용자 승인을 받는 HITL 설정 방법입니다. 승인·거절 후 실행을 재개하는 코드와 상태 저장, 만료 처리, 오류 해결 사례를 담았습니다.
sample: false
---

HITL(Human-in-the-Loop)은 AI의 실행 과정에 사람이 판단하는 단계를 넣는 방식입니다. 이 실습에서는 사용자 선호를 저장하기 전에 승인을 받도록 구현했습니다.

## 승인 전 중단과 상태 저장

- 승인 대상 도구를 실행하기 직전에 멈춘다. 승인되면 실행하고, 거절되면 해당 동작을 실행하지 않는다
- 중단된 상태를 저장할 checkpointer가 필요하다. 재개할 때는 같은 `thread_id`로 해당 상태를 이어받는다

## 승인이 필요한 도구 설정

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware

HumanInTheLoopMiddleware(interrupt_on={
    "save_preferences": {
        "allowed_decisions": ["approve", "reject"],
        "description": describe,      # 승인 화면 문구
    },
    "confirm_plan": False,            # False면 승인 없이 실행
})

def describe(tool_call, state=None, runtime=None):   # 인자 3개
    return f"선호를 저장할까요? ({tool_call['args']})"
```

## 승인·거절 후 실행 재개

```python
from langgraph.types import Command

agent.invoke(
    Command(resume={"decisions": [{"type": "approve"}]}),   # 거절: {"type": "reject", "message": "사유"}
    config={"configurable": {"thread_id": tid}},
)
```

## 오류 증상과 해결 방법

| 증상 | 원인 | 해결 |
|---|---|---|
| `_describe() takes 1 positional argument but 3 were given` | 라이브러리가 `(tool_call, state, runtime)`로 호출 | 인자 3개 받기 |
| 승인 대상이 2개 이상이면 재개 안 됨 | 결정 개수 불일치 | 대상 개수만큼 `decisions` |
| 승인 직전에 실행해야 할 훅이 실행되지 않음 | `after_model` 훅은 등록 역순 실행 | HITL 미들웨어보다 뒤에 등록 |

## 구현 중 확인한 문제와 해결

- 처음에는 계획 확정에도 승인을 요청했다. 사용자가 이미 후보를 선택한 상황에서 중복 확인이 되어, 승인 요청 대신 도구 내부에서 최신 상태를 다시 검사하도록 바꿨다
- 최종적으로 사용자 정보를 저장하는 ‘선호 저장’ 도구에만 승인을 요청했다
- 승인 대기에도 만료가 필요했다 (2분). 추천 후보의 유효 시간(5분)과는 따로 쟀다
- 전체 에이전트에 적용하기 전에 작은 테스트 에이전트로 중단과 재개 동작을 확인했다

## 적용할 때 확인할 점

- 승인 대상은 정보를 저장하거나 되돌리기 어려운 동작인지 검토해 정한다
- 승인 · 거절 · 만료가 각각 화면에 어떻게 보이는지 같이 정한다
- 승인 여부는 모델의 응답이 아닌 사용자의 재개 명령으로 전달한다

## 핵심 요약

> 사용자가 이미 선택한 내용을 다시 묻는 승인 요청은 줄였습니다. 이 실습에서는 사용자 정보를 저장하는 도구에 승인을 적용하고, 승인·거절·만료를 구분해 처리했습니다.

출처: SKALA 생성형 AI 서비스 개발 팀 실습 (2026-09-09 ~ 09-11)

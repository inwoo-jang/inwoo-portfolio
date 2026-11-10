---
title: 승인은 어디에 걸어야 할까? — LangChain HITL 실습
category: ai
tags: [AI Agent, HITL, LangChain, create_agent]
date: 2026-09-11
summary: 처음엔 계획 확정에도 승인을 걸었다가 중복 확인이 됐다. 결국 사용자 정보를 저장하는 도구 하나에만 승인을 남기고, 승인·거절·만료를 나눠 처리했다.
sample: false
---

HITL(Human-in-the-Loop)은 AI의 실행 과정에 사람이 판단하는 단계를 넣는 방식이다. 팀 실습에서 에이전트가 사용자 선호를 저장하기 전에 승인을 받도록 구현했다. 핵심은 **어디에 승인을 걸 것인가**였다.

## 처음엔 너무 많이 물었다

- 처음에는 계획 확정에도 승인을 요청했다. 그런데 사용자는 이미 후보를 직접 고른 상태여서, 같은 걸 한 번 더 묻는 꼴이 됐다
- 그래서 계획 확정은 승인 대신 도구 안에서 최신 상태를 다시 검사하도록 바꿨다
- 최종적으로 승인은 사용자 정보를 저장하는 ‘선호 저장’ 도구에만 남겼다
- 승인 대기에도 만료가 필요했다(2분). 추천 후보의 유효 시간(5분)과는 따로 쟀다
- 전체 에이전트에 붙이기 전에, 작은 테스트 에이전트로 중단과 재개가 되는지 먼저 확인했다

승인 여부는 모델의 응답이 아니라 사용자의 재개 명령으로 전달된다. 모델이 “승인됐다”고 말한다고 실행되는 구조가 아니다.

## 어떻게 동작하나

- 승인 대상 도구를 실행하기 직전에 멈춘다. 승인되면 실행하고, 거절되면 실행하지 않는다
- 멈춘 상태를 저장할 checkpointer가 필요하다. 재개할 때는 같은 `thread_id`로 그 상태를 이어받는다

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

승인·거절 후 재개:

```python
from langgraph.types import Command

agent.invoke(
    Command(resume={"decisions": [{"type": "approve"}]}),   # 거절: {"type": "reject", "message": "사유"}
    config={"configurable": {"thread_id": tid}},
)
```

## 막혔던 오류

| 증상 | 원인 | 해결 |
|---|---|---|
| `_describe() takes 1 positional argument but 3 were given` | 라이브러리가 `(tool_call, state, runtime)`로 호출 | 인자 3개 받기 |
| 승인 대상이 2개 이상이면 재개 안 됨 | 결정 개수 불일치 | 대상 개수만큼 `decisions` |
| 승인 직전에 실행해야 할 훅이 실행되지 않음 | `after_model` 훅은 등록 역순 실행 | HITL 미들웨어보다 뒤에 등록 |

## 남은 질문

- 승인을 하나로 줄이면, 그 하나의 승인 화면에는 무엇을 보여줘야 사용자가 실제로 판단할 수 있을까?
- 만료된 승인은 화면에서 어떻게 보여야 사용자가 다시 시도할까?

출처: SKALA 생성형 AI 서비스 개발 팀 실습 (2026-09-09 ~ 09-11)

---
title: 에이전트를 어디서 멈춰 세울까? — 입력·호출 횟수·출력 가드레일
category: ai
tags: [AI Agent, 가드레일, LangChain, Middleware]
date: 2026-09-11
summary: 입력 검사, 모델·도구 호출 한도, 출력 검사를 LangChain 미들웨어로 붙였다. 재시도가 호출 횟수에 안 잡히는 문제, 모델이 만든 가짜 ID 같은 걸 겪으며 고친 기록.
sample: false
related: [agent-hitl]
---

가드레일은 에이전트의 입력·실행·출력을 코드로 제한하는 규칙이다. 팀 실습에서 LangChain 미들웨어로 입력 검사, 호출 횟수 제한, 출력 검사를 붙였다.

## 붙이고 나서 발견한 것

- **재시도도 호출이다.** 재시도가 모델 호출 횟수에 잡히지 않고 있었다. 남은 호출 횟수가 없으면 재시도하지 않도록 고쳤다
- **입력 검사는 사람 입력에만.** HITL 재개 메시지까지 검사하고 있었다. `type == "human"`일 때만 검사하게 했다
- **모델이 ID를 지어냈다.** 최종 답의 후보 ID를 세션에서 실제로 조회한 것만 남기도록 했다. 안 그러면 존재하지 않는 ID가 사용자에게 보인다
- **`a.b`와 `ab`가 같은 파일로 저장됐다.** 사용자 ID의 해시값 앞 12자리를 파일명에 붙여 구분했다

## 어느 시점에 무엇을 검사하나

| 실행 지점(훅) | 실행 시점 | 검사 내용 |
|---|---|---|
| `@before_agent` | 입력 직후 | 빈 입력, 길이 초과, API 키 등 비밀정보 패턴 차단 |
| `@wrap_model_call` | 모델 호출마다 | 호출 횟수 한도, 일시 오류 재시도 |
| `@wrap_tool_call` | 도구 호출마다 | 허용한 도구인지 검사, 도구·외부 API 호출 한도 확인, 읽기 도구 재시도 |
| `@after_agent` | 최종 답 직전 | 실제로 조회한 적 없는 ID 제거 |

등록 순서:

```python
create_agent(
    model=model, tools=TOOLS,
    middleware=[
        input_validation,         # before_agent
        model_budget,             # wrap_model_call
        tool_policy,              # wrap_tool_call
        approval_middleware(),    # after_model (HITL)
        mark_approval_requested,  # after_model, 역순 실행이라 HITL 뒤
        output_integrity,         # after_agent
    ],
    checkpointer=InMemorySaver(),
)
```

입력에서 막으면 모델을 부르지 않고 끝낸다:

```python
@before_agent(can_jump_to=["end"])
def input_validation(state, runtime):
    if SECRET_PATTERN.search(text):        # r"sk-[A-Za-z0-9_\-]{20,}"
        return {"messages": [AIMessage(content="비밀값은 입력하지 마세요.")],
                "jump_to": "end"}           # 모델 호출 없이 끝
```

## 한도를 넘으면 어떻게 할까

숫자보다 **넘었을 때 무엇을 할지**를 정하는 게 더 어려웠다. 도구 호출은 그냥 멈추는 대신, 이미 확인한 사실만으로 답하게 했다. 아래 숫자는 이 서비스의 대화 흐름에 맞춘 값이라 다른 곳에 그대로 가져갈 기준은 아니다.

| 제한 항목 | 한도 | 넘으면 |
|---|---|---|
| 입력 길이 | 500자 | 안내 후 종료 |
| 모델 호출 | 8회 | 실행 중단 |
| 도구 호출 | 12회 | 추가 호출을 막고, 이미 확인한 사실만으로 응답 |
| 외부 API | 24회 | 도구 차단 |

## 남은 질문

- 한도 숫자를 어떤 근거로 정해야 할까? 이번엔 이 서비스의 실행 흐름을 보고 정했다

출처: SKALA 생성형 AI 서비스 개발 팀 실습 (2026-09-09 ~ 09-11)

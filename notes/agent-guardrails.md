---
title: AI 에이전트 가드레일 — 입력·호출 횟수·출력을 코드로 제한하기
category: ai
tags: [AI Agent, 가드레일, LangChain, Middleware]
date: 2026-09-11
summary: 잘못된 입력을 차단하고, 모델·도구 호출 횟수를 제한하며, 최종 응답을 검사한 방법입니다. LangChain 미들웨어의 실행 시점과 한도 초과 시 처리를 정리했습니다.
sample: false
---

가드레일은 AI 에이전트의 입력·실행·출력을 제한하는 규칙입니다. 이 실습에서는 LangChain 미들웨어로 입력 검사, 호출 횟수 제한, 출력 검사를 추가했습니다.

## 검사를 실행하는 시점과 역할

미들웨어의 훅은 에이전트 실행 중 지정한 시점에 검사 코드를 실행하는 지점입니다.

| 실행 지점(훅) | 실행 시점 | 검사 내용 |
|---|---|---|
| `@before_agent` | 입력 직후 | 빈 입력, 길이 초과, API 키 등 비밀정보 패턴 차단 |
| `@wrap_model_call` | 모델 호출마다 | 호출 횟수 한도, 일시 오류 재시도 |
| `@wrap_tool_call` | 도구 호출마다 | 허용한 도구인지 검사, 도구·외부 API 호출 한도 확인, 읽기 도구 재시도 |
| `@after_agent` | 최종 답 직전 | 실제로 조회한 적 없는 ID 제거 |

## 미들웨어 등록 순서

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

## 입력 차단 시 모델 호출 없이 종료하기

```python
@before_agent(can_jump_to=["end"])
def input_validation(state, runtime):
    if SECRET_PATTERN.search(text):        # r"sk-[A-Za-z0-9_\-]{20,}"
        return {"messages": [AIMessage(content="비밀값은 입력하지 마세요.")],
                "jump_to": "end"}           # 모델 호출 없이 끝
```

## 이 실습에서 정한 호출 한도

아래 값은 이 서비스의 실행 흐름에 맞춘 설정이며, 다른 서비스에 그대로 적용하는 기준은 아닙니다.

| 제한 항목 | 한도 | 한도 초과 시 처리 |
|---|---|---|
| 입력 길이 | 500자 | 안내 후 종료 |
| 모델 호출 | 8회 | 실행 중단 |
| 도구 호출 | 12회 | 추가 호출을 제한하고, 이미 확인한 사실만으로 응답하도록 안내 |
| 외부 API | 24회 | 도구 차단 |

## 구현 중 확인한 문제와 해결

- 재시도도 모델 호출 횟수에 포함해야 한다. 남은 호출 횟수가 없으면 재시도하지 않도록 수정했다
- 입력 검사는 사람 입력(`type == "human"`)일 때만 한다. HITL 재개 같은 메시지는 건너뛴다
- 최종 답의 후보 ID는 세션에서 실제로 조회한 것만 남긴다. 모델이 임의로 만든 ID가 사용자에게 표시되는 것을 방지했다
- 사용자 ID `a.b`와 `ab`가 같은 파일로 저장됐다. ID의 해시값 앞 12자리를 파일명에 추가해 구분했다

## 적용할 때 확인할 점

- 입력 차단, 호출 횟수 제한, 잘못된 ID 제거는 코드로 검사한다
- 각 한도를 초과했을 때 실행을 중단할지, 확인한 정보만으로 응답할지 정한다
- 한도 숫자는 서비스의 대화 길이와 호출 흐름을 보고 정한다. 다른 서비스에 그대로 가져가지 않는다

## 핵심 요약

> 입력 검사, 모델·도구 호출 제한, 출력 검사를 각각 구현합니다. 각 한도를 초과했을 때의 동작도 함께 정해야 합니다.

출처: SKALA 생성형 AI 서비스 개발 팀 실습 (2026-09-09 ~ 09-11)

---
title: Where should an agent be stopped? — guardrails on input, call counts, and output
category: ai
tags: [AI Agent, Guardrails, LangChain, Middleware]
date: 2026-09-11
summary: Disallowed actions should be blocked before execution, and further execution should be limited once a call budget is reached. Depending on the situation, the agent may need to stop entirely, block a specific action, or wait for approval. It should also determine whether it can answer using information already verified. This note covers input checks, call limits, and output checks with LangChain middleware, along with issues found during implementation.
sample: false
related: [agent-hitl]
---

> I don't think guardrails are there to block an agent as much as possible. They're a way to define in code how far the agent can proceed on its own, and where a human's judgment is needed. That's why separating a full stop, blocking a specific action, waiting for approval, and a partial answer matters.

Guardrails are rules that limit an agent's input, execution, and output in code. In a team exercise, we added input checks, call-count limits, and output checks with LangChain middleware. While building them, I felt that **deciding what to stop, and in which situation, matters more** than blocking risky requests.

## Where should an agent stop?

Not every error means the whole agent should shut down. Each step stops in a different way.

| Step | How it stops |
|---|---|
| Input | Input that can't be handled or isn't allowed is blocked before the model is called |
| Model call | Once the call limit is hit, further inference and retries stop |
| Tool call | Disallowed actions are blocked before they run, and actions that need human approval are held until approved |
| Error | Transient errors are retried within a set number of attempts, after first checking that the task is safe to run again |
| Output | Unverified results aren't passed to the user as if they were confirmed |

For example, if the API call limit is exceeded, new lookups can be blocked while the agent still answers from information it has already checked. But an unapproved change to an external system must not run, even if the model decided it was needed.

Output checks can't be the way to stop external actions. Hard-to-undo actions like payments or deleting data have to be controlled **at the tool execution step**, before the final answer is produced.

## What I found after adding them

- **Retries are calls too.** Retries weren't being counted toward the model call total. I fixed it so there's no retry when no calls are left
- **Input checks are only for human input.** We were also checking HITL resume messages. I changed it to check only when `type == "human"`
- **The model made up IDs.** I made the final answer keep only candidate IDs that were actually looked up in the session. Otherwise IDs that don't exist show up to the user
- **`a.b` and `ab` were saved as the same file.** I told them apart by adding the first 12 characters of the user ID's hash to the filename

## What gets checked, and when

| Hook | When it runs | What it checks |
|---|---|---|
| `@before_agent` | Right after input | Blocks empty input, input that's too long, and secret patterns like API keys |
| `@wrap_model_call` | On every model call | Call-count limit, retries on transient errors |
| `@wrap_tool_call` | On every tool call | Checks the tool is allowed, checks tool and external API call limits, retries read tools |
| `@after_agent` | Right before the final answer | Removes IDs that were never actually looked up |

Registration order:

```python
create_agent(
    model=model, tools=TOOLS,
    middleware=[
        input_validation,         # before_agent
        model_budget,             # wrap_model_call
        tool_policy,              # wrap_tool_call
        approval_middleware(),    # after_model (HITL)
        mark_approval_requested,  # after_model, runs in reverse order so it comes after HITL
        output_integrity,         # after_agent
    ],
    checkpointer=InMemorySaver(),
)
```

If input is blocked, it ends without calling the model:

```python
@before_agent(can_jump_to=["end"])
def input_validation(state, runtime):
    if SECRET_PATTERN.search(text):        # r"sk-[A-Za-z0-9_\-]{20,}"
        return {"messages": [AIMessage(content="비밀값은 입력하지 마세요.")],
                "jump_to": "end"}           # end without calling the model
```

## What happens when a limit is exceeded

Deciding **what to do when a limit is exceeded** was harder than picking the numbers. For tool calls, instead of just stopping, I had the agent answer using only facts it had already checked. The numbers below were set for this service's conversation flow, so they aren't a standard to copy elsewhere.

| Limit | Value | When exceeded |
|---|---|---|
| Input length | 500 characters | Show a notice and end |
| Model calls | 8 | Stop execution |
| Tool calls | 12 | Block further calls and answer only from facts already checked |
| External API | 24 | Block the tool |

## Open questions

- What should the limit numbers be based on? This time I set them by looking at this service's execution flow

Source: SKALA Generative AI Service Development team exercise (2026-09-09 ~ 09-11)

---
title: Where should approval go? — a LangChain HITL exercise
category: ai
tags: [AI Agent, HITL, LangChain, create_agent]
date: 2026-09-11
summary: Asking users to approve something they have already selected makes them decide twice. Approval should be placed where it is needed, based on an action's impact and reversibility, and users should understand what they are authorizing. This note covers implementing approval, rejection, and resumption with LangChain HITL, along with the errors encountered and how they were resolved.
sample: false
related: [agent-autonomy]
---

> **Only put approval on actions that are hard to undo.** In this exercise, I kept it on just one tool: the one that saves user information.
> I removed approvals that re-ask about something the user already picked, and instead check the latest state inside the tool.
> Approval comes from the user's resume command, not the model's response. The model saying "approved" doesn't make anything run.

HITL (human-in-the-loop) means adding a step where a person makes the call during an AI's execution. I settled on the rules above in a team exercise, while building an agent that asks for approval before saving user preferences.

## Why I set it up this way

| Action | At first | After the change | Why |
|---|---|---|---|
| Confirm plan | Asked for approval | No approval; re-check the latest state inside the tool | The user had already picked the candidate, so we were asking the same thing twice |
| Save preferences | Asked for approval | Kept approval | It saves user information and is hard to undo |

Pending approvals also needed a timeout (2 minutes), tracked separately from how long a recommended candidate stays valid (5 minutes). Approved, rejected, and expired each need to look different on screen.

## How to set it up

- Pause right before the tool that needs approval runs. If approved, run it; if rejected, don't
- You need a checkpointer to save the paused state. On resume, pick up that state with the same `thread_id`

```python
from langchain.agents.middleware import HumanInTheLoopMiddleware

HumanInTheLoopMiddleware(interrupt_on={
    "save_preferences": {
        "allowed_decisions": ["approve", "reject"],
        "description": describe,      # text shown on the approval screen
    },
    "confirm_plan": False,            # False runs it without approval
})

def describe(tool_call, state=None, runtime=None):   # takes 3 arguments
    return f"선호를 저장할까요? ({tool_call['args']})"
```

Resuming after approve or reject:

```python
from langgraph.types import Command

agent.invoke(
    Command(resume={"decisions": [{"type": "approve"}]}),   # reject: {"type": "reject", "message": "reason"}
    config={"configurable": {"thread_id": tid}},
)
```

## Errors I got stuck on

| Symptom | Cause | Fix |
|---|---|---|
| `_describe() takes 1 positional argument but 3 were given` | The library calls it as `(tool_call, state, runtime)` | Accept 3 arguments |
| Resume fails when 2 or more tools need approval | Number of decisions doesn't match | Pass one entry in `decisions` per tool |
| A hook that should run right before approval doesn't run | `after_model` hooks run in reverse registration order | Register it after the HITL middleware |

## Open questions

- If approval is cut down to one, what does that one screen need to show so the user can actually decide?
- How should an expired approval look so the user tries again?

Source: SKALA Generative AI Service Development team exercise (2026-09-09 ~ 09-11)

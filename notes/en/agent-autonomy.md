---
title: How autonomous should an agent be?
category: planning
categories: [planning, ai, ux]
tags: [AI Agent, Autonomy, Human-in-the-loop, UX]
date: 2026-11-06
summary: Thoughts on designing agent autonomy around execution permissions and risk level, human-in-the-loop, and giving users real control.
sample: false
related: [agent-hitl, why-ai-agent, agent-guardrails, agent-eval]
---

> More autonomy isn't automatically better for an agent. Autonomy should be designed differently depending on execution permissions, impact of the outcome, and how recoverable it is. That policy has to show up not only in backend execution control but also in the UI/UX for approvals, rejections, and execution history.

## The problem

An AI agent can understand a user's request, pick the tools it needs, and carry out real actions. So is an agent that finishes more tasks without human involvement necessarily a better agent?

- More autonomy can make work more efficient, but it also raises the risk that a bad judgment turns into a real action
- Requiring approval for every action cuts into the benefit of automation and adds to the user's review load

So when planning an agent, the first question shouldn't be **how much to automate, but which actions to automate under which conditions.**

## What I found in the research

### In real production, autonomy is applied in limited ways

*Measuring Agents in Production* shows that agents running in production tend to use short, controllable execution flows. A model's technical capability and the execution permissions a real service allows need to be kept separate.

### How users interact changes with their experience level

Anthropic's *Measuring AI Agent Autonomy in Practice* observed that experienced users made more active use of auto-approval while still stopping the agent when needed. But whether it's right to widen execution permissions for high-risk tasks just because a user is experienced is a separate call.

### Human approval doesn't guarantee safety on its own

Repeated approval requests can lead to review fatigue and rubber-stamp approvals. Human-in-the-loop isn't about adding an approve button. It's about designing things so a person can actually judge and step in with enough information.

## Criteria that decide autonomy

I think autonomy can be designed along three criteria.

| Area | Main criteria |
|---|---|
| Execution permissions | Scope the user delegated, org policy, legal limits |
| Task risk | Impact of the outcome, recoverability, uncertainty, chance of errors spreading |
| User experience | Experience level, work context, approval fatigue |

- Don't run actions there's no permission for
- Even for permitted actions, split automatic execution and prior approval by risk level
- Experience level only adjusts how approval works and how much information is shown. It must never be a reason to bypass required safety policies

## Turning autonomy policy into UX

Autonomy policy has to be reflected in the user experience, not just in backend execution control.

| Policy | What the screen should provide |
|---|---|
| Automatic execution | Low-risk, permitted tasks run automatically, but the execution history can be checked |
| Conditional approval | Before running, show what will change, the expected result, and why approval is needed |
| Not allowed | Explain why it's not allowed, possible alternatives, and how to request permission |
| After execution | Provide the task log, a way to stop, error handling, and recovery options |

What matters isn't whether there's an approval step, but **whether the user can understand and control what the agent does.**

## How do you evaluate the results of autonomy?

High autonomy alone doesn't tell you much about an agent's quality. Drawing on existing ideas for evaluating task success, safety, and operational efficiency, you could look at these metrics together.

| Evaluation area | Example metrics |
|---|---|
| Task results | Autonomous task completion rate |
| Safety | Rate of risky actions executed, rate of legitimate tasks wrongly blocked |
| Approval efficiency | Share of unnecessary approval requests, human review time |
| Operating cost | Time and cost to recover from errors |
| Business value | Net benefit: automation benefit minus review, operating, and error costs |

This is a proposed set of metrics. To apply it to a real service, you'd need to pin down each metric's denominator, measurement scope, and acceptance thresholds by risk level.

## Where I've landed for now

A good agent may not be one that handles everything alone, but **one that properly separates what it can do on its own from what needs a human's judgment.** For that, a PM has to design not just for model performance but also for execution permissions, risk levels, the approval experience, error recovery, and operational metrics.

That said, whether risk-based tiered approval actually delivers better work results and safety than approving everything still needs to be verified.

## Open questions

- Even when AI accuracy gets high enough, which tasks still need human approval?
- Can reducing approval requests and strengthening real human control go together?
- Can autonomy be adjusted dynamically based on a user's experience level and the service's operating history?
- What experiments and KPIs could verify whether an autonomy policy is appropriate?

## References

- [Measuring Agents in Production](https://arxiv.org/abs/2512.04123)
- [Anthropic — Measuring AI Agent Autonomy in Practice](https://www.anthropic.com/research/measuring-agent-autonomy)
- [NIST — AI Risk Management and Human-AI Interaction](https://airc.nist.gov/airmf-resources/airmf/appendices/app-c-ai-risk-management-and-human-ai-interaction/)
- [OpenAI — Guardrails and Human Review](https://developers.openai.com/api/docs/guides/agents/guardrails-approvals)

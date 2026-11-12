---
title: Why build it as an AI agent? — can you decide the next step in advance
category: planning
categories: [planning, ai]
tags: [AI product planning, AI Agent, Workflow, Execution scope]
date: 2026-10-07
date_type: class
summary: Calling an LLM multiple times or using tools does not by itself mean an agent is needed. First identify whether the model needs to choose its next action based on intermediate results. If an agent is used, define what it can choose, its execution limits, and when it must stop, then compare whether it actually produces better results than a fixed workflow.
sample: false
related: [agent-eval, agent-guardrails, agent-hitl]
---

> Calling an LLM multiple times or using tools does not by itself mean an agent is needed.

Here, an AI agent means a setup where the model picks its own next action and tools while working toward a goal. That's a different topic from building software with AI coding tools. This note is about when there's a real reason to put an agent inside a service.

## Can you decide the next step in advance?

Anthropic separates workflows, which follow paths defined in code, from agents, where the model dynamically directs its own process and tool use. It also says that the more complexity you add, the more you have to weigh latency and cost, not just performance. [Building effective agents](https://www.anthropic.com/research/building-effective-agents)

From a planning point of view, that splits like this:

| Approach | Fits when | Example |
|---|---|---|
| Fixed automation | You can define the inputs, processing rules, and order of steps | Check a condition, then send a notification |
| Language model call | You need text interpreted or generated, and the task scope is fixed | Extract the requested items from an inquiry |
| AI workflow | Multiple steps can be chained in code | Search → summarize → format check |
| AI agent | The next search or tool has to be chosen based on intermediate results | Look at whether material is missing, then research further |

Calling an LLM several times or using tools isn't enough on its own to need an agent. If you can't write down specifically **where the model has to choose dynamically**, I think a fixed workflow is likely the better answer.

And even if you go with an agent, split reversible work like research from hard-to-reverse work like saving data or sending it outside, and set permissions and approval conditions for each.

## If you've decided on an agent

Once you've decided to go with an agent, set the scope first.

- **Goal:** what output means the task is done?
- **Choice scope:** which of search terms, sources, and tools can the model pick?
- **Execution limits:** maximum run time, number of calls, cost
- **Stop conditions:** how does it end when material is lacking, failures repeat, or permissions are missing?

**How far to let it run on its own**, covering permissions, approvals, and execution logs, is covered separately in "How autonomous should an agent be?"

## Was the agent actually better?

Run the same task through a fixed workflow and through an agent, and compare. Look at completion rate and evidence quality, but also extra calls, time to finish, and how much people had to fix. Beyond normal inputs, feed in "no search results," "tool error," and "conflicting sources" to check that stopping and retrying work properly.

Running more steps isn't an achievement. The test is whether the user got the result they wanted.

## Open questions

- What about building it as a workflow first, seeing where it gets stuck, and switching only that part to an agent?

Related class: SKALA AI Agent Design and Development (last class 2026-10-07) · Planning review criteria compiled with reference to official sources

---
title: As AI agents multiply, what should a company manage?
category: planning
categories: [planning, ai]
tags: [Agent Governance, Agent Sprawl, Agent Lifecycle, AI ROI]
date: 2026-11-10
summary: Creating more agents does not by itself make an AI transformation successful. Organizations need to know what each agent does, who manages it, what permissions it has, and whether it delivers results. Drawing on Gartner forecasts and examples from SKT, IBM, and Cisco, this note covers management across the agent lifecycle and criteria for keeping, improving, or retiring agents.
sample: false
related: [agent-kpi, agent-autonomy, ai-failure-tracing, agent-guardrails]
---

> More AI agents doesn't mean AX is succeeding. I think what matters more than how many agents you've built is how you run, control, and improve the ones your organization actually needs.

## The problem

As AI agents spread, companies are starting to think not just about building agents but about how to manage the ones they've built.

The more agents there are, the more you risk duplicate functionality, unclear ownership, rising operating costs, and data access and security problems. AI agents also go beyond generating answers: they can query external systems and call tools to do real work.

So how should a company know and control which agents exist, who owns them, what permissions they run with, and whether they're actually delivering results?

## Agent governance and agent sprawl

**Agent governance** is the set of policies and accountability structures for managing an organization's AI agents through creation, operation, evaluation, improvement, and retirement.

A related concept is **agent sprawl**: as agents multiply quickly across an organization, it becomes hard to see the full picture or manage them by consistent standards.

In April 2026, Gartner projected that by 2028, global Fortune 500 companies could be using an average of more than 150,000 AI agents. It also reported that only 13% of organizations believe they have adequate agent governance.

The management steps Gartner laid out are: setting governance policies, keeping a central inventory of agents, defining identity, permissions, and lifecycle, managing data, monitoring behavior, and building a culture of responsible use.

My takeaway is that the point isn't to restrict every agent, but **to let the organization see the full picture while still scaling the agents it needs safely**.

## How are companies responding?

### SKT — from individual AI use to managing organizational results

Under its "one agent per person" strategy, SKT at one point had more than 7,000 internal agents created, but as reported in November 2026, it said only about 1,500 agents run on a regular basis.

As a result, its AX 2.0 strategy focuses on productivity across the whole organization rather than individual AI use. It's tackling data, permission, and security issues company-wide and building a system to evaluate each agent's business impact and results relative to token cost.

What matters here isn't the drop in agent count itself, but that **the goal of AI adoption is shifting from spreading usage to organizational results**.

### IBM — agents need identities and permissions too

In October 2026, IBM announced Agent Identity and access control features. Each agent gets a defined owner, lifecycle status, and allowed permissions, and is restricted to only the systems it needs. It also includes revoking access when an agent attempts an unauthorized action.

I read this as saying that if agents do real work, you have to manage not just who built them but **what permissions they were given and who is accountable for their actions**.

### Cisco — observing agent behavior and cost together

In November 2026, Cisco announced expanded Agent Observability and security validation features. Beyond tracing how agents run and the quality of their work, the direction is to evaluate token costs against business results.

It's an approach that doesn't stop at checking whether an agent ran correctly, but goes on to manage **whether that run created real value and whether the cost or risk was excessive**.

## How should the agent lifecycle be managed?

Looking at these three companies, I think agent governance isn't one specific feature. It has to apply across an agent's entire lifecycle.

| Stage | What to manage |
|---|---|
| Creation and registration | The agent's purpose, owner, target work, and overlap with existing functionality |
| Validation and deployment | Quality bar, data access permissions, risk level, approval conditions |
| Operation and observation | Usage, business results, execution errors, cost, policy violations |
| Evaluation and improvement | Causes of declining results, room for improvement, expected return on investment |
| Consolidation and retirement | Duplicate functionality, business value, upkeep cost, security risk, and whether something else can replace it |

This isn't an official standard that companies share; it's my own management perspective, based on the cases I looked at.

In particular, the performance metrics covered in my [note on designing AI agent KPIs](#n-agent-kpi) need to connect to operational decisions. For example, rather than automatically retiring a low-performing agent, you need to figure out the cause first.

| Decision | Conditions to consider |
|---|---|
| Keep or expand | Business value is proven and cost and safety conditions are met |
| Improve | There's demand for the work, but quality, data, tools, or UX can be improved |
| Retire or consolidate | Real business value is low, or it duplicates another agent's functionality |
| Pause | It doesn't meet required permission or security conditions |

Even with low usage, an agent may be worth keeping if it handles work that's only needed at certain times. Conversely, even if it's used often, its operation should be reviewed if upkeep costs are excessive or safety issues keep recurring.

## Where I've landed

I don't think agent governance is only about restricting what agents do or cleaning up low performers. It's closer to **treating agents as business assets and designing a system that manages them by consistent standards from creation through operation to retirement**.

Along the way, PMs also need to think beyond feature requirements to ownership, deployment criteria, permission scope, and evaluation and shutdown conditions.

Applying the same level of control to every agent can also be inefficient, since a simple information lookup and a job that changes data in an external system carry different risk. I think the level of management should vary with the agent's purpose, its execution permissions, and the impact if it fails.

In the end, I see **the purpose of agent governance not as controlling AI more, but as building a structure that lets the organization use AI safely and sustainably**.

## Open questions

- By what criteria should an organization assign each agent's owner and permissions?
- When an agent underperforms, how do you choose between improving, consolidating, or retiring it?
- Should every agent follow the same management standard, or should it vary by risk level?
- Could tighter central control end up discouraging teams from using and experimenting with AI?

## References

- [Gartner — Managing AI Agent Sprawl (2026.04.28)](https://www.gartner.com/en/newsroom/press-releases/2026-04-28-gartner-identifies-six-steps-to-manage-artificial-intelligence-agent-sprawl)
- [Electronic Times (etnews) — SKT AX 2.0 shifts to a results-driven system (2026.11.01)](https://www.etnews.com/20261031000044)
- [IBM — Identity and Control for AI Agents (2026.10.27)](https://newsroom.ibm.com/2026-10-27-ibm-introduces-identity-and-control-for-ai-agents%2C-securing-frontier-intelligence-for-the-enterprise)
- [Cisco — Agent Observability (2026.11.09)](https://newsroom.cisco.com/c/r/newsroom/en/us/a/y2026/m11/cisco-unveils-frontier-ai-red-teaming-and-agent-observability-to-secure-the-agentic-enterprise.html)

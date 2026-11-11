---
title: How should you design KPIs for an AI agent?
category: planning
categories: [planning, ai]
tags: [Agent Evaluation, Product KPI, Business Impact]
date: 2026-11-06
summary: An agent that works accurately and an agent that actually improves the work are not the same thing. Drawing on a production KPI framework and evaluation research, I laid out how to choose metrics in this order — goal → success criteria → KPIs → measurement and validation → improvement.
sample: false
related: [agent-eval, agent-autonomy, multi-agent-vs-single, why-ai-service]
---

> I think an AI PM's job isn't just to push success rates up. It's to define what counts as success and to make that result verifiable.

## The problem: how do you judge whether an AI agent succeeded?

The first metrics that come to mind when evaluating an AI agent are answer accuracy and task success rate. But **an agent working accurately and the user's work actually improving are two different things**.

Even an agent with 95% answer accuracy is hard to call a successful product if few people actually use it, or if users spend more time reviewing and fixing its output.

So what should define an AI agent's performance? Going beyond a list of KPIs, I looked at which metrics to treat as the core results and how to measure and validate them.

## Research: how are AI agents being evaluated?

### Google Cloud — a KPI framework for production

In February 2026, Google Cloud's *The KPIs that actually matter for production AI agents* split KPIs for production AI agents into three areas.

| Area | Core question | Key metrics |
|---|---|---|
| Reliability & Operational Efficiency | Does it perform reliably and efficiently? | Tool Selection Accuracy, Cost per Successful Task |
| Adoption & Usage | Is it actually adopted and used in real work? | Active Users, Acceptance Rate |
| Business Value | Does it improve productivity and business results? | Time-to-Value, OpEx Reduction |

The metric that caught my attention was **Cost per Successful Task**. Instead of checking whether AI calls are cheap, it measures how much was spent per task that actually succeeded. It also gives weight not just to how long the AI took to finish, but to how long it took a person to review and approve the result.

### Google Cloud — goal-driven agent evaluation

In November 2025, *A methodical approach to agent evaluation* stresses clear success conditions for the agent as the starting point of evaluation design. It uses three broad criteria:

1. **Agent Success & Quality:** the final result and the user experience
2. **Process & Trajectory:** whether tool choices and the execution path were appropriate
3. **Trust & Safety:** stability and security in edge cases

An agent can produce the right answer and still have queried the wrong data or called unnecessary tools. So you have to evaluate not just the final result but **the path it took to get there**.

### ACL 2026 — A Survey on Evaluation of LLM-based Agents

This is a comprehensive survey of agent evaluation methods and benchmarks. It notes that agent evaluation is broadening from static answer comparison to evaluating complex tasks in real environments, and that evaluating cost-efficiency, safety, and robustness in particular still has open problems.

This confirmed for me that a single accuracy metric isn't enough to judge whether an agent succeeds.

## How should AI agent KPIs be designed?

Drawing on Google Cloud's goal-driven evaluation method and KPI framework, I reorganized it into this sequence from a product planning perspective.

| Step | Design question |
|---|---|
| Define the goal | What business problem should the agent solve? |
| Define success criteria | What state counts as the work succeeding? |
| Choose KPIs | What core metric represents success, and what are the supporting and safety metrics? |
| Measure and validate | What data and evaluation methods will confirm the results? |
| Improve | What should be improved based on the measurements? |

This isn't an official five-step process from any study; it's a design procedure I put together from the references.

### Areas to consider when choosing KPIs

| Area | Example KPIs |
|---|---|
| Technical quality | Task Success Rate, Tool Selection Accuracy |
| Business results | Time to complete work, rework rate |
| User value | Adoption Rate, Output Acceptance Rate |
| Economics | Cost per Successful Task, ROI |
| Safety and control | Unsafe Execution Rate, Approval Compliance Rate |

Not every metric needs equal weight. For an agent that helps with information search, accuracy and time saved may matter most; for an agent that changes real data or runs actions in external systems, permission compliance and safety may be the more important constraints.

So pick the core KPIs based on the work's purpose, but **conditions you can't compromise on, like safety, may be best managed separately as guardrail metrics.**

## More things to consider in KPI design

- **Make the criteria for task success explicit.** An agent declaring a task done doesn't mean the work is actually finished. Decide what evidence will confirm success — automated checks, results in an external system, human approval, and so on
- **Keep measurement conditions consistent.** Comparing agents that handled tasks of different difficulty and types by overall success rate alone can lead to wrong conclusions. Look at what was evaluated, over what period, and how hard the work was
- **Account for trade-offs between metrics.** Raising the autonomous completion rate reduces human intervention but can also make risky actions more likely. Decide which metrics must hold steady while you push results up
- **Separate out the AI's contribution.** A drop in work time doesn't mean every improvement came from the AI. Compare against a pre-adoption baseline and, where possible, validate the effect under similar working conditions

## Where I've landed

I think AI agent KPIs should start not from the model's technical performance alone but from **first defining the work being solved and the value users should get**. Rather than looking for one core metric that applies to every product, it seems more important to choose metrics that fit the nature of the work and its risk level.

When measuring KPIs, you also need to separate the success an agent declares from the work actually being done, and validate not just the final result but the execution path and cost too.

In the end, I think an AI PM's job isn't just to push success rates up. It's **to define what counts as success and to make that result verifiable**.

## Open questions

- **North Star Metric:** What metric should represent an agent's core results?
- **Success Criteria:** Can a result that a person had to fix still count as the AI succeeding at the task?
- **Measurement:** Who should verify whether the work succeeded, and how?
- **Trade-off:** When completion rate, cost, and safety conflict, how do you prioritize?
- **Business Impact:** How can you isolate and measure the improvement that comes from adopting AI?

## References

- Google Cloud (2026.02.26). [The KPIs that actually matter for production AI agents](https://cloud.google.com/transform/the-kpis-that-actually-matter-for-production-ai-agents)
- Google Cloud (2025.11.17). [A methodical approach to agent evaluation: Building a robust quality gate](https://cloud.google.com/blog/topics/developers-practitioners/a-methodical-approach-to-agent-evaluation/)
- Yehudai et al. (2026.07). [A Survey on Evaluation of LLM-based Agents](https://aclanthology.org/2026.findings-acl.1330/), Findings of ACL 2026.

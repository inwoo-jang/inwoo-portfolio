---
title: As AI writes code faster, what needs to change in software development?
status: published
published: true
category: ax
categories: [ax, infra, ops]
tags: [AI Coding, Developer Productivity, CI/CD, Code Review, Technical Debt]
date: 2026-11-11
created: 2026-11-11
updated: 2026-11-11
summary: Faster AI code generation does not speed up delivery to users when review, CI, merging, and deployment are backed up. Identify where delays occur, and track time to deployment, errors, and rework alongside code output. Drawing on company examples, this note covers development bottlenecks, responsibility for verification, and how to measure productivity.
sample: false
related: [ai-dev-tools-compare, tech-stack-choice, agent-kpi]
---

> AI reducing the time it takes to write code does not mean the productivity of the entire development organization improves at the same rate. I think improving delivery speed means also considering validation, merging, deployment and maintenance after code generation.

## The problem

As AI coding tools improve, developers are spending less time writing code themselves. AI agents can now also analyze requirements, modify code and run tests.

But can existing development systems handle the volume of code and tasks these agents produce?

It is easy to assume that faster coding will naturally make development faster overall. Yet generated code has to pass through several stages before reaching a live service.

Code review, testing, merging, deployment and operations cannot necessarily keep up at the same pace.

What interested me was that **as code generation gets faster, the bottleneck can move elsewhere in the development process**.

## What are companies experiencing?

**1. GitHub — redesigning Git storage for the age of AI agents**

In November 2026, GitHub described a new architecture designed to improve the scalability of its Git storage infrastructure.

It accounts for the possibility of many more changes being made to a single repository as AI coding agents become more common.

GitHub reported that an internal test supported 5,000 concurrent agents working on one repository and about 7,200 pushes per second.

These figures describe a specific test environment, not a guarantee of the same performance for every repository.

What interests me is not the AI model's performance, but **the redesign of existing development infrastructure to handle the volume of work AI can produce**.

Reference: [GitHub Engineering — Inside GitHub's new Git storage architecture (2026-11-05)](https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/)

**2. Anthropic — source control and CI become bottlenecks as code volume grows**

In October 2026, Anthropic explained why it had built Scion, its own source control system.

According to the article, the number of code changes merged each day grew from about 2,500 in May 2026 to more than 30,000 in September.

As AI-assisted coding expanded, source control, builds and CI became bottlenecks rather than coding itself.

Anthropic redesigned its source control system to support that increased workload.

Together, these examples suggest that AI is changing more than how developers write code.

**Development infrastructure and collaboration processes may also need to adapt to the workload AI creates.**

Reference: [Anthropic — Redesigning source control (2026-10-13)](https://www.anthropic.com/research/redesigning-source-control)

## Where might the bottleneck move?

AI coding tools can increase code generation speed. But if later stages lack capacity, overall delivery speed may not improve much.

| Stage | Possible problems |
| :--- | :--- |
| Code generation | Duplicate functionality, more changes, less consistency |
| Version control | Conflicting changes, more branch and merge management |
| Code review | Longer queues, lower review quality |
| Testing and CI | Longer test runs and queues, higher compute costs |
| Deployment | Release risk from a larger volume of changes |
| Maintenance | Unnecessary code, structural complexity, technical debt |

For example, if AI agents generate 100 PRs a day but people can review only 20, the rest wait in a queue.

Increasing code generation capacity would not improve overall delivery speed in that situation. It could simply add more work to the review queue.

This resembles a production process in which the stage with the lowest capacity limits total throughput.

When adopting AI coding tools, we therefore need to look beyond code generation and **identify which stage is actually causing delays across the whole development flow**.

## Can AI review and maintenance help?

In November 2026, GitHub added an *Addressed Rate* metric for Copilot code review.

It lets teams see the proportion of AI review comments that developers acted on.

I see this as an attempt to observe not just how many issues AI flags, but whether its suggestions lead to action in the development process.

A high addressed rate does not, however, prove that reviews are accurate or that defects have decreased. Evaluating quality requires distinguishing useful suggestions from unnecessary ones.

Reference: [GitHub — Code Review Addressed Rate (2026-11-05)](https://github.blog/changelog/2026-11-05-usage-metrics-api-adds-code-review-details-and-addressed-rate/)

OpenAI has also shared examples of using Codex for software maintenance.

These include removing unused code, cleaning up stale experiments and improving CI, rather than only developing new features.

If AI can increase code production, it can also help remove unnecessary code and automate maintenance.

But the fact that AI performed maintenance is not sufficient on its own. We still need to verify that the changes preserved existing functionality and that maintenance costs actually decreased.

Reference: [OpenAI — Maintaining software with the GPT-6 family (2026-10-14)](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family)

## How should development productivity be measured?

Judging AI adoption by code volume or PR count alone may be misleading.

Even if more code is produced, productivity has not necessarily improved if that code cannot reach users or if post-deployment errors increase.

I think productivity measurement needs to consider the speed and reliability of the whole development flow alongside code output.

| Metric | What it helps us understand |
| :--- | :--- |
| Lead Time for Changes | Time from a code change to production deployment |
| Change Failure Rate | Proportion of deployed changes that cause failures or require recovery work |
| Review Time | Time needed to complete code review |
| CI Queue Time | Time CI jobs spend waiting before execution |
| Rework Rate | Proportion of completed work that needs further changes |
| Deployment Frequency | How often deployments occur over a given period |

Lead time, change failure rate and deployment frequency are also connected to DORA's software delivery performance metrics.

The goal should not simply be to make every metric higher or lower.

For example, more frequent deployments are not automatically a good outcome if failures also increase. Shorter reviews do not mean validation improved if important defects are being missed.

Ultimately, **speed and quality need to be evaluated together**.

Reference: [DORA — Software Delivery Performance](https://dora.dev/guides/dora-metrics-four-keys/)

## What should a product planner consider?

I do not think this is only an infrastructure issue.

As AI agents take part in development, the way requirements are defined, work is divided and completion criteria are set may become more important.

For example, when several AI agents develop a feature in parallel, these questions need clear answers:

- **Scope:** Which functionality and files is each agent responsible for changing?
- **Completion criteria:** Does completion mean code generation, passing tests, code review or deployment?
- **Validation responsibility:** Who makes the final check of AI-generated code and its errors?
- **Dependencies:** How will conflicts be prevented when agents change the same files or features?
- **Change management:** Can we trace what AI changed and why?

If requirements and acceptance criteria are unclear during planning, faster code generation can still lead to repeated rework.

Alongside the capabilities of AI coding tools, I therefore think **defining work clearly and dividing it into verifiable units** matters too.

## Where I've landed

Rather than assuming that better AI coding tools simply reduce developers' work, I think they may change which parts of that work matter most.

Writing code may take less time, but defining what to build, validating results and coordinating multiple tasks remain important.

As the GitHub and Anthropic examples show, existing development infrastructure can itself become a bottleneck when AI produces more code and changes.

That does not mean every organization needs large-scale repository architecture or complex automation.

First identify where delays actually occur, then choose the level of technology and process needed to address them.

I think **the purpose of adopting AI should be to deliver useful software to users faster and more reliably, rather than to produce as much code as possible**.

## Open questions

- How should productivity be compared before and after adopting AI coding tools?
- How can code review quality be maintained as AI-generated PR volume grows?
- If the bottleneck moves from writing code to validation and deployment, what should be improved first?
- How specific should requirements and completion criteria be in an AI-assisted development environment?
- Will more code generation create more technical debt, or can AI also reduce the maintenance burden?

## References

- [GitHub Engineering — Inside GitHub's New Git Storage Architecture (2026-11-05)](https://github.blog/engineering/architecture-optimization/inside-githubs-new-git-storage-architecture/)
- [Anthropic — Redesigning Source Control (2026-10-13)](https://www.anthropic.com/research/redesigning-source-control)
- [GitHub — Code Review Addressed Rate (2026-11-05)](https://github.blog/changelog/2026-11-05-usage-metrics-api-adds-code-review-details-and-addressed-rate/)
- [OpenAI — Maintaining Software with the GPT-6 Family (2026-10-14)](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family)
- [DORA — Software Delivery Performance](https://dora.dev/guides/dora-metrics-four-keys/)

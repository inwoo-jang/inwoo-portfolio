---
title: How can AI help clean up code?
status: published
published: true
category: infra
categories: [infra, tools, testing]
date: 2026-11-11
created: 2026-11-11
tags: [Technical Debt, Codex, Feature Flag, CI]
summary: A lack of recorded calls is not enough reason to delete code. Even when AI identifies cleanup candidates, their original purpose, production usage history, and dependencies on other features still need to be checked. Drawing on a Codex case study, this note covers investigating unused code, completed experiments, and slow CI jobs, making changes in small PRs, and verifying their impact.
sample: false
related: [ai-coding-delivery, ai-dev-tools-compare, model-selection]
---

If AI can help us write code quickly, can it also help clean up code that has accumulated? OpenAI's Core Experimentation team used Codex to find unused code and stale experiments and improve slow CI jobs.

What interested me most was not how much old code AI found, but **how it established why that code was still there**.

## Can code be deleted if there is no record of it running?

Codex examined past PRs, Slack discussions and internal project records, then checked production profiling data to see whether the code actually ran. It used code search to find references, change history to understand why code was introduced and production data to check for usage.

When looking at production data, **the observation period and operating conditions** matter. Code that has not run for several weeks might be used only for month-end batch jobs or incident response. References that code search misses could also come from framework configuration or reflection.

If I assigned this work to AI, I would ask it to record **where it looked, which period it examined and which possible call paths remain unchecked** for each candidate. I would start with small PRs for well-supported candidates so developers familiar with the feature could check which behavior must be preserved.

## When should feature flags from completed experiments be removed?

Feature flags turn functionality on or off and apply different behavior for different users or environments. When flags and old branches remain after an experiment ends or a feature reaches all users, future changes require checking more combinations.

Before cleanup, I would examine **settings across environments, recent evaluations, code references and dependencies from other flags** together. A flag can still matter even if its value is constant: it may be a prerequisite for another flag or an emergency switch used during incidents.

In OpenAI's example, a testing flag connected to multiple feature flags was adding CPU cost. Codex noticed that the management console marked it as `Permanent` and requested human review. After review, the team removed it and **estimated a CPU saving of about 0.42%** in the main affected service.

Defining cleanup conditions when a flag is created could reduce the need to reconstruct its purpose later. For example, a release flag could be created with **an owner, removal conditions and a cleanup ticket**. Uber's Piranha shows how code changes can be automated once the flag to remove and the branch to keep have been identified.

## If CI is slow, first find out where the time goes

CI results may arrive late because jobs are queued or because the tests themselves take a long time. GitHub Actions provides workflow and job metrics for queue time, execution time and failure rate. If AI analyzes that history, I would ask it to identify repeatedly slow jobs and attach estimated time savings and the calculation behind each proposed improvement.

OpenAI reported that after merging about 30 CI optimization PRs, **median CI completion time fell from roughly 10 minutes to 4.5 minutes**, and **the 90th percentile fell from 12.5 minutes to 6 minutes**. A later improvement added a missing mock, retaining all 63 tests while reducing that suite's runtime from about 593 seconds to 30 seconds.

To evaluate CI improvements, I would check the median and 90th-percentile completion times alongside failure rate and existing test coverage. That would show whether typical runs became faster and whether unusually long waits also improved.

## How far can a cheaper model investigate?

When OpenAI investigated stale experiments in the same repository scope, GPT-6.1 Sol Ultra produced 131 reviewed findings for $15.12 in API costs. GPT-6 Astra Ultra produced 142 for $109.06. In that experiment, Sol Ultra produced **about 92% as many findings at about 14% of the API cost**.

The differences mainly involved constant flags used as dependencies by other flags. In practice, I would use a lower-cost model to search broadly, then apply additional review to candidates with complex dependencies or substantial operational impact. I would also record **which types of candidates each model missed and how long people spent checking its evidence**.

## How I would apply this

I would start with one completed experiment or one repeatedly slow CI job. When AI gathers evidence and proposes a small PR, that PR should explain **why the change is needed, which behavior must be preserved and what to check afterward**.

After removing a flag, I would check that the released feature still behaves correctly in each environment. After improving CI, I would compare completion time and failure rate for the same workflow. Those results would help decide which cleanup work deserves time next.

## References

- [OpenAI · Maintaining software with the GPT-6 family](https://developers.openai.com/blog/maintaining-software-with-the-gpt-6-family) — unused code cleanup with Codex, model cost comparisons and CI improvements
- [LaunchDarkly · Reducing technical debt from feature flags](https://launchdarkly.com/docs/eu-docs/guides/flags/technical-debt) — identifying stale flags and planning cleanup
- [LaunchDarkly · Archiving flags](https://launchdarkly.com/docs/fed-docs/home/flags/archive) — recent usage and dependencies to check before archiving
- [Pete Hodgson · Feature Toggles](https://martinfowler.com/articles/feature-toggles.html) — categories of flags and tracking removal in the backlog
- [Uber Engineering · Introducing Piranha](https://www.uber.com/ke/en/blog/piranha/) — automatically removing branches from completed experiments
- [GitHub Docs · About GitHub Actions metrics](https://docs.github.com/en/actions/concepts/metrics) — queue time, execution time and failure rate metrics

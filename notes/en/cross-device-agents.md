---
title: How can an AI agent's work continue across devices?
status: published
published: true
category: ux
categories: [ux, ai, backend, infra]
date: 2026-11-05
created: 2026-11-05
updated: 2026-11-11
tags: [Cloud Agent, Session Persistence, Context Management, Cross-Device UX, Agent Analytics]
summary: Continuing work across devices requires managing progress and the execution environment alongside conversation history. Devices should share the same task state, while defining what users can inspect and control on each device. Drawing on Copilot examples, this note covers resuming tasks, approvals and permissions, device-specific UX, and considerations when measuring usage.
sample: false
related: [context-engineering, agent-memory, agent-hitl, agent-kpi]
---

> Is synchronizing conversation history enough for an AI agent to continue working across devices? I think the execution environment and task state also need to persist, so users can inspect and control the same task wherever they are.

## The problem

It is becoming possible to assign development work to an AI agent from a phone, then inspect the results or give further instructions from a computer.

But what allows work started on a phone to continue on a computer?

At first, it might seem like saving conversation history on a server and loading it on another device.

Coding agents, however, do more than chat. They modify code, run commands, execute tests and change the state of multiple files.

Continuing work across devices therefore requires managing not just conversations, but **what the agent is doing, how far it has progressed and which artifacts it has produced**.

## GitHub Copilot's connected cloud environment

On October 28, 2026, GitHub announced a connected cloud experience that lets users continue the same cloud agent session across mobile, web, IDEs, the CLI and collaboration tools.

Users can start work in GitHub Mobile, then inspect progress or provide further instructions in VS Code. Since the work runs in the cloud, a personal computer does not need to stay on.

GitHub's default execution environment is a cloud sandbox.

Work runs separately from the user's local computer. When the sandbox shuts down, a snapshot is saved so the session can resume later.

What matters here is not merely support for multiple devices, but **the separation between the environment doing the work and the interface through which the user controls it**.

Reference: [GitHub — Work from Anywhere with a Connected Copilot Cloud Experience (2026-10-28)](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/)

## How is conversation history different from task state?

I find it useful to separate the information an AI service needs to retain into three categories.

| Category | Information to retain | Purpose |
| :--- | :--- | :--- |
| Conversation state | User requests, AI responses, conversational context | Continue the conversation |
| Task state | Current stage, progress, failure point, pending approval | Inspect progress and resume work |
| Execution environment | File changes, execution settings, dependencies, environment snapshots | Restore the working environment |

This is a conceptual classification for understanding cloud agent design, not GitHub's official internal data structure.

For example, suppose a user requests a code change and then closes the phone app.

If the task continues running in the cloud, closing the app need not stop it.

If the cloud execution environment itself stops, however, restoring only the conversation history may not be enough to resume the work.

The service also needs to account for changed files, completed stages and the point of failure.

In other words, **maintaining the user's interface session and recovering the actual agent execution are separate problems**.

## What UX considerations change across devices?

The same agent task may need different interfaces in different settings.

On mobile, requesting work, checking progress and giving simple approvals or cancellations may be most important.

On a computer, more screen space supports complex work such as comparing changed files, reviewing code and inspecting test results.

Rather than showing the same interface everywhere, I think the goal should be **to share the same task state while providing controls appropriate to each device**.

Continuing work across environments also raises questions such as:

- What happens if the phone and computer send conflicting instructions at the same time?
- Can a user approve a pending action from another device?
- Does work continue when the network connection drops?
- Should someone taking over a session inherit its existing permissions?
- Which device should receive a completion notification?

These questions require designing task state, permissions and user interaction together, rather than simply synchronizing screens.

## How should AI usage across devices be measured?

On November 6, 2026, GitHub added Chat and VS Code Agents usage to the Copilot impact dashboard.

It also renamed the group previously labeled "Passive users" to "Chat-first users."

The change reflects how existing classifications could fail to show meaningful engagement by people who use Copilot Chat.

The rules for calculating adoption phases themselves did not change.

Reference: [GitHub — Copilot Impact Dashboard Update (2026-11-06)](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)

In a multi-device environment, it also matters what counts as one use.

If someone requests work on mobile and checks the result on a computer, is that two uses or one task?

The answer can depend on the purpose of the measurement.

- Users: distinct people using the service
- Sessions: task sessions created
- Usage by device: interactions on mobile, web and IDEs
- Task completion rate: the proportion of requested tasks completed successfully
- Human interventions: approvals, corrections and additional instructions
- Task completion time: time from the request to final completion

These are examples to consider in service design, not a claim that GitHub officially provides all of them in this form.

## The measurement system can also be wrong

In October 2026, GitHub disclosed a problem that prevented agent activity from being correctly counted as some IDEs migrated to the Copilot SDK.

Some activity was omitted and some was misclassified as Copilot CLI usage. GitHub said the missing historical activity could not be recovered.

This illustrates an important distinction in usage analysis:

**We need to distinguish users not using a feature from the measurement system failing to record that usage.**

When the same functionality is offered across platforms, consistent event definitions and collection criteria matter.

Reference: [GitHub — Restore Agent Activity in Copilot Usage Metrics (2026-10-06)](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)

## Where I've landed

Expanding an AI agent service across devices is not simply a matter of adding a mobile app.

The service needs to manage a task continuously, regardless of where the user requested it, and present a consistent view of its current state and results.

That means managing conversational context, task progress and the execution environment separately.

Usage measurement should also look beyond devices and conversation counts to understand which tasks users requested and how far those tasks progressed.

I think **AI agent UX is evolving from an experience contained in one screen into the experience of carrying out one task continuously across multiple environments**.

## Open questions

- How much task state should a cloud agent retain?
- How does snapshotting an execution environment differ from recording only task stages?
- How can conflicting instructions from different devices be prevented?
- Which approvals and edits should be available on mobile?
- Should AI adoption be measured primarily by session count or completed tasks?

## References

- [GitHub — Connected Copilot Cloud Experience (2026-10-28)](https://github.blog/changelog/2026-10-28-work-from-anywhere-with-a-new-connected-copilot-cloud-experience/)
- [GitHub — Copilot Impact Dashboard Update (2026-11-06)](https://github.blog/changelog/2026-11-06-copilot-impact-dashboard-adds-chat-and-vs-code-agent-usage/)
- [GitHub — Copilot Usage Metrics API: AI Adoption Cohorts (2026-05-29)](https://github.blog/changelog/2026-05-29-copilot-usage-metrics-api-adds-cohorts-for-ai-adoption/)
- [GitHub — Restore Agent Activity in Usage Metrics (2026-10-06)](https://github.blog/changelog/2026-10-06-update-your-ide-to-restore-agent-activity-in-copilot-usage-metrics/)
- [GitHub Docs — Using Copilot in the Cloud on GitHub Mobile](https://docs.github.com/en/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-mobile)

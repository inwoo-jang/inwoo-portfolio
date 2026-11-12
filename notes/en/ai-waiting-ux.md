---
title: How should a service behave while users wait for an AI answer?
category: planning
categories: [planning, dev]
tags: [Async, Queue, Streaming, UX]
date: 2026-11-10
summary: The design should define whether users can do other things while waiting for an AI response and how they can check progress and results. Leaving a screen and canceling a task should be treated separately, with clear limits on what can be retried after a failure. This note covers synchronous and asynchronous processing, streaming, queues, and how response patterns and available user actions should fit the task and its state.
sample: false
related: [tech-stack-choice, claude-cli-in-app]
---

> Designing how an AI service responds isn't just about making it faster. It's about deciding whether the user has to wait, whether they can do something else while waiting, and how they can see where things stand.

## Designing an async flow in Quiket

In Quiket, I designed quiz generation so that after requesting a quiz, the user could go back to the home screen instead of staying on that screen until it finished. Generating a quiz takes time, but I decided there was no reason for the user to keep staring at the screen meanwhile.

Extending that experience to AI services in general raises a few questions:

- Does the user really have to wait for the result?
- Should they be able to use other features while they wait?
- Is it useful to show the content as it's being generated?
- What happens if the job fails or the user leaves the screen?

In the end, I think what matters isn't processing everything fast, but **designing the response style and user experience to fit the nature of the job**.

## How are sync, async, streaming, and queues different?

The four concepts look similar but solve different problems.

| Concept | Core role |
|---|---|
| Synchronous | Waits for the previous step's result before moving on |
| Asynchronous | Decouples the work so other things can proceed without waiting for it to finish |
| Streaming | Sends generated content piece by piece before the full result is done |
| Queue / Worker | Puts jobs in a queue for a separate process to handle |

Sync vs. async has to be looked at separately from **the user-experience side** and **the server-processing side**. A user waiting on a screen and a server holding an HTTP request open while waiting for a response don't necessarily mean the same thing. The server can accept a job asynchronously while the frontend still shows a loading screen until it's done. Conversely, streaming can deliver data gradually over a single open HTTP connection.

### Why do you need queues and workers?

> [!Example] Analyzing a 100-page document with AI
> 1. **User** — requests a document analysis
> 2. **API server** — accepts the request and issues a job ID
> 3. **Queue** — registers the job to be processed
> 4. **Worker** — picks up the job and runs the document analysis and AI calls
> 5. **Result storage** — saves the finished result and makes it available to the user
>
> The user doesn't need to keep the screen open until the analysis finishes.

When jobs pile up, the queue controls throughput, and you can scale workers separately. But adding a queue doesn't make the work itself faster. Wait times can even go up, and you now have to manage duplicate runs, failures, retries, and worker outages.

So my understanding is that **a queue isn't a required part of async; it's a structure you add when job volume and reliable processing call for it**.

### What does streaming solve?

Streaming shows content as it's generated instead of sending the whole answer once the AI is done. It fits services where the user can start reading right away, like a typical AI chatbot. Common ways to implement it are SSE (Server-Sent Events) and HTTP streaming.

But streaming doesn't shorten the actual time to finish the job. It improves **perceived wait time**, because the user sees the first output sooner. You also have to decide what happens if an error occurs mid-answer: keep what's already shown, mark it as failed, or allow regeneration.

## The response style depends on the job

Not every AI service needs streaming or a queue.

| Use case | What to consider first | Why |
|---|---|---|
| Short data lookup | Plain request/response | Seeing the result immediately matters |
| AI chatbot | Streaming | The user can read the answer as it's generated |
| Bulk document analysis | Async + queue/worker | Separates long-running work and manages throughput |
| Image or video generation | Async + status polling | The finished output can be checked later |
| Bulk notifications | Async + queue/worker | Handles failures and retries for individual jobs |

These approaches aren't mutually exclusive. You can run a job asynchronously and stream its progress.

At the planning stage, you can decide using these criteria:

- **Job duration:** How long does the user have to wait for the result?
- **User dependency:** Can the user take their next step only once the result is out?
- **Value of partial results:** Is showing content mid-generation actually useful?
- **Request volume:** How are concurrent spikes in requests handled?
- **Failure risk:** What do interruptions, retries, and duplicate runs affect?
- **Operating cost:** Is it needed enough to justify running a separate queue and workers?

So the deciding factor isn't response speed but **user behavior and the nature of the job**.

## How far should the PM define things?

A PM may not need to decide how the queue or workers are implemented. But they do need to define what statuses the user sees and what actions are allowed in each.

| Status | What to show the user, and the rules |
|---|---|
| QUEUED | Whether the request was accepted, a note that it's waiting |
| RUNNING | Progress, whether the user can leave the screen |
| SUCCEEDED | Viewing the result, a completion notification |
| FAILED | A failure message, whether retry is possible |
| CANCEL_REQUESTED | A note that cancellation is in progress, preventing duplicate requests |
| CANCELED | The cancellation result, whether the user can request again |

Once the statuses are set, there are more things to think through.

**How should progress be shown?** For AI jobs, it's often hard to predict exactly when they'll finish. If you can't measure actual progress, it may be better to show verifiable stages like "Analyzing document" or "Generating answer" rather than an arbitrary "70% complete."

**Leaving the screen and canceling the job are different things.** A user closing the page or moving to another screen doesn't automatically stop the AI job on the server. You need a rule for whether the job keeps running after the user leaves, and whether a cancel request actually stops the underlying work.

**Define the scope of failures and retries.** Re-running an AI call costs money again. If the job saves or changes data in an external system, duplicate runs can cause side effects. Whether to retry automatically, the maximum number of attempts, and how to handle duplicate requests should be reviewed with the dev team. **Idempotency** — making sure repeated identical requests don't create unintended duplicate results or side effects — is also an important consideration.

## Where I've landed

I don't think a long response time, by itself, is a reason to add async processing or a queue to an AI service.

If users can read the result as it's generated, streaming may fit; if they don't need to stay on the screen until it's done, an async flow may be better. If request volume is high or reliable reprocessing matters, queues and workers are worth considering.

Whatever structure you choose, though, users need to know whether their request was accepted, what state it's in now, and what they can do if it fails.

**I think a PM's job isn't to pick a technology first. It's to define the experience users need and the conditions the service must handle, then decide on a matching technical structure together with the dev team.**

## References

- [Microsoft Learn — Asynchronous Request-Reply Pattern](https://learn.microsoft.com/en-us/azure/architecture/patterns/async-request-reply)
- [MDN — Using Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events)
- [AWS — Amazon SQS Standard Queues](https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/standard-queues.html)

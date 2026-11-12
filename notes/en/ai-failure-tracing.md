---
title: When an AI answer is wrong, how do you find where it failed?
category: ops
categories: [ops, ai]
tags: [AI Observability, Tracing, Root Cause Analysis, LangSmith]
date: 2026-10-23
summary: Knowing that the final answer is wrong does not tell you what to fix. Step-by-step execution records (Tracing) help narrow down the cause by showing retrieval results, information passed to the model, tool calls, and final output. This note covers checking improvements and regressions against the same evaluation cases after a change, and deciding what to log.
sample: false
related: [agent-eval, rag-citation-rules, agent-guardrails]
---

> Observability is how you estimate where a problem happened. Evaluation is how you confirm that a fix actually made things better.

## The problem

When an AI service gives a wrong answer, what should you check first?

With ordinary software bugs, you can trace the failure point through exception messages or server logs. But RAG systems and AI agents produce results through several steps: retrieval, prompt building, model inference, tool calls, and so on. Knowing that the final answer is wrong doesn't tell you which step went wrong.

Say a tax consultation AI gave the wrong tax rate.

- The retrieval system may have pulled an outdated law
- It may have retrieved the current law, but the needed part never reached the model
- The right evidence may have reached the model, and the model misread it
- The value may have changed during a tool call or post-processing

Every one of these shows up as "a wrong answer," but each points to something different to fix. So **shouldn't an AI service record not just the final result, but the process that produced it?**

## Breaking AI errors down by step

Rather than treating an AI failure as one problem, it helps to separate it by step.

![How an AI agent processes a request: interpret the question, retrieve evidence, call tools, check policy and permissions, generate the answer, return the final response. This is an illustrative structure; real agents may repeat retrieval and tool calls or skip some steps.](media/notes/ai-failure-pipeline-clean.png)

| Step | What can go wrong | What to check |
|---|---|---|
| Retrieval | Fails to find relevant documents | Query, retrieved documents, scores |
| Context | Needed information is missing or truncated | The context actually passed to the model |
| Generation | Misreads evidence or makes up facts | Model input and output, prompt |
| Tool Calling | Picks the wrong tool or arguments | Tool name, arguments, result |
| Policy / Validation | Allows an improper action or blocks a legitimate one | Policy rules, decisions, approval status |
| Output | Post-processing or response assembly errors | Generated result vs. final output |

This breakdown is only a starting point for root cause analysis. One error can span several steps, so you can't assume each step is an independent cause.

The thing to separate in particular is that **technical execution success and correct results are different things.** An API call can finish normally with no error code and the model can still have produced wrong information. Execution status and answer quality need to be evaluated separately.

## Observability and tracing

Going through related material, I came across the concepts of AI observability and tracing.

**Observability** is the ability to understand a system's internal behavior and state from the data it emits. In an AI service, what you observe includes not only model calls but also retrieval, tool execution, inputs and outputs, latency, and token usage.

**Tracing** records how a single request is processed, step by step, with the steps linked together.

- **Trace:** The full execution record for one request
- **Span:** An individual operation inside a trace
- **Attributes:** Extra information for each operation, such as model name, input and output, duration, and status

For example, one trace can contain a retrieval span, an LLM call span, and a tool execution span.

### What if you only log the final answer?

If you only store the question and the final answer, you can tell that an error happened, but you don't have enough to analyze the cause. On the other hand, storing every input, retrieved document, tool argument, and intermediate result helps tracing but raises storage costs and the risk of exposing sensitive information.

So I think what matters isn't logging a lot, but **a design that records first the information you need to tell failure causes apart.**

## Looking at tools

I looked at LangSmith, Langfuse, and Arize Phoenix as tools for tracing and evaluating AI execution.

| Tool | Main features | How I'd use it |
|---|---|---|
| LangSmith | Tracing, run analysis, evaluation | Checking how LangChain and LangGraph agents run |
| Langfuse | Tracing, prompt management, evaluation, usage analytics | Watching quality, cost, and operational metrics |
| Arize Phoenix | Tracing, RAG evaluation, experiment comparison | Analyzing retrieval and generation steps and verifying improvements |

The three tools overlap a lot. Rather than seeing them as built for completely different purposes, it makes sense to choose based on your existing dev environment and the features you need.

I'd used LangSmith before while learning LangChain and LangGraph. Looking at it again this time, what stood out was that checking an agent's results and recording its execution path to analyze the cause of errors are two different activities.

Tracing tools also don't pin down the cause for you. Execution records only give you evidence about the cause. Confirming the actual cause takes further comparison and verification.

## How should you verify the cause of a failure?

Finding a suspicious step through tracing doesn't confirm the cause on its own. If the right document was retrieved and the final answer was still wrong, it could be a context-building or prompt problem, not just the model misreading.

So I think a process like this is needed.

1. Collect failure cases and define the expected results
2. Check the input and output of each step in the trace
3. Form a hypothesis about the cause
4. Fix the suspected element and keep everything else as unchanged as possible
5. Check for improvement and side effects on the same evaluation cases and on additional ones

![Order for narrowing down the cause of a wrong answer: detect the error; depending on whether the right evidence was retrieved, check retrieval and data or context and generation; reproduce and compare under the same conditions; fix, run regression tests, and monitor](media/notes/ai-failure-triage-clean.png)

Model output can be nondeterministic, so a single rerun isn't enough to confirm an improvement. Version everything that changed, such as the prompt, model, retrieval index, and policies, and run the same evaluation dataset repeatedly.

## Judgment calls from a PM's point of view

### Is logging everything the best option?

At first I thought the more detail I logged about execution, the easier errors would be to analyze. But in a real service, the level of detail changes cost and operational load. Especially in services handling sensitive information, like tax, healthcare, or HR, user input, retrieved documents, and tool arguments can contain personal data.

| Criterion | What to consider |
|---|---|
| Can you analyze the cause? | What information do you need to keep to tell failure points apart? |
| Privacy | Do you need to store the raw text? Can it be masked or de-identified? |
| Storage cost | Does every request need to be logged? |
| Operational efficiency | Which failures should be analyzed first? |
| Reproducibility | Can you track model, prompt, data, and policy versions? |

For now, rather than storing all data no matter what, I'd like to first consider **logging basic execution info consistently and collecting detailed data only when needed, in a limited way.** For example, normal requests would keep metadata like execution steps, duration, status, and versions, while failed requests would make the necessary detail available.

That said, there are cases where you can't recover the raw text later, so deciding in advance which data to collect matters.

### Shouldn't error analysis have priorities too?

You can't investigate every wrong answer at the same depth. A simple wording mistake, a wrong tax rate, and an unapproved tool execution have different business impact. I think analysis priority should be set by looking at frequency together with user impact, recoverability, and safety risk.

## A small experiment plan

**Goal: Analyze one failed AI response through its trace, form a hypothesis about the cause, and verify whether a fix improves it.**

I plan to use a RAG or agent project I built before.

1. Build a small evaluation dataset that includes both normal and failure cases
2. Record execution with a tracing tool such as LangSmith
3. Pick one failure case and check its retrieval results, model input, and tool calls
4. Write down the cause hypothesis and change one related element
5. Rerun the same case, and compare performance on the full evaluation dataset too

| What to record | Details |
|---|---|
| Failure case | Question, expected result, actual result |
| Trace | Input, output, and status for each step |
| Environment | Model, prompt, data and policy versions |
| Cause hypothesis | The step suspected of causing the problem, and why |
| Change | What was actually changed |
| Re-verification | Whether it improved under the same conditions, and the effect on other cases |

I haven't run the experiment yet. Once I've checked the results, I'll write them up along with the actual trace.

## Where I've landed

When an AI answer is wrong, I think what matters isn't fixing the prompt or switching models, but **judging, based on evidence, what went wrong at which step.** That requires being able to trace the execution path from the development stage on, and designing the logs and version info you'll need.

- The success or failure of the final response alone makes it hard to decide what to fix
- Step-by-step execution records help narrow down the cause of errors
- Logs don't prove the cause by themselves, so reproduction and comparison experiments are needed
- How much to observe has to weigh cost and privacy, not just how analyzable things are

In the end, AI service planning also has to design **not just what to build, but how you'll find, analyze, and fix problems when they happen.**

## References

Checked: 2026.11.10

- [LangSmith — Observability](https://www.langchain.com/langsmith/observability) — Tracing agent execution steps; watching latency, cost, and response quality
- [Langfuse — GitHub](https://github.com/langfuse/langfuse) — Tracing, evaluation, and operational observability for LLM applications
- [Arize Phoenix — Official docs](https://arize.com/docs/phoenix/) — OpenTelemetry-based tracing, evaluation, datasets, and experiments
- [Phoenix — Traces & Spans](https://github.com/Arize-ai/phoenix/blob/main/.agents/skills/phoenix-tracing/references/fundamentals-overview.md) — Concepts of traces, spans, and their hierarchy

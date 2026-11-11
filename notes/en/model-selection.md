---
title: How should you choose an LLM? — balancing performance, reasoning, and cost
category: planning
categories: [planning, ai]
tags: [LLM, Model Selection, Reasoning, Inference Cost, AI Service Planning]
date: 2026-09-05
summary: Performance versus cost isn't an either-or choice. Meet the quality and safety bar first, then optimize latency and total cost per successful task. This note looks at parameter count, reasoning, and cost separately, and lays out criteria for choosing a model through model routing and comparison experiments.
sample: false
related: [why-sllm, why-ml-model, multi-agent-vs-single, agent-kpi, when-rag, ai-failure-tracing]
---

> A model with more parameters and stronger reasoning isn't necessarily the best fit for a service. What matters more than a model's absolute performance is what cost and time it takes to reach the quality you need.

## The question: why not just use the best-performing model?

The first criterion that comes to mind when choosing an AI model is performance. Isn't a model with more parameters smarter? Doesn't longer reasoning produce more accurate answers? So why not just use the best-performing model?

That's partly true. High-end models can have an edge on complex reasoning or hard problems. But not every service needs the same level of reasoning. Do you need the biggest model for simple information extraction? If the performance gap is small but the model is slower and costs several times more, is it still a good choice?

Running an AI service means looking at latency, call cost, retries after failure, and human review cost, not just accuracy. So the real question is **less "what's the best model?" and more "by what criteria do we choose the model that fits our service?"**

Even a high-performing model runs into other constraints in a real service.

> [!Example] Comparing three models (hypothetical numbers)
> | Model | Task success rate | Cost per request |
> |---|---:|---:|
> | A. Lightweight model | 85% | KRW 10 |
> | B. Mid-size model | 95% | KRW 25 |
> | C. High-end model | 98% | KRW 80 |
>
> On success rate alone, C looks best. But going from 95% to 98%, a 3 percentage point gain, raises the cost per request from KRW 25 to KRW 80.

Is that gap worth it? It depends on the task. For a simple classification where errors have little impact, B may be enough. If a wrong result leads to a large financial loss or a safety problem, C's extra cost may be justified.

What matters is **evaluating both the size of the performance gain and the business value that gain creates**.

## Parameter count: why bigger isn't always better

Parameters are numerical values, like weights, that a model learns. Scaling up a model can increase its capacity to learn more complex patterns. But a large parameter count alone doesn't tell you the model actually performs better.

### Chinchilla — how you allocate training compute matters as much as model size

DeepMind's *Training Compute-Optimal Large Language Models* (2022) analyzed the relationship between model size and amount of training data. The researchers trained the 70-billion-parameter Chinchilla and compared it with the 280-billion-parameter Gopher. Chinchilla had about a quarter of the parameters but outperformed Gopher on most of the tasks they evaluated. The finding was that, for the same training compute budget, splitting it well between model size and training data matters.

The takeaway for me: **parameter count is not a ranking of model performance**. Results depend on the quantity and quality of training data, the model architecture, and how it's trained.

### Why parameter counts are hard to compare directly

Recent models also use a Mixture of Experts (MoE) architecture. MoE activates only some of several expert networks depending on the input. So the total parameter count can differ from the number of active parameters used at inference. An MoE model with more total parameters may use less compute per token than a model with a different architecture.

That said, actual speed and cost are also affected by memory use, hardware, batching, and implementation. Bottom line: don't judge accuracy, speed, or cost from parameter count alone.

## Reasoning: does more reasoning always mean more accuracy?

Reasoning models can go through extra reasoning steps to solve a problem. For complex math, multi-step decisions, or code analysis, this can improve performance. But reasoning longer doesn't improve results on every task.

The NeurIPS 2025 paper *Does Thinking More Always Help?* looks at the so-called overthinking problem. It analyzes how extra reasoning doesn't always lead to better performance, and how too much reasoning can actually make results worse. As reasoning increases, performance may rise at first, then the gains shrink or performance drops past a certain point. Longer reasoning also means longer latency and higher cost for generated tokens.

| Task | Capability needed | Model to consider first |
|---|---|---|
| Extracting an order number | Extracting information in a fixed format | Lightweight model, or code |
| Deciding how complex tax law applies | Comparing many conditions, exceptions, and sources | High-end reasoning model |

Extracting an order number may not need complex reasoning at all. Comparing the requirements and exceptions across multiple statutes, on the other hand, can benefit from extra reasoning. But using a reasoning model doesn't guarantee a correct legal judgment. The right sources have to be supplied accurately, and there needs to be a step that verifies the applicable conditions.

So I think **the reasoning level shouldn't be set as high as possible; it should match the task's difficulty and the quality required**.

## Cost: price per token versus total cost per successful task

When looking at model cost, the easiest thing to check first is the input and output token price. But the real cost of a service isn't set by token price alone.

- Input and output token usage
- Extra tokens generated during reasoning
- External search and tool calls
- Retries after failure
- Result verification and human review
- Fixing and recovering from errors
- System operating costs

So instead of the cost of a single request, compare **the total cost to complete one successful task**.

```text
Cost per Successful Task
= total task processing cost / number of successful tasks
```

> [!Example] Running the numbers on the hypothetical models above
> Based on a single run, assuming no retries and no separate operating costs.
>
> | Model | Cost per request | Success rate | Cost per successful task |
> |---|---:|---:|---:|
> | A | KRW 10 | 85% | ~KRW 11.8 |
> | B | KRW 25 | 95% | ~KRW 26.3 |
> | C | KRW 80 | 98% | ~KRW 81.6 |

In practice, if failed tasks are retried or need human review, the total cost changes. If A fails often and people have to fix the output by hand, the call cost may be cheap but the actual cost of getting the work done can be high. Conversely, if a high-end model's accuracy cuts rework, it may offset the extra model cost.

So **a cheap model isn't always economical, and an expensive model isn't always inefficient.**

## Selection criteria: set the quality and safety bar first, then optimize cost and latency

Quality and safety are **the bar you have to clear**; cost and latency are **what you optimize** among the candidates that clear it.

| Criterion | Question to ask |
|---|---|
| Task difficulty | Does it need complex reasoning, or is it simple classification or extraction? |
| Quality | What errors can be tolerated? |
| Latency | How long can the user wait? |
| Cost | How much can you spend on one successful task? |
| Operational reliability | Does it handle retries, outages, and tool calls reliably? |
| Data and security | Does it meet requirements for personal data, access permissions, and data handling? |

What matters most differs by service. For real-time customer support, latency is key; for a complex company analysis report, accuracy and faithfulness to sources may matter more even if it's a bit slower. So rather than weighting every metric equally, you need to **separate the conditions you must meet from the metrics you optimize**.

OpenAI's guide to building agents describes setting a performance baseline with a strong model first, then swapping some tasks over to smaller, faster models. From a planning point of view, I'd put it like this:

1. **Define the task and success criteria:** decide what the model will do and the quality required
2. **Measure a performance baseline:** use a high-end model to see what quality is achievable on that task
3. **Compare lightweight models:** measure smaller models on the same evaluation data
4. **Compare reasoning levels:** check whether more reasoning actually improves performance
5. **Verify cost, speed, and safety:** check the relationship between quality gains and added cost
6. **Final choice:** among the candidates that meet the required quality, pick the setup that runs most efficiently

One caveat: **a high-end model's output is not the ground truth**. Evaluation should use separately defined correct answers, verifiable results, and the judgment of domain experts.

## Model routing: should every task use the same model?

Even within one service, each task needs different capabilities. Taking TaxDesk as an example, you could split it like this:

| Task | Approach to consider first | Why |
|---|---|---|
| Classifying the question type | Lightweight LLM or rules | Relatively simple classification |
| Finding relevant statutes | Search system / RAG | Looking up source documents |
| Analyzing complex applicability requirements | High-end reasoning model | Comparing many conditions and exceptions |
| Calculating tax | Verified calculation logic | Accurate, reproducible calculation |
| Validating answer format | Code | Checking format and required fields |

This way you can combine different models with plain code and search technology per function. That's the idea behind model routing, or task-based routing.

But splitting every task across multiple models isn't always better. More routing steps make the structure more complex, and picking the wrong model hurts quality. Managing and evaluating multiple models also adds operating burden. Start with a single-model setup as the baseline, and check whether splitting actually helps.

This is a design direction I could apply to TaxDesk, not a result of validating this setup in production.

## Comparison experiments: evaluating by model tier and reasoning level

| Option | Setup | What to check |
|---|---|---|
| A | Lightweight model | Does it reach the target quality at low cost? |
| B | Mid-size model | Is the balance of performance and cost good? |
| C | High-end model | Does quality improve as much as the extra cost? |
| D | Different reasoning levels | Does extra reasoning have an effect? |
| E | Per-task model routing | Is it more efficient than a single model? |

Use the same questions, input data, output format, and evaluation criteria wherever possible. Models differ in the reasoning settings and context lengths they support, though, so not every condition can be matched exactly. Record any conditions you couldn't match.

If you only use simple questions, it's hard to see the strengths of high-end models or the limits of lightweight ones. Split the evaluation questions by difficulty.

- **Simple tasks:** classification, information extraction, format conversion
- **Typical tasks:** document summarization, simple Q&A
- **Complex tasks:** analysis combining multiple conditions
- **Edge cases:** handling incomplete or conflicting information
- **Can't answer:** does it avoid guessing when there's no evidence?

Don't judge from a single run; run it repeatedly and see how much the results vary.

| Area | Metric |
|---|---|
| Output quality | Task Success Rate, Accuracy |
| Evidence quality | Faithfulness, source match rate |
| Speed | Average and p95 latency |
| Cost | Cost per Successful Task |
| Reliability | Error rate, retry rate |
| User workload | Review time, edit rate, rework rate |

Not every service needs every metric. For simple information extraction, accuracy, processing time, and cost are what matter; for evidence-based analysis, you also need to look at faithfulness to sources and the impact of a wrong judgment.

### Questions to ask alongside the experiments

**How much more would you pay for a 1 percentage point gain in accuracy?** The value of better accuracy differs by task. You can't compare simple content classification and high-stakes decision support, like finance or healthcare, on the same scale. Look not just at how likely an error is, but at its impact when it happens.

**Would strengthening verification beat using a high-end model?** Another approach is to draft with a lightweight model and verify with code checks or an evaluator model. But more verification steps add call cost and latency, and the evaluator model can be wrong too. You have to actually compare a single high-end model against a lightweight model plus verification.

**As models improve, should you revisit your choice?** Model performance and pricing keep changing. There's no guarantee that today's most efficient model will still be the best in a few months. So keep your evaluation data and criteria around, so you can compare new models under the same conditions when they come out.

**Could the service architecture matter more than model performance?** A wrong answer might come not from the model's reasoning but from inaccurate retrieved data or a bad tool call. In that case, a stronger model won't fix it. Before switching models, find the step where the error happened.

## Where I've landed: not the strongest model, but the one that reaches the needed performance efficiently

At first it was easy to assume that better models would naturally mean a better service. But model selection turned out not to be a matter of comparing performance rankings. More parameters don't necessarily mean better performance, and reasoning longer doesn't raise accuracy on every task. On the flip side, if you pick a lightweight model on cost alone when the situation needs a high-end one, errors and rework can end up costing more.

So I think you need to settle these three things before choosing a model:

- **Quality needed:** which tasks need to be handled, and how accurately?
- **Acceptable cost and time:** how much can you spend, and how long can you wait, to hit the target quality?
- **Impact of failure:** what goes wrong when the output is wrong, and how will you detect it and recover?

Then compare several models and reasoning settings against the same evaluation criteria.

**In choosing an LLM, performance and cost aren't an either-or choice. First meet the quality and safety bar the service requires, then optimize latency and total cost per successful task.**

In the end, I think **the right choice isn't the highest-performing model, but the one that reliably reaches the quality the service needs while keeping total cost and operating burden manageable**. For someone planning AI services, what matters is not only knowing which model is best, but being able to explain why you chose a model in terms of business criteria and measured results.

## References

Checked: 2026.11.11

- [Training Compute-Optimal Large Language Models](https://arxiv.org/abs/2203.15556) — DeepMind, NeurIPS 2022. The relationship between parameter count and amount of training data
- [Switch Transformers: Scaling to Trillion Parameter Models with Simple and Efficient Sparsity](https://arxiv.org/abs/2101.03961) — JMLR 2022. MoE architecture and selective parameter activation
- [Does Thinking More Always Help? Understanding Test-Time Scaling in Reasoning Models](https://arxiv.org/search/?query=Does+Thinking+More+Always+Help&searchtype=all) — related NeurIPS 2025 research. The effects and limits of extra reasoning
- [OpenAI — A Practical Guide to Building Agents](https://cdn.openai.com/business-guides-and-resources/a-practical-guide-to-building-agents.pdf) — setting a performance baseline, then choosing and optimizing models
- [OpenAI — Model Selection](https://platform.openai.com/docs/guides/model-selection) — weighing performance, latency, and cost when choosing a model
- [Anthropic — Claude Pricing](https://platform.claude.com/docs/en/about-claude/pricing) — token usage and cost structure by model

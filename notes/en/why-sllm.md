---
title: Why use an sLLM? — not because it's small, but because it fits the requirements
category: planning
categories: [planning, ai]
tags: [AI product planning, sLLM, Language model, Operating cost]
date: 2026-08-31
date_type: class
summary: Before choosing an sLLM, I need to check whether it can deliver the quality the task requires. Even a small model can cost more overall if it creates extra review and rework. I think the decision should be based on quality and response time measured with real task inputs, along with costs that include operation and human review.
sample: false
related: [why-ai-agent]
---

> Before choosing an sLLM, I need to check whether it can deliver the quality the task requires.

Here I use sLLM (Small Language Model) to mean a relatively small language model. Rather than drawing the line at a parameter count, I think the right test is **whether it delivers the quality needed for the task you give it, in the environment it runs in**.

## "A small model is enough" is a hypothesis

Microsoft Research shows a case where they tuned a small model for a specific business application and compared its accuracy and run time against larger models. But that's a result for that task, not a guarantee of the same performance on other work. [SLM application interactions case study](https://www.microsoft.com/en-us/research/publication/small-language-models-for-application-interactions-a-case-study/)

So write down your reasons for using a small model as hypotheses, and check each one against real work inputs.

| Hypothesis | What to check |
|---|---|
| It can deliver the quality needed for a narrow task | Misses and wrong answers on defined extraction and classification tasks |
| It can cut latency or resource use | Measure on the same hardware, input length, and concurrent load |
| It can be deployed in the environment the organization requires | Deployment rights for the model, hardware, external network paths |
| It can lower the cost of repetitive work | Compare not just inference but also hardware, operations, and review costs |

Confirming quality on a short extraction task doesn't justify handing it long-document synthesis or complex judgment calls. Every task you plan to give it has to be in the evaluation.

## Easy things to confuse

I pulled apart the things that tend to get lumped in with size.

- **Small ≠ domain-specialized.** Being small doesn't give a model domain knowledge. Whether you need prompting, retrieved documents, or extra training is a separate decision
- **Small ≠ self-hosted.** Small models can also be used as an external service. Self-hosting is a deployment choice
- **Self-hosted ≠ data control.** Even with the model in-house, you still have to check the paths data can leave through: logs, external search, connected tools
- **Quantization ≠ shrinking the model.** Quantization stores weights at lower precision to save memory. That's different from reducing the parameter count. [Hugging Face quantization overview](https://huggingface.co/docs/transformers/quantization/overview)

## Compare under the same conditions

| What to compare | How to measure or check |
|---|---|
| Task quality | Rate of missing required fields, wrong values, and made-up information |
| Edge cases | Behavior with typos, multiple requests, missing information, long inputs |
| Latency | Average plus latency of slow requests, and how it handles concurrent requests |
| Total cost | Include hardware, hosting, maintenance, extra training, and review |
| Deployment conditions | License, available hardware, version updates, and incident response |

Even with a low per-request inference cost, total cost can end up higher if review and reprocessing go up. That's why I think the right comparison is **the cost of getting one result that passes the business criteria**.

## When quality falls short

Failures code can catch, like a missing required field, can be routed to a re-entry request or human review. Escalating to a larger model is another option, but first decide whether the data is allowed to leave, and set a cost limit.

Don't judge accuracy by how confident the model says it is. Set the switching criteria with a separate evaluation dataset and check rules.

## Open questions

- To actually measure "cost per result," how should review time be measured?

Related class: SKALA sLLM Implementation and Fine-Tuning (last class 2026-08-31) · Planning review criteria compiled with reference to official sources

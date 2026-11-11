---
title: Why build an AI service? — which part of the user's work are you changing
category: planning
tags: [AI product planning, Problem definition, User flow, Adoption decision]
date: 2026-09-11
date_type: class
summary: Being able to generate answers with AI isn't a reason to adopt it. I think you first have to ask which user task you're improving, whether it can be solved without AI, and whether users can tell when the output is wrong.
sample: false
related: [why-ai-agent, why-ml-model, why-sllm]
---

To me, planning an AI service means looking closely at the work users have to do and finding the parts AI actually improves. You can't stop at "it can generate an answer." You have to design the flow all the way through: the user checks the result and finishes the next step.

## Separate these first

AI service, ML, agent, and sLLM aren't options lined up on one shelf. They're choices at different layers, and one service can use several of them together.

| Layer | Question to answer |
|---|---|
| AI service | Which user problem are we improving? |
| Traditional ML | Compared with DL and LLMs, is it a better fit for classification or prediction on tabular data? |
| Language model | What text does it need to understand, extract, summarize, or generate? |
| AI agent | Does the model need to choose its next action based on what it learns while running? |
| sLLM | Can a small language model meet the quality and operating requirements? |

Language models are also trained with machine learning. An agent is a choice about how a task is executed, regardless of model size.

## Do you really need AI?

Google PAIR recommends finding where user needs meet AI's strengths, and checking first whether a rule-based approach would work. [People + AI Guidebook](https://pair.withgoogle.com/guidebook-v2/chapter/user-needs/)

As planning questions, that becomes:

- Who is trying to get what done, and in what situation?
- Which step currently takes too long or lets things slip through?
- Would a better screen, a search filter, a formula, or fixed automation solve it?
- Is it still a win once you count the time spent reviewing and fixing the AI's output?
- When the output is wrong, can the user notice and undo it?

If people have to review what the AI produces, that review time is part of the cost.

## How to check whether it worked

Compare the existing way and the AI-assisted way on the same kind of task. Agree on the pass criteria with the people who actually do the work, in advance.

- Time from starting a task to finishing it
- How often users edit the AI's output, and how many items were handled wrong
- Time spent on review and rework, plus operating cost
- Whether cases the AI can't judge were properly handed to a person

Averages hide the exceptions. Look at short inputs, compound inputs, and inputs missing information separately.

## Open question

- What should decide whether AI starts as full automation, or as an assistant that shows candidates and lets a person confirm?

Related class: SKALA Generative AI Service Development (last class 2026-09-11) · Planning review criteria compiled with reference to official sources

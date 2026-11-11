---
title: 10 prompt techniques — which one to reach for, and when
category: ai
tags: [Prompt Engineering, RICE, CoT, Few-shot]
date: 2026-07-15
summary: I think the desired result should guide the choice of prompt technique. I structure the request with RICE, use examples when the output format matters, and Step-back when the premise needs checking.
sample: false
---

A reference note on the prompt techniques from class, organized by **when to reach for each one**. RICE is the base structure, and other techniques go on top depending on the goal. For example, I lay out the request with RICE, then use Step-back to check the premise one more time.

## What to use when

| Technique | When to use it | How to write it |
|---|---|---|
| RICE | Setting up the basic structure of a request | Write role, instruction, context, and examples as separate parts |
| Zero / One / Few-shot | Showing the output format you want | Give no example (Zero), one (One), or several (Few) |
| CoT (step-by-step reasoning) | Problems with steps, like root-cause analysis or calculations | Ask for the analysis broken into steps |
| Self-Consistency | When the conclusion changes from response to response | Compare several reasoning runs and pick by majority vote |
| Step-back | When you want to check the background or premise first | Pose the underlying question before the detailed task |
| Devil’s Advocate (opposing view) | Finding weak spots in a proposal | Assume it failed and ask for the reasons and evidence to fix each |
| Multi-Persona (several roles) | Reviewing from multiple perspectives | Compare each role's opinion, then ask for a conclusion |
| Meta Prompting | When the request itself is hard to write | Ask the AI to write a prompt that fits the task |
| Socratic (clarify through questions) | When requirements or background aren't sorted out | Ask the AI to question you for the information it needs first |
| Markdown | Structuring a long request | Separate content with headings, lists, and tables |

## RICE template

```markdown
[Role]        Who — e.g. a B2B strategy consultant with 10 years of experience
[Instruction] What — deliverable · scope · priorities
[Context]     Situation — company · problem · goal (the more specific, the less hallucination)
[Examples]    Shape — an example or an outline of the output
+ rules · tone · constraints (character count) · format (table · JSON)
```

## Examples

```text
[Few-shot]
Classify each sentence as positive or negative.
"It was truly moving" -> positive
"It was so boring I dozed off" -> negative
"The acting was superb" ->

[CoT]
Think through the cause step by step: symptom → candidate causes → check against evidence and rank → how to verify → immediate fix / root-cause fix

[Step-back]
Before writing the report, answer this first: what's the root reason this service isn't selling?

[Devil's Advocate]
Assume this proposal was rejected. Give 5 reasons it was turned down, plus evidence to address each.

[Multi-Persona]
Debate for and against as the CFO and the COO → summarize the final decision and the conditions for approval.
```

## Don't mix these up

- CoT: how much it helps depends on the model, and it can even hurt performance on small models
- Few-shot: keep the output format of your examples consistent
- Temperature: a setting you pass through the API. It's not the same as a tone instruction written in the prompt
- Polite phrasing or emotional appeals work differently by model and task, so I don't treat them as required rules

## References

- [A Systematic Survey of Prompt Engineering in Large Language Models: Techniques and Applications (arXiv 2402.07927)](https://arxiv.org/abs/2402.07927)

Source: SKALA class on prompt design and context engineering (2026-07-15)

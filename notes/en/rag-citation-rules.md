---
title: No evidence, no answer — citation checks for RAG
category: ai
tags: [RAG, Citation, AI Agent, LangGraph]
date: 2026-09-22
summary: With zero sources, the LLM isn't called at all, and citations not on the list get removed in code. At one point I passed the raw source text, the LLM copied it word for word, and the output failed validation.
sample: false
related: [agent-eval]
---

RAG is a way for an AI to build its answer from documents it retrieves. In the capstone, I set rules for **what to do when there's no evidence and when a citation is wrong**.

## Problems I ran into

- The summary came out in English, and citations were a mix of brackets and parentheses. I added writing rules to the prompt and normalized the format once more in code
- When I passed the raw source text, the LLM copied it straight into the output, which failed validation. For that step I switched to passing source IDs instead of the text, and dropped any sentence without a citation
- Searching by a technology's full official name returned zero results or more irrelevant ones. In this exercise, short names made it easier to find relevant material
- Once the zero-evidence handling was in, that node also finished without calling the model in tests run without an API key

## Rules I set

| Situation | Handling |
|---|---|
| Zero sources to cite | Don't call the LLM; return a fixed message ("No supporting evidence was found in the reviewed sources") |
| Citation ID not on the list | Removed in code |
| Sentence with no citation | Dropped before it reaches the validation step |
| Report structure | The LLM writes only the summary; the other sections and the references are assembled in code |
| Several copies of the same paper retrieved | Deduplicated and counted as one source |

```python
def synthesis(state):
    context, allowed = _build_context(state)
    if not allowed:
        return {"synthesis": NO_EVIDENCE}      # no LLM call
    out = model.with_structured_output(SynthesisOut).invoke(messages)
    return {"synthesis": validate_synthesis(out, allowed)}   # drop unknown IDs
```

Normalizing citation format:

```text
(ID) → [ID]
[A][B] → [A, B]
```

## What these rules can't catch

Code can check whether a citation ID is on the list. But these rules alone can't tell **whether that source actually supports the claim**. They lower the risk of answers with no evidence, but they don't fully prevent wrong answers.

## Open question

- How should "No supporting evidence was found" be shown so it doesn't look like a system error?

Source: SKALA RAG pipeline capstone (2026-09-18 ~ 09-22)

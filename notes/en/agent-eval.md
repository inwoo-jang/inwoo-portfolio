---
title: Character count couldn't evaluate a report — splitting checks between code and an LLM judge
category: ops
categories: [ops, ai]
tags: [AI Agent, Evaluation, LLM Judge, LangGraph]
date: 2026-10-28
summary: Code can check formatting and required fields, but whether the content matches its evidence needs a separate evaluation. LLM Judge verdicts can vary, so automated evaluation alone cannot establish quality. This note covers the roles of code checks and LLM evaluation, when human review is needed, and what information reviewers need.
sample: false
---

> Code can check formatting and required fields, but whether the content matches its evidence needs a separate evaluation.

When I evaluated agent-generated reports by character count alone, reports with thin content passed. So I split the criteria: code checks the format, and an LLM judge (an AI model used as the evaluator) checks the meaning.

## What was slipping through

- With only a 300-character minimum, a 328-character report of generalities passed
- The screen showed all three companies, but only the last company's result was being passed to the next step
- Once I changed the evaluation criteria, even a report generated without errors failed 4 of the 5 evaluation items (faithfulness 23/30 = 0.767)
- Evaluating the same report twice gave the same pass/fail result, but faithfulness came out as 17/32 one time and 17/30 the other. Even at `temperature=0`, the evaluation wobbled
- For a target with no source material, the right output was "cannot determine." Making up content just to fill the format is itself a wrong answer

## So I split the roles

| What's checked | Checked by | Example |
|---|---|---|
| Format, counts, ranges | Code | At least 3 pieces of evidence, citation numbers in range, required fields present |
| Whether content matches evidence | LLM judge | Whether the evidence supports each sentence's claim, whether limitations are explained specifically |
| Pass/fail | Code | Computes the ratio from the judge's per-sentence verdicts |

Code runs a check after each of search, analysis, and report generation. The thresholds are ones I set for this project.

| Step | Pass criteria | On failure |
|---|---|---|
| Search | At least 3 pieces of evidence, no empty source or body | Feed the failure reason into the next query and retry once |
| Analysis | For each target, a result + citation, or "cannot determine + reason" | Re-analyze only the failed targets, once |
| Report | At least 3 distinct citations, a stated limitation | Feed in the reason and rewrite once |

Faithfulness was calculated like this:

```text
factual claims supported by evidence ÷ total factual claims ≥ 0.8
fails if there are 0 factual claims
```

LLM evaluation settings:

- `temperature=0`, a single call with strict JSON schema
- Code splits the report into sentences with ids before passing it in (so no sentence gets skipped or merged)
- The prompt states explicitly that text inside the report and evidence is data to evaluate, not instructions

## Next time

- When I create a criterion, first feed in inputs that deliberately break it and confirm they actually get caught
- Record measurements (time, counts) separately from verdicts (OK/defect)
- Evaluate results near the pass threshold twice to see whether they wobble
- `recursion_limit` turned out to be a cap on graph steps, not on retries. Set a separate cap for retries

## If automated evaluation passes, can you skip human review?

I split format checks off to code and content-evidence matching to an LLM judge. But evaluating the same report twice gave different faithfulness scores. So can a result that passes automated evaluation go straight to the user?

Automated evaluation helps judge quality, but on its own it doesn't guarantee accuracy. Results near the threshold, or with weak evidence, may need a separate review. In this project too, a person looked at the results near the threshold at the end.

Based on this, I think automated checks and human review can be divided like this.

| Type | What's checked | How it's judged |
|---|---|---|
| Code checks | Format, required fields, counts, numeric ranges | Checked against fixed rules |
| LLM judge | How faithful the content is, whether claims match evidence | Model verdict against evaluation criteria |
| Human review | Whether it fits the context, important decisions, ambiguous evaluation results | A person checks the evidence and result directly and makes the final call |

I think the point isn't to have a person re-read every output from scratch, but **to separate what can be checked automatically from what needs human judgment**. Which results must be seen by a person should depend on what the output is used for and the impact if it's wrong.

## What do users need to review AI output?

Once I saw the limits of automated checks, it also seemed important to decide how to show the check results to users.

> [!Example] An AI-generated company analysis report
> If it just says "Verified," can users trust it? To judge for themselves, they may need information like this.
>
> | Information to provide | Why it's needed |
> |---|---|
> | Evidence and sources for each claim | To see what material it was based on |
> | Check results and failed items | To know which parts to double-check |
> | "Cannot determine" and weak-evidence markers | To tell apart the parts the AI couldn't confirm |
> | Content before and after edits | To see what the user changed |
> | Final approval status | To tell reviewed results from unreviewed ones |

Putting all of this on screen doesn't automatically make for good UX. One option is to show the items that need review first and let users expand the evidence and detailed evaluation results when they need them. It's also clearer to manage **passed automated checks, human review complete, and final approval** as separate statuses.

## Where I've landed

Quality control for AI output doesn't end with producing an accurate result.

- Check with code whatever conditions code can check
- Check meaning and claim-evidence matching with separate evaluation criteria
- Consider human review when automated evaluation is uncertain or the result has high impact
- If users have to review, they need to see the evidence and the unconfirmed items

In this project, I built the automated checks and the LLM judge and saw cases where evaluation results varied. I didn't build the user review screen or approval flow, so that part is a design direction I thought through from a product planning perspective.

In the end, I think **a good verification setup doesn't just evaluate how accurate the AI is; it makes clear when people need to check what**.

Source: SKALA AI service mini-project, DAY1~3 (2026-10-26 ~ 10-28)

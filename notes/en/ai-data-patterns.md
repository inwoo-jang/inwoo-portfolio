---
title: How much can we trust the patterns AI finds in data?
status: published
published: true
category: data
categories: [data, planning]
date: 2026-09-25
updated: 2026-11-11
tags: [Exploratory Data Analysis, Hypothesis Testing, Generalization, LLM]
summary: Before using a pattern found by AI to make a business decision, define what that pattern is meant to help decide. Check whether it holds under different aggregation choices, recurs in other periods, and reflects the phenomenon the data is supposed to measure. Using a customer-support example, this note distinguishes the evidence needed for observations, predictions, and staffing decisions.
sample: false
related: [data-preprocessing, why-ml-model, agent-eval]
---

> Before using a pattern found by AI to make a business decision, define what that pattern is meant to help decide.

Suppose we give an LLM October's customer-support records and ask it to find notable patterns. It replies, "In October, payment inquiries accounted for a larger share of all inquiries on Fridays than on other days of the week." The summary table shows the same result. Does that mean we should assign more payment-support staff on Fridays next month?

After reading MIT Technology Review Korea's article "AI가 발견하고 인간이 증명하는 시대" (an era in which AI discovers and humans prove), I wondered what a person would need to verify in this situation. At first, I thought checking the next month's data would be enough. Looking into more research examples, though, I found that **some problems emerge only when we change the analysis of the same data, while others persist even when we collect new data.** [MIT Technology Review Korea — AI가 발견하고 인간이 증명하는 시대](https://www.technologyreview.kr/ai가-발견하고-인간이-증명하는-시대/)

Researchers have applied LLM-generated hypotheses to classification tasks and combined data with literature to generate hypotheses. Their results suggest that AI can help propose candidates for analysis. But using a hypothesis that helps prediction to make a business decision requires checking the evidence that decision needs. [Zhou et al. — Hypothesis Generation with Large Language Models](https://aclanthology.org/2024.nlp4science-1.10/) · [Liu et al. — Literature Meets Data](https://aclanthology.org/2025.acl-long.12/)

## Does the pattern survive different ways of analyzing the same data?

In the 2018 study *Many Analysts, One Data Set*, 29 teams answered the same question using the same soccer data: was player skin tone associated with how often referees issued red cards? The teams used different variables and models. Twenty reported a statistically significant positive association; the other nine did not find a significant association. The study illustrates how analytical choices can change the strength of a conclusion even when the data stays the same. [Silberzahn et al. — Many Analysts, One Data Set](https://doi.org/10.1177/2515245917747646)

Similar choices arise with customer-support records. Pooling all Friday inquiries gives more weight to a particularly busy day. Aggregating all inquiries shows the composition of the work the team handled that month. Looking at each day's proportion shows whether payment inquiries were concentrated on one Friday or the pattern recurred across several Fridays. The unit of aggregation depends on what we want to learn.

If the same customer contacts support three times about the same issue, we might count it once when measuring **the number of problems customers experienced**, but three times when measuring **the support team's workload**.

Rerunning AI-generated SQL and obtaining the same number reproduces the calculation. To assess how robust the pattern is, we also need to examine **choices that can affect the result, such as aggregation units, denominators, and duplicate handling**.

If AI explored many conditions—days of the week, channels, or times of day—and selected the largest difference, I would record what it explored and specify the hypothesis before examining data from a new period. If we keep changing the conditions after seeing validation results, that data becomes part of the exploration too. [Dwork et al. — The Reusable Holdout](https://doi.org/10.1126/science.aaa9375)

## Can the same error persist in new data?

In DeGrave and colleagues' study of chest X-ray models for COVID-19 detection, classifiers relied on cues about image acquisition and data sources as well as features related to disease. Models that appeared accurate in earlier evaluations performed worse on data from new hospitals. Evaluating more images collected in the same setting checks something different from evaluating images from hospitals with different acquisition conditions. [DeGrave et al. — AI for radiographic COVID-19 detection selects shortcuts over signal](https://doi.org/10.1038/s42256-021-00338-7)

Google Flu Trends raised the question of **how well a measurement represents the underlying phenomenon**. It estimated influenza-like illness activity from search volumes, but persistently produced estimates above CDC surveillance indicators. Searches may provide clues about an outbreak, yet the meaning of the same search volume can change when people's search behavior or the platform changes. [Lazer et al. — The Parable of Google Flu](https://doi.org/10.1126/science.1248506)

Returning to the support example, suppose payment inquiries make up a high share on Fridays for two consecutive months. If the same automated classifier has mislabeled a particular type of inquiry as "payment" throughout both months, the same error has simply repeated. Instead of aggregating another month's records, **sampling the original inquiries and comparing them with their assigned categories would directly check for misclassification.**

Alternatively, if inquiry volume fell after the contact button was moved, we could examine **data collected in a different way**, such as payment-failure logs, to test whether customers actually experienced fewer problems.

## What decisions can the pattern support?

The evidence needed depends on the decision we want to make, even when the observed pattern is the same.

| Judgment to make | Evidence to check |
|---|---|
| **Payment inquiries made up a higher share on Fridays in October.** | Check the source classifications and aggregation rules. Examine whether a single Friday accounts for the overall difference. |
| **Friday support demand will also be high next month.** | Check a period that was not used to develop the hypothesis. Staffing forecasts also need actual inquiry counts, handling time, and event schedules, not just proportions. |
| **Adding staff on Fridays will reduce waiting time.** | Where feasible, randomly assign different staffing levels to comparison dates or time slots and measure waiting time. Otherwise, examine differences in inquiry volume and type, promotions, and staff experience, and avoid attributing the difference conclusively to added staff. |

The observation that payment inquiries account for a high share may be correct. But if total inquiries fell while the payment inquiry count stayed the same, that observation may only justify **looking more closely at which types of inquiries arrive on Fridays**. Increasing staffing requires further evidence about the workload and what the current team can handle.

## What I would check first in the next analysis

The next time AI finds an interesting pattern, I want to start by **writing one sentence stating what decision I intend to make with it**. If I suspect the conclusion depends on aggregation choices, I would vary the analysis criteria. If I want to know whether it holds at another time, I would fix the hypothesis and check a new period. If I doubt whether the metric captures the phenomenon, I would compare it with data collected through another method.

AI's suggestion that "there are many payment inquiries on Fridays" is enough to start exploring. To decide whether to change next month's staffing schedule, I still need to know **how many more inquiries there are, which Fridays show the pattern, and how far the workload exceeds the current team's capacity**. Identifying what remains unknown helps determine which data to use in the next analysis.

---
title: With DL and LLMs available, why choose traditional ML?
category: data
categories: [data, planning]
tags: [Machine Learning, Deep Learning, LLM, GBDT, Model Selection, Research]
date: 2026-09-03
date_type: class
summary: For predictions based on numerical and categorical business data, traditional ML is a useful starting point for comparison. But having little data or tabular inputs is no reason to rule out deep learning or LLMs. I think we need to check how much they improve actual business outcomes and whether that improvement justifies the additional development and operating costs.
sample: false
related: [why-sllm]
---

If you're classifying or predicting from business data organized into numbers and categories, traditional ML is a candidate worth comparing first. But you can't settle the choice with formulas like "tabular data always means trees" or "little data always means ML."

By traditional ML I mean linear and logistic regression, Random Forest, and gradient boosted trees (GBDT: XGBoost, LightGBM, CatBoost, etc.). DL and LLMs are also part of machine learning. And calling GBDT, which combines many trees, a "simple, easy-to-explain model" isn't accurate.

This is a research note following up on a class topic. I keep what the papers found separate from my own thinking about applying it at work.

## What I found in the research

| Study | What it found | What it means for choosing, and its limits |
|---|---|---|
| Grinsztajn et al., NeurIPS 2022 | On 45 tabular benchmarks, tree-based models beat the neural networks compared at the time. It also analyzed fit to irregular functions and uninformative features. | Grounds for treating GBDT as a strong baseline. I don't generalize 2022's model and data conditions to every neural network since. |
| McElfresh et al., NeurIPS 2023 | Comparing 176 datasets and 19 algorithms, many problems showed small differences between model families, or light tuning mattered more. | Don't spend the whole experiment budget on "NN or trees." Compare data characteristics and tuning conditions together. |
| Holzmüller et al., NeurIPS 2024 | Comparing RealMLP and improved default settings, neural networks were competitive with GBDT in the 1,000 to 500,000 sample range. | Don't run one neural network with poor defaults and conclude "DL doesn't work." That benchmark had no missing numeric values. |
| Hollmann et al., Nature 2025 | TabPFN, a pretrained model built for tabular data, performed strongly in an evaluation covering up to 10,000 samples and 500 features. | Little data alone isn't a reason to rule out DL. These numbers are the evaluation range for that paper's version, not a shared limit for every current version. |
| Hegselmann et al., AISTATS 2023 | TabLLM, which turns column names and values into sentences, was competitive with tree models when there were very few labeled examples. | If language meaning and pretrained knowledge are useful, compare LLMs too. I don't read that T0-based experiment as a performance ranking of today's general-purpose LLMs. |

Papers: [NeurIPS 2022](https://proceedings.neurips.cc/paper_files/paper/2022/file/0378c7692da36807bdec87ab043cdadc-Paper-Datasets_and_Benchmarks.pdf), [NeurIPS 2023](https://proceedings.neurips.cc/paper_files/paper/2023/file/f06d5ebd4ff40b40dd97e30cee632123-Paper-Datasets_and_Benchmarks.pdf), [RealMLP 2024](https://proceedings.neurips.cc/paper_files/paper/2024/file/2ee1c87245956e3eaa71aaba5f5753eb-Paper-Conference.pdf), [TabPFN 2025](https://www.nature.com/articles/s41586-024-08328-6), [TabLLM 2023](https://proceedings.mlr.press/v206/hegselmann23a.html)

The TabPFN-3.5 technical report, which I checked in November 2026, widened the comparison to tabular data with time and group splits, text, and more. These are results reported by the model's own developers, so whether the same edge shows up in real work needs to be checked separately. Still, I think it matters that **there's now a reason to include pretrained models as candidates even for tabular data.** Tabular foundation models should be kept distinct from general-purpose chat LLMs. [TabPFN-3.5 technical report v3, revised 2026-11-03](https://arxiv.org/abs/2609.17895v3)

## Why compare tree models first

With images or long text, a big part of the job is deciding what information to extract from the raw input. Business tables, on the other hand, already have columns whose meaning people defined, like "recent purchase count," "average handling time," or "product type." In that case, the core task may be learning the relationship between conditions across columns and the outcome, rather than learning representations from scratch. Columns often have different units, and outcomes often change sharply at certain thresholds. Traits like these are why tree-based models are worth comparing first. [Grinsztajn et al.](https://proceedings.neurips.cc/paper_files/paper/2022/file/0378c7692da36807bdec87ab043cdadc-Paper-Datasets_and_Benchmarks.pdf)

So I think the first question to ask is: **Can you predict from business columns you already have, or do you need to derive new representations from raw images, text, or time series?**

You also have to count the cost of preprocessing and feature building. If people have to hand-craft lots of rules and features, a cheap model to run doesn't mean cheap overall development.

## Does little data always mean ML?

With little data, you have to ask whether you can support the degrees of freedom of a model you're training from scratch. But if you bring in a pretrained model, you can use knowledge and representations it has already learned. The TabPFN and TabLLM results show why this distinction matters.

So rather than a number like "under N rows, always use ML," I find these questions more useful.

- Do the labels you have actually represent real usage?
- Do the column names and text carry meaning that pretrained knowledge could help with?
- Are the inputs opaque, like internal company codes, or can they be described in plain language?
- Does that pretrained model support your input format and runtime environment?

`Returns in the last 30 days` conveys its meaning, but an undocumented `internal_code_731` tells you nothing. Looking at this difference, you can form a hypothesis about whether an LLM's language knowledge would help prediction. That's a hypothesis to test for each task, not a claim that LLMs always fail on internal codes.

In the end, you need to look at **how many labels you have, and also whether there's a channel for bringing in knowledge learned elsewhere.**

## What to hand to an LLM

"Reading a long inquiry and pulling out the promised date" and "predicting whether that account will contact us again next month" are different jobs. The first needs language understanding. The second needs the relationship between past outcomes and inputs.

Here are some designs worth comparing. These aren't real project cases where I confirmed a performance gain.

| Design | Role assigned | What else to check |
|---|---|---|
| Business table → GBDT | Predict outcomes from existing numbers and categories | Do the current columns carry the information needed? |
| Inquiry → language model → extracted fields + business table → ML | Language model extracts, ML predicts | How extraction errors affect the final prediction, and the added cost |
| Text or images → pretrained embeddings → classifier | Classify using representations of the raw input | Cost of generating embeddings, how results shift on updates |
| Input → classify directly with an LLM | Use pretrained language knowledge directly | Does the advantage with few labels offset the operating cost? |

When explaining the reason for a prediction to users, the explanation has to connect to the information the model actually used and evidence that was verified. If you just pass the score to an LLM and have it write a plausible reason, you have to check separately whether that explanation is right.

## Turning score differences into business impact

A slightly higher average score isn't a reason to switch models. For example, if a reviewer can only check 100 items a day, "how many of the top 100 are truly urgent" (Precision@100) and "how many of all urgent items did we catch" (Recall@100) mean more than overall accuracy.

Check whether DL or an LLM catches additional items at the same review volume, and whether that improvement holds in other periods, before you calculate cost.

- Cost of collecting and reviewing labels, and designing features
- Cost of tuning, retraining, and version validation
- Inference cost at real request volume, and latency on slow requests
- Cost of format errors, retries, human review, and incident response

> Added value of a more advanced model = value of the extra work resolved in the same period + reduced cost of errors and rework − added development, inference, and operating cost

The specific values and acceptance criteria need to be set with the business owner.

## What traditional ML doesn't solve for you either

**Explainable ≠ knowing the cause.** Even if you can see a linear model's coefficients or feature importance, "changing this variable will improve the outcome" is a separate conclusion. A predictive model only learns associations in observed data, and hidden variables can change how it should be read. [scikit-learn causal interpretation example](https://scikit-learn.org/stable/auto_examples/inspection/plot_causal_interpretation.html)

Finding users who are likely to churn and finding users whose churn a coupon would prevent are different questions. The second needs experiments or causal analysis.

**Outputs a probability ≠ the probability is right.** If you're going to show "80% risk," you also need to check how often it actually happened among cases with similar scores. Look at calibration curves together with probabilistic metrics, and don't declare calibration good or bad from Brier score or log loss alone. [scikit-learn probability calibration docs](https://scikit-learn.org/stable/modules/calibration.html)

So at the planning stage, first be clear whether what you need is a "priority score," a "probability of occurrence," or a "reason to change an action."

## If I were actually choosing, in this order

This order is based on the research above. It doesn't mean you should run every model.

1. **Start with the prediction time and the follow-up action.** Using information available when, what are you predicting, and who makes what decision?
2. **Build baselines with rules, linear models, and GBDT.** Include small comparisons, like regression for numeric prediction or logistic regression for classification
3. **Match the validation split to real usage.** If you're predicting the future, train on the past and evaluate on a later period. If it's for new accounts, don't let the same account appear in both training and evaluation. Do preprocessing and feature selection inside the training data too. [Data leakage principles](https://scikit-learn.org/stable/common_pitfalls.html#data-leakage)
4. **Write down, one by one, the reasons to add DL, foundation models, or LLMs.** Do you need to learn representations from raw input? Can you use pretraining? Are there clear cases the existing model misses? For tabular data, a tuned small neural network or a tabular foundation model are also candidates
5. **Compare on the same information and labels.** Write down the total budget including development time per model, and keep experiments that used extra information separate. Use validation data for prompt and model selection, and don't keep picking with the final evaluation data
6. **Adopt based on business metrics, cost, and operating conditions.** Check whether results hold across periods and splits, and whether it only improved for a specific user group. If the difference is unstable, hold off on declaring a winner

## Open questions

- What new information do DL or LLMs use? Is there a reason beyond feeding the same columns into a more complex model?
- Was the GBDT baseline being compared tuned enough? Is this a win over a weak baseline?
- Does "little data" mean few labels, or also no usable pretraining?
- How much did results improve within the volume the team can actually handle?

Related class: SKALA Understanding Machine Learning and Deep Learning (last class 2026-09-03)

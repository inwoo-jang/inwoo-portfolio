---
title: Why is data preprocessing needed, and how far should it go?
category: data
categories: [data, ai, planning]
tags: [Data Preprocessing, OCR, Chunking, RAG]
date: 2026-08-30
summary: The amount of preprocessing needed depends on the condition of the data and its intended use. Filling missing values or splitting documents should preserve the original meaning and the information needed to make decisions. I think it is important to compare results before and after processing to check whether retrieval and answers actually improve.
sample: false
related: [why-ml-model, context-engineering, rag-citation-rules]
---

> I think the point of data preprocessing isn't simply to make data clean. It's to prepare data so its meaning doesn't get distorted along the way to being used.

## Is preprocessing always necessary?

Data preprocessing is the process of organizing and transforming raw data so it fits a purpose such as analysis, model training, or search.

But not all data has to be preprocessed.

If the data is already structured, or you're passing short text straight to an LLM, it can be used without any separate preprocessing.

On the other hand, if you're combining data in different formats, training a machine learning model, or building a RAG system on a large set of documents, checking the data's quality and structure becomes important.

In other words, whether you need preprocessing, and how much, **depends on the state of the data and what it's used for.**

It also helps to keep preprocessing separate from **data quality management**. Preprocessing transforms data to fit a purpose; data quality management is the broader, ongoing work of checking that the source data is accurate, complete, current, and consistent. If the source is wrong, the result will be wrong no matter how well you preprocess.

## Preprocessing tabular data

For tabular data, check missing values, duplicates, outliers, data types, units, and so on.

| Item | How it's handled | What to watch for |
|---|---|---|
| Missing values | Impute, drop, or keep as missing | Don't confuse "unknown" with 0 |
| Duplicates | Find and remove duplicate rows | Don't delete legitimate repeat transactions |
| Outliers | Range checks; fix or keep | It may be an extreme value that really happened |
| Units | Unify KRW vs. KRW 10,000 units, kg vs. g | Avoid conversion errors |
| Formats | Unify dates, numbers, and strings | Preserve the original meaning and precision |
| Scaling | Normalization, standardization | Choose based on the model you're using |

In payroll data, for example, an allowance of KRW 0 is not the same as an allowance that was never entered.

If you fill every missing value with 0, missing entries can be read as an actual payment of KRW 0.

In machine learning, preprocessing can also cause data leakage. If you fill missing values with the mean of the whole dataset before splitting training and test data, information from the test data can leak into training.

So preprocessing is both a cleanup task and **a way of protecting the data's meaning and the reliability of evaluation**.

## Preprocessing document data

In a RAG system, documents in many formats — PDFs, images, Word files — have to be turned into something searchable.

A typical pipeline looks like this:

**Collect documents → extract text and structure → review errors → chunk → add metadata → embed and index**

- **OCR:** recognizing text in images and scanned documents
- **Document structure analysis:** working out how headings, paragraphs, lists, and tables relate
- **Chunking:** splitting documents into units suited for retrieval
- **Metadata:** tracking document name, source, date written, effective date, version, and so on

Chunking in particular isn't always best done by a fixed character count.

It's worth considering splitting along the document's structure so that the meaning of an article or paragraph doesn't get cut apart.

## What goes wrong when you preprocess too much

Take a hypothetical tax law document as an example.

> Article ○: A tax credit applies when certain requirements are met. However, certain industries are excluded.

If chunking separates the main clause from the exception that starts with "However," and only the main clause shows up in search results, the AI may answer that the excluded industries can also claim the credit.

Removing the effective date or the applicable year also creates a risk of presenting an old rule as the current one.

The same goes for tabular data. Arbitrarily filling in missing values or automatically removing outliers can distort what the real data means.

**More preprocessing doesn't necessarily mean higher data quality.**

## How do you decide the scope of preprocessing?

Set preprocessing criteria based on what the data is for and what happens if there's an error.

1. What work and decisions is the data used for?
2. What quality problems exist in the raw data?
3. What would change the meaning if you modified or removed it?
4. Can you compare the result with the original after preprocessing?
5. Did actual model performance or retrieval accuracy improve?

In domains where accuracy is critical, like law and tax, you need rules for preserving dates, figures, who a rule applies to, exceptions, and sources.

## How do you verify that preprocessing helped?

You can only tell whether a preprocessing approach actually works by **changing only the preprocessing on the same evaluation data and comparing**.

When building a RAG system, for example, you could compare chunking approaches like this:

| Variant | Approach | Description |
|---|---|---|
| A | Minimal preprocessing | Retrieve whole documents or large units |
| B | Fixed-size chunking | Split by a set number of tokens |
| C | Structure-based chunking | Split along article, heading, and paragraph boundaries |

With the same documents, questions, and retrieval settings, compare the following.

| Metric | What to check |
|---|---|
| Evidence recall (Recall@k) | Does the evidence needed for the answer appear in the top k results? |
| Answer accuracy | Did it meet the answer criteria set in advance? |
| Response time | How long did retrieval and answer generation take? |
| Cost | The cost of embedding, retrieval, and model calls |

For tax law documents, deliberately include the risky cases above in the evaluation questions. You need questions whose answers depend on an exception clause ("However") or an effective date to see whether chunking broke the context.

I don't assume which approach is best before measuring actual results. When planning a tax RAG service like TaxDesk, this comparison can be written into the requirements.

## Where I've landed

I think preprocessing isn't about making data as simple as possible. It's about **organizing data for its purpose while preserving the information the judgment depends on**.

An AI PM may not implement every preprocessing technique themselves, but they should understand which missing information leads to wrong results, and be able to define the data processing rules and how to verify them.

In RAG especially, a more important criterion than chunk size itself may be whether the retrieved documents contain enough context to answer the question.

## References

- [scikit-learn — Common Pitfalls](https://scikit-learn.org/stable/common_pitfalls)
- [Microsoft — Chunk Documents for RAG](https://learn.microsoft.com/en-us/azure/search/vector-search-how-to-chunk-documents)
- [Google Cloud — Document AI Layout Parser](https://docs.cloud.google.com/document-ai/docs/layout-parse-chunk)
- [LangChain — Text Splitters](https://docs.langchain.com/oss/python/integrations/splitters)

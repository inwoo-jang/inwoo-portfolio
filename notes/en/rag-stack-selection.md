---
title: How should we choose a technology stack for AI search and RAG?
status: published
published: true
category: planning
categories: [planning, data, ai]
date: 2026-11-11
tags: [RAG, Search, Reranking, Ontology, Knowledge Graph, GraphRAG]
summary: Choosing an AI search and RAG stack starts with identifying whether failures occur in candidate retrieval, ranking, or evidence lookup. This note distinguishes the roles and requirements of keyword and vector search, reranking, and SQL and graph queries, and sets out criteria for comparing accuracy and operating costs.
sample: false
related: [when-rag, data-preprocessing, rag-citation-rules, tech-stack-choice]
---

"Find a commission decision about a social media ad that displayed discount conditions in small print. Also show the statutory provisions the commission applied and how they were amended afterward."

This question involves three tasks: finding similar decisions, selecting passages containing findings about the ad, and checking the versions and amendment history of the applicable provisions. The first is mainly retrieval and ranking, the second evidence selection, and the third data modeling and querying. The technology to change depends on which stage fails.

## The overall flow

| Flow | From input to result |
|---|---|
| Data preparation | Collect sources → split documents and passages → organize identifiers and metadata → build search indexes |
| Query processing | Interpret the question → retrieve and combine candidates → rerank → look up evidence passages and applied provisions → generate and validate the answer |
| Operations | Record errors by stage → run regression checks with evaluation questions → update sources and legislation versions |

## 1. What should we store from the source?

Store the full decision alongside the passages containing findings. Search at the passage or issue level, and link each result back to its location in the source and the full case. A passage that is too short may omit context needed to understand the finding, so retrieval can also bring in neighboring passages or the parent section. For scanned documents, preserve the original page location with the OCR output.

| Model | What it records | When it is useful |
|---|---|---|
| Tags and taxonomies | Media, product types, and issues | Classification criteria are clear, such as showing only social media cases |
| Relational schema | Cases, ads, findings by issue, versions of applied provisions, and their links | Relationships are defined and recurring queries can use SQL |
| Ontology | The meaning of concepts and relationships | Decisions, legislation, and guidelines need shared meanings for relationships such as "cites," "applies," and "amends" |
| Knowledge graph | Actual entities and relationships | Queries explore paths from decisions to provisions, amending legislation, and other decisions |

For example, record "applied by the commission" only when the basis for application is confirmed in its findings on the issue. Preserve the supporting passage with the relationship, and link a provision to its version as well as its number. If the applicable version is unclear, leave it unverified.

This structure can also be implemented in SQL. An ontology becomes more valuable when sources need shared relationship meanings. The EU's ELI-I provides a model for expressing which amending provision changes which part of existing legislation. [W3C OWL 2 Primer](https://www.w3.org/TR/owl2-primer/) · [EU ELI-I](https://interoperable-europe.ec.europa.eu/collection/eli-european-legislation-identifier/solution/eli-i)

## 2. How should we retrieve candidates?

| Method | Strengths and selection criteria |
|---|---|
| Exact lookup and filters | Use for explicit conditions such as case identifiers, a specific provision version, or a required medium. Cases with missing metadata may be excluded, so track omissions too. |
| Keyword search, such as BM25 | Useful for provision names, industry terminology, and wording that matches the source. Case numbers can be looked up through normalized identifiers. |
| Vector search | Finds candidates with different wording, such as "discount conditions are hard to see" and "eligibility for the discount is not clearly displayed." |
| Hybrid search | Combines keyword and vector results. RRF uses positions in each ranked list. A weighted sum of scores also requires deciding how to reconcile different score scales. |
| Query rewriting and decomposition | Splits a compound question into tasks such as finding similar decisions and looking up amendments to applied provisions. Preserve original constraints such as case identifiers and reference dates. |
| SQL and graph traversal | Retrieves evidence through verified relationships. Start with SQL joins for consistent query paths; compare graph queries when traversal paths vary by question. |

[Elastic hybrid search](https://www.elastic.co/docs/solutions/search/hybrid-search) · [Azure AI Search — Hybrid search ranking](https://learn.microsoft.com/en-us/azure/search/hybrid-search-ranking)

## 3. What if the candidates are present but ranked incorrectly?

| Reranking method | Information used for ranking | Requirements |
|---|---|---|
| Manual weights | Retrieval scores, matching media or issues, and similar signals | A baseline that requires no model training |
| Tree-based LTR, such as LambdaMART | Text scores combined with structured features | Query-specific candidate relevance labels and training and evaluation data |
| Cross-Encoder | A relevance score computed by reading the query and candidate passage together | Context is needed to judge whether the issue matches. Apply it to top candidates with per-candidate computation costs in mind. |
| LLM reranking | Query, candidates, and natural-language evaluation criteria | Testing complex criteria on a small candidate set. Measure cost, latency, and ranking consistency together. |

A Cross-Encoder score can also be an input to a tree-based ranker. For example, a model can learn from textual relevance alongside signals such as "same medium" and "matching verified applied provision." Handle mandatory conditions through lookup or filtering, and preferences through ranking.

Reranking cannot recover candidates that retrieval missed. Compare rankers on the same candidate list, and measure candidate retrieval performance separately. [Elastic Learning to Rank](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr) · [Sentence Transformers — Retrieve & Re-Rank](https://www.sbert.net/examples/sentence_transformer/applications/retrieve_rerank/README.html)

## 4. What evidence should go into the answer?

| Configuration | Evidence supplied to the answer | When to use it |
|---|---|---|
| Document RAG | Retrieved decision and legislative passages | Finding similar cases and summarizing sources are the main tasks |
| Document RAG with SQL lookup | Findings and verified applied provisions and versions | Provision or case relationships are structured and query paths are consistent |
| RAG using graph queries | Evidence and sources found by following multiple relationships | Questions repeatedly connect decisions, provisions, and amendment history |

GraphRAG uses graphs to retrieve evidence. Local search in Microsoft's implementation combines an AI-extracted graph with chunks of the source text. For legal data, check extracted relationships against the source and distinguish a citation from an actual application of a provision.

After generation, check that case IDs, findings passages, and provision versions match the query results. Even when IDs match, whether the evidence supports the answer's claims needs a separate evaluation. A feature that only presents search results and source documents can work without calling an LLM. [RAG paper](https://arxiv.org/abs/2005.11401) · [Microsoft GraphRAG — Query Overview](https://microsoft.github.io/graphrag/query/overview/)

## Configurations and metrics to compare for the AI Advertising Pre-Review Service (working title)

The following is a comparison plan, not a report of validated performance.

Start with exact lookup and keyword search plus SQL evidence lookup as the baseline. Add vector retrieval if it misses similar cases expressed differently. If candidate coverage is sufficient but ordering is poor, compare manual weights and a Cross-Encoder on the same candidates. Once relevance labels accumulate and multiple structured signals need to be incorporated, compare tree-based LTR. If more questions connect multiple sources, evaluate shared relationship definitions and graph querying.

| Failure | First metric to check | Changes to compare |
|---|---|---|
| A relevant decision is absent from the candidates | Recall@K | Retrieval methods, query rewriting, and filter omissions |
| A relevant decision ranks too low | nDCG@K | Manual weights, Cross-Encoder, and tree-based LTR |
| The case is correct but the findings passage is not | Correct findings-passage presentation rate | Passage indexing and issue-level links |
| A citation is treated as an application, or versions are confused | Relationship-type and provision-version accuracy | Verified SQL or graph lookup and provenance records |
| The answer's explanation is difficult to verify in the source | Source-evidence verification rate and proportion of claims supported by evidence | Evidence selection and citation validation |

Keep the evaluation questions and source collection fixed when comparing retrieval, reranking, and evidence lookup. Record accuracy alongside response latency, cost per query, and the work required to verify relationships and update legislation. That makes it possible to choose a stack based on the improvement it provides.

---
title: When do you need RAG, and when does it make things worse?
category: ai
categories: [ai, planning]
tags: [RAG, Long Context, Architecture, Retrieval, AI Service Planning]
date: 2026-09-28
summary: Adding retrieval does not guarantee accurate answers. Depending on the amount and type of information needed, compare it with passing entire documents to the model or querying an API or database. When using RAG, check whether retrieval loses important conditions and whether the evidence applies to the actual question, then evaluate answer quality alongside operating costs.
sample: false
related: [rag-citation-rules, data-preprocessing, context-engineering]
---

> RAG is useful for bringing in external knowledge, but adding a retrieval step doesn't guarantee more accurate answers. Depending on the shape and size of the information you need and the kind of question, something simpler than RAG may fit better.

## Why I asked this question

In a September RAG capstone, I built a pipeline where an AI writes reports from retrieved material. We set rules: if no evidence was retrieved, don't call the LLM, and strip out any citation ID that doesn't exist, in code. While building it, we also ran into cases where retrieval returned nothing or returned documents with low relevance.

Reading RAG research afterward, new questions came up. **Is adding a retrieval system always the better choice?** If there aren't many documents, wouldn't it be better to just give the model all of them? Wouldn't real-time data be more accurate fetched from an API than retrieved? Couldn't retrieved documents actually push the model toward a wrong answer?

So instead of how to build RAG, I looked at **when you should choose RAG in the first place**.

## What problem does RAG solve?

RAG (Retrieval-Augmented Generation) retrieves information related to the question from external data, adds it to the LLM's input, and generates an answer. It's useful for internal documents or recent material that the LLM's pretrained knowledge can't cover.

1. Collect documents and prepare them for search
2. Retrieve documents related to the user's question
3. Pass the retrieved documents to the model
4. The model generates an answer from that information

But RAG is just one of several ways to use external knowledge.

| Situation | Approach to consider first | Why |
|---|---|---|
| General explanations or writing | LLM alone | May not need any external knowledge |
| Summarizing or analyzing a few documents | Long Context | Keeps the context of the whole document |
| Searching a large set of internal documents | RAG | Picks out and passes only the material needed |
| Current order status, account balance | API / DB lookup | Gets the exact real-time value |
| Calculations with a fixed formula | Code / calculation engine | Reproducible, accurate calculations |
| Work that needs both document search and real-time data | RAG + API / DB | Separate lookup methods by information type |

These aren't absolute rules for picking a technology. What matters is **where the information the answer needs lives, and how to fetch it so it can be used accurately.**

## Why not pass the whole document instead of using RAG?

The EMNLP 2024 study *Retrieval Augmented Generation or Long-Context LLMs?* compared RAG with feeding long context directly. With enough resources, long context performed better on average, but RAG had a cost advantage. The study also proposed Self-Route, which picks one or the other depending on the question.

That doesn't mean long context wins in every situation. Results change with the model, document length, question type, and cost constraints. But it does show that **RAG isn't always required.**

> [!Example] Finding unfavorable clauses in a 20-page contract
> Is retrieving a few highly relevant paragraphs enough? If unfavorable clauses are scattered across the document or tied to other clauses, some can get lost during retrieval. On the other hand, if you're looking for a specific clause across tens of thousands of contracts, you can't hand every document to the model each time.

So you have to look not just at the total document size but also at **how widely the information the answer needs is spread out.**

## Are more retrieval results better?

The ICLR 2025 study *Long-Context LLMs Meet RAG* observed that adding more retrieved documents improves performance at first, but past a certain point it actually drops. Material that looks relevant but doesn't actually fit (hard negatives) gets in the way of the model's judgment.

> [!Example] Suppose a tax consultation AI retrieved this material
> - A: The tax rule currently in effect
> - B: A rule that applied in a previous tax period
> - C: A rule for a different type of business
> - D: A rule for a similar tax item but with different requirements
>
> All four are related to the search query. But if the model can't tell apart when a rule applies or which business type it covers, having more related documents actually makes the answer less accurate.

You can't assume that going from 5 to 10 retrieval results is the fix. **What matters more than the number of results is whether they're evidence that actually applies to the question.**

## With few documents, you may not need RAG

In *Introducing Contextual Retrieval* (2024), Anthropic explained that if the knowledge base is fairly small, you can consider putting all of it into the prompt instead of using RAG. They gave under 200,000 tokens as an example at the time, but that suggestion reflected the models and prompt caching of that moment. It isn't a standard for every service.

The same post also covered how traditional RAG loses context when it splits documents into chunks.

> [!Example] A chunk that lost its context
> If a retrieved sentence just says "It rose 3% year over year that quarter," you can't tell what rose. You need the document title and the surrounding text to read it correctly.

Anthropic proposed Contextual Retrieval, which adds contextual information to each chunk. In their experiments, the failure rate for retrieving relevant documents fell from 5.7% to 2.9%, and to 1.9% when combined with reranking. That said, those are results from their research setup.

What caught my attention wasn't how good any particular retrieval technique is, but that **RAG can lose the original context in the process of finding information.** For some tasks, handing over the whole document as is beats building a more sophisticated retrieval setup.

## When RAG actually makes things worse

| Problem | Risk | Example |
|---|---|---|
| Wrong documents retrieved | Answers built on the wrong evidence | Presenting a past law as the current rule |
| Missed retrieval | Needed information never gets checked | An exception clause is missed |
| Lost context | Partly right but wrong overall | A provision gets separated from its conditions |
| Stale data | Outdated information gets used | Pre-amendment rules remain in the index |
| Access control | Information exposed beyond allowed scope | Retrieving another client company's documents |
| Operational complexity | Higher cost and latency | A complex retrieval pipeline even for a simple FAQ |

### Retrieval can succeed and the answer can still be wrong

With RAG, it's especially important to separate retrieval quality from answer quality.

- **Retrieval Relevance:** Are the retrieved documents related to the question?
- **Faithfulness:** Are the answer's claims backed by the retrieved evidence?
- **Answer Correctness:** Does the answer match the actual facts and conditions?

These are three different things. Even if the AI cites a real tax provision, the answer is wrong if that provision applies to a different kind of business than the one asked about. Finding a source document doesn't guarantee the right answer. If the retrieved documents don't contain the needed information, the system may need to hold off on answering or ask for more information instead of guessing.

So when designing RAG, you need to check not only retrieval accuracy but also **whether the retrieved evidence actually supports the answer.**

## How should you decide whether to adopt RAG?

| Step | What to check |
|---|---|
| Does the problem need external knowledge? | If not, there's little reason to add RAG. Fixed calculations or rule checks may belong in code |
| What shape is the data you need? | Structured real-time data: API or DB. A few documents: long context. Many documents: RAG. Both: combine them |
| How much context does the answer need? | If part of a document can answer it, RAG works well. If it needs the relationship between several clauses or the overall flow, retrieving a few chunks works against you |
| Did you compare accuracy and operating cost together? | Include collection, preprocessing, embedding, index updates, retrieval, reranking, incident response, and evaluation costs |

Large data alone doesn't make RAG the best option either. In the end, what matters is **whether the approach meets the quality you need with operational complexity you can handle.**

## What if I applied this to TaxDesk?

The actual TaxDesk combines retrieval over summarized legal documents (RAG) with server code for lookups, rule checks, and calculations. The table below is a design direction I thought through for which approach to consider first if the features were expanded. It isn't the result of an actual comparison experiment.

| Feature | Approach to consider first | Why |
|---|---|---|
| Q&A on tax rules | RAG | Retrieve relevant laws and interpretations |
| Looking up a specific tax rate | Verified data or API / rules | Confirm the effective date and exact value |
| Tax calculation | Calculation logic | Reproducible formulas and exception conditions |
| Searching similar consultation cases | RAG | Find related cases and evidence |
| Summarizing a single document | Long Context | Keep the original context |
| Checking whether a tax rule applies | RAG + condition checks | Verify the requirements of the retrieved law |

For tax consultations, you can use RAG to find the relevant rules and use verified data and calculation logic for exact figures and calculations. Even if RAG finds the latest law, the effective date, business type, and exception conditions still need to be checked separately.

Being an AI service doesn't mean every feature has to run through an LLM and RAG. I think it's more important to **split the roles of each technology based on the judgment the work needs and the nature of the data.**

## How do you verify that RAG is actually needed?

You can design an experiment that compares several approaches on the same questions.

| Variant | Approach | What it checks |
|---|---|---|
| A | LLM alone | How much can be answered without external knowledge |
| B | Long Context | Answer quality when given the whole document |
| C | Basic RAG | Using the top K retrieved chunks |
| D | Improved RAG | With hybrid search, reranking, etc. |

Not all four have access to the same external information, so the purpose of the comparison has to be clear. LLM alone serves as a no-external-knowledge baseline, and long context and RAG are compared on the same document set and evaluation questions wherever possible.

| Question type | What it verifies |
|---|---|
| General question | Retrieves the right evidence |
| Exception conditions | Whether provisos and exception clauses get missed |
| Time conditions | Tells past rules from current ones |
| Multiple sources | Combines information across documents |
| Unanswerable | Doesn't guess when there's no evidence |

**Unanswerable questions** are especially important to include. The ACL 2025 study *UAEval4RAG* also took up the need to evaluate whether RAG handles questions it can't answer. If you only evaluate questions that have answers, you can't tell how often the model makes up a wrong answer when there's no evidence.

| Evaluation area | Metrics |
|---|---|
| Retrieval quality | Recall@k, Context Precision |
| Answer quality | Answer Correctness, Faithfulness |
| Handling edge cases | Rate of appropriately holding off on unanswerable questions |
| Response performance | Mean and p95 latency |
| Cost | Cost per successful request |
| Data management | Document freshness, version error rate |

Keep comparison conditions like the model, evaluation questions, and data version as aligned as possible, and log any settings you change. Rather than settling which is better from a single run, look at performance by question type and across repeated runs. I haven't run this comparison yet.

## Where I've landed

When I first built RAG, I thought retrieving external documents and passing them to the model would produce more accurate answers. But in the capstone we hit cases where retrieval returned nothing or returned low-relevance material, and reading the research, I learned that the retrieval step itself can become a new source of failure.

There are clear cases where RAG is needed: finding relevant evidence in a large document set, or using internal knowledge the model wasn't trained on. But in situations like these, other approaches are worth looking at first.

- There are few documents and the full context matters
- You need exact real-time values
- It can be calculated with fixed rules and formulas
- Important information gets dropped during retrieval
- The added operational complexity and cost outweigh the quality gain

Adopting RAG shouldn't become the goal in itself. **Define the business problem first, then pick the approach that best supplies the information that problem needs.** I think an AI service PM should understand not just how RAG works but also be able to judge when to use it and when not to.

## References

Checked: 2026.11.11

- [Retrieval Augmented Generation or Long-Context LLMs? A Comprehensive Study and Hybrid Approach](https://aclanthology.org/2024.emnlp-industry.66/) — EMNLP 2024, performance and cost comparison of RAG and long context
- [Long-Context LLMs Meet RAG](https://proceedings.iclr.cc/paper_files/paper/2025/hash/5df5b1f121c915d8bdd00db6aac20827-Abstract-Conference.html) — ICLR 2025, number of retrieved documents and performance drop
- [Introducing Contextual Retrieval](https://www.anthropic.com/research/contextual-retrieval) — Anthropic, 2024.09.19, context loss and improving retrieval
- [LaRA: Benchmarking Retrieval-Augmented Generation and Long-Context LLMs](https://proceedings.mlr.press/v267/li25dv.html) — ICML 2025, comparing when RAG and long context fit
- [UAEval4RAG: Unanswerability Evaluation for Retrieval Augmented Generation](https://aclanthology.org/2025.acl-long.415/) — ACL 2025, evaluating unanswerable cases
- [Ragas — Metrics](https://docs.ragas.io/en/stable/concepts/metrics/available_metrics/) — Evaluating retrieval relevance, faithfulness, and answer correctness

Related exercise: SKALA RAG pipeline capstone (2026.09.18 ~ 09.22)

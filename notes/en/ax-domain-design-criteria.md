---
title: What Should Change When AI Transformation Moves Across Industries?
category: ax
tags: [AX, AI governance, Risk management, Workflow design]
date: 2026-11-12
summary: Research and examples from finance, healthcare, legal services, manufacturing, retail, HR, and public services inform a practical framework for evaluating business outcomes, managing risk, and setting AI autonomy.
sample: false
series: domain-ax
seriesOrder: 1
related: [agent-autonomy, agent-governance, agent-kpi]
---

A bank searching internal policies, a hospital summarizing clinical records, and a retailer processing refunds can all use AI. Sharing a model does not mean they should share approval procedures or success criteria. Correcting a search result is different from reversing an executed transaction or a decision that has already affected a patient.

Here, **AI transformation (AX)** means using AI to change how work is performed and managed. The starting point is the specific task, its consequences, and the authority granted to AI. The industry provides the regulatory, data, and operational context for those decisions.

Three principles guide this article:

- **Evaluate outcomes alongside risk.** Measure time, cost, and completion together with serious errors, unauthorized actions, and harm to people's rights.
- **Set autonomy according to risk and recoverability.** Separate permission to read and recommend from permission to change external systems.
- **Distinguish evidence from design recommendations.** Findings from one company or experiment do not establish the returns every industry should expect.

## 1. Better model performance still requires a separate test of business outcomes

### Customer support: who benefits matters as much as the average

Brynjolfsson, Li, and Raymond's 2025 journal article analyzed **5,172 customer-support agents**. Access to AI assistance increased issues resolved per hour by **15% on average**, with substantial differences by experience and skill. Less experienced and less skilled workers benefited more; the most skilled group saw small speed gains and small quality declines. This study of a staggered rollout at one company is not a universal ROI estimate. [Generative AI at Work, QJE, 2025](https://doi.org/10.1093/qje/qjae044)

**Design recommendation:** Break results down by task difficulty, worker experience, and exception cases. Include verification and correction time when calculating the time saved.

### Healthcare: a capable model does not automatically produce a better human–AI team

A randomized study published in JAMA Network Open in 2024 involved **50 physicians** working through clinical cases. Access to an LLM did not produce a statistically significant improvement in diagnostic reasoning over conventional resources. The study did not measure patient treatment outcomes, and it does not establish that all medical AI is ineffective. [Large Language Model Influence on Diagnostic Reasoning, 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395)

**Design recommendation:** Evaluate the human–AI workflow as well as the model alone. Check whether reviewers have the evidence and time needed to detect errors, and whether they actually reject incorrect recommendations.

### Legal research: retrieval does not make an answer verified

A study of US legal research tools found that hallucinations persisted in specialist services using retrieval-augmented generation. Its findings concern particular tools and questions at a particular time; they are not current error rates for all legal AI or for Korean legal and tax work. [Hallucination-Free? research paper](https://arxiv.org/abs/2405.20362)

**Design recommendation:** Check separately that a source exists, supports the answer, and applies to the relevant jurisdiction, tax period, and effective date. A citation link and an appropriate source are different things.

## 2. Industries differ in the consequences of failure and the evidence required

The following table contains **design recommendations** informed by the research and official materials discussed here. It does not assign legal risk classifications to entire industries or impose universal requirements.

| Field | Tasks to distinguish | Critical data and operating conditions | Failures and evaluation priorities |
| --- | --- | --- | --- |
| Finance | Policy search / credit decisions / transaction execution | Product and policy versions, customer-data access, transaction state | Incorrect explanations, adverse decisions, unauthorized or duplicate transactions |
| Healthcare | Administrative summaries / clinical support / actions affecting treatment | Patient population, clinical context, current and complete records | Clinically significant errors and omissions, reviewer performance, patient safety |
| Legal and tax | Research / drafting / calculation and filing | Jurisdiction, effective dates, tax period, source records | Unsupported claims, temporal errors, calculation errors, incorrect submissions |
| Manufacturing | Maintenance-document search / failure prediction / equipment control | Sensor health, rare failures, equipment changes, response time | Missed failures, false alarms, production losses, breached safety limits |
| Retail and logistics | Demand forecasts / support / purchasing and refunds | Seasonality, demand hidden by stockouts, inventory and order state | Stockouts, excess stock, repeat contacts, duplicate refunds, inconsistent state |
| HR | Policy information / candidate evaluation / employment decisions | Job relevance, population coverage, sensitive information | Group-specific errors, unjust exclusion, effective review and appeal |
| Public services | Information / eligibility support / benefit decisions | Policy versions, missing records, accessibility, decision records | Incorrect eligibility decisions, rights infringements, slow correction, access to human assistance |

Record summaries and internal search are not automatically low-risk tasks. An omission may influence a later clinical decision, and a search result may expose another customer's information.

Accuracy alone cannot resolve every problem in HR. A 2025 ILO paper examines how flawed objectives, biased data, and opaque implementation can undermine AI in recruitment and workforce management. [ILO, AI in human resource management](https://www.ilo.org/publications/ai-human-resource-management-limits-empiricism)

**Design recommendation:** Before training a model to reproduce past hiring or performance decisions, examine whether those decisions are a legitimate target. Public services also need usable routes for people to understand and challenge mistakes, alongside faster processing.

## 3. Separate legal duties, official guidance, and internal rules

For a Korean deployment, checking one AI law is not enough. Data protection, sector-specific rules, and institutional policies may also apply. These sources identify questions to investigate at project initiation.

| Type of source | What the source establishes | What the project must determine |
| --- | --- | --- |
| Korean legislation | Article 34 of Korea's AI Basic Act sets out duties relating to high-impact AI, including risk management, explanation arrangements, user protection, human oversight, and documentation. | Whether the system qualifies, the provider's role, and relevant implementing provisions. Do not assume identical duties apply to every AI feature. |
| Financial-sector self-regulation | The Financial Services Commission's June 2026 announcement describes its AI guidelines as self-regulation and distinguishes them from separate legal obligations. | Applicable guidance, internal accountability, and human intervention arrangements. |
| Official data-protection guidance | The Personal Information Protection Commission describes explanation and review requests for fully automated decisions, and a right to refuse certain decisions subject to conditions. | Personal-data processing, how decisions are made, significant effects, and conditions and exceptions governing those rights. |
| Medical-device guidance | The Ministry of Food and Drug Safety lists guidance on approval and review of generative AI medical devices. | Whether the intended use falls within medical-device regulation and which requirements apply. |

Sources for the respective rows: [AI Basic Act, Article 34](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031809457), [FSC announcement](https://www.fsc.go.kr/po010103/87142), [PIPC guidance](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=9969), and [MFDS guidance listing](https://www.mfds.go.kr/law/board/boardDetail.do?brdId=data0011&menuKey=29&seq=15628).

International frameworks have different roles. NIST's AI Risk Management Framework is voluntary; its 2024 Generative AI Profile adapts that framework to generative AI. This article draws on **AI RMF 1.0 and NIST AI 600-1**. NIST reports that revision work is underway, so projects should record the version they use. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

**Design recommendation:** Label each requirement as a legal duty, official guidance, or an internal standard, and record its source, scope, review date, and owner. Do not present foreign guidance as a domestic legal obligation or equate an internal risk rating with a statutory classification.

## 4. Set autonomy at the task level and enforce limits in the execution system

At least five dimensions matter:

1. **Severity:** Could an error affect health, property, rights, or personal information?
2. **Likelihood and exposure:** How often does the action run, and what happens under exceptions or concurrent execution?
3. **Detectability:** Can an error be caught before harm occurs?
4. **Recoverability:** Can the real-world outcome be reversed, or only the displayed data? Does recovery require time, money, or another party's cooperation?
5. **Authority and reach:** Is this one recommendation, or a sequence of actions affecting many customers or machines?

Do not reduce these dimensions to a single additive score that determines release approval. Low scores elsewhere cannot cancel a possibility of serious, irreversible harm. The following is an **initial design framework**, not a legal classification.

| Operating mode | Conditions to consider | Controls to establish |
| --- | --- | --- |
| Read, draft, or recommend | People execute the action and can assess the output | Access controls, source verification, limits on external transmission, abstention when uncertain |
| Execute after approval | A reviewer can understand the evidence and proposed change and detect mistakes | Exact target, amount, and changes shown; valid approval; fresh authorization and state checks before execution |
| Bounded automatic execution | Impact is limited, detection and recovery are tested, and applicable rules permit it | Allowlisted tools, amount and frequency limits, duplicate prevention, audit records, automatic stopping and human handoff |
| Defer automatic execution | Potential serious harm, insufficient validation, irreversibility, or unclear authority | Preserve human procedures, use validated existing systems, reassess after redesign |

Human approval is itself a control whose effectiveness needs testing. WHO warns that medical use of large multimodal models can encourage automation bias, causing people to overlook errors or delegate difficult judgments inappropriately. [WHO guidance announcement, 2024](https://www.who.int/news/item/18-01-2024-who-releases-ai-ethics-and-governance-guidance-for-large-multi-modal-models)

**Design recommendation:** Have APIs and business systems enforce permissions; a prohibition in a prompt is insufficient. Require fresh approval if the target or amount changes. Include cases where deleting a record cannot undo harm, such as information already disclosed externally.

> [!예시] dividing a refund assistant's authority
> This is a hypothetical design, not a description of a named company's system.
>
> 1. AI reads the order and refund policy, then drafts a proposal.
> 2. Separate rules check identity, eligibility period, amount, and previous refunds.
> 3. Cases outside the predefined automatic-processing scope go to a reviewer who sees the exact order and amount.
> 4. The execution system rechecks permissions and current state and prevents duplicate payment for the same request.
> 5. A timeout triggers a check of the payment system's actual state, rather than an assumption that the payment failed and should be repeated.
> 6. An incorrect payment is not assumed to be reversible through a database rollback. Define whether recovery or offsetting is possible and who handles it.

Evaluation must ask whether the system reached the **correct final state while following policy**, as well as whether its reply sounded natural. τ-bench combines simulated users, tools, and policies and evaluates final database state and repeated-run reliability. Passing a benchmark does not certify operational safety. [τ-bench, 2024](https://arxiv.org/abs/2406.12045)

## 5. Choose technology around uncertainty and verification

These are starting points, not a ranking of technologies. A single workflow may combine several methods.

| Task characteristics | Methods to consider first | Verification question |
| --- | --- | --- |
| Explicit calculations or eligibility rules | Conventional code and rule engines | Can results be reproduced for the same inputs and rule version, including boundary cases? |
| Demand, failure, or risk prediction | Statistical, ML, and time-series models | Are observations and labels adequate? Do false positives and false negatives have different costs? |
| Evidence retrieval and explanation | Search and RAG | Are document permissions and versions correct, and does the answer follow the evidence? |
| Extraction and summarization | OCR, document processing, and LLMs | How will important omissions and incorrect extractions be identified? |
| Predetermined action sequences | Workflows and APIs | How are exceptions, retries, duplicates, and partial failures handled? |
| Context-dependent tool selection | A constrained agent | Is dynamic selection necessary, and can systems enforce permissions and stopping conditions? |
| Safety-critical physical control | Validated control logic and safety systems | Are safety limits and emergency stops independent of unrestricted AI judgment? |

**Design recommendation:** Use testable functions for tax calculations, source retrieval for explaining applicable rules, and a separate approval process for filing. The label “tax agent” should not collapse calculation, judgment, and execution into a single undifferentiated mechanism.

## 6. Read company examples together with their evidential limits

### Klarna: adoption scale does not establish complete replacement

Klarna's February 2024 press release said its assistant handled about two-thirds of customer-service chats in its first month. The **$40 million profit improvement was a projection at that time**. These company claims do not independently establish causal effects or the number of jobs eliminated. [Klarna press release, February 27, 2024](https://www.prnewswire.com/news-releases/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month-302072740.html)

Its fiscal 2025 annual report, filed in 2026, describes a combination of AI and human support, with a human option available to customers. It also states that the company uses established ML techniques for underwriting, but not generative AI. This illustrates different technology and authority choices within one organization. [Klarna Form 20-F, fiscal 2025](https://www.sec.gov/Archives/edgar/data/2003292/000200329226000007/klar-20251231.htm)

### Siemens Senseye: a vendor's maximum benefit is not your plant's forecast

Siemens states that Senseye can reduce unplanned machine downtime by **up to 50%**. This is a supplier claim, not an average improvement across all equipment or an independently established general effect. [Siemens announcement, 2022](https://news.siemens.co.uk/news/siemens-acquires-senseye-predictive-maintenance-and-asset-intelligence-for-industrial-companies)

**Design recommendation:** In a predictive-maintenance pilot, track baseline downtime by asset, failure frequency, false-alarm handling costs, and whether maintenance teams actually respond. Early detection may not produce operational gains if the necessary staff or spare parts are unavailable.

Both examples are useful for asking which tasks were measured and how people and systems were connected.

## 7. Evaluate business outcomes and risk side by side

This is a **sample evaluation framework**, not a set of universal passing thresholds.

| Dimension | Example metrics | Measurement considerations |
| --- | --- | --- |
| Completion | Policy-compliant completions divided by predefined eligible cases | Avoid retaining only easy cases in the denominator. Report automatic completion, human handoff, and failure separately. |
| Time | Time from intake to final resolution; human review and correction time | Examine long delays and repeat contacts as well as averages. |
| Quality | Expert correction, important omission, and rework rates | Break down results by task difficulty, user group, and worker experience. |
| Cost | Total cost per finally resolved case | Include models, retrieval, infrastructure, review, rework, and operations; account for initial investment over the evaluation period. |
| Risk | Serious errors, unauthorized actions, disclosures, discriminatory outcomes | Record exposure and severity alongside counts. Average gains do not offset serious incidents. |
| Recovery | Time to detect and stop; completed restoration or remediation | Distinguish editing data from repairing harm, and record irreversible incidents separately. |

The ILO's 2026 review of empirical evidence also highlights uneven productivity gains and limits to their verification. Time savings, organizational output, cost reductions, and employment changes should be measured as distinct outcomes. [ILO review of empirical evidence on GenAI](https://www.ilo.org/publications/impact-genai-jobs-productivity-and-work-organization-review-empirical)

**Design recommendation:** Use a comparison group or phased rollout where feasible. If only a before-and-after comparison is possible, record seasonality, changes in case mix, staffing, and policy. Check separately whether saved time leads to additional output or lower costs.

Define stopping conditions independently of performance targets. For example, an action outside its approval scope can trigger suspension and investigation. An accountable owner should establish evidence-based error, handoff, and restart criteria. Observing no incidents during a test does not establish the absence of rare, serious risks.

## 8. Questions to answer before implementation

- **Workflow:** Where does the task begin and end, and what are its bottlenecks and exceptions?
- **Data:** Who manages provenance, lawful use, access, and freshness?
- **Role:** May AI read, recommend, request approval, or execute?
- **Risk:** What is the worst credible harm, and can it be detected beforehand?
- **Recovery:** What can actually be reversed, and who responds when reversal is impossible?
- **Review:** Do reviewers have the evidence, authority, and time to make a real decision?
- **Evaluation:** Are comparison metrics, populations, periods, and failure criteria defined?
- **Operations:** Who can stop, take over, and restart the service, and what triggers reevaluation after model, document, or policy changes?

Record the answers in workflow diagrams, data inventories, risk registers, permission tables, evaluation plans, and incident procedures. A risk register should identify triggering conditions, affected parties, prevention, detection, recovery, ownership, and validation evidence.

These answers turn industry context into concrete design decisions. The next installment examines finance by separating policy search, credit decisions, and transaction execution.

*Series plan: 01 Common design principles → 02 Finance → 03 Healthcare → 04 Legal and tax → 05 Manufacturing → 06 Retail → 07 HR and public services. Later installments are planned.*

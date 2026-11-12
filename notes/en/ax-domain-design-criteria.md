---
title: What Should Change When AX Moves Across Industries?
category: ax
tags: [AX, AI governance, Risk management, Workflow design]
date: 2026-11-12
summary: What changes across industries isn't the model. It's what breaks when things fail, which rules apply, and whether the result can be undone. That's why the same summarization, search, or execution task calls for different AI permissions and verification in each industry.
sample: false
series: domain-ax
seriesOrder: 1
related: [agent-autonomy, agent-governance, agent-kpi]
---

> What changes across industries isn't the model. It's ① what breaks when things fail ② which rules must be followed ③ whether the result can be undone. Because these three differ, the same summarization, search, or execution task calls for different AI permissions and verification.

A bank searching internal policies, a hospital summarizing clinical records, and a retailer processing refunds can all use AI. But sharing a model doesn't mean sharing the same approval procedures or success criteria. Fixing a wrong search result is different from reversing an executed transaction or a judgment that has already affected a patient.

Here, AX means using AI to change how work is done and run. This note is the **common installment** of the series: it sets out the criteria that separate industries and how those criteria change the design.

## Three things that differ by industry

| Field | Tasks to distinguish | Key data and operating conditions | What breaks when it fails |
| --- | --- | --- | --- |
| Finance | Internal policy search / credit decisions / transaction execution | Product and policy versions, customer-data access, transaction state | Wrong explanations, adverse decisions, unauthorized or duplicate transactions |
| Healthcare | Administrative summaries / clinical support / actions affecting treatment | Patient population, clinical context, current and complete records | Clinically significant omissions or errors, patient safety |
| Legal and tax | Research / opinion drafts / calculation and filing | Jurisdiction, effective dates, tax period, source records | Unsupported claims, timing errors, calculation errors, wrong submissions |
| Manufacturing | Maintenance-document search / failure prediction / equipment control | Sensor health, rare failures, equipment changes, response time | Missed failures, false alarms, production losses, breached safety limits |
| Retail and logistics | Demand forecasts / support / ordering and refunds | Seasonality, demand hidden by stockouts, inventory and order state | Stockouts or excess stock, repeat contacts, duplicate refunds, inconsistent state |
| HR | Policy information / candidate evaluation / employment decisions | Job relevance, representativeness of the evaluated group, sensitive data | Group-specific errors, unjust exclusion, no route to appeal |
| Public services | Information / eligibility support / benefit decisions | Policy versions, missing records, accessibility, decision records | Wrong eligibility decisions, rights infringements, slow correction |

Reading down the table, tasks carry different weight even within one industry. So the judgment has to be made by **task**, not by industry name. Summarizing medical records or searching a bank's internal documents isn't automatically low-risk. If an omission in a summary feeds a later decision, or a search exposes another customer's information, the real impact grows.

HR and public services have problems that accuracy alone won't fix. A 2025 ILO paper points out that wrongly set objectives, biased data, and opaque implementation can undermine HR AI. [ILO, AI in human resource management](https://www.ilo.org/publications/ai-human-resource-management-limits-empiricism) So in HR, before building a model that reproduces past hiring or evaluation results, you have to ask whether those past results are a legitimate standard. In public services, alongside processing speed, a route for citizens to understand errors and request corrections has to count as part of performance.

## The same task is handled differently by industry

Below is an **example design** that applies the three criteria above to the same task.

> [!예시] The same "summarize"
> | Task | If something is missed | Can it be undone? | What AI is trusted with |
> | --- | --- | --- | --- |
> | Retail support-log summary | The next agent asks the customer again | Easily | Generated automatically, spot-checked |
> | Bank internal-policy summary | Staff give a customer wrong guidance | Hard once the guidance is out | Draft + required link to the source clause, checked by staff |
> | Clinical-record summary | The next clinical judgment goes wrong | Hard once it affects the patient | Draft only, not used before clinician review |

> [!예시] The same "search"
> | Task | Where it tends to go wrong | What to check alongside |
> | --- | --- | --- |
> | Retail product FAQ | Outdated promotion or stock information | When the document was last updated |
> | Financial product guidance | Discontinued products, pre-amendment terms | Product and policy version, per-customer access rights |
> | Legal and tax questions | Provisions from another year or jurisdiction | Effective date, tax period, jurisdiction |

> [!예시] The same "execute"
> | Task | If it runs wrongly | What AI is trusted with |
> | --- | --- | --- |
> | Small retail refund | Duplicate payment, which needs a recovery process | Limited automatic execution within set amounts and conditions |
> | Bank transfer or trade | An executed transaction is hard to reverse | Proposal only; execution after approval |
> | Manufacturing equipment control | Production loss, breached safety limits | Detection and alerts only; control stays with validated control logic |
> | Public benefit decision | Rights infringement, slow correction | Review support only; the decision stays with staff |

Even under the same task name, if **the harm from being wrong and the ability to recover** differ, what AI is trusted with differs too. The sections below cover the evidence behind these differences and how it changes project design.

## Model performance and business outcomes need separate checks

### Customer support: who benefited matters more than the average

Brynjolfsson, Li, and Raymond's 2025 journal article analyzed data from **5,172 customer-support agents**. After agents gained access to an AI assistant, issues resolved per hour rose **15% on average**, but the effect varied with skill and experience. Less skilled and less experienced agents improved the most, while the most skilled group saw small speed gains and a slight drop in quality. It analyzes a staggered rollout at one company, so it shouldn't be carried over as the expected ROI for every industry. [Generative AI at Work, QJE, 2025](https://doi.org/10.1093/qje/qjae044)

So for call centers with many agents, such as in retail or finance, results should be split between new and experienced staff rather than read as one average. The real time saved only shows up once the time people spend checking and fixing AI output is added back.

### Healthcare: an AI's answering ability and a person's ability to use AI are different

In a randomized study published in JAMA Network Open in 2024, **50 physicians** worked through clinical cases. The group with access to an LLM did not perform significantly better at diagnostic reasoning than the group using conventional resources. The trial didn't measure actual patient outcomes, and it doesn't mean all medical AI is ineffective. [Large Language Model Influence on Diagnostic Reasoning, 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395)

So in healthcare, what needs evaluating is the result of "physician + AI," not the model's score alone. That includes whether clinicians have the information and time to spot a wrong AI suggestion, and whether they actually reject it.

### Legal research: adding retrieval doesn't make an answer verified

A study of US legal research tools reported that hallucinations remained even in professional services using RAG. It covers specific tools and questions at a specific time, so it doesn't represent the error rate of all legal AI today or of Korean legal and tax work. [Hallucination-Free? research paper](https://arxiv.org/abs/2405.20362)

So in legal and tax work, the fact that a source link is attached and whether that source is right have to be evaluated separately. Check whether the retrieved document actually supports the answer's claim, and whether it applies to the relevant jurisdiction, tax period, and effective date.

## Rules to follow: separate legal duties, official guidance, and internal standards

For a project in Korea, checking a single AI law rarely finishes the review. Data-protection rules, sector-specific regulation, and internal policies can all apply at once.

| Type of source | What I found | What the project needs to check |
| --- | --- | --- |
| Korean legislation | Article 34 of the AI Basic Act sets out risk management, explanation arrangements, user protection, human oversight, and documentation for operators of high-impact AI. | Whether the system counts as high-impact, the operator's role, the enforcement decree and its scope. Don't assume it applies the same way to every AI feature. |
| Financial self-regulation in Korea | The Financial Services Commission's June 2026 announcement describes its AI guidelines for the financial sector as self-regulation, separate from legal obligations. | Which guidelines apply to the task and institution, internal accountability, and human-intervention arrangements. |
| Official data-protection guidance | The Personal Information Protection Commission explains the right to request explanation and review of fully automated decisions, and a right to refuse them under certain conditions. | How personal data is processed and decisions are made, whether the effect is significant, and the conditions and exceptions for exercising those rights. |
| Official medical-device guidance | The Ministry of Food and Drug Safety publishes guidelines for approval and review of generative AI medical devices. | Whether the service counts as a medical device given its intended use, and which standards apply. |

Sources for each row: [AI Basic Act, Article 34](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031809457), [FSC announcement](https://www.fsc.go.kr/po010103/87142), [PIPC guidance](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=9969), [MFDS guideline listing](https://www.mfds.go.kr/law/board/boardDetail.do?brdId=data0011&menuKey=29&seq=15628).

International materials also need to be read for what they are. NIST's AI RMF is a voluntary risk-management framework, and its 2024 Generative AI Profile extends it to generative AI. This note draws on **AI RMF 1.0 and NIST AI 600-1**. Since NIST says revisions are under way, it's worth recording which version you apply. [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework), [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)

Each industry starts from a different place. In finance, look first at the FSC guidelines and internal-control standards; in healthcare, at whether the service is a medical device; in HR and public services, where decisions about people are involved, at the data-protection rules on automated decisions. In any industry, mark each requirement as a legal duty, official guidance, or an internal standard, and record its source, scope, review date, and owner. Don't rewrite foreign guidance as a domestic obligation, or treat an internal risk rating as a legal classification.

## Can it be undone: set autonomy per task and enforce limits in the execution system

Deciding autonomy needs at least these five things:

1. **Size of harm:** How would an error affect life and safety, property, rights, or personal information?
2. **Exposure and likelihood:** How often does it run, and what goes wrong in exceptions or concurrent runs?
3. **Detectability:** Can the error be found before harm occurs?
4. **Recoverability:** Is what can be reversed the data on screen, or the actual business outcome? Does recovery need time, money, or another party's cooperation?
5. **Authority and reach:** Is it a single proposal, or an action that can affect many customers or machines in a row?

Don't turn these into a simple summed score that decides release. The possibility of serious, irreversible harm can't be offset by low scores on other items. Below is an **initial design standard**, not a legal classification. The example designs in "The same task is handled differently by industry" follow the levels in this table.

| Operating mode | Conditions to consider | Controls needed |
| --- | --- | --- |
| Read, draft, recommend | People carry out the action and can check whether the result fits | Access rights, source checks, limits on external transmission, holding back when uncertain |
| Execute after approval | The approver can understand the evidence and changes and spot errors | Show target, amount, and changes; confirm valid approval; recheck permissions and state right before execution |
| Limited automatic execution | Impact is limited, error detection and recovery are tested, and applicable rules allow it | Limits on allowed tools, amounts, and counts; duplicate prevention; audit records; automatic stop and human handoff |
| Hold off on automatic execution | Possible serious harm, insufficient validation, irreversibility, unclear authority | Keep the human-run procedure, use validated existing systems, reassess after redesign |

Human approval is a control too, so its effect has to be tested. WHO warns about automation bias in medical use of large multimodal models, where people miss errors or hand over judgment too readily. [WHO announcement, 2024](https://www.who.int/news/item/18-01-2024-who-releases-ai-ethics-and-governance-guidance-for-large-multi-modal-models)

Permissions have to be enforced by the actual APIs and business systems, not by prohibitions in a prompt. If the target or amount changes after approval, require approval again. Recovery plans should also cover cases where deleting a record can't undo the harm, such as sensitive information that has already gone out.

> [!예시] A retail refund assistant — splitting authority
> 1. AI reads the order status and refund policy and drafts a refund proposal.
> 2. Separate rule logic checks identity, the refund window, the amount, and any previous refunds.
> 3. Anything outside the predefined automatic range goes to a staff member, who sees the exact order and amount and approves it.
> 4. The execution system rechecks permissions and current state, and blocks duplicate payment for the same request.
> 5. If the response is cut off, it doesn't assume failure and pay again. It checks the payment system's actual state first.
> 6. A wrong payment isn't assumed to be fixed by a simple rollback. Decide whether recovery or offsetting is possible and who is responsible.

What to evaluate here isn't just how natural the reply sounds, but **whether it reached the correct final state while following policy**. τ-bench combines simulated users, tools, and business policies, and evaluates the final database state and reliability across repeated runs. [τ-bench, 2024](https://arxiv.org/abs/2406.12045)

Move the same structure to bank transfers and the automatic range in step 3 shrinks to practically zero; in equipment control, AI doesn't enter step 4 at all. When the industry changes, what changes isn't the number of steps but **where in the steps AI is allowed to sit**.

## Choose technology to fit the task's uncertainty and how it's verified

This is a design starting point, not a ranking of technologies. Several methods can be combined within one task.

| Nature of the task | Method to consider first | Question to check |
| --- | --- | --- |
| Clear calculations and eligibility rules | Ordinary code, rule engines | With the same rule version and inputs, can results be reproduced and boundary values tested? |
| Demand, failure, or risk prediction | Statistics, ML, time-series models | Are there enough observations and labels? Do false positives and false negatives cost differently? |
| Finding and explaining source documents | Search, RAG | Are document permissions and versions right, and does the answer follow the actual evidence? |
| Extracting and summarizing unstructured documents | OCR, document processing, LLMs | How are omissions of important items and wrong extractions caught? |
| Fixed-sequence execution | Workflows, APIs | How are exceptions, retries, duplicates, and partial failures handled? |
| Choosing tools by situation | A constrained agent | Is dynamic judgment really needed? Can the system enforce permissions and stopping conditions? |
| Safety-critical physical control | Validated control logic, safety systems | Do safety limits and emergency stops stay independent of free AI judgment? |

In tax work, split it up: tax calculation as a testable function, explaining the applicable law as source retrieval, filing as a separate approval step. Don't handle calculation, judgment, and execution the same way under one "tax agent" label. In manufacturing, ML can handle prediction, but stopping equipment and enforcing safety limits stays with validated control logic.

## Read company examples for the limits of their evidence, not just the effect

### Klarna (fintech): separating scale of adoption from full replacement

In a February 2024 press release, Klarna said its AI handled about two-thirds of customer-service chats in the first month. The **$40 million profit improvement** in the same release **was a projection at the time**. It shouldn't be used as independently verified causal impact or as proof of actual headcount reduction. [Klarna press release, February 27, 2024](https://www.prnewswire.com/news-releases/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month-302072740.html)

Later sources matter too. Its fiscal 2025 annual report, filed in 2026, describes running AI and human support side by side and offering customers a human option. It also states that underwriting uses established ML but not generative AI. It reads as a case where one financial company applies different technology and authority to support and to credit decisions. [Klarna Form 20-F, fiscal 2025](https://www.sec.gov/Archives/edgar/data/2003292/000200329226000007/klar-20251231.htm)

### Siemens Senseye (manufacturing): don't use a vendor's maximum as your plant's forecast

Siemens says Senseye can reduce unplanned machine downtime by **up to 50%**. That's the supplier's product claim, not an average improvement across all equipment or an independently verified general effect. [Siemens announcement, 2022](https://news.siemens.co.uk/news/siemens-acquires-senseye-predictive-maintenance-and-asset-intelligence-for-industrial-companies)

So a predictive-maintenance pilot should measure baseline downtime per asset, failure frequency, the cost of handling false alarms, and whether maintenance staff actually respond. Detecting an anomaly early doesn't become a business result if there are no parts or people to act on it.

## Judge AX success by putting business results and risk side by side

Below is an **example evaluation sheet** to define per project.

| Dimension | Example metrics | Watch out when measuring |
| --- | --- | --- |
| Completion | Cases completed in line with policy ÷ predefined eligible cases | Don't leave only easy cases in the denominator. Count automatic completion, human handoff, and failure separately. |
| Time | Time from intake to final resolution; human review and correction time | Look at long-delay cases and repeat contacts, not just averages. |
| Quality | Expert correction rate, rate of missing key information, rework rate | Check differences by task difficulty, user group, and staff experience. |
| Cost | Total cost per finally resolved case | Include model, retrieval, infrastructure, review, rework, and operating costs, and spread initial investment over the evaluation period. |
| Risk | Serious errors, unauthorized execution, data leaks, discriminatory outcomes | Record exposure and severity along with counts. Don't let average gains offset serious incidents. |
| Recovery | Time to detect and stop; rate of actual state restored or compensation completed | Separate fixing data from repairing harm. Record unrecoverable incidents separately. |

The ILO's 2026 review of empirical studies also points to uneven productivity gains and the limits of verifying them. Individual time savings, organizational output, cost reductions, and employment changes are different outcomes and need to be measured separately. [ILO review of empirical evidence on GenAI](https://www.ilo.org/publications/impact-genai-jobs-productivity-and-work-organization-review-empirical)

Which dimension gets the most weight differs by industry. Retail and customer support come first on time and cost; healthcare and public services on risk and recovery; finance on risk and policy-compliant completion. But in any industry, confirm the effect with a pilot that has a comparison group or a phased rollout where possible, and set stopping conditions before launch, separate from performance targets. For example, finding an execution outside the approved scope can stop automatic execution and trigger an investigation. No incidents during testing doesn't mean rare, serious risks are absent.

## Questions to settle on one page before starting

Whatever the industry, these questions need answers before starting.

- **Work:** Where does the task start and end, and what are the biggest bottlenecks and exceptions today?
- **Data:** Who manages provenance, legal basis for use, access rights, and freshness?
- **Role:** How far does AI go: reading, recommending, requesting approval, or executing?
- **Risk:** What is the biggest harm, and can it be detected before it happens?
- **Recovery:** What can actually be undone, and who responds when it can't?
- **Review:** Do reviewers have the evidence, authority, and time to make the call?
- **Evaluation:** Are the metrics, population, period, and failure criteria for comparison with the current way defined? If only a before-and-after comparison is possible, are seasonality, changes in case mix, staffing changes, and policy changes recorded too?
- **Operations:** Who is responsible for stopping, handing off, and restarting, and is there a reevaluation process after model, document, or policy changes?

Keep the answers as a workflow diagram, data inventory, risk register, permission table, evaluation plan, and incident procedure. A risk register needs more than risk names: triggering conditions, who is affected, prevention, detection and recovery measures, owner, and validation results.

## Where I've landed

I think the same summarization, search, or execution task calls for different AI permissions and verification depending on the industry. So before choosing a model, you have to work out **what breaks when it fails, which rules apply, and whether it can be undone**.

## Open questions

- In finance, if policy search, credit decisions, and transaction execution are separated, how far can AI judge and act? The next installment, on finance, takes this up.

## References

- [ILO, AI in human resource management](https://www.ilo.org/publications/ai-human-resource-management-limits-empiricism)
- [Generative AI at Work, QJE, 2025](https://doi.org/10.1093/qje/qjae044)
- [Large Language Model Influence on Diagnostic Reasoning, 2024](https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2825395)
- [Hallucination-Free? research paper](https://arxiv.org/abs/2405.20362)
- [AI Basic Act, Article 34](https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031809457)
- [FSC announcement](https://www.fsc.go.kr/po010103/87142)
- [PIPC guidance](https://pipc.go.kr/np/cop/bbs/selectBoardArticle.do?bbsId=BS074&mCode=C020010000&nttId=9969)
- [MFDS guideline listing](https://www.mfds.go.kr/law/board/boardDetail.do?brdId=data0011&menuKey=29&seq=15628)
- [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)
- [Generative AI Profile](https://www.nist.gov/publications/artificial-intelligence-risk-management-framework-generative-artificial-intelligence)
- [WHO announcement, 2024](https://www.who.int/news/item/18-01-2024-who-releases-ai-ethics-and-governance-guidance-for-large-multi-modal-models)
- [τ-bench, 2024](https://arxiv.org/abs/2406.12045)
- [Klarna press release, February 27, 2024](https://www.prnewswire.com/news-releases/klarna-ai-assistant-handles-two-thirds-of-customer-service-chats-in-its-first-month-302072740.html)
- [Klarna Form 20-F, fiscal 2025](https://www.sec.gov/Archives/edgar/data/2003292/000200329226000007/klar-20251231.htm)
- [Siemens announcement, 2022](https://news.siemens.co.uk/news/siemens-acquires-senseye-predictive-maintenance-and-asset-intelligence-for-industrial-companies)
- [ILO review of empirical evidence on GenAI](https://www.ilo.org/publications/impact-genai-jobs-productivity-and-work-organization-review-empirical)

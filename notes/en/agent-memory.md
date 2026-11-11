---
title: What should an AI agent remember, and when should it forget?
category: ai
categories: [ai, planning]
tags: [AI Agent, Agent Memory, Memory Lifecycle, Context Engineering, Data Governance]
date: 2026-09-12
summary: Not holding on to incorrect information matters as much as remembering well. Store information worth using again, and update or stop using information that has become outdated or changed. The design should let users edit and delete memories, and include a way to verify that superseded or deleted information is not reused in later answers.
sample: false
related: [context-engineering, agent-hitl, agent-governance]
---

> What matters as much as an AI remembering users well is not holding on to wrong information. The question isn't how much memory to store, but what criteria decide what to store and when to correct or delete it.

## Why I started asking this

In a September AI agent team exercise, I built a tool that saves user preferences. At first we required user approval for two actions, confirming the plan and saving preferences. But confirming the plan just re-checked a result the user had already picked. Saving preferences, on the other hand, could affect later conversations, so we kept human-in-the-loop (HITL) approval on it.

At the time, I was focused on **which actions need the user's approval**. But what happens after something is saved was also worth thinking through.

When a user changes a preference, what should happen to the old one? Is it fine to keep remembering a taste inferred from a single action? When a user asks the AI to forget something, how far does that deletion actually need to go?

I looked at AI agent memory not as a feature that stores past conversations, but as **a problem of managing how valid information is and where it can be used**.

## How is context engineering different from memory management?

Context engineering is selecting and assembling the information an AI needs for the task at hand. Memory management is storing, updating, and deleting information used across multiple tasks and conversations.

| | Context Engineering | Memory Management |
|---|---|---|
| Core question | What information is needed right now? | What information should be kept? |
| Main targets | Current request, search results, task state | User preferences, long-term information, past experience |
| Main decisions | Select, compress, pass along, retrieve | Store, update, check validity, delete |
| Example failure | Needed information never reaches the model | Outdated information is used in a current decision |

The two are separate but affect each other. Even an accurately stored memory is useless if it isn't retrieved for the current task. And even if the right memory is found, an outdated one leads to a wrong answer.

So **storing a memory, whether it's still valid, and whether it's okay to use right now are three different problems**.

## What kinds of agent memory are there?

The LangGraph docs split memory into short-term and long-term memory.

- **Short-term memory:** state and history kept within a single conversation or task flow
- **Long-term memory:** information reused across multiple conversations or tasks

Long-term memory can be split further:

| Type | Meaning | Example |
|---|---|---|
| Semantic Memory | Facts and knowledge | User preferences, project settings |
| Episodic Memory | Past experiences and events | Results of earlier tasks |
| Procedural Memory | Rules and procedures for doing tasks | How a particular task is handled |

Looking at this breakdown, I thought each kind of memory should have its own retention rules. Current booking status loses most of its use once the task is done. A language preference the user set explicitly, though, can be used across many sessions. Keeping all information for the same period, or updating it all the same way, may not make sense.

## Is an AI that remembers more a better AI?

### LongMemEval — memory is more about using and updating than storing

*LongMemEval*, published at ICLR 2025, evaluates long-term memory on five abilities:

1. Extracting the needed information from past conversations
2. Connecting information scattered across multiple conversations
3. Understanding time and the order of events
4. Updating existing memory based on new information
5. Abstaining when it doesn't know

The two I paid most attention to were Knowledge Updates and Abstention. Even if an AI remembers past information accurately, if it doesn't reflect what changed later, it gives the current user a wrong answer.

> [!Example] A preference that changed over time
> - September: "I prefer remote work."
> - October: "A company where I go into the office is fine too."
> - November: "From now on, only recommend companies that allow remote work at least twice a week."
>
> The September preference wasn't wrong information. But applying it as is when recommending job postings today would be a problem.

So memory needs to separate **preserving the past record** from **judging which conditions are valid now**.

### MemoryAgentBench — forgetting well is also something to evaluate

*MemoryAgentBench* at ICLR 2026 includes selective forgetting among the areas it evaluates for agent memory. The point is that an agent needs not only to remember important information, but also to drop information that no longer holds from its current decisions.

What to keep apart here is that **forgetting and deleting aren't necessarily the same operation**. Deactivating old information so it isn't used in current decisions is different from actually removing it from storage. Especially when a user has asked for their personal data to be deleted, just leaving it out of search results may not be enough.

## What should go into long-term memory?

Not every conversation needs to be stored as long-term memory. These criteria can help decide:

| Criterion | What to check |
|---|---|
| Reusability | Will it be needed in later tasks? |
| Source | Did the user say it directly, or did the AI infer it? |
| Certainty | Is it a verified fact or a guess? |
| Validity period | Does this information change over time? |
| Sensitivity | Does it include personal or authentication information? |
| User control | Can the user see that it's stored, and edit or delete it? |

In particular, I think **explicit information and inferred information have to be kept apart**.

> [!Example] An inferred preference
> Just because a user bought black clothes several times doesn't mean they prefer black. They might have been gifts, or a one-off need. If the AI stores this as a confirmed preference, later recommendations go off track.

Inferred information shouldn't be treated the same as facts the user stated directly; confirm it when needed, or manage it with a separate certainty level.

## When should existing memory be updated?

Overwriting existing memory every time new information comes in isn't right either.

> [!Example] A one-off exception, or a changed preference?
> - **Existing memory:** "The user doesn't drink coffee."
> - **New request:** "Order me an iced latte today."
>
> Does this request alone mean the no-coffee preference has changed? It might be a one-time exception. If instead the user said, "I drink coffee a lot now, so update my old preference," that's an explicit change request.

So memory updates need more than sorting by most recent.

| Situation | How to handle it |
|---|---|
| Explicit change | Update the existing memory |
| One-off exception | Decide whether to apply it to the current task only |
| New inference | Keep it separate from existing facts; hold it or confirm it |
| Conflicting information | Check source, timing, and scope |
| Validity period has passed | Reconfirm, or exclude it from current use |

What matters isn't that the latest information is always more correct than the old, but **judging which information is valid under which conditions**. Without these criteria, an agent may change user preferences unnecessarily every time a new behavior shows up.

## When should memory be deleted?

In memory management, "deleting" gets used to mean several things.

| Handling | Meaning |
|---|---|
| Exclude from the current task | Don't put it in that request's context |
| Deactivate | Not used in current decisions, but kept for a legitimate retention purpose |
| Update | Replace the existing value with new information |
| Delete | Remove stored data within a defined deletion scope |

These four need to be kept apart. A project ending doesn't mean every related record should be wiped right away; there may be work history or a legitimate reason to retain it. Personal data a user has asked to delete, on the other hand, has to be handled after reviewing the relevant laws and retention obligations. Article 21 of Korea's Personal Information Protection Act sets out the principle of destroying personal data once it's no longer needed, and Article 36 covers requests for correction or deletion under certain conditions.

So how long to keep a memory isn't something you can decide from storage capacity or model performance alone. **You have to look at the purpose of storage, the nature of the information, the user's rights, and retention obligations together.**

## Can a deleted memory come back?

An AI service can hold the same information in several forms:

- Original conversation logs
- Long-term memory store
- Conversation summaries
- Search indexes
- Task state and logs

Even if a preference is deleted from long-term memory, if the same information remains in the original conversation, the same preference may be extracted again later when memory is rebuilt. So when designing deletion, you need to work out:

1. What exactly did the user ask to delete?
2. Which stores hold that information?
3. Is it also in derived summaries or search indexes?
4. Is there information that must be retained separately for legal reasons?
5. Does that information get used again after deletion?

The last one in particular has to be actually tested. A successful delete in the store doesn't automatically guarantee the AI will stop using that information.

## How should the agent memory lifecycle be designed?

Based on this research, the memory lifecycle could be split like this:

| Stage | Management criterion |
|---|---|
| Storage candidate | Is it worth keeping in long-term memory? |
| Active memory | Is it valid now and okay to use? |
| Review | Is it outdated or conflicting? |
| Update | Does it need correcting with new facts, or a change in scope? |
| Deactivate | Should it be left out of current decisions but kept for a reason? |
| Delete | Should it be removed based on a deletion request, its purpose being fulfilled, a retention period, or similar? |

Not every piece of information has to move through these stages in order. If the user explicitly asks for deletion, handle it per the deletion policy without waiting for a review stage. Explicit correction requests should also be applied right away when they meet the defined conditions.

To turn this lifecycle into a real system, you also need to define the metadata needed to manage memories, not just their content.

| Metadata | Purpose |
|---|---|
| Memory ID | Identify the memory |
| User and task scope | Keep it from mixing with other users or projects |
| Source | Check whether it was entered directly or inferred |
| Created and modified time | Track changes over time |
| Scope of use | Distinguish current-task memory from long-term memory |
| Validity status | Manage states like active, under review, inactive |
| Retention and deletion rules | Prevent unnecessary long-term storage |

This isn't a data schema I actually built; it's a list of items to consider at the product planning stage.

## How do you verify a memory management policy?

Using the preference-saving tool from September, I could design an experiment that tests updating and deleting after a preference is saved.

**Goal:** check how the agent handles existing memory when a user's preference changes or is deleted.

| Scenario | What's tested | Expected result |
|---|---|---|
| Explicit change | Update an existing preference with a new condition | The new condition is applied |
| One-off exception | Make one request that differs from the usual preference | The existing preference isn't overwritten by default |
| Conflicting information | Give different conditions for the same item | Source, timing, and scope are checked |
| Memory deletion | Ask to delete a saved preference | Removed within the defined deletion scope |
| Asking again after deletion | Request a related recommendation after deletion | The deleted memory isn't used again as a basis |

Looking only at the final response isn't enough. You also need to check how the memory actually changed, which memories were retrieved, and what information was passed into the current request.

| Metric | What it checks |
|---|---|
| Memory Update Accuracy | Share of explicit correction requests applied correctly |
| Stale Memory Usage Rate | Share of cases where invalid memories were used |
| Deletion Compliance Rate | Share of deletion targets where the deletion policy was carried out |
| Unnecessary Retention Rate | Share of memories still kept with no need to retain them |

These are evaluation criteria proposed in this note, not measured results. Deletion policy in particular needs separate verification, since you have to check the stores and retrieval paths, not just the final response. I haven't run this experiment yet. If I extend the earlier agent exercise later, I could compare the state and answers before and after memory changes.

## Where I've landed

When I first ran into AI agent memory, I thought what mattered was how long it could remember past conversations. But through this research I realized that **accuracy, validity, and controllability of memory** may be more important design criteria than the amount of memory.

- **Store:** is this information worth using going forward?
- **Update:** is the existing information still valid, and does it conflict with new information?
- **Delete:** is there no longer a need to keep it, or has the user asked for it to be deleted?

Storing a lot of memory helps make use of past context, but holding on to outdated or wrongly inferred information can actually lower answer quality.

In the end, I think a good memory system isn't one that remembers everything, but one that **keeps the information it needs and can update or stop using information that's no longer valid**. In AI service planning too, you have to go beyond a requirement like "provide conversation memory" and define what information gets stored, what can be edited or deleted, and how you'll verify the results.

## References

Checked: 2026.11.11

- [LangChain — Memory Overview](https://docs.langchain.com/oss/python/concepts/memory) — short- and long-term memory; semantic, episodic, and procedural memory
- [LangGraph — Long-term Memory](https://docs.langchain.com/oss/python/langgraph/memory) — storing memory and managing state
- [LongMemEval: Benchmarking Chat Assistants on Long-Term Interactive Memory](https://arxiv.org/abs/2410.10813) — ICLR 2025; evaluates long-term memory on information retrieval, temporal reasoning, knowledge updates, and abstention
- [MemoryAgentBench: Evaluating Memory in LLM Agents via Incremental Multi-Turn Interactions](https://arxiv.org/abs/2507.05257) — ICLR 2026; evaluates long-term memory and selective forgetting
- [Letta — Memory Management](https://docs.letta.com/configuration/memory) — memory management for stateful agents
- [Personal Information Protection Act, Article 21](https://www.law.go.kr/법령/개인정보보호법/제21조) — destruction of personal information
- [Personal Information Protection Act, Article 36](https://www.law.go.kr/법령/개인정보보호법/제36조) — correction and deletion of personal information
- [GDPR Article 5](https://gdpr-info.eu/art-5-gdpr/) — accuracy, data minimization, storage limitation

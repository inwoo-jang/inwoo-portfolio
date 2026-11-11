---
title: What should an AI agent be given, when, and how much?
category: ai
categories: [ai, planning]
tags: [Context Engineering, Prompt Engineering, RAG, Agent Memory, AI Agent]
date: 2026-07-31
summary: Planning an AI agent involves not just its prompt, but what information it needs, when and how much to provide, how long to retain it and what to discard. Deciding what to discard starts with setting criteria for what is worth remembering.
sample: false
related: [prompt-techniques, rag-citation-rules, ai-failure-tracing, agent-guardrails]
---

> It's not enough to design what you tell the model to do. You also have to design what information it needs, when to fetch it, how long to keep it, and what to throw away.

## Why I started asking this

It's easy to assume that good answers come from good prompts. Give the model a role, define the answer format, spell out the edge cases, and quality can improve.

But no matter how firmly you tell a model to be accurate, it can't produce the right answer if the information it needs isn't there at the right time. Does it work the other way, then — give it as much relevant material as possible and it gets more accurate? Not necessarily. Irrelevant material can make the model miss what matters, and old and new information can contradict each other.

So I got interested not just in how to write prompts, but in **designing what information the model gets while it works**. AI agents use search, tool calls, and the results of earlier steps all at once, which makes context management even harder.

In the end, I want to answer three questions:

- What information should the model be given?
- When should that information be searched for or refreshed?
- How much information is the right amount?

## Prompt engineering vs. context engineering

**Prompt engineering** is designing the instructions that tell the model how to behave. For a tax consultation AI, it might look like this:

> Answer the user's tax questions based on the relevant laws. Do not guess about anything the laws don't state, and ask for more information when it's unclear whether a rule applies.

This defines the role, the answering style, the constraints, and the output format.

**Context engineering** is choosing and assembling the information the model needs for the task, and updating it as the task moves along. The same tax consultation AI might need:

- The user's question and any conditions confirmed earlier in the conversation
- The relevant laws and when they apply
- Retrieved documents and their sources
- Results of earlier tool calls
- Where the current task stands
- Rules and constraints that must always be followed

If prompt engineering is about **how the model should act**, context engineering is about **what it needs to know to make a judgment**. They aren't separate skills, though — they complement each other, since the instructions are themselves part of the context the model receives.

RAG is just one technique you can use for context engineering. It isn't the whole of it.

## My criteria for designing context

### What information should it get?

The first thing I look at isn't the amount of information but **whether it's relevant to the task, reliable, and actually applicable**.

For tax consultation, finding the relevant law may not be enough. Which rules apply, and what the answer is, depends on whether the user is a sole proprietor or a corporation and which tax period they're asking about. So I think context should be sorted like this:

| Type | What it covers |
|---|---|
| Must have | Conditions and evidence that could change the answer |
| Nice to have | Material that fills out the explanation or helps understanding |
| Leave out | Anything unrelated to the current question or duplicated |
| Needs checking | Anything with an unclear source or that conflicts with other material |

The key here is **noticing when information is missing**. If a required condition hasn't been confirmed, asking the user or looking up more information — instead of producing an answer no matter what — is a valid design choice.

### When should it get it?

I don't think everything has to be handed over up front. Say an AI agent works in this order:

1. Interpret the user's request
2. Decide what information it needs
3. Gather it through search or API calls
4. Use the results to decide the next action
5. Write the final answer

Each step needs different information. Interpreting the request needs the user's goal and conditions; choosing a tool needs the available tools and when to call them; the final answer needs the key results and evidence from the earlier steps. So instead of passing everything to every step, it's worth considering **giving each step only what it needs right now**.

That said, hard constraints and approval conditions must not get lost when information is compressed. And important permission checks shouldn't be left to the prompt alone — the system has to enforce them separately.

### How much should it get?

More context doesn't always mean better results.

- Irrelevant information throws off the judgment
- Duplicate documents waste tokens
- Old and new information conflict
- Key conditions drop out of long conversations
- More context means slower responses and higher cost

Cut too much, though, and the conditions or exceptions the judgment depends on can disappear. The goal isn't to make the context as small as possible. It's **to keep enough information to do the job accurately while cutting what isn't needed**.

It seems especially important to separate information that can be summarized from information that has to stay in its original form. The general flow of a conversation can be summarized, but legal requirements, numbers, dates, and exceptions need care so their meaning doesn't shift in the summary.

## Is agent memory the same problem?

Thinking about context engineering made me realize I should look at agent memory too. A conversational AI may need to keep using earlier conversation, but passing along the entire history indefinitely is wasteful.

| Type of information | Example | How to manage it |
|---|---|---|
| Current request | The user's latest question | Pass to the current task |
| Task state | Steps done, steps left | Update as the task progresses |
| Conversation summary | Conditions decided earlier | Keep the key points |
| Long-term memory | Preferences and settings used repeatedly | Look up when needed |
| External knowledge | Laws, manuals, work documents | Search trusted sources |

What I'm weighing isn't how long to keep memories but **which information is worth remembering**. You also need rules for updating or discarding old information so it doesn't affect the current task. A condition the user has explicitly corrected should take priority over the old one.

## Questions to check when applying this to a project

Whatever the AI feature, I check these questions first when designing its context.

| Check | Question |
|---|---|
| Deciding conditions | What conditions (who, which period, what type, etc.) could change the answer, and are they in the context? |
| Missing information | When a required condition is missing, does it guess, ask, or look it up? |
| Source priority | When official documents, internal material, and past records all exist, which does it trust first? |
| Handling conflicts | When retrieved sources disagree, does it go by recency, by source, or hand off to a person? |
| Per-step handoff | What exactly gets passed to each step (interpretation, tool choice, answer)? |
| Conditions to keep | Which constraints and approval conditions must never drop out, even in long conversations? |
| Summary vs. original | What can be summarized, and what — like numbers, dates, and exceptions — must stay verbatim? |
| Remembering and discarding | What gets stored, and when is it updated or thrown away? Do the user's corrections take priority? |
| Enforcement | Are permissions and rules left to the prompt alone? |

## How to compare context setups

To know whether a context change actually helped, compare under the same conditions. Keep the model version, prompt, questions, and generation settings fixed, and change **only the context setup**.

| Variant | Context setup | What to check |
|---|---|---|
| A | Relevant material only | Baseline when it gets only the evidence it needs |
| B | Relevant material + loosely related material | Does quality drop when irrelevant information is mixed in? |
| C | Relevant material + a summary of key conditions | Does structured information improve how well it follows conditions? |

Recording or matching the actual length and token count matters more than the number of documents.

| Metric | What to check |
|---|---|
| Accuracy | Did it meet the answer criteria set in advance? |
| Evidence accuracy | Do the cited sources actually support the answer? |
| Condition compliance | Did it correctly reflect dates, subjects, and exceptions? |
| Response time | How long did it take to answer? |
| Token usage | Tokens used for input and output |

Model output can vary from run to run, so I also look at how much results fluctuate across multiple questions and repeated runs.

## Where I've landed

I don't think "which matters more, prompt engineering or context engineering?" is a fair comparison. A clear prompt still produces wrong answers without the information the judgment needs, and plenty of information still produces poor results if the instructions are vague or badly structured.

When planning an AI agent, you have to design not just what to tell the model but **what information it needs, when to fetch it, how long to keep it, and what to throw away**. And giving the model information is a different thing from having the system enforce permissions and rules.

Giving a lot of context is not the same as giving good context. I don't assume which setup is better — I check it on each project by comparing them as described above.

## References

- [LangGraph GitHub](https://github.com/langchain-ai/langgraph) — reference for stateful agent workflows and implementation
- [LangChain docs](https://docs.langchain.com/) — concepts and implementation for agents, RAG, and memory
- [Anthropic — Effective Context Engineering for AI Agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) — how to build and manage agent context

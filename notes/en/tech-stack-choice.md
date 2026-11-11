---
title: How do you put together a tech stack for a service?
category: planning
categories: [planning, backend, infra]
tags: [Architecture, Tech Stack, Overengineering, MSA, ADR]
date: 2026-10-25
summary: Choosing a tech stack isn't about picking the best technology. It's about deciding how much complexity you actually need. This note covers the requirements and constraints a PM can provide, six criteria for choosing technology, how to judge overengineering, MSA, and new tech, and ADRs for recording why you chose what you did.
sample: false
related: [why-python-ai, multi-agent-vs-single, why-ai-agent]
---

> I think choosing a tech stack isn't about picking the best technology. It's about deciding which technology, and how much complexity, the service needs to meet its requirements.

## At a glance

A PM doesn't need to pick the framework. What a PM can do is build the decision criteria in this order and hand them to the dev team.

| Step | What to do | Where in this note |
|---|---|---|
| 1 | Set **quality targets** like latency, consistency, throughput, and security first, not just features | What does the PM decide? |
| 2 | Check existing systems and **team skills**, and ask whether new technology is really needed | Six criteria for choosing technology |
| 3 | Weigh what an added technology gets you against the **operating cost** it adds | Overengineering · MSA |
| 4 | Separate **what you need now** from preparing for the future | Separating what you need now from future-proofing |
| 5 | Record the **reasoning and the conditions for revisiting** the choice | ADR |

## Why I started asking this

Working on web services and AI projects, I wondered how tech stacks get put together. Even for similar web services, some projects build both frontend and backend with just Next.js, while others split React and Spring Boot. Then Redis, Docker, Kubernetes, or Kafka sometimes get added on top.

You can learn what each technology does by studying it. But **when you actually need it, and when you can skip it, was a separate question.** Should you lean into the latest technology? Is meeting today's requirements enough? Should you plan for future scale up front? And how far should a PM understand the tech stack, and which decisions should they be part of?

With those questions in mind, I looked into architecture selection criteria and overengineering.

## What does the PM decide?

Picking specific frameworks and databases and designing the architecture is the job of developers and architects. But the architecture depends on **how fast and reliably the service has to run, what data it connects to, and how much it can spend on operations**. Setting those requirements and priorities takes the PM's judgment.

| Area | PM / product planning | Developers / architects |
|---|---|---|
| Functional requirements | Define user workflows and features | Design the implementation structure and logic |
| Non-functional requirements | Agree on performance, security, and availability targets | Design the technology to hit those targets |
| Tech stack selection | Provide business constraints and priorities | Lead evaluation of alternatives and the final pick |
| System integration | Define the purpose, scope, and data needs of each integration | Build the API, auth, and data integration |
| Operations | Define cost, outage impact, and operating rules | Build deployment, monitoring, and recovery |
| Adopting a technology | Weigh expected benefit against cost | Verify implementation difficulty and technical risk |

The actual split of responsibility varies by organization and project. What matters is not telling the team which technology to use, but **making the requirements and constraints clear enough that the dev team can make a sound choice**.

> [!Example] The same feature can need a different structure depending on the conditions
> A service where you upload a PDF and AI analyzes it. Feature-wise it's simple: `PDF upload → AI analysis → show results`. But the structure changes with these conditions.
>
> - **Latency:** does it have to show results within 5 seconds, or is 3 minutes fine?
> - **Throughput:** how many documents does it need to process at once?
> - **Data:** does it include personal or confidential information?
> - **Reliability:** should it retry if analysis fails partway?
> - **User experience:** should analysis keep going if the user closes the screen?
> - **Operating cost:** what processing cost per document is acceptable?
>
> If the job finishes quickly, a regular API request is enough. If analysis takes minutes and there are many jobs, you may need an async job queue, a separate worker, and stored processing status.

Sometimes the technology you need is set less by the feature itself than by **the conditions attached to it**. I think defining those conditions is how a PM takes part in choosing the tech stack.

## Six criteria for choosing technology

A tech stack isn't a combination of trending technologies. It's the process of splitting out the roles a service needs and placing a fitting technology in each.

| Layer | Role | Example technologies |
|---|---|---|
| Frontend | Screens and user interaction | React, Next.js, Vue |
| Backend | Business logic, auth, API | Spring Boot, FastAPI, NestJS |
| Database | Persistent data storage | PostgreSQL, MySQL |
| Cache | Temporary storage, e.g. results of repeated lookups | Redis |
| Queue | Passing async jobs and coordinating their processing | RabbitMQ, SQS |
| Infrastructure | Running servers, deployment, scaling | Cloud hosting, Docker, Kubernetes |
| Observability | Logs, metrics, tracing | OpenTelemetry, Prometheus, Grafana |

Not every service needs all of these. Some services can be built with just Next.js and PostgreSQL; a complex business system may need a separate backend. When choosing technology, I look at these six things.

| Criterion | Question to ask | Watch out for |
|---|---|---|
| Fit with requirements | Does it reliably deliver the features and quality level needed? | More features isn't automatically better |
| Team skills | Can the team build it, and keep running it themselves afterward? | Unfamiliar technology costs learning time and trial and error |
| Compatibility with existing systems | Can you reuse the auth, DB, and APIs you already have? | Features that are very different in nature may be better split out |
| Operating and maintenance cost | Who handles deployment, monitoring, incident response, and security? | People's operating time is a cost too, not just the cloud bill |
| Ecosystem and maturity | Are there docs, security updates, and long-term support? | New tech lacks production track record, and old tech isn't always safe either |
| Changeability | Is it easy to swap out or remove later? | Building lots of abstraction for swapping from day one is also overdesign |

The last criterion especially needs balance. **Weigh the cost of keeping things changeable against how likely you are to actually change them.**

## How do you judge overengineering?

The concept that felt most important while researching this was overengineering. If over-spec means using hardware or specs far beyond what performance requires, overengineering also covers **the system's structure and technology mix getting more complex than needed**.

That said, you can't call a complex structure overengineering just because the service is small. Some services need high reliability or large-scale throughput from day one. The key question is **whether the added complexity is in balance with the problem it solves and what it costs**.

| Technology | Example of when it's needed | When it can be overdesign |
|---|---|---|
| Redis | A repeated-lookup bottleneck or caching need has been confirmed | The existing DB already meets the performance target |
| Kafka | Multiple consumers, event streams, reprocessing needs | Simple notifications or small async jobs |
| Kubernetes | Container operations at scale and automation needs | Few services to manage and limited ops capacity |
| MSA | Independent deployment and scaling are genuinely needed | One small team building a single product |
| Vector DB | Semantic search and similarity search are needed | Regular SQL or keyword search is enough |
| Multi-Agent | Splitting roles brings a benefit you can verify | A single agent or workflow can handle it |

This table alone can't decide whether to adopt something. For example, if Kubernetes is already the organization's standard infrastructure, using it for a new project may be more efficient than standing up a separate environment. In the end, what matters isn't the number of technologies, but **whether you can justify the added complexity**.

## When do you need MSA?

**Monolithic** architecture builds and deploys features like membership, orders, payments, and notifications as a single application. Development, testing, and deployment are simple early on, but once the code gets tightly tangled, even small changes mean redeploying everything, and scaling individual features independently is hard. A monolith doesn't have to mean tangled code, though. A **Modular Monolith** that splits features into modules is also an option.

**Microservices (MSA)** split services by feature or domain so each is developed and deployed independently. You can deploy and scale each service on its own, but you have to manage inter-service communication, data consistency, distributed transactions, and failure tracing separately.

| Criterion | Monolith | MSA |
|---|---|---|
| Early development and operations | Relatively simple | Complex operational setup |
| Deployment | Per application | Independent per service |
| Scaling | Whole app, or per separated component | Per service |
| Data management | Easier with single transactions | Requires managing distributed data consistency |
| Failure analysis | Relatively easy to trace | Greater need for distributed tracing |
| Fits when | Small team, early product, tightly coupled business logic | Highly independent domains, many teams, per-service operating needs |

Martin Fowler's *Monolith First* suggests starting with a monolith and considering a split once service boundaries become clear. It doesn't mean every project must start as a monolith. It's a warning about **the risk of slicing the structure too finely before you know the domain and service boundaries**.

The question a PM should ask: **does splitting membership, orders, and payments into separate services gain more than it costs to build and run them separately?** You also need to tell apart problems that splitting into modules would solve from cases that really need independent deployment and scaling. My understanding is that you don't pick MSA because it's more advanced technology. You pick it when there's a requirement a monolith can't easily handle.

## When should you adopt new technology?

Being new doesn't make a technology better than the existing system. A useful reference is Thoughtworks' **Technology Radar**, which sorts technologies and techniques into four rings.

| Ring | Meaning | How to apply it |
|---|---|---|
| Adopt | Worth actively considering | Use it in production if it fits the requirements |
| Trial | Try it within a limited scope | Validate with a PoC or a small project |
| Assess | Explore its potential and characteristics | Research, learn, assess applicability |
| Caution | Proceed with care | Review risks and alternatives |

Rather than following these rings as is, the useful takeaway is the approach: neither adopting nor ruling out new tech by default, but **evaluating the technology's maturity and its fit for the project separately**.

> [!Example] Adding an AI support feature to an existing Spring Boot system
> **Connecting Spring AI** to the existing service lets you keep using its auth, business logic, DB, and infrastructure. **Splitting it out as a Python/FastAPI service** makes Python's data processing and model libraries easier to use, but you then have to manage inter-service API calls, deployment, incident response, and auth and data integration separately.
>
> For a service that calls an external LLM API and uses search results, Java is enough. The case for Python comes when you depend heavily on a specific Python library or need to train or run models yourself. I compared this in more detail in [Why is Python so common in AI development?](#n-why-python-ai).

**Choose technology based on the work that needs doing; be wary of building a new system just to use a technology.**

## Separating what you need now from future-proofing

If you ignore scaling entirely because there are few users, you may face a big rework when requirements change. On the other hand, building a complex distributed system from day one for millions of hypothetical users costs you now for something you don't need yet.

A helpful concept here is **YAGNI (You Aren't Gonna Need It)**: don't build features or structures you don't actually need just because you expect to need them someday. It doesn't mean ignoring the future. What matters is **telling apart building for scale in advance from designing so you can scale later**. You can handle growth without Kubernetes from the start if state management and configuration are well designed, and you can consider splitting later without starting on MSA if module boundaries per feature are kept clean.

| Category | Examples | How to handle it |
|---|---|---|
| Requirements you must meet now | Latency, data consistency, security | Have them in place at launch |
| Things likely to change | Usage growth, external API changes, swapping AI models | Draw boundaries so the change touches as little as possible |
| An uncertain future | Global expansion, large-scale distributed processing, dozens of services talking to each other | Don't build ahead on possibility alone |

My understanding is that planning for scalability doesn't mean building every future feature in advance. It's **judging which changes are likely and how costly it would be to respond to them**.

## Is the simplest structure always the answer?

Avoiding overdesign means keeping things simple, but making simplicity the goal in itself is also risky. A payment service can't skip failure retries, duplicate-payment prevention, or transaction records just to keep the structure simple. A service handling personal data needs access control and security even at small scale. **A simple structure is not the same as a structure missing the quality it needs.**

The AWS Well-Architected Framework evaluates architecture across operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability. Based on that, I think technology choices could be reviewed in this order:

1. Define the problem to solve and the requirements
2. Check whether the current structure or a simpler alternative solves it
3. If not, verify what an added technology actually achieves
4. Assess the development and operational complexity it adds
5. Among the options that meet the requirements, pick the one with reasonable total cost and risk
6. Look at real operating results and check whether the decision still holds

Total cost here isn't just the infrastructure bill. It includes development time, learning, maintenance, incident response, and the cost of changing technology later. The goal isn't the simplest possible stack, but **cutting unnecessary complexity while still meeting the quality you need**.

## Recording why you chose it — ADR

A tech stack isn't a one-time decision. When users grow or requirements change, you have to revisit it, and without a record of why you chose that technology, you end up repeating the same review.

An **ADR (Architecture Decision Record)** is a document that captures, for a major architecture decision, the situation at the time, the alternatives considered, why you chose what you did, and the expected impact.

> [!Example] ADR — whether to adopt Redis
> **Context** · An early-stage B2B SaaS built its lookup features on PostgreSQL, and currently meets its latency requirements.
>
> **Alternatives considered** · Keep PostgreSQL as is / optimize queries and indexes / add a Redis cache
>
> **Decision** · Keep the PostgreSQL setup for now. If performance problems come up, look at queries and indexes first.
>
> **Rationale** · Performance requirements are already met, and adding Redis would add cache invalidation, data consistency, and infrastructure operations burden.
>
> **Revisit when** · Response times for key APIs keep exceeding the agreed threshold, or DB load starts degrading service quality.

What matters in this record isn't the decision not to use Redis itself, but that it writes down **under what conditions the decision was made, and what situation would change it**. ADRs turn technology decisions from one-off choices into a process you can trace and revise.

## Where I've landed

At first I thought putting together a good tech stack meant knowing lots of frameworks and infrastructure tools. But researching this, I realized that **knowing many technologies and choosing the right one are different skills**.

A PM doesn't need to make every technical decision. But I think **providing the criteria that keep technical decisions aligned with the service's goals and requirements, and understanding the cost and impact of each choice**, is an important role.

A good tech stack isn't one packed with the latest technology. It's one that fully meets today's requirements while keeping development and operational complexity manageable. And a good architecture is probably less about being perfect from the start, and more about being able to explain why you chose it and re-decide when things change.

## References

- [Microsoft Azure Architecture Center — Architecture Styles](https://learn.microsoft.com/en-us/azure/architecture/guide/architecture-styles) — characteristics and trade-offs of each architecture style
- [AWS — Well-Architected Framework](https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html) — evaluation criteria including reliability, security, operations, performance, and cost
- [Google Cloud — Well-Architected Framework](https://docs.cloud.google.com/architecture/framework) — principles for designing and operating cloud architecture
- [Thoughtworks — Technology Radar](https://www.thoughtworks.com/radar) — criteria for adopting, trialing, assessing, and being cautious about technologies
- [Martin Fowler — Monolith First](https://martinfowler.com/bliki/MonolithFirst.html) — starting with a monolith and moving to microservices
- [Martin Fowler — YAGNI](https://martinfowler.com/bliki/Yagni.html) — the risk of building ahead for uncertain future needs
- [AWS — Architectural Decision Records](https://docs.aws.amazon.com/prescriptive-guidance/latest/architectural-decision-records/) — how to record a decision's context, alternatives, and consequences

---
title: Why is Python so common in AI development?
category: planning
categories: [planning, ai, backend]
tags: [Python, Java, Spring AI, Spring Boot, FastAPI, AI Architecture]
date: 2026-08-22
summary: Python's strength comes from its ecosystem for training and experimenting with models; connecting an external LLM API to a service works in Java too. I compared Spring Boot + Spring AI with Python + FastAPI using TaxDesk as the example, and listed what a PM should look at when choosing.
sample: false
related: [why-ml-model, multi-agent-vs-single, why-sllm]
---

> The question isn't which language is better for AI. It's which technology fits the feature you're building, your existing system, and your operating environment.

Python is the default for a lot of AI service development. But if a service already runs on Java and Spring Boot, do you really have to use Python to add AI features?

I looked at why Python is so widely used for AI and compared Spring Boot + Spring AI with Python + FastAPI. The goal was to understand the difference between building a model yourself and connecting AI features to an existing service.

## Why Python is so common in AI

Python's strength isn't that the language makes models more accurate. It's that it has a rich ecosystem of libraries for data processing and for training and experimenting with models.

| Work | Main role | Typical tools |
|---|---|---|
| Data processing | Cleaning, transforming, and analyzing data | pandas, NumPy, Polars |
| Model development | Training, fine-tuning, and evaluating models | PyTorch, scikit-learn, Transformers |
| Building AI services | Connecting LLMs, RAG, agents, serving APIs | LangChain, LangGraph, FastAPI |

If you're training or fine-tuning your own model, the Python ecosystem is a big advantage, because you can experiment with everything from preprocessing to training to evaluation in one language.

Services that use an external LLM API are different. Passing a user's question to an LLM API and returning the result can be done in Java too. RAG and tool calling aren't Python-only features either.

So **building a model yourself and connecting an existing model to a service are two separate things.**

## Can you build AI services in Java?

Spring AI is a framework for building AI features in Java's Spring ecosystem. In Python, you can build an API server with FastAPI and assemble the AI pipeline with libraries like LangChain and LangGraph.

| Comparison | Spring Boot + Spring AI | Python + FastAPI |
|---|---|---|
| Integrating with existing systems | Easy to connect with Spring-based services | Can integrate separately through APIs |
| Connecting LLM APIs | Supported | Supported |
| RAG | Supported | Supported |
| Tool calling | Supported | Supported |
| AI agents | Supported | Supported |
| Model training and experiments | Relatively limited ecosystem | Rich library ecosystem |
| Independent deployment | Possible | Possible |
| Operating burden | Depends on the architecture | Depends on the architecture |

The key point here is that **choosing a language and choosing a system architecture are separate decisions**. You can build a separate AI service with Spring AI, and using Python doesn't mean you need a standalone server.

## What if TaxDesk were built both ways?

I assumed TaxDesk's tax consultation feature was being added to an existing Spring Boot service. The user enters a tax question, the system retrieves the relevant legal basis, calls a calculation function if needed, and writes an answer that includes the evidence.

### Adding Spring AI to the existing Spring Boot service

**User → Spring Boot → Spring AI → LLM API, vector DB, business tools → response**

You can add AI features while reusing the existing Java service's authentication, permissions, data access, and business logic as they are. If the Java service already has tax calculation logic, for example, it can be reused directly. You can let the model choose through Spring AI's tool calling, or have the server call things directly in a fixed order. The actual TaxDesk went with the latter so that the order of calculations wasn't left to the model.

There's less need to design communication between services, but you have to make sure AI request latency and resource use don't affect the existing service.

### Building a separate Python AI service

**User → Spring Boot → HTTP API → FastAPI → AI libraries → LLM API, vector DB → response**

The existing Java service handles user authentication and business features, and a separate Python service handles AI requests. AI features can be developed and deployed independently, and Python AI libraries are easy to use.

On the other hand, you have to design the API contract, authentication, timeouts, error handling, and log tracing between the Java and Python services.

### Using Java and Python together

You could also split responsibilities: Java handles existing business logic like user authentication, permission management, and tax calculations, while Python handles AI inference, retrieval, and model experiments. But if the feature is simple, building two services from the start can actually increase the operating burden.

What matters isn't splitting languages for its own sake, but **drawing system boundaries based on each feature's responsibilities and how often it changes**.

## What criteria should a PM use?

Whether something can technically be built isn't enough to decide on a tech stack.

| Criterion | What to review |
|---|---|
| Existing system | How many APIs, databases, and business logic can be reused? |
| Team skills | What technology can the dev team comfortably build and maintain? |
| AI features | Is it a simple LLM connection, or does it need model training or a complex agent? |
| Change cycle | Do AI features need to be deployed independently of the existing service? |
| Operating burden | Does a separate service need its own deployment, monitoring, and incident response? |
| Security and permissions | Where will user data and tool execution permissions be checked? |

AI features are affected by external API response times, retrieval, tool calls, and so on. So when choosing technology, look not just at ease of development but at problems that can come up in operation. Splitting services allows independent changes and fault isolation, but it also makes communication and monitoring more complex.

## Does building it in Python make the AI perform better?

Using Python doesn't automatically make AI answers more accurate. With the same LLM, prompt, retrieval data, and tools, retrieval quality and pipeline design affect answer quality far more directly than the language does. Response time likewise depends on many factors, such as external LLM API calls, data retrieval, and network communication.

To actually compare them, you'd need to build the same feature both ways and measure:

- **Response time:** total response time and time per step
- **Development complexity:** initial setup, integration with the existing system, and the work needed to change features
- **Operational complexity:** deployment, monitoring, and incident response
- **AI quality:** accuracy and evidence accuracy on the same evaluation data
- **Cost:** LLM API usage, plus server and extra infrastructure costs

Without real measurements, you can't claim that one language is faster or more stable.

## Where I've landed

Python is common in AI development because of its rich ecosystem for data processing and model training and experiments. But building a model yourself and bringing AI features into an existing product are different problems. If you're adding LLM APIs, RAG, and tool calling to an existing Java service, Spring AI is a perfectly reasonable option to consider.

When choosing a tech stack, I concluded these three questions come first:

1. How much of the existing system's business logic and data can be reused?
2. Does it fit the AI features needed and the dev team's skills?
3. Do the benefits of a separate structure outweigh the extra operating burden?

**In the end, the question isn't which language is better for AI. It's which technology fits the feature you're building, your existing system, and your operating environment.**

This is based on official documentation and an architecture perspective. It isn't the result of an experiment comparing the actual performance of the two approaches.

## References

- [Spring AI docs](https://docs.spring.io/spring-ai/reference/)
- [Spring AI Tool Calling](https://docs.spring.io/spring-ai/reference/api/tools.html)
- [FastAPI docs](https://fastapi.tiangolo.com/)
- [LangChain and LangGraph docs](https://docs.langchain.com/oss/python/learn)
- [PyTorch website](https://pytorch.org/)

---
title: Comparing IDEs — VS Code · Kiro · Cursor
category: infra
tags: [VS Code, Kiro, Cursor, AI Coding]
date: 2026-11-06
summary: VS Code is mix-and-match, Kiro is spec-driven, Cursor is agent-driven. A comparison of how each handles AI coding, project rules, and planning and verifying work, based on official docs.
sample: false
---

I compared how VS Code, Kiro, and Cursor handle AI coding, project rules, and the flow of planning and verifying work, based on their official docs. All three let AI write and edit code and connect to external tools, but each puts the emphasis on a different part of development.

## In one line each

- **VS Code:** A dev environment where you can combine various AI agents and extensions
- **Kiro:** Spec-driven development that links requirements, design, and task lists
- **Cursor:** Agent-driven development that runs from planning through code edits to review

## Comparison table

| | VS Code | Kiro | Cursor |
|---|---|---|---|
| Focus | Mix-and-match — add AI features and agents to the editor (GitHub Copilot, etc.) | Spec-driven | Agent-driven |
| Workflow | Edit suggestions while coding, chat, agent tasks | Requirements → design → task list, in order (Specs) | Scope with Plan Mode → edit with Agent → review results in Diff |
| Project rules | `.github/copilot-instructions.md`, `AGENTS.md` | `.kiro/steering/` (defaults: product · tech · structure), `AGENTS.md` | `.cursor/rules/*.mdc`, `AGENTS.md` |
| Automation | Extensions · agents | Hooks — run a set action on file changes, tool use, or task completion | Rules · skills · plugins |
| External connections (MCP) | Supported | Supported | Supported |
| Model choice | Models from multiple providers, your own API key, local models | Pick from the supported model list | Pick from per-provider model lists |

## What I learned putting this together

- All three support `AGENTS.md`, so you can share common project instructions. But how and how far the rules apply has to be checked for each tool
- Kiro's Specs were interesting because they can link the requirements and acceptance criteria a PM writes to actual implementation tasks
- Cursor's Plan Mode lets you review the scope of changes before implementation, and you can check the edits with Agent and Diff
- Rules only give the AI guidance. They don't enforce anything. You can split it this way: Skills for repeated tasks, Hooks for event-based execution, MCP for connecting external systems
- Rather than asking which IDE is best, it makes more sense to choose based on the nature of the work, your existing dev environment, and how easy it is to reuse rules and verify results

## Notes per tool

**VS Code**
- AI is used through a GitHub Copilot plan, an account with a supported provider, or an API key
- Choose the agent that does the work from Copilot · Claude · Codex
- Rules file: `.github/copilot-instructions.md` — also recognizes `AGENTS.md`

**Kiro**
- Specs: `requirements.md` → `design.md` → `tasks.md` (`bugfix.md` for bug fixes)
- Steering: per project `.kiro/steering/`, global `~/.kiro/steering/`
- Hooks: specify actions to run on file changes, tool use, or task completion
- The same agent also runs outside the IDE, in the CLI, web, and mobile

**Cursor**
- For big changes, set the scope first with Plan Mode
- Only `.mdc` files inside `.cursor/rules/` are recognized as rules files (`.md` files are ignored)
- Recognizes `AGENTS.md` at the root and in subfolders

## Where I've landed

When choosing an AI coding tool, I think what matters isn't only how fast it writes code, but **whether requirements actually make it into the implementation and whether you can verify the results.**

If you use several IDEs on the same project, it seems right to manage shared rules in `AGENTS.md` and add tool-specific config files only when you need a tool's own features. That said, the real differences in productivity and quality are hard to call until you've done the same task in each.

## References

- [VS Code — AI features overview](https://code.visualstudio.com/docs/copilot/overview)
- [VS Code — Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Kiro Docs](https://kiro.dev/docs/) · [Specs](https://kiro.dev/docs/specs/) · [Steering](https://kiro.dev/docs/steering/)
- [Cursor Docs](https://cursor.com/docs) · [Rules](https://cursor.com/docs/context/rules)


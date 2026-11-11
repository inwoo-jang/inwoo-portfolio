---
title: Call Claude Code from an app and your own settings come along — CLI flags and streaming
category: ai
categories: [ai, tools, backend]
tags: [Claude Code, CLI, Streaming, Python]
date: 2026-08-28
summary: I made a study app's "Grade" button run the claude command from a Python server. Notes on how Claude called from an app still reads my PC's settings and skills, and how the flag for turning off tools wasn't what I expected.
sample: false
---

I set up a study app so that pressing "Grade" has a Python server run the `claude` command on my computer and bring back the answer. The idea was to reuse my already logged-in Claude Code instead of issuing a separate API key.

## What I found when I hooked it up

- **Claude run from the app still reads my PC's settings and skills.** Personal settings can mix into the app's instructions. I used `--setting-sources ""` so it wouldn't load settings files, and the login stayed intact. I didn't separately verify whether that alone removes every effect of my personal settings
- **`--allowed-tools ""` doesn't turn tools off.** It only means the list of tools that run without approval is empty. To actually turn tools off, use `--tools ""`
- **The default output only arrives after the whole response is done.** Showing the response as it's generated took three streaming flags together
- **The streaming data also includes progress info.** From the line-by-line JSON, I pulled out only the `text_delta` text to display on screen
- **I pointed the working directory at an empty folder.** Called from the app folder, the contents of nearby files can leak into the answer
- **I passed the question through stdin.** That avoids long text or quotes being parsed as command arguments
- I capped the wait at 120 seconds (`timeout=120`; past that, it returns a notice)

## Flags I used

| Flag | Purpose |
|---|---|
| `-p` | Print only the response and exit, no interactive screen |
| `--allowed-tools ""` | List of tools to run without asking for approval. Empty means no tools are pre-approved. It doesn't turn tools off |
| `--setting-sources ""` | Don't load the user, project, or local settings files (`user`, `project`, `local`) |
| `--model sonnet` | The model this app used |

Which flag turns off what (per `claude --help` 2.1.247):

| What to turn off | Flag | In this app |
|---|---|---|
| Built-in tools (reading files, running commands, etc.) | `--tools ""` | Not used |
| Settings files | `--setting-sources ""` | Used |
| Skills | `--disable-slash-commands` | Not used |
| MCP servers | `--strict-mcp-config` (only uses what's given via `--mcp-config`) | Not used |

`--tools ""` only turns off built-in tools. MCP tools are handled separately.

Flags I added for streaming:

```bash
--output-format stream-json --verbose --include-partial-messages
```

## The code

This is a trimmed version of the app's actual code (the version that waits for the full response). `empty_dir` is the empty working folder, and `question` is the question the app passes in.

```python
import subprocess

cmd = ["claude", "-p", "--allowed-tools", "", "--setting-sources", "", "--model", "sonnet"]

try:
    proc = subprocess.run(
        cmd,
        input=question,          # pass the question via stdin, not appended to the command
        capture_output=True,
        text=True,
        timeout=120,             # stop after 120 seconds
        cwd=empty_dir,
    )
except subprocess.TimeoutExpired:
    answer = "AI 응답이 120초를 넘었습니다. 다시 시도해 주세요."
else:
    answer = proc.stdout.strip() if proc.returncode == 0 else f"오류: {proc.stderr[:400]}"
```

Before running, it checks whether Claude is installed with `shutil.which("claude")`, and if not, falls back to Codex, Gemini, then Ollama in that order. The environment variable `GUIDE_AI_PROVIDER` picks which AI to use.

## Open questions

- If I use the same setup again, should I add `--tools ""`, `--disable-slash-commands`, and `--strict-mcp-config` as well? This time I only turned off settings files

## References

- [Claude Code — CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code — Headless mode](https://code.claude.com/docs/en/headless)

Source: SKALA sLLM study guide app server.py (2026-08-28) · Flags checked with `claude --help`

---
title: Does Claude Code use my personal settings when called from an app?
category: ai
categories: [ai, tools, backend]
tags: [Claude Code, Codex, CLI, Streaming, Python]
date: 2026-08-28
updated: 2026-11-11
summary: Calling a CLI locally can bring personal settings and instructions into the session. I looked into how to exclude settings, disable tools, and stream the response to the screen as it is generated.
sample: false
---

I set up a study app so that pressing "Grade" makes a Python server run the `claude` command on my computer and return the answer. Since the app runs locally, I could use my existing Claude Code login without getting a separate API key.

Once I connected it, I found that Claude Code launched by the app also read my PC's settings. Grading needed a question and an answer, but I also had to check which settings and tools the CLI brought with it. For longer answers, I needed to decide when the app should start displaying the response.

## Launching it from an app still loads my settings

My personal study skills included rules such as "don't give the answer straight away." That helps when studying, but doesn't fit a feature that needs to grade an answer against the app's criteria. I wanted to keep my login without bringing those personal rules into the request.

I passed `--setting-sources ""` to exclude user, project, and local settings. In my environment, the app still ran with the existing login. That confirmed I could handle settings loading separately from authentication.

I also changed the working directory from the app folder to an empty folder, since grading didn't need the app's source files. Starting in an empty folder does not prevent access to other files, though. File access needs its own restrictions.

## Does excluding settings also exclude instructions and skills?

When I first connected the app, I checked that grading worked with settings excluded. While updating this note, I also compared what actually went into the request.

I put distinct markers in temporary user settings, personal and project `CLAUDE.md` files, and personal and project skills. I sent a default run and a run with `--setting-sources ""` to a local mock server, then checked for those markers in the requests. For skills, I checked **whether their names and descriptions appeared in the available-skills list**, rather than whether their full contents were loaded.

| Item checked | Default run | With `--setting-sources ""` |
|---|---|---|
| Test model selection in user settings | Applied | Excluded |
| Markers in personal and project `CLAUDE.md` | Included in the request | Excluded |
| Names and descriptions of personal and project skills | Listed | Excluded |
| Built-in tools | Present | Still present |

In the installed **2.1.247**, this excluded the tested instructions and skill listings as well as settings. It would therefore be wrong to say that skills remained just because I hadn't used a separate flag to disable them. Not using a flag and observing that something was loaded are different things.

Both runs used an empty MCP configuration. These results don't establish that existing MCP connections, managed policies, or inherited environment variables are all excluded. The earlier app run demonstrated that my login still worked; this mock-server test checked what settings and instructions entered the request.

## The flag I misunderstood was `--allowed-tools ""`

From its name, I initially assumed an empty value would mean no tools were available. Instead, `--allowed-tools` specifies **tools that may run without a separate approval**. An empty value means this option pre-approves no tools. It doesn't remove tools or clear other permission settings.

To exclude built-in tools from the session, use `--tools ""`. The request comparison also showed that built-in tools remained when I passed `--allowed-tools ""`.

| Flag | What it controls | Used in the original app |
|---|---|---|
| `--setting-sources ""` | User, project, and local settings loading. In the tested version, it also excluded the tested personal/project instructions and skill listings | Yes |
| `--allowed-tools ""` | Tools pre-approved by this option; it does not disable tools | Yes |
| `--tools ""` | Excludes built-in tools; MCP tools are separate | No |
| `--disable-slash-commands` | Disables skills | No |
| `--strict-mcp-config` | Limits MCP servers to those supplied through `--mcp-config` | No |

The installed version also had `--safe-mode`. The official description says it preserves authentication while disabling customizations such as `CLAUDE.md`, skills, plugins, hooks, and MCP. In the local comparison, the tested instructions and skill listings disappeared, but the user's model setting and built-in tools remained. **The choice depends on whether I want to skip settings files or disable customizations.** Managed policies still apply separately.

## What changes if the app uses Codex?

The app could also select Codex. Its basic command was:

```bash
codex exec --skip-git-repo-check
```

It could add model and reasoning-effort options. `--skip-git-repo-check` allows execution outside a Git repository; it doesn't exclude personal settings. The original Codex path therefore had no equivalent of the settings exclusion used on the Claude side.

The installed **Codex CLI 0.144.4** has `--ignore-user-config`. The official description says it skips `$CODEX_HOME/config.toml` while using the existing `CODEX_HOME` for authentication. I tested this option with temporary markers and compared requests at a local mock server.

| Item checked | Default run | With `--ignore-user-config` |
|---|---|---|
| Instructions in user `config.toml` | Included | Excluded |
| Personal `AGENTS.md` | Included | Still included |
| Project `AGENTS.md` | Included | Still included |
| Project skill name and description | Listed | Still listed |

This didn't have the same scope as the Claude settings flag. Codex still included `AGENTS.md` and skills after excluding the user configuration file.

In a separate prompt-input check, `project_doc_max_bytes=0` excluded the project `AGENTS.md` but left the personal one in place. Setting the test skill to `enabled=false` in `skills.config` removed that skill from the list. Each source needed its own check.

An app-specific `CODEX_HOME` can separate personal configuration and global instructions, but it also changes the authentication storage location. Personal skills can also be discovered under `~/.agents/skills`. **Changing one folder doesn't isolate the entire personal environment.** An app-specific working directory and explicit skill and MCP choices would need to be part of the setup too.

## Showing the grading response as it arrives

Initially, I used `subprocess.run()`, waited for the process to finish, and read `stdout` all at once. That was simple when I only needed the final answer. To display the response as it was generated, the CLI needed to emit intermediate events and Python needed to read output while the process was running.

For Claude Code, I passed these options together:

```bash
--output-format stream-json --verbose --include-partial-messages
```

The output contains one JSON event per line. The existing streaming code used `subprocess.Popen()` and sent only text matching these conditions to the screen:

```python
if event.get("type") == "stream_event":
    inner = event.get("event", {})
    if inner.get("type") == "content_block_delta":
        delta = inner.get("delta", {})
        if delta.get("type") == "text_delta":
            yield delta.get("text", "")
```

Displaying session information or the final `result` event as response text can mix metadata into the answer or append the full answer a second time. Text fragments belong in the response area; `result` should inform success, failure, and completion handling. Seeing some text doesn't mean grading has finished.

The existing code handles `result.is_error`, but still needs to check both a successful completion event and the process exit code. The `timeout=120` below applies only to the non-streaming `subprocess.run()` call. The streaming path needs its own timeout and cancellation handling.

Codex can emit JSONL events with `--json`, but its event format differs from Claude's. The app's current decoder expects Claude events, so switching the command alone doesn't make streaming compatible.

## The code for receiving the complete answer at once

This is a shortened version of the app's original code. `empty_dir` is its empty working directory, and `question` is the grading request. `-p` runs non-interactively. Passing the question through standard input keeps multiline answers and quotation marks separate from command arguments.

This shows the original implementation, not a completed version of all the tool restrictions and streaming improvements discussed above.

```python
import subprocess

cmd = [
    "claude", "-p",
    "--allowed-tools", "",
    "--setting-sources", "",
    "--model", "sonnet",
]

try:
    proc = subprocess.run(
        cmd,
        input=question,
        capture_output=True,
        text=True,
        timeout=120,
        cwd=empty_dir,
    )
except subprocess.TimeoutExpired:
    answer = "The AI response exceeded 120 seconds. Please try again."
else:
    answer = (
        proc.stdout.strip()
        if proc.returncode == 0
        else f"Error: {proc.stderr[:400]}"
    )
```

Before execution, the app checks CLI availability with `shutil.which()`. It chooses the first installed provider in the order Claude Code → Codex → Gemini → Ollama, unless `GUIDE_AI_PROVIDER` specifies one. It does not automatically retry with the next provider after a runtime error.

## If I build this again

Grading in this app only needs a question and an answer. I'd exclude unnecessary built-in tools and MCP servers, then verify that grading still works end to end with the existing login and without personal study rules. Beyond checking which settings load, I'd also test whether the session can actually read files or call external tools.

In the UI, I'd distinguish a response that has started from grading that has finished. If the process fails midway, the app should report the error and allow another request, rather than present the partial answer as a completed result. Supporting both Claude and Codex also means handling settings, output parsing, and errors separately for each provider.

## References

- [Claude Code CLI reference](https://code.claude.com/docs/en/cli-reference) — settings sources, tools, skills, and safe mode
- [Run Claude Code programmatically](https://code.claude.com/docs/en/headless) — non-interactive execution and streaming
- [Codex CLI commands](https://learn.chatgpt.com/docs/developer-commands?surface=cli) — `exec`, `--ignore-user-config`, and `--json`
- [How Codex loads AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — personal/project instructions and `CODEX_HOME`
- [Codex skills](https://learn.chatgpt.com/docs/build-skills) — skill discovery locations
- [Codex configuration reference](https://learn.chatgpt.com/docs/config-file/config-reference) — `project_doc_max_bytes` and `skills.config`

Sources checked: `server.py` from the SKALA sLLM study guide app (August 28, 2026 implementation), installed CLI help, and local mock-server request comparisons on November 11, 2026. These tests checked the inclusion of settings and skills; they did not evaluate grading quality or every execution permission.

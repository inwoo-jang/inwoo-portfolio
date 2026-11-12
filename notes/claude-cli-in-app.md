---
title: 앱에서 Claude Code를 호출하면 내 설정도 따라올까?
category: infra
categories: [infra, ai]
tags: [Claude Code, Codex, CLI, 스트리밍, Python]
date: 2026-08-28
updated: 2026-11-11
summary: 로컬에서 CLI를 호출하면 개인 설정과 지침이 적용될 수 있다. 설정을 제외하는 법과 도구를 끄는 법을 알아보고, 답변을 생성되는 대로 화면에 보여주는 스트리밍 처리도 살펴봤다.
sample: false
---

학습 앱에서 ‘채점’을 누르면 Python 서버가 내 컴퓨터의 `claude` 명령을 실행해 답을 가져오도록 만들었다. 로컬에서 쓰는 앱이라 이미 로그인해 둔 Claude Code를 쓰면 API 키를 따로 발급하지 않아도 됐다.

막상 붙이고 보니 앱에서 실행한 Claude Code도 내 PC의 설정을 읽었다. 채점에 필요한 건 질문과 답안이었는데, CLI가 어떤 설정과 도구를 가져오는지도 확인해야 했다. 답변이 길어질 때는 화면에 언제부터 결과를 보여줄지도 정해야 했다.

## 앱에서 실행해도 내 설정을 읽는다

개인 학습용 스킬에는 ‘정답을 바로 주지 않기’ 같은 규칙이 있었다. 공부할 때는 도움이 되지만, 앱의 채점 기준에 따라 답안을 평가하려는 상황에는 맞지 않았다. 로그인은 그대로 쓰면서 이런 개인 규칙은 가져오지 않고 싶었다.

`--setting-sources ""`를 넘겨 사용자·프로젝트·로컬 설정을 읽는 범위에서 제외했다. 이 상태에서도 내 환경에서는 기존 로그인으로 실행됐다. 설정을 읽는 범위와 로그인 상태를 따로 다룰 수 있다는 건 여기서 확인했다.

작업 디렉터리도 앱 폴더에서 빈 폴더로 바꿨다. 채점에 앱의 소스 파일이 필요 없어서 실행 시작 위치를 분리했다. 다만 빈 폴더에서 시작한다고 다른 파일에 접근할 수 없게 되는 것은 아니다. 파일 접근 권한은 별도로 제한해야 한다.

## 설정을 빼면 지침과 스킬도 빠질까?

처음 앱을 붙일 때는 설정을 제외한 상태에서 채점이 되는지까지 확인했다. 글을 보완하면서는 어떤 내용이 실제 요청에 들어가는지 비교했다.

임시 사용자 설정, 개인·프로젝트의 `CLAUDE.md`, 개인·프로젝트 스킬에 서로 다른 식별 문구를 넣었다. 기본 실행과 `--setting-sources ""`를 적용한 실행을 로컬 모의 서버로 보내고, 요청 내용에 그 문구가 남는지 확인했다. 스킬은 본문 전체가 아니라 **사용 가능한 스킬 목록에 포함되는지**를 봤다.

| 확인한 항목 | 기본 실행 | `--setting-sources ""` 적용 |
|---|---|---|
| 사용자 설정 파일의 테스트용 모델 지정 | 적용됨 | 제외됨 |
| 개인·프로젝트 `CLAUDE.md`의 식별 문구 | 요청에 포함됨 | 제외됨 |
| 개인·프로젝트 스킬의 이름·설명 | 목록에 포함됨 | 제외됨 |
| 내장 도구 | 남아 있음 | 남아 있음 |

설치된 **2.1.247에서는 설정 파일뿐 아니라 테스트한 지침과 스킬 목록도 제외됐다.** 따라서 ‘스킬은 별도 옵션을 쓰지 않았으니 그대로 남아 있다’고 설명하면 맞지 않는다. 별도 옵션을 쓰지 않았다는 것과 실제로 로딩됐다는 것은 다른 얘기였다.

이 비교에서는 MCP를 빈 구성으로 고정했다. 기존 MCP 연결이나 관리자 정책, 상속된 환경변수까지 모두 배제되는지는 이 결과만으로 말할 수 없다. 로그인 유지 여부는 앞서 앱에서 확인한 내용이고, 이 모의 서버 검증은 설정이 요청에 포함되는지를 확인한 것이다.

## 헷갈렸던 옵션은 `--allowed-tools ""`였다

처음에는 이름만 보고 빈 값을 넘기면 사용 가능한 도구가 없어질 줄 알았다. `--allowed-tools`는 **승인 없이 실행할 도구를 미리 지정**하는 옵션이었다. 빈 값으로 두면 이 옵션을 통해 미리 승인한 도구가 없다는 뜻이지, 다른 권한 설정까지 지우거나 도구를 없애지는 않는다.

내장 도구를 실행 세션에서 제외하려면 `--tools ""`를 써야 한다. 실제 비교에서도 `--allowed-tools ""`를 넣은 요청에 내장 도구가 남아 있었다.

| 옵션 | 제어하는 범위 | 기존 앱에 적용 |
|---|---|---|
| `--setting-sources ""` | 사용자·프로젝트·로컬 설정 로딩. 위 버전에서는 테스트한 개인·프로젝트 지침과 스킬 목록도 제외됨 | 사용 |
| `--allowed-tools ""` | 이 옵션으로 미리 승인할 도구 목록. 도구 자체를 끄지는 않음 | 사용 |
| `--tools ""` | 내장 도구 제외. MCP 도구는 별도 | 미사용 |
| `--disable-slash-commands` | 스킬 비활성화 | 미사용 |
| `--strict-mcp-config` | `--mcp-config`로 지정한 MCP 서버만 사용하도록 제한 | 미사용 |

설치된 버전에는 `--safe-mode`도 있었다. 공식 설명상 인증은 유지하면서 `CLAUDE.md`, 스킬, 플러그인, 훅, MCP 같은 맞춤 기능을 끈다. 로컬 비교에서도 테스트한 지침과 스킬 목록은 빠졌다. 다만 사용자 설정의 모델 지정과 내장 도구는 남아 있었다. **설정 파일을 통째로 제외하고 싶은지, 맞춤 기능을 끄고 싶은지에 따라 고를 옵션이 달랐다.** 관리자 정책도 별도로 적용된다.

## Codex로 바꿔 실행하면 어떻게 될까?

앱에는 Claude Code 외에 Codex를 선택하는 경로도 있었다. 기본 명령은 아래와 같았고, 필요하면 모델과 추론 강도 옵션을 덧붙였다.

```bash
codex exec --skip-git-repo-check
```

`--skip-git-repo-check`는 Git 저장소 밖에서도 실행할 수 있게 하는 옵션이다. 개인 설정을 제외하는 옵션은 아니어서, 기존 앱의 Codex 경로에는 Claude 쪽과 같은 설정 제외 처리가 없었다.

현재 설치된 **Codex CLI 0.144.4**에는 `--ignore-user-config`가 있다. 공식 설명은 `$CODEX_HOME/config.toml`을 읽지 않되 인증은 기존 `CODEX_HOME`을 사용한다는 것이다. 이 옵션도 임시 설정에 식별 문구를 넣고 로컬 모의 서버에서 요청 내용을 비교했다.

| 확인한 항목 | 기본 실행 | `--ignore-user-config` 적용 |
|---|---|---|
| 사용자 `config.toml`에 넣은 지침 | 요청에 포함됨 | 제외됨 |
| 개인 `AGENTS.md` | 요청에 포함됨 | 남아 있음 |
| 프로젝트 `AGENTS.md` | 요청에 포함됨 | 남아 있음 |
| 프로젝트 스킬의 이름·설명 | 목록에 포함됨 | 남아 있음 |

Claude에서 썼던 설정 제외 옵션과 같은 범위로 생각하면 안 됐다. Codex에서는 설정 파일을 제외해도 `AGENTS.md`와 스킬이 남았다.

별도로 프롬프트 입력을 확인했을 때 `project_doc_max_bytes=0`은 프로젝트 `AGENTS.md`를 제외했지만 개인 `AGENTS.md`는 남겼다. `skills.config`에서 테스트 스킬을 `enabled=false`로 지정했을 때는 그 스킬이 목록에서 빠졌다. 무엇을 제외하려는지에 따라 따로 확인할 필요가 있었다.

앱 전용 `CODEX_HOME`을 두면 개인 설정과 전역 지침을 분리할 수 있다. 하지만 인증 저장 위치도 함께 달라지고, 개인 스킬은 `~/.agents/skills`에서도 읽는다. **폴더 하나를 바꾸는 것만으로 개인 환경이 모두 분리되는 것은 아니다.** 앱 전용 작업 폴더와 필요한 스킬·MCP 설정까지 함께 정하는 쪽으로 보완해야 한다.

## 채점 결과를 생성되는 대로 보여주기

처음에는 `subprocess.run()`으로 프로세스가 끝날 때까지 기다린 뒤 `stdout`을 한 번에 읽었다. 최종 답변만 필요할 때는 이 방식이 간단했다. 화면에 답변이 생성되는 과정을 보여주려면 CLI가 중간 이벤트를 보내고, Python도 실행 중에 출력을 한 줄씩 읽어야 했다.

Claude Code에는 다음 옵션을 함께 넘겼다.

```bash
--output-format stream-json --verbose --include-partial-messages
```

이렇게 받은 출력은 한 줄에 JSON 이벤트 하나씩 들어온다. 기존 스트리밍 코드는 `subprocess.Popen()`으로 실행한 뒤, 다음 조건에 맞는 텍스트만 화면으로 보냈다.

```python
if event.get("type") == "stream_event":
    inner = event.get("event", {})
    if inner.get("type") == "content_block_delta":
        delta = inner.get("delta", {})
        if delta.get("type") == "text_delta":
            yield delta.get("text", "")
```

세션 정보나 마지막 `result` 이벤트까지 그대로 표시하면 답변 외의 정보가 섞이고, 최종 응답 전문이 다시 붙을 수 있다. 답변 조각은 화면에 이어 붙이고, `result`는 성공·실패와 완료 상태를 판단하는 데 쓰는 편이 맞다. 글자가 일부 나타났다고 채점이 끝난 것은 아니기 때문이다.

기존 코드에는 `result.is_error`를 처리하는 부분이 있지만, 정상 완료 이벤트와 프로세스 종료 코드를 함께 확인하는 처리는 더 필요하다. 아래의 `timeout=120`도 한 번에 답변을 받는 `subprocess.run()`에만 적용돼 있다. 스트리밍 경로에는 별도의 시간 제한과 중단 처리를 붙여야 한다.

Codex는 `--json`으로 JSONL 이벤트를 받을 수 있지만 Claude와 이벤트 형식이 다르다. 현재 앱의 출력 해석은 Claude 기준이므로, 실행 명령만 바꿨다고 스트리밍까지 호환되는 것은 아니다.

## 최종 답변을 한 번에 받는 실행 코드

앱에서 사용한 코드를 줄였다. `empty_dir`는 실행에 쓸 빈 디렉터리이고, `question`은 앱이 넘기는 채점 요청이다. `-p`로 비대화형 실행을 하고, 질문은 명령 인자와 분리해 표준 입력으로 전달했다. 여러 줄이거나 따옴표가 들어간 답안도 문자열 그대로 넘길 수 있다.

이 코드는 당시 구현을 보여주는 예시다. 앞에서 확인한 도구 제한이나 스트리밍 보완이 모두 적용된 코드는 아니다.

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
    answer = "AI 응답이 120초를 넘었습니다. 다시 시도해 주세요."
else:
    answer = (
        proc.stdout.strip()
        if proc.returncode == 0
        else f"오류: {proc.stderr[:400]}"
    )
```

실행 전에는 `shutil.which()`로 CLI 설치 여부를 확인했다. 기본 도구를 정할 때는 설치된 Claude Code → Codex → Gemini → Ollama 순으로 고르고, `GUIDE_AI_PROVIDER` 환경변수로 지정할 수도 있게 했다. 실행 중 오류가 나면 다음 도구로 자동 재시도하는 방식은 아니다.

## 다음에 같은 구조를 쓴다면

이 앱의 채점에는 질문과 답안이면 충분하다. 다시 만든다면 필요 없는 내장 도구와 MCP를 제외하고, 개인 학습 규칙이 들어오지 않는 상태에서 기존 로그인으로 채점이 끝까지 되는지 확인하겠다. 이미 확인한 설정 로딩 결과에 더해, 실제로 파일을 읽거나 외부 도구를 부를 수 없는지도 따로 확인하고 싶다.

화면에서는 답변이 나오기 시작한 상태와 채점이 끝난 상태를 구분하겠다. 중간에 실패했다면 일부 답변을 완성된 결과처럼 남기지 않고, 오류를 알리고 다시 요청할 수 있게 해야 한다. Claude와 Codex를 선택할 수 있게 한다면 설정 제외뿐 아니라 출력 해석과 오류 처리도 도구별로 맞춰야 한다.

## 참고

- [Claude Code CLI 레퍼런스](https://code.claude.com/docs/en/cli-reference) — 설정 소스, 도구, 스킬, safe mode 옵션
- [Claude Code를 프로그래밍 방식으로 실행하기](https://code.claude.com/docs/en/headless) — 비대화형 실행과 스트리밍
- [Codex CLI 명령](https://learn.chatgpt.com/docs/developer-commands?surface=cli) — `exec`, `--ignore-user-config`, `--json`
- [Codex의 AGENTS.md 로딩](https://learn.chatgpt.com/docs/agent-configuration/agents-md) — 개인·프로젝트 지침과 `CODEX_HOME`
- [Codex 스킬](https://learn.chatgpt.com/docs/build-skills) — 스킬 탐색 위치
- [Codex 설정 레퍼런스](https://learn.chatgpt.com/docs/config-file/config-reference) — `project_doc_max_bytes`, `skills.config`

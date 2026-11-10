---
title: Claude Code CLI를 Python 앱에서 실행하기 — 설정 분리와 응답 스트리밍
category: ai
categories: [ai, tools, backend]
tags: [Claude Code, CLI, 스트리밍, Python]
date: 2026-08-28
summary: Python 서버에서 Claude Code를 실행해 응답을 받는 방법입니다. 개인 설정을 분리한 실행 옵션과 응답을 실시간으로 표시하는 방법을 정리했습니다.
sample: false
---

학습 앱에서 사용자가 ‘채점’ 버튼을 누르면 Python 서버가 Claude Code를 실행해 응답을 받도록 구현했습니다. 이 글은 실행 방식과 설정할 때 주의할 점을 정리한 기록입니다.

## 앱에서 Claude Code를 실행하는 흐름

- 학습 앱에서 "채점" 버튼을 누르면, 앱 서버(Python)가 내 컴퓨터의 `claude` 명령을 대신 실행해 답을 받아 온다
- 서버가 질문을 전달하고 응답을 받아 앱 화면에 표시한다
- 장점: API 키를 따로 발급하지 않고, 이미 로그인된 Claude Code를 그대로 쓴다

**용어**

| 용어 | 뜻 |
|---|---|
| CLI | 터미널에서 명령어로 프로그램을 사용하는 방식. 여기서는 `claude` 명령을 사용 |
| `-p` | 대화형 화면을 열지 않고 질문의 응답을 출력한 뒤 종료하는 옵션 |
| stdin | 프로그램이 데이터를 전달받는 표준 입력 통로. 여기로 질문을 전달 |
| 스트리밍 | 응답이 완성되기 전부터 생성되는 내용을 나눠 받아 화면에 표시하는 방식 |

## 사용한 실행 옵션

| 옵션 | 사용 목적 |
|---|---|
| `-p` | 서버가 대화형 화면 없이 응답을 받을 수 있도록 실행 |
| `--allowed-tools ""` | 승인 질문 없이 실행할 도구 목록. 빈 값이면 미리 허용한 도구가 없다는 뜻이고, 도구를 끄는 옵션은 아니다 |
| `--setting-sources ""` | 사용자·프로젝트·로컬 설정 파일(user, project, local)을 불러오지 않는다 |
| `--model sonnet` | 이 학습 앱에서 사용한 모델 지정 |

**옵션별로 끄는 범위 (`claude --help` 2.1.247 기준)**

| 끄고 싶은 것 | 옵션 | 이 앱에서 |
|---|---|---|
| 내장 도구(파일 읽기·명령 실행 등) | `--tools ""` | 쓰지 않음 |
| 설정 파일 | `--setting-sources ""` | 사용 |
| 스킬 | `--disable-slash-commands` | 쓰지 않음 |
| MCP 서버 | `--strict-mcp-config` (`--mcp-config`로 준 것만 사용) | 쓰지 않음 |

- `--tools ""`는 내장 도구만 끈다. MCP 도구는 따로 다룬다
- 이 앱에서는 `--setting-sources ""`만으로 개인 설정의 영향이 없어졌는지 따로 검증하지 않았다

**응답을 스트리밍으로 받을 때 추가한 옵션**

```bash
--output-format stream-json --verbose --include-partial-messages
```

- 이 구현에서는 세 옵션을 함께 사용해 응답을 나눠 받았다

## Python 실행 코드

앱의 실제 코드(응답을 끝까지 받는 방식)를 줄인 것입니다. `empty_dir`는 빈 작업 폴더 경로, `question`은 앱에서 전달할 질문입니다.

```python
import subprocess

cmd = ["claude", "-p", "--allowed-tools", "", "--setting-sources", "", "--model", "sonnet"]

try:
    proc = subprocess.run(
        cmd,
        input=question,          # 질문은 명령 뒤에 붙이지 않고 stdin으로 넘긴다
        capture_output=True,
        text=True,
        timeout=120,             # 120초가 넘으면 중단
        cwd=empty_dir,
    )
except subprocess.TimeoutExpired:
    answer = "AI 응답이 120초를 넘었습니다. 다시 시도해 주세요."
else:
    answer = proc.stdout.strip() if proc.returncode == 0 else f"오류: {proc.stderr[:400]}"
```

## 구현 중 확인한 문제와 해결

- **개인 설정이 앱의 지시에 영향을 줄 수 있다.** 앱에서 실행한 Claude도 PC에 있는 설정과 스킬을 읽는다. 이 앱은 `--setting-sources ""`로 설정 파일을 불러오지 않게 했고, 기존 로그인은 유지됐다. 스킬·MCP까지 확실히 끄려면 위 표의 옵션을 따로 넣어야 한다
- **기본 출력은 응답이 완성된 뒤 전달된다.** 생성 중인 응답을 화면에 표시하려면 위의 스트리밍 옵션 세 개를 함께 사용한다
- **스트리밍 데이터에는 진행 정보도 포함된다.** 한 줄씩 전달되는 JSON에서 `text_delta`의 텍스트를 추출해 화면에 표시한다
- **작업 폴더를 빈 폴더로 지정했다.** 앱 폴더에서 부르면 주변 파일 내용이 답에 섞일 수 있다
- **질문은 stdin으로 전달했다.** 긴 문장이나 따옴표가 명령 인자로 해석되는 문제를 피하기 위해서다
- 응답을 기다리는 시간은 최대 120초로 정했다 (`timeout=120`, 넘으면 안내 문구 반환)

## 적용할 때 확인할 점

- 개인 설정이 앱의 지시와 충돌하지 않도록 실행 환경을 분리한다. 설정 파일·스킬·MCP·내장 도구를 각각 무엇으로 끄는지 확인한다
- 실행할 PC에 Claude Code가 설치되어 있는지 먼저 확인한다(`shutil.which("claude")`). 이 앱에서는 없을 때 Codex · Gemini · Ollama 순서로 대체하도록 구성했다
- 이 앱에서는 환경변수 `GUIDE_AI_PROVIDER`로 사용할 AI를 선택하도록 구성했다

## 핵심 요약

> 이 앱은 빈 작업 폴더에서 `claude -p --allowed-tools "" --setting-sources ""`로 실행했습니다. 도구를 확실히 끄려면 `--allowed-tools`가 아니라 `--tools ""`를 써야 합니다. 실시간 응답은 스트리밍 옵션을 추가하고 `text_delta`의 텍스트를 추출해 표시했습니다.

## 참고 자료

- [Claude Code — CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code — Headless mode](https://code.claude.com/docs/en/headless)

출처: SKALA sLLM 학습 가이드 앱 server.py (2026-08-28) · 옵션은 `claude --help`로 확인

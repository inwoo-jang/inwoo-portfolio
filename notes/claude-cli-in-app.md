---
title: 앱에서 Claude Code를 부르면 내 설정까지 따라온다 — CLI 실행 옵션과 스트리밍
category: ai
categories: [ai, tools, backend]
tags: [Claude Code, CLI, 스트리밍, Python]
date: 2026-08-28
summary: 학습 앱의 ‘채점’ 버튼이 Python 서버에서 claude 명령을 실행하게 만들었다. 앱에서 부른 Claude도 내 PC의 설정과 스킬을 읽는다는 것, 도구를 끄는 옵션이 생각과 달랐다는 것을 기록했다.
sample: false
---

학습 앱에서 ‘채점’ 버튼을 누르면 Python 서버가 내 컴퓨터의 `claude` 명령을 대신 실행해 답을 받아 오도록 만들었다. API 키를 따로 발급하지 않고, 이미 로그인된 Claude Code를 그대로 쓰려는 선택이었다.

## 막상 붙여 보니

- **앱에서 실행한 Claude도 내 PC의 설정과 스킬을 읽는다.** 개인 설정이 앱의 지시에 섞일 수 있다. `--setting-sources ""`로 설정 파일을 불러오지 않게 했고, 로그인은 유지됐다. 다만 이것만으로 개인 설정의 영향이 다 사라졌는지는 따로 검증하지 않았다
- **`--allowed-tools ""`는 도구를 끄는 옵션이 아니었다.** 승인 없이 실행할 도구 목록이 비어 있다는 뜻일 뿐이다. 도구를 확실히 끄려면 `--tools ""`를 써야 한다
- **기본 출력은 응답이 완성된 뒤에야 온다.** 생성 중인 응답을 보여 주려면 스트리밍 옵션 세 개를 함께 써야 했다
- **스트리밍 데이터에는 진행 정보도 섞여 있다.** 한 줄씩 오는 JSON에서 `text_delta`의 텍스트만 뽑아 화면에 표시했다
- **작업 폴더는 빈 폴더로 지정했다.** 앱 폴더에서 부르면 주변 파일 내용이 답에 섞일 수 있다
- **질문은 stdin으로 넘겼다.** 긴 문장이나 따옴표가 명령 인자로 해석되는 문제를 피하려고
- 응답 대기는 최대 120초로 정했다 (`timeout=120`, 넘으면 안내 문구 반환)

## 쓴 옵션

| 옵션 | 사용 목적 |
|---|---|
| `-p` | 대화형 화면 없이 응답만 출력하고 종료 |
| `--allowed-tools ""` | 승인 질문 없이 실행할 도구 목록. 빈 값이면 미리 허용한 도구가 없다는 뜻이고, 도구를 끄는 옵션은 아니다 |
| `--setting-sources ""` | 사용자·프로젝트·로컬 설정 파일(user, project, local)을 불러오지 않는다 |
| `--model sonnet` | 이 앱에서 쓴 모델 |

무엇을 끄려면 어떤 옵션이 필요한지 (`claude --help` 2.1.247 기준):

| 끄고 싶은 것 | 옵션 | 이 앱에서 |
|---|---|---|
| 내장 도구(파일 읽기·명령 실행 등) | `--tools ""` | 쓰지 않음 |
| 설정 파일 | `--setting-sources ""` | 사용 |
| 스킬 | `--disable-slash-commands` | 쓰지 않음 |
| MCP 서버 | `--strict-mcp-config` (`--mcp-config`로 준 것만 사용) | 쓰지 않음 |

`--tools ""`는 내장 도구만 끈다. MCP 도구는 따로 다룬다.

스트리밍으로 받을 때 추가한 옵션:

```bash
--output-format stream-json --verbose --include-partial-messages
```

## 실행 코드

앱의 실제 코드(응답을 끝까지 받는 방식)를 줄인 것이다. `empty_dir`는 빈 작업 폴더, `question`은 앱에서 넘길 질문.

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

실행 전에 `shutil.which("claude")`로 설치 여부를 확인하고, 없으면 Codex · Gemini · Ollama 순서로 대체하게 했다. 쓸 AI는 환경변수 `GUIDE_AI_PROVIDER`로 고른다.

## 남은 질문

- 다음에 같은 구조를 쓴다면 `--tools ""`, `--disable-slash-commands`, `--strict-mcp-config`까지 다 넣어야 할까? 이번엔 설정 파일만 껐다

## 참고 자료

- [Claude Code — CLI reference](https://code.claude.com/docs/en/cli-reference)
- [Claude Code — Headless mode](https://code.claude.com/docs/en/headless)

출처: SKALA sLLM 학습 가이드 앱 server.py (2026-08-28) · 옵션은 `claude --help`로 확인

---
title: VS Code·Kiro·Cursor, 프로젝트 규칙은 어디에 적어야 할까?
category: tools
tags: [VS Code, Kiro, Cursor, AI 코딩]
date: 2026-11-06
summary: 세 도구가 AI에게 일을 맡기는 방식과 프로젝트 규칙 파일의 위치를 공식 문서로 비교했다. AGENTS.md 하나로 VS Code와 Cursor에 같은 규칙을 줄 수 있다.
sample: false
---

VS Code·Kiro·Cursor에서 AI에게 일을 맡기는 방식과, 프로젝트 규칙을 AI에게 전달하는 방법을 공식 문서로 비교했다. 정리하고 보니 핵심은 **같은 규칙을 여러 도구에 한 번에 줄 수 있는가**였다.

## 정리하며 알게 된 것

- `AGENTS.md`는 VS Code(Copilot)와 Cursor가 함께 인식한다. 규칙을 한 파일로 공유하려면 이걸 쓰면 된다
- Cursor의 `.cursor/rules/`는 **`.mdc`** 파일만 인식한다. `.md`로 두면 무시된다
- Kiro는 요구사항 → 설계 → 작업 목록 문서를 먼저 만드는 흐름(Specs)이 기본이다. 기획 문서를 기준으로 구현을 진행하는 방식과 잘 맞을 것 같다
- 세 도구 모두 MCP(AI가 외부 도구·데이터에 연결하는 표준)를 지원한다
- 가격·무료 사용량은 자주 바뀌어서 적지 않았다

## 비교

| | VS Code | Kiro | Cursor |
|---|---|---|---|
| 기본 구조 | 코드 에디터에 AI 기능 추가(GitHub Copilot 등) | 명세 문서 중심의 AI 개발 환경 | AI 에이전트 중심의 코드 에디터 |
| AI 작업 방식 | 코드 작성 중 수정 제안, 채팅, 에이전트 작업 | 요구사항 → 설계 → 작업 목록 순서로 진행(Specs) | 에이전트로 작업하며, 큰 변경은 Plan Mode에서 범위부터 정함 |
| 프로젝트 규칙 | `.github/copilot-instructions.md`, `AGENTS.md` | `.kiro/steering/` (기본: product · tech · structure) | `.cursor/rules/*.mdc`, `AGENTS.md` |
| 자동화 | 확장 기능 · 에이전트 | Hooks — 파일 변경 · 도구 사용 · 작업 완료 시 지정한 동작 실행 | 규칙 · 스킬 · 플러그인 |
| MCP | 지원 | 지원 | 지원 |
| 모델 선택 | 여러 제공사의 모델, 개인 API 키, 로컬 모델 사용 | 지원 모델 목록에서 선택 | 제공사별 모델 목록에서 선택 |

## 도구별 메모

**VS Code**
- AI는 GitHub Copilot 플랜, 지원 제공사 계정, API 키 중 하나로 사용
- 작업을 수행할 에이전트를 Copilot · Claude · Codex 중에서 선택
- 규칙 파일: `.github/copilot-instructions.md` — `AGENTS.md`도 인식

**Kiro**
- Specs: `requirements.md` → `design.md` → `tasks.md` (버그 수정은 `bugfix.md`)
- Steering: 프로젝트 `.kiro/steering/`, 전체 공통 `~/.kiro/steering/`
- Hooks: 파일 변경·도구 사용·작업 완료 시 실행할 동작을 지정
- 같은 에이전트가 IDE 외에 CLI · 웹 · 모바일에서도 동작

**Cursor**
- 큰 변경은 Plan Mode로 범위를 먼저 잡음
- 규칙 파일은 `.cursor/rules/` 안의 `.mdc` 파일만 인식
- `AGENTS.md`를 루트와 하위 폴더에서 인식

## 참고 자료

- [VS Code — AI 기능 개요](https://code.visualstudio.com/docs/copilot/overview)
- [VS Code — Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Kiro Docs](https://kiro.dev/docs/) · [Specs](https://kiro.dev/docs/specs/) · [Steering](https://kiro.dev/docs/steering/)
- [Cursor Docs](https://cursor.com/docs) · [Rules](https://cursor.com/docs/context/rules)

출처: 각 도구 공식 문서 (확인일 2026-11-06). 기능이 자주 바뀌므로 쓰기 전에 다시 확인

---
title: AI 개발 도구 비교 — VS Code vs Kiro vs Cursor
category: tools
tags: [VS Code, Kiro, Cursor, AI 코딩]
date: 2026-11-06
summary: 세 도구의 AI 기능을 같은 기준으로 비교 — 작업 방식, 프로젝트 규칙 파일, MCP, 모델 선택.
sample: false
---

> 공식 문서 기준 비교 · 확인일 2026-11-06 · 기능이 자주 바뀌므로 쓰기 전에 다시 확인

## 한눈에

| | VS Code | Kiro | Cursor |
|---|---|---|---|
| 성격 | 에디터 + AI(GitHub Copilot 등) | 스펙 중심 AI 개발 환경 | 에이전트 중심 코드 에디터 |
| AI 작업 방식 | 입력 중 제안(다음 수정 포함), Chat, 에이전트 | 요구사항 → 설계 → 작업 순서로 진행(Specs) | 에이전트, 큰 변경은 Plan Mode로 범위부터 |
| 프로젝트 규칙 | `.github/copilot-instructions.md`, `AGENTS.md` | `.kiro/steering/` (기본: product · tech · structure) | `.cursor/rules/*.mdc`, `AGENTS.md` |
| 자동화 | 확장 · 에이전트 | Hooks — 파일 변경 · 도구 사용 · 작업 완료 때 실행 | 규칙 · 스킬 · 플러그인 |
| MCP | 지원 | 지원 | 지원 |
| 모델 | 여러 제공사 선택, 내 API 키, 로컬 모델 | 지원 모델 목록에서 선택 | 제공사별 모델 표에서 선택 |

## 도구별 메모

**VS Code**
- AI는 GitHub Copilot 플랜, 지원 제공사 계정, API 키 중 하나로 사용
- 에이전트 실행 방식(harness)을 Copilot · Claude · Codex 중에서 고를 수 있음
- 규칙 파일: `.github/copilot-instructions.md` — `AGENTS.md`도 인식

**Kiro**
- Specs: `requirements.md` → `design.md` → `tasks.md` (버그 수정은 `bugfix.md`)
- Steering: 프로젝트 `.kiro/steering/`, 전체 공통 `~/.kiro/steering/`
- Hooks: 에이전트가 파일을 바꾸거나 도구를 쓰거나 작업을 끝낼 때 동작 연결
- 같은 에이전트가 IDE 외에 CLI · 웹 · 모바일에서도 동작

**Cursor**
- 큰 변경은 Plan Mode로 범위를 먼저 잡음
- 규칙 파일은 `.cursor/rules/` 안의 **`.mdc`** 파일만 인식 (`.md`는 무시됨)
- `AGENTS.md`를 루트와 하위 폴더에서 인식

## 메모

- 공통점: 세 도구 모두 MCP 지원, 규칙 파일로 프로젝트 기준을 AI에 전달
- `AGENTS.md`는 VS Code(Copilot)와 Cursor가 함께 인식 → 규칙을 한 파일로 공유할 때 유리
- Kiro는 요구사항·설계·작업 문서를 먼저 만드는 흐름이 기본 → 기획 문서와 구현을 이어 붙이기 좋음
- 가격·무료 사용량은 자주 바뀌어서 이 노트에 적지 않음

## 참고

- [VS Code — AI 기능 개요](https://code.visualstudio.com/docs/copilot/overview)
- [VS Code — Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Kiro Docs](https://kiro.dev/docs/) · [Specs](https://kiro.dev/docs/specs/) · [Steering](https://kiro.dev/docs/steering/)
- [Cursor Docs](https://cursor.com/docs) · [Rules](https://cursor.com/docs/context/rules)

---
title: IDE 툴 비교 — VS Code · Kiro · Cursor
category: tools
tags: [VS Code, Kiro, Cursor, AI 코딩]
date: 2026-11-06
summary: VS Code는 조합형, Kiro는 명세 중심, Cursor는 에이전트 중심. AI 코딩 방식, 프로젝트 규칙 관리, 작업 계획·검증 흐름을 공식 문서 기준으로 비교했다.
sample: false
---

VS Code·Kiro·Cursor의 AI 코딩 방식과 프로젝트 규칙 관리, 작업 계획과 검증 흐름을 공식 문서 기준으로 비교했다. 세 도구 모두 AI로 코드를 작성·수정하고 외부 도구에 연결할 수 있지만, 개발 과정에서 강조하는 부분이 다르다.

## 한 줄로 비교

- **VS Code:** 다양한 AI 에이전트와 확장 기능을 조합할 수 있는 개발 환경
- **Kiro:** 요구사항·설계·작업 목록을 연결하는 명세 중심 개발
- **Cursor:** 계획 수립부터 코드 수정, 검토까지 이어지는 에이전트 중심 개발

## 비교표

| | VS Code | Kiro | Cursor |
|---|---|---|---|
| 중심 | 조합형 — 에디터에 AI 기능·에이전트를 붙임(GitHub Copilot 등) | 명세 중심 | 에이전트 중심 |
| 작업 흐름 | 코드 작성 중 수정 제안, 채팅, 에이전트 작업 | 요구사항 → 설계 → 작업 목록 순서로 진행(Specs) | Plan Mode로 범위 정리 → Agent로 수정 → Diff로 결과 검토 |
| 프로젝트 규칙 | `.github/copilot-instructions.md`, `AGENTS.md` | `.kiro/steering/` (기본: product · tech · structure), `AGENTS.md` | `.cursor/rules/*.mdc`, `AGENTS.md` |
| 자동화 | 확장 기능 · 에이전트 | Hooks — 파일 변경 · 도구 사용 · 작업 완료 시 지정한 동작 실행 | 규칙 · 스킬 · 플러그인 |
| 외부 연결(MCP) | 지원 | 지원 | 지원 |
| 모델 선택 | 여러 제공사의 모델, 개인 API 키, 로컬 모델 | 지원 모델 목록에서 선택 | 제공사별 모델 목록에서 선택 |

## 정리하며 알게 된 것

- 세 도구 모두 `AGENTS.md`를 지원해서 공통 프로젝트 지침을 공유할 수 있다. 단, 규칙이 적용되는 방식과 범위는 도구별로 확인해야 한다
- Kiro의 Specs는 기획자가 쓰는 요구사항과 인수 기준을 실제 구현 작업으로 연결할 수 있다는 점에서 흥미로웠다
- Cursor의 Plan Mode는 구현 전에 변경 범위를 검토할 수 있고, Agent와 Diff로 수정 결과를 확인할 수 있다
- Rules는 AI에게 지침을 줄 뿐 실행을 강제하지 않는다. 반복 작업은 Skills, 이벤트 기반 실행은 Hooks, 외부 시스템 연결은 MCP로 구분할 수 있다
- 어떤 IDE가 가장 우수한지보다, 작업의 성격, 기존 개발 환경, 규칙 재사용과 결과 검증이 쉬운지를 기준으로 고르는 게 합리적이다

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
- 규칙 파일은 `.cursor/rules/` 안의 `.mdc` 파일만 인식(`.md`로 두면 무시됨)
- `AGENTS.md`를 루트와 하위 폴더에서 인식

## 현재의 결론

AI 코딩 도구를 고를 때 중요한 건 코드를 얼마나 빠르게 쓰는가만이 아니라, **요구사항이 구현에 제대로 반영되고 결과를 검증할 수 있는가**라고 생각한다.

같은 프로젝트에 여러 IDE를 쓴다면 공통 규칙은 `AGENTS.md`로 관리하고, 도구별 기능이 필요할 때만 전용 설정 파일을 추가하는 방식이 맞아 보인다. 다만 실제 생산성과 품질 차이는 같은 작업을 해 보기 전까지 단정하기 어렵다.

## 참고 자료

- [VS Code — AI 기능 개요](https://code.visualstudio.com/docs/copilot/overview)
- [VS Code — Custom instructions](https://code.visualstudio.com/docs/copilot/customization/custom-instructions)
- [Kiro Docs](https://kiro.dev/docs/) · [Specs](https://kiro.dev/docs/specs/) · [Steering](https://kiro.dev/docs/steering/)
- [Cursor Docs](https://cursor.com/docs) · [Rules](https://cursor.com/docs/context/rules)

출처: 각 도구 공식 문서 (확인일 2026-11-06). 기능과 가격이 자주 바뀌므로 쓰기 전에 다시 확인

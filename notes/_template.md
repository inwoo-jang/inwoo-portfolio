---
title: 노트 제목
category: tools
tags: [태그1, 태그2]
date: 2026-01-01
summary: 목록 카드에 보일 한두 문장 요약.
sample: false
---

<!--
  새 노트 작성법
  1. 이 파일을 복사해 notes/영문-슬러그.md 로 저장한다 (파일명 = 주소의 슬러그).
     밑줄(_)로 시작하는 파일은 목록에 포함되지 않는다.
  2. category 는 planning · ux · ai · data · frontend · backend · infra · tools · testing 중 하나.
     category에는 주 분류를 적고, 복합 주제는 categories: [planning, data]처럼 관련 분류를 추가한다.
     주 분류는 카드의 대표 색상을 정하며, 글은 연결한 모든 분류에서 검색된다.
     분류별 범위·색상은 notes/categories.json을 참고한다.
     기술 선택 이유는 planning, AI 구현은 ai, 데이터 분석·ML 실험은 data에 둔다.
     비교·사용 가이드·오류 해결은 분류가 아닌 태그로 구분한다.
  3. 저장 후 `node tools/build-notes-index.mjs` 를 실행해 notes/index.json 을 갱신한다.
  4. 직접 확인하지 않은 내용은 "확인 필요"로 표시하고, 샘플이면 sample: true.
  5. 수업일 기준이면 date에 마지막 수업일을 적고 date_type: class를 추가한다.
     수업명과 마지막 수업일은 본문 하단에도 적는다.
-->

## 상황

무엇을 하다가, 어떤 환경에서 문제가 생겼는지.

## 원인

## 해결

```bash
# 실행한 명령
```

## 배운 점

## 참고

- [공식 문서](https://example.com)

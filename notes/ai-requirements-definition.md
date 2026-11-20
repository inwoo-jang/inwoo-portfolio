---
title: AI가 코드를 만드는 시대에 좋은 요구사항 정의란? | 분량이 아니라 합의와 판정 기준
category: planning
categories: [planning, dev]
tags: [요구사항 정의, Spec-Driven Development, 수용 기준, BDD, AI Coding]
date: 2026-11-20
summary: 좋은 요구사항은 구현 방법을 다 지정한 문서가 아니라, 무엇을 만들지에 대한 합의와 무엇이 잘못된 결과인지 판정할 기준을 담은 문서다. AI가 코드를 빨리 쓸수록 분량보다 이 두 가지가 중요해진다. 사용자의 문제, 지켜야 할 업무 규칙, 아직 결정하지 않은 조건, 검증 가능한 결과를 구분해 적는 틀을 정리했다.
sample: false
related: [ai-coding-delivery, tech-stack-choice, ai-dev-tools-compare]
---

> 좋은 요구사항은 구현 방법을 다 지정한 문서가 아니다. 무엇을 만들지에 대한 합의와, 무엇이 잘못된 결과인지 판정할 기준을 담은 문서다. AI가 코드를 빨리 쓸수록 요구사항의 분량이 아니라 이 두 가지가 중요해진다.

요구사항 한 줄을 AI 코딩 도구에 넘기면 몇 분 안에 화면과 API가 나온다. 문제는 그다음이다. 돌아가는 코드를 보고 나서야 "이게 내가 말한 게 맞나"를 묻게 된다. 개발팀에 기획서를 넘기던 때는 개발자가 빈칸을 되물어 줬다. 지금은 AI가 빈칸을 스스로 채운다. 그래서 요구사항을 어디까지, 어떤 형태로 써야 하는지 다시 정리했다.

먼저 세 가지를 구분한다. **요구사항**은 무엇을, 왜, 어떤 조건에서 만들어야 하는지 적는다. **구현 명세**는 제약과 기술적 결정을 전달해 구현 방향을 통제한다. **수용 기준**은 만들어진 결과가 맞는지 확인하거나 반증할 수 있게 한다. 셋은 이어지지만 같은 문서가 아니고, AI에게 넘길 때 가장 자주 빠지는 것은 세 번째다.

## 명세를 많이 쓸수록 좋아지지는 않는다

처음에는 "AI가 임의로 결정하지 못하게 상세히 쓰면 된다"고 생각했다. 그런데 명세 중심 개발(Spec-Driven Development)을 직접 써 본 사람들의 기록이 그 생각을 흔들었다.

Thoughtworks의 Birgitta Böckeler는 Kiro, Spec Kit, Tessl을 비교하면서 작은 버그 수정 하나에 Kiro가 사용자 스토리 4개와 수용 기준 16개를 만들어 낸 사례를 들었다. 고칠 내용보다 문서 절차가 커진 것이다. [Understanding Spec-Driven Development](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html) Vercel도 명세가 검토할 변경보다 복잡해지면 문서화 자체가 부담이 된다고 적는다. [Vercel, Spec-driven development](https://vercel.com/i/spec-driven-development)

실제 사용자를 조사한 연구도 같은 방향이다. 개발자 21명 인터뷰와 공개 저장소 266개를 분석한 [Spec-Driven Development as Prescribed and as Practiced](https://arxiv.org/abs/2608.25202)에서 참여자들은 명세로 AI 작업을 더 안정적으로 유도할 수 있다고 평가하면서도, 계획·검토 비용과 명세를 최신으로 유지하는 문제를 함께 보고했다. 명세가 구현 세부까지 담을수록 변경 뒤에 낡는다.

반대 방향의 근거도 있다. [SpecFirst](https://arxiv.org/abs/2607.27167)는 프로그램 재구성 과제 200개를 모델 4개로 평가해, 명세 추출 단계를 분리했을 때 테스트 통과율이 상대적으로 6.9~21.3% 올랐다고 보고한다. 다만 기존 코드베이스에 기능을 더하는 보통의 제품 개발을 검증한 연구는 아니다.

여기서 내린 판단은 이렇다. 명세를 먼저 만드는 방식은 유효하지만, 명세가 많을수록 좋다고 일반화할 근거는 없다. 명세 수준은 **잘못 구현했을 때의 위험과 불확실성**에 맞춘다.

| 상황 | 적는 수준 |
|---|---|
| 버튼 문구 변경 | 변경 대상, 기대 결과 |
| 단순 UI 기능 | 사용자 행동, 화면 상태, 완료 조건 |
| API·DB 연동 기능 | 업무 규칙, 데이터 계약, 오류, 수용 기준 |
| 승인·정산·결제 | 상태 전이, 권한, 동시성, 실패 복구, 검증 |
| 대규모 신규 서비스 | 목표, 범위, 도메인, 아키텍처 제약, 단계별 검증 |

## 같은 결과란 같은 코드가 아니라 같은 업무 동작이다

"누가 읽어도 같은 결과를 만들 수 있는가"를 요구사항의 기준으로 자주 말한다. 같은 요구사항을 줘도 AI마다 코드 구조, 라이브러리, 컴포넌트 구성은 달라진다. 그것은 문제가 아니다. 문제는 업무적으로 지켜야 할 동작이 달라지는 것이다.

> [!예시] 한 줄짜리 요구사항이 갈라지는 지점
> "급여가 확정되면 직원에게 급여명세서를 자동으로 발송한다."
>
> 이 한 줄로 구현하면 다음을 AI나 개발자가 각자 정하게 된다. 확정 즉시 보낼지 담당자 확인 후 보낼지. 연락처가 없는 직원이 있으면 전체를 멈출지. 발송 API가 타임아웃되면 재시도할지. 이미 보낸 건을 다시 실행하면 중복 발송해도 되는지. 발송 후 금액을 정정하면 어떻게 할지.

좋은 요구사항은 이 질문들에 기술적 선택까지 다 답하는 것이 아니라, 업무 정책에 해당하는 질문부터 답한다. 이때 문장 형식으로는 EARS가 쓸 만하다. Rolls-Royce에서 2009년에 제안한 구조화된 자연어 요구사항 작성법으로, 조건과 이벤트에 따른 시스템 동작을 다섯 가지 형식으로 적는다. [EARS, IEEE RE 2009](https://doi.org/10.1109/RE.2009.9)

| 형식 | 쓰는 곳 | 예시 |
|---|---|---|
| 항상 | 공통 규칙 | 발송 이력은 요청자와 결과를 기록한다 |
| When | 이벤트 발생 | 급여가 확정되면 발송 요청이 가능해진다 |
| While | 특정 상태 | 급여가 미확정 상태이면 발송을 허용하지 않는다 |
| If | 예외 상황 | 발송에 실패하면 재처리 가능한 상태로 기록한다 |
| Where | 선택적 조건 | 외부 발송 채널을 쓰는 경우 해당 채널의 결과를 반영한다 |

표의 정책은 형식을 보여 주기 위한 가정이다. 더 중요한 규칙은 **아직 결정하지 않은 것을 AI의 추론에 맡기지 않는 것**이다. 발송 실패 시 전체 재처리와 실패 건만 재처리 중 무엇이 맞는지 모르겠으면, 한쪽을 골라 명세를 완성하는 대신 "결정 필요"라고 남긴다.

## 어디까지 명시하나: 틀렸을 때 데이터·권리·돈에 닿는 조건부터

모든 조합을 적을 수는 없다. 잘못 구현했을 때 데이터 무결성, 사용자 권리, 금전에 영향을 주는 조건부터 적는다. 요구사항을 검토할 때 보는 관점은 일곱 가지다.

| 관점 | 확인할 것 |
|---|---|
| 정상 흐름 | 일반적인 사용자 행동과 기대 결과 |
| 입력 검증 | 누락, 중복, 범위 초과, 형식 오류 |
| 상태 전이 | 어떤 상태에서 어떤 상태로 갈 수 있는가 |
| 권한 | 조회·변경·승인·실행을 누가 할 수 있는가 |
| 취소·정정 | 언제 되돌릴 수 있고 무엇을 보존하는가 |
| 실패·중복 | 타임아웃, 부분 실패, 동시 요청, 재시도 |
| 비기능 | 성능, 보안, 접근성, 감사, 운영 제약 |

금전이나 승인이 걸린 업무에서는 상태와 함께 불변조건을 정한다. "승인되지 않은 지급 건은 어떤 경로에서도 지급 실행될 수 없다"처럼 적어 두면, AI가 화면을 어떻게 만들든 서버가 반드시 지켜야 할 규칙이 된다. OpenAI의 [Harness Engineering](https://openai.com/index/harness-engineering) 사례도 구현 방법을 세세히 통제하는 대신 아키텍처 경계와 불변조건을 정하고 린터와 구조 테스트로 강제한다. 기획자에게 남는 일은 어떤 규칙을 강제할지 결정하는 것이고, 그 규칙을 코드에서 어떻게 강제할지는 엔지니어링과 나눠 설계하면 된다.

## 수용 기준은 테스트와 이어져야 한다

세 개념을 구분한다. 요구사항은 시스템이 무엇을 해야 하는지, 수용 기준(AC)은 무엇이 충족되면 요구사항을 만족했다고 볼지, 테스트 케이스는 어떤 조건과 입력으로 실제 결과를 확인할지를 답한다. 수용 기준을 코드로 쓸 필요는 없지만 테스트 가능한 형태여야 한다. BDD의 Given-When-Then이 그 형태다. [Cucumber, Gherkin](https://cucumber.io/docs/gherkin/reference/)

> [!예시] 급여명세서 발송을 Given-When-Then으로
> Given 급여가 확정됐고, 발송 권한이 있는 담당자가 로그인했을 때
> When 담당자가 해당 명세서의 발송을 요청하면
> Then 시스템은 발송 요청을 기록하고 처리 상태를 표시한다.
>
> 채널의 접수 응답과 실제 전송 성공을 별개 상태로 둔다고 가정했다. 이 구분도 미리 합의할 업무 규칙이다. 같은 명세서를 반복 발송할 때, 권한이 없을 때, 외부 채널이 실패할 때를 각각 시나리오로 잇는다.

자연어로 시나리오를 적었다고 자동 테스트가 생기지는 않는다. 실행 코드나 테스트 러너가 따로 필요하다. 그리고 "중복 발송하지 않는다"는 기능별 수용 기준이고, "테스트 통과·보안 검사·코드 리뷰 완료"는 프로젝트 전체에 적용되는 완료 정의(DoD)다. 둘을 섞지 않는다. [Atlassian, Definition of Done](https://www.atlassian.com/agile/project-management/definition-of-done)

다음 기획서부터는 PRD 본문과 별도로 업무 규칙마다 검증 근거를 잇는 표를 둔다.

| 요구사항 | 수용 기준 | 검증 방법 |
|---|---|---|
| R-01 미확정 급여 발송 금지 | AC-01 미확정 건의 발송 요청은 거절된다 | API·화면 테스트 |
| R-02 중복 발송 방지 | AC-02 같은 요청의 재시도가 중복 전송을 일으키지 않는다 | 통합 테스트 |
| R-03 실패 상태 구분 | AC-03 채널 실패 시 성공으로 표시되지 않는다 | 장애 시뮬레이션 |
| R-04 권한 통제 | AC-04 권한이 없는 사용자는 발송할 수 없다 | 권한 테스트 |
| R-05 이력 보존 | AC-05 요청자·시각·처리 결과를 추적할 수 있다 | 감사 로그 확인 |

정책은 가정이지만 구조는 그대로 쓴다. 문제와 사용자 목표, 업무 규칙·상태·권한·제약, 수용 기준, 구현, 검증, 검증 결과와 변경 이력 순으로 잇고, 요구사항 ID와 AC ID와 테스트 ID를 연결해 관리한다.

### 테스트의 기대값은 사람이 쥔다

AI가 테스트를 쓰는 것은 생산성에 도움이 된다. 그런데 AI가 구현과 테스트를 모두 쓰고 고치면, 잘못된 구현에 맞춰 테스트까지 바꿀 수 있다. Thoughtworks의 Matteo Vaccari는 핵심 업무 규칙을 사람이 읽을 수 있는 테스트 데이터로 분리하고 쉽게 바꾸지 못하게 관리하자고 제안한다. [Tests as data](https://martinfowler.com/articles/tests-as-data.html) "AI가 만든 코드가 테스트를 통과했다"와 "우리가 의도한 업무가 구현됐다"는 다른 사실이다. 테스트 자체가 잘못된 기대값을 확인하고 있을 수 있다.

그래서 작업 순서를 이렇게 둔다.

1. 기획자와 개발자가 핵심 업무 규칙과 수용 기준을 합의한다.
2. AI가 이를 바탕으로 테스트와 구현 초안을 만든다.
3. 중요한 테스트 데이터와 기대 결과는 사람이 검토·승인한다.
4. AI가 이후 코드를 고치더라도 승인된 기대 결과는 바꾸지 않는다.
5. 업무 정책이 바뀔 때만 승인된 기준과 관련 테스트를 함께 고친다.

규칙과 사례와 미해결 질문을 나눠 발견하는 방법은 Cucumber의 [Example Mapping](https://cucumber.io/docs/bdd/example-mapping/)을 따른다.

## 기획자에게 남는 일

좋은 명세가 코드 품질까지 보장하지는 않는다. 요구사항을 충족하면서도 같은 기능을 중복 구현하거나 도메인 경계를 무시한 코드가 나온다. 그래서 결과는 업무 적합성, 기술적 품질, 운영 적합성으로 나눠 본다. 업무 적합성은 기획자와 현업의 몫이 크고, 나머지는 엔지니어링과 함께 정한다.

명세의 가치가 결함을 더 찾는 데 있지도 않다. InfoQ에 실린 소규모 실험에서 명세를 받은 리뷰어는 명세 없이 리뷰한 사람보다 결함을 더 찾아내지 못했다. 대신 지적한 문제를 특정 요구사항에 연결하는 능력이 좋아졌고, 검토 시간은 더 들었다. [When Spec-Driven Development Pays Off](https://infoq.com/articles/when-spec-driven-development-pays-off) 명세의 가치는 책임 추적성과 합의된 판단 근거에 있다.

AI는 사용자 스토리, 예외 조건, 테스트 케이스를 빠르게 늘려 준다. 그래도 다음 판단은 남는다. 실제 사용자의 문제와 우선순위가 무엇인지. 여러 정책 중 무엇이 조직의 업무와 위험 수준에 맞는지. 이번 범위에서 뺄 기능은 무엇인지. 어떤 동작을 절대 허용하면 안 되는지. 어느 정도의 증거가 있어야 출시할 수 있는지. 요구사항을 쓰는 일은 상당 부분 자동화되어도, 그 요구사항이 옳은지 결정하고 승인하는 책임은 남는다.

## 현재의 생각

AI가 코드를 빠르게 쓸수록 중요한 것은 요구사항의 분량이 아니라, 무엇을 구현해야 하는지에 대한 합의와 무엇이 잘못된 결과인지 판단할 기준이다. 좋은 요구사항은 사용자의 문제, 업무상 지켜야 할 규칙, 결정되지 않은 조건, 검증 가능한 결과를 구분한 문서다. AI는 요구사항을 구현할 수 있지만, 그 요구사항이 문제를 올바르게 정의했는지 판단하는 일까지 대신하지는 않는다.

아직 하지 않은 것이 있다. 위 틀로 모호한 요구사항 하나를 검증 가능한 명세로 바꾸고, 같은 AI 도구에 전후를 각각 넘겨 결과가 어떻게 달라지는지 비교해 보지 않았다. 다음 기능을 만들 때 그 비교부터 한다.

## 남은 질문

- 승인된 기대값을 AI가 바꾸지 못하게 하는 장치는 무엇이 현실적일까? 파일 보호, 리뷰 규칙, 테스트 데이터 분리 중 혼자 개발할 때도 지켜지는 방식이 필요하다.
- 명세 수준을 위험에 따라 다르게 가져갈 때, 그 판단을 팀이 같은 기준으로 하려면 무엇을 적어 두어야 할까?

## 참고

- [Birgitta Böckeler, Understanding Spec-Driven Development: Kiro, spec-kit, and Tessl](https://www.martinfowler.com/articles/exploring-gen-ai/sdd-3-tools.html)
- [Matteo Vaccari, Tests as data](https://martinfowler.com/articles/tests-as-data.html)
- [Spec-Driven Development as Prescribed and as Practiced](https://arxiv.org/abs/2608.25202)
- [SpecFirst: Behavioral Specification Elicitation as a First-Class Step in Agent-Based Program Synthesis](https://arxiv.org/abs/2607.27167)
- [InfoQ, When Spec-Driven Development Pays Off](https://infoq.com/articles/when-spec-driven-development-pays-off)
- [OpenAI, Harness Engineering](https://openai.com/index/harness-engineering)
- [Vercel, Spec-driven development](https://vercel.com/i/spec-driven-development)
- [GitHub Spec Kit](https://github.com/github/spec-kit)
- [Kiro, Specs](https://kiro.dev/docs/specs/)
- [Anthropic, Claude Code best practices](https://www.anthropic.com/engineering/claude-code-best-practices)
- [Mavin et al., Easy Approach to Requirements Syntax, IEEE RE 2009](https://doi.org/10.1109/RE.2009.9)
- [Cucumber, Example Mapping](https://cucumber.io/docs/bdd/example-mapping/)
- [Cucumber, Gherkin reference](https://cucumber.io/docs/gherkin/reference/)
- [Atlassian, Definition of Done](https://www.atlassian.com/agile/project-management/definition-of-done)

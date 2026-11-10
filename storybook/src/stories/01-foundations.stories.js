import { status } from "../components.js";

export default { title: "기초 요소" };

const COLORS = [
  ["--paper", "#FFFFFF", "페이지 바탕"],
  ["--paper-2", "#F5F6F8", "띠 · 표 머리 · 코드"],
  ["--ink", "#111418", "제목 · 굵은 선 (18:1)"],
  ["--text", "#2B2F36", "본문 (13:1)"],
  ["--muted", "#545B66", "보조 · 메타 (7:1)"],
  ["--faint", "#6F7682", "날짜 등 (4.6:1)"],
  ["--rule", "#E4E7EB", "구분선"],
  ["--accent", "#1B4F8F", "링크 · 번호 · 주요 버튼 (8:1)"],
  ["--accent-soft", "#EDF3FA", "선택 영역"],
  ["--ok", "#1E6B45", "운영 적용 · 출시 표시"],
];

export const 색 = {
  render: () => `<ul style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px;list-style:none;padding:0;margin:0">
${COLORS.map(([v, hex, use]) => `<li style="margin:0;font-size:13px;line-height:1.5"><i style="display:block;height:56px;margin-bottom:8px;border:1px solid var(--rule);border-radius:4px;background:var(${v})"></i><b style="color:var(--ink)">${v}</b><br><code>${hex}</code><br>${use}</li>`).join("")}
</ul><p style="margin-top:24px;font-size:13px;color:var(--muted)">대비는 흰 바탕(#FFFFFF) 기준. 본문·보조 글자는 모두 WCAG AA(4.5:1) 이상입니다.</p>`,
};

const TYPE = [
  ["Display 30–46", "display", "현장에서 발견한 문제를 사용자 흐름과 기능으로 설계하는 기획자"],
  ["H2 24–30", "h2", "대표 프로젝트"],
  ["H3 20", "h3", "의약품 도매몰 주문·박스 상태 연동"],
  ["Lead 19", "lead", "현장에서 문제를 찾아 문서로 고정합니다."],
  ["본문 17", "p", "담당자가 도매몰 주문을 Excel로 내려받아 어드민에 직접 입력하고 있었습니다."],
  ["보조 15", "small", "표 · 목록 · 카드 설명"],
  ["캡션 13", "caption", "2026.01 – 02 · 본인: 기획·검증 · 구현: 개발팀"],
];

export const 글꼴 = {
  name: "글꼴 · 크기",
  render: () => TYPE.map(([k, t, s]) => {
    const el = {
      display: `<span class="display" style="display:block;margin:0">${s}</span>`,
      h2: `<h2 style="font-size:var(--fs-h2)">${s}</h2>`,
      h3: `<h3 style="font-size:var(--fs-h3)">${s}</h3>`,
      lead: `<p class="lead" style="margin:0">${s}</p>`,
      p: `<p style="margin:0">${s}</p>`,
      small: `<p style="margin:0;font-size:var(--fs-small)">${s}</p>`,
      caption: `<p style="margin:0;font-size:var(--fs-caption);color:var(--muted)">${s}</p>`,
    }[t];
    return `<div style="display:grid;grid-template-columns:9rem 1fr;gap:16px;align-items:baseline;padding:12px 0;border-bottom:1px solid var(--rule)"><small style="color:var(--muted)">${k}</small>${el}</div>`;
  }).join("") + `<p style="margin-top:16px;font-size:13px;color:var(--muted)">서체: Pretendard Variable 하나. 숫자는 같은 서체의 고정폭 숫자(tabular-nums).</p>`,
};

export const 간격 = {
  name: "간격 · 폭",
  render: () => [4, 8, 12, 16, 24, 32, 48, 72, 112].map((n, i) =>
    `<div style="display:flex;align-items:center;gap:16px;margin:6px 0;font-size:13px"><i style="display:block;height:10px;width:${n}px;background:var(--accent)"></i>s${i + 1} · ${n}px</div>`).join("") +
    `<p style="margin-top:16px;font-size:13px;color:var(--muted)">페이지 최대 1120px · 본문 680px · 목차 200px · 카드 최소 320px</p>`,
};

export const 상태표시 = {
  name: "상태 표시 어휘",
  render: () => `<p style="max-width:640px">프로젝트가 어디까지 갔는지 카드와 상세에 항상 같은 말로 표시합니다.</p>
<ul style="list-style:none;padding:0;display:grid;gap:12px">
<li>${status({ label: "운영 적용", kind: "live" })} — 실제 업무·서비스에 쓰임</li>
<li>${status({ label: "내부 사용 · 시범 운영", kind: "live" })} — 내부에서 쓰이고 고객 시범 운영</li>
<li>${status({ label: "출시 후 운영 중단", kind: "other" })} — 스토어 출시 후 서버 중단</li>
<li>${status({ label: "베타 테스트 단계", kind: "other" })}</li>
<li>${status({ label: "교육 실습", kind: "edu" })} — 교육 과정 과제</li>
<li>${status({ label: "프로토타입", kind: "other" })} · ${status({ label: "개인 사용", kind: "other" })} · ${status({ label: "기획 · 디자인 단계", kind: "other" })}</li>
</ul>`,
};

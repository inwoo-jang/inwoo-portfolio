/* 영어판 — 이미지 속 한글을 영어로 옮긴 문구 (script/image-en.js가 사용). 이미지 경로 → 위에서 아래 순서의 문구 */
window.IMAGE_TEXT_EN = {
  "media/portfolio/possessed-flow.png": [
    "POSSESSED — Did the agent act within the permitted scope?",
    "Product planning and design / In progress",
    "The model proposes; code controls execution.",
    "Set experiment conditions — request, allowed and denied tools, approval conditions",
    "AI proposes an action — tool-call proposal (PROPOSED)",
    "Policy gate — check rules and approval state (POLICY_CHECKED)",
    "Allowed → mock execution (EXECUTED). Real external services are not changed.",
    "Denied → block execution (BLOCKED). Record the reason.",
    "Approval required → hold execution. Do not execute before approval (BLOCKED, with an approval-required reason).",
    "Record tool-call attempts, decisions and execution. Inspect the timeline → change the policy → rerun the same scenario.",
    "Next.js · TypeScript · SQLite · OpenAI Tool Calling",
    "Early implementation. End-to-end flow and live LLM experiment results are not yet validated.",
    "Resuming after approval is outside the verification scope of this diagram."
  ],
  "media/notes/ai-failure-pipeline-clean.png": [
    "How an AI agent processes a request",
    "01 Interpret the user's question — identify intent and the information needed",
    "02 Search · Retrieval — find relevant documents and evidence",
    "03 Tool calls · Tool Calling — query external APIs and internal systems",
    "04 Policy and permission check — decide what's allowed and whether approval is needed",
    "05 LLM answer generation — combine the evidence and write the response",
    "06 Final response — deliver the result to the user",
    "Note: An example structure for explanation. Real agents may repeat retrieval and tool calls or skip some steps."
  ],
  "media/notes/ai-failure-triage-clean.png": [
    "Error detected in the final answer — user report or automated evaluation",
    "Was the right evidence retrieved? — compare retrieved documents with the correct evidence",
    "No → Investigate retrieval and data — check the index, search terms, missing documents, freshness",
    "Yes → Investigate generation and context — check the prompt, conflicting documents, how the model interpreted them",
    "Does it reproduce under the same conditions? — pin versions · run repeatedly · compare by condition",
    "Fix → Regression test → Production monitoring — also confirm the fix doesn't cause other problems"
  ],
  "media/portfolio/ai-coach-side.jpg": [
    "Header: sLLM · PEFT Guide — SKALA · sLLM implementation and fine-tuning",
    "Tabs: Intro · Textbook Day1 · Textbook Day2 · Guide · Exercises · Dictionary · Quiz · Mastery · Sub-notes · Notes · My",
    "Contents sidebar: Day 1 sections (LLM pipeline overview, MLM vs CLM, LLM vs sLLM, sLLM use cases, Fine-tuning strategy, project structure, PEFT basics exercise, Day 1 wrap-up)",
    "Main: 5. Fine-tuning strategy — Full fine-tuning and PEFT",
    "Bullets: difference between full fine-tuning and PEFT; main PEFT methods (LoRA, Adapter, Prefix-Tuning, Prompt-Tuning); per-scenario methods and example code on the next slide",
    "Callout \"If you're new\": explains PEFT (freeze original parameters, train only a small part) and why full retraining risks catastrophic forgetting",
    "Table: Scenario / Goal / Suitable method — domain knowledge (HR document summaries) → LoRA / Adapter; very limited resources (on-device) → Prompt Tuning / Prefix Tuning",
    "Right: Question panel — Quiz (3 questions) · Applied question · Explain simply · My question history",
    "AI explanation card for \"5. Fine-tuning strategy\": Question 1 asks to explain the notes in a friendly tone without missing key points",
    "Answer body: summarizes PEFT vs full fine-tuning and catastrophic forgetting, a scenario-to-method table, and how the exercise combines domain data with instruction tuning + LoRA",
    "Next section: LoRA — differences between textbook code and exercise code (train_lora.py)"
  ],
  "media/portfolio/classtrack-dashboard.jpg": [
    "Dashboard · button: Add course",
    "Courses — In progress 1 · Upcoming 1 · Completed 3 · Total 5 (View all →)",
    "Assignments — In progress 2 · Not started 1 · Completed 3 · Past due 1 (View all →)",
    "Courses in progress: LLM Engineering — LLM prompt design, 2/3, sample instructor · Room A",
    "Assignments in progress: Vue 3 frontend exercise — build the course list screen, due Nov 5 6:00 PM, 4 days overdue",
    "LLM prompt design — RICE prompt comparison exercise, due Nov 11 6:00 PM, D-2",
    "Calendar — November 2026 (← → Today), Sun–Sat",
    "Calendar entries: Vue 3 frontend exercise 1/4–4/4, Data analysis and visualization 1/3–3/3, LLM prompt design 1/3–3/3, Cloud deployment exercise 1/4–4/4"
  ],
  "media/portfolio/classtrack-dev.jpg": [
    "Top note: preflight (OPTIONS) responses are cached for 1 hour; allowed origins come from the CORS_ALLOWED_ORIGINS env var (comma-separated, * wildcard allowed)",
    "API — 20 endpoints · descriptions 20/20",
    "Columns: Method · Path · Function · Handler · AOP",
    "/courses group:",
    "GET /api/courses — list courses (with assignment counts)",
    "POST /api/courses — create course · DELETE /api/courses/{courseId} — delete course (and its assignments)",
    "GET /api/courses/{courseId} — course detail · PUT — update course (all fields except PK)",
    "GET /…/assignments — assignments per course · POST — create assignment",
    "DELETE /…/assignments/{assignmentId} — delete assignment · GET — get one assignment",
    "PATCH /…/assignments/{assignmentId} — change assignment status and deliverable link"
  ],
  "media/portfolio/demo-triage.png": [
    "Sidebar: Future Work-Experience Program Ops — attendance, allowance checks, follow-up support",
    "Menu: Today's tasks · Participants · Action history · By mentor",
    "Header: Today's tasks — right after login, prioritized by who needs action · mock · Connect local Claude · or Claude API key",
    "Card: Amount that depends on today's follow-up — ₩16,631,250 (allowances that can be added if attendance is pushed up now vs. keeping the current rate)",
    "Card: Amount on hold due to missing documents — ₩4,050,000 (attended but payment blocked without documents; payable once submitted)",
    "Stats: 300 total participants · 229 attendance nudge targets · 10 missing documents · 8 unrecoverable (not action targets)",
    "List: Who to look at first today · 232 people",
    "Sort: Intervention value ↑ · Attendance rate · Name; filters: Payment confirmation week (4–8) · Show contacts · Missing documents only",
    "Row (each person): [name], birth date, program (job training / work experience), group, current week, priority",
    "Row status: Attendance nudge — can reach up to 90%+ / 70–90% etc.; current attendance by program",
    "Right column: Intervention value (e.g. ₩450,000), max amount, Ends D-3/D-6 weeks, Not handled"
  ],
  "media/portfolio/demo-vibe.png": [
    "Header: Vibe Coding Guide — Learn · My projects · Prompt dictionary · References · Glossary · Log in",
    "Eyebrow: For people just starting to code",
    "Headline: What to tell AI, and how",
    "Body: vibe coding isn't \"AI figures it out\"; deciding what to build, splitting the work, and checking results is still your job — this guide walks that order in 8 steps from planning to deployment",
    "Buttons: Create my project and start · See the curriculum first",
    "Steps: 00 Prep · 01 Planning · 02 Design · 03 Build · 04 Data · 05 Security · 06 Deploy · 07 Maintenance",
    "Sections: One cycle with your own project · Prompts for each step · How to get unstuck"
  ],
  "media/portfolio/eduup-home.png": [
    "Header: SK AX · EDU:UP — Home · Categories · My page · search (data analysis, leadership, languages) · points 600,000P · [name] · Log out",
    "Banner (2026 Q3 education benefit): If you haven't started what you planned to learn this year",
    "Banner body: apply for internal and external courses with company-allocated education points; priorities are sorted by your job and growth goals · button: Browse content",
    "Side panel: My interests — priority of education areas: 01 Cloud · Security, 02 Planning · Design, 03 Development · Edit settings",
    "Section: Personalized — Recommended for [name]",
    "Card: Information security basics to protect your account (Cloud · Security) — \"You picked this area as interest #1\" · 32,000P",
    "Card: Clean Code (Development) — \"An area 5 colleagues on the data platform team picked\" · 33,000P",
    "Card: Build your own work system with Notion (Planning · Design) — \"You picked this area as interest #2\" · 34,000P",
    "Card: The art of Python coding (AI · Data) — \"An area 5 colleagues on the data platform team picked\" · 28,000P",
    "Each card shows an application count"
  ],
  "media/portfolio/eduup-spec-conflicts.jpg": [
    "GitHub file view: Agile_MSA_0826 / docs / SPEC_CONFLICTS.md",
    "Bullets: reference document — origin/main as of 2026-08-27 (SRS v3.3 · UC · TC); application rule — if implementation and docs differ, follow the docs; conflicts between docs are decided below",
    "Table columns: ID · Issue · Status · Linked TODO",
    "SC-1 Number of recommendations 2 vs 3 vs 4 — Resolved (4: 2 courses + 2 books), UC-05 updated",
    "SC-2 Education areas 5 vs 6 vs 9 — Resolved, docs set to 9 (backend enum remains, A-2)",
    "SC-3 Survey question set — Decided, interest area promoted to a formal question (A-7)",
    "SC-4 Free-text AI interpretation vs \"no LLM\" — Decided, free-text question removed (A-7)",
    "SC-5 Onboarding gate vs \"don't restrict browsing\" — Decided, auto modal once + set later",
    "SC-6 to SC-10: point balance storage, FAILED status in enrollments.status, recommendation failure message, block vs FAILED on low balance, 600,000P quarterly points — all resolved or applied",
    "SC-11~16 Implementation constants and screens not in docs — partly resolved, rest in tables below",
    "Remaining open: SC-3 · SC-4 · SC-11 · SC-12 · SC-15",
    "SC-1. Number of recommendations and allocation rules — table: Source · Content (SRS.md FR-5, USE-CASES.md UC-05 quotes)"
  ],
  "media/portfolio/gwangyebu-app-home.png": [
    "Header: Gwangyebu · Edit home",
    "Welcome! We'll help you remember and return the kindness you received.",
    "Buttons: + Add event · + Add person",
    "Upcoming events: D-10 [name] — first birthday, 2026.11.12, hotel venue, tag: High school; D-20 [name] — wedding, 2026.11.22, wedding hall, tag: College friend",
    "Upcoming birthdays: D-13 [name] (coworker) — Nov 15; D-24 [name] (friend) — Nov 26, 31st",
    "This year's giving: 2026 sent 1 · received 1 (View ledger)",
    "Entry: [name] — helped prepare a presentation",
    "Bottom tabs: Home · People · My events · Ledger · My"
  ],
  "media/portfolio/gwangyebu-app-ledger.png": [
    "Title: Giving ledger",
    "Tabs: Ledger · Gifts",
    "Note: Records of cash given and received, such as event money and condolence gifts",
    "Period: This year · All time · Custom",
    "Filters: All · Only ones I sent · Only ones I received · All relationships",
    "Summary: Sent 3 (KRW 200,000) · Received 7 (KRW 755,000)",
    "Table: Name · Sent · Received — rows for [name] with relationship (client, coworker, friend), count and amount each way",
    "Bottom tabs: Home · People · My events · Ledger · My"
  ],
  "media/portfolio/gwangyebu-app-persons.png": [
    "Title: People",
    "Search by name, tag, or Instagram ID",
    "Relationship filters: All · Family · Relatives · Friends · Coworkers · Clients",
    "Tags: # Client · # High school · # College friend · # SKALA Team 4",
    "Dropdowns: MBTI all · Sort by name",
    "10 people",
    "Cards: [name] · relationship (friend / coworker / family) · MBTI · tag (college friend, company Team A, high school) · Sent N / Received N",
    "Floating button: +",
    "Bottom tabs: Home · People · My events · Ledger · My"
  ],
  "media/portfolio/gwangyebu-erd.png": [
    "Tables (English names): tags, users, events, person_tags, persons, gifts",
    "Group labels: users = Account · tags, person_tags, persons = People · events, gifts = Giving",
    "Relationships: users owns tags, persons, events; person_tags links tags (tag link) and persons (tag attached)",
    "events → gifts: records per event; persons → gifts: giving; events.person_id: the other person's event",
    "Legend: Gwangyebu ERD — PostgreSQL · 6 tables · CASCADE on owner delete",
    "Key colors: Account · People · Giving; PK primary key · FK foreign key · UQ unique · NN NOT NULL",
    "1:N (bar = 1, crow's foot = N)",
    "Notes: amounts stored only in gifts · events.person_id NULL = my own event · one guest-book line = 1 RECEIVED gift · deleting an event sets gifts.event_id to NULL"
  ],
  "media/portfolio/gwangyebu-flow-deck.png": [
    "Core flow ① · Check past records",
    "S04 Relationship list —(person card)→ S06 Relationship detail —(+ Record)→ S07 Record popup —(Save)",
    "Saving returns you to the S06 relationship detail timeline.",
    "Core flow ② · My event guest book",
    "S08 My events list —(event card)→ S09 My event guest book —(name · amount, Enter)→ S06 Relationship detail",
    "Each guest-book line becomes a received record for that person."
  ],
  "media/portfolio/gwangyebu-uiflow.png": [
    "Title: Gwangyebu UI flow — 11 screens · layout · main buttons · navigation",
    "S01 Log in (logo and intro, email, password, Log in, Sign up) → Log in → S03 Home",
    "S01 ↔ S02 Sign up (email, password, confirm, phone, consent: all / required terms / required privacy / optional marketing, Sign up) — Sign up / Signup complete",
    "S03 Home: Edit home, + Add event →S07, + Add relationship →S05, upcoming events →S06, upcoming birthdays →S06, this year's giving (sent N / received N, View ledger →S10)",
    "S03 → Relationships tab → S04 Relationship list (search by name, tag, Instagram; filters: type, tag, MBTI; person rows with sent/received counts; + button)",
    "S04 → Relationship card → S06 Relationship detail ([name], Edit →S05, relationship/MBTI/tag, memo, sent 1 / received 1, upcoming reminder, Giving / Events tabs, + Record, history)",
    "S06 → + Record → S07 Record popup (giving with [name]: Sent / Received, Event / Gift, reference: received history, amount or item, date and reason, linked event, Save) → Save → back to S06",
    "S05 Add/edit relationship (Save; name, relationship chip, tags + existing tags, business card photo, Instagram link, more: birthday, MBTI, food preference, memo)",
    "Bottom tabs (My · Ledger · My events) → S11, S10, S08",
    "S11 My page (account info: email, phone, password [change]; tag management; Log out →S01; Delete account)",
    "S10 Giving ledger (Events / Gifts ♥; period: all / sent only / received only; sent N / received N; per-person rows →S06)",
    "S08 My events list (+ My event; e.g. our wedding — 2024.05.18, received from 7 · KRW 755,000; father's funeral) → Select event → S09 My event guest book (our wedding: 7 total · KRW 755,000; name/amount rows; name, amount, Enter)",
    "Sticky note: Core flows — Flow 2: relationship list → check what you received in detail → + Record → Save; Flow 3: my events → enter only name and amount in the guest book → Enter",
    "Legend: core flow · general navigation · →S05 = screen the button opens"
  ],
  "media/portfolio/jikim-home-card.jpg": [
    "JEEKIM Pharmacy (sample pharmacy name) — support and settings icons",
    "Banner: How much will our pharmacy get back? — Check your tax refund in 1 minute › (1/3)",
    "Button: Scan a prescription",
    "Button: Scan a medicine"
  ],
  "media/portfolio/jikim-home.jpg": [
    "Home screen",
    "Daily sales, purchases, claim counts, and dispensing fees — checked in real time",
    "JEEKIM Pharmacy (sample pharmacy name) — support and settings icons",
    "Banner: How much will our pharmacy get back? — Check your tax refund in 1 minute › (1/3)",
    "Buttons: Scan a prescription · Scan a medicine",
    "September profit and loss — Details",
    "Dispensing fees · 3,497 cases",
    "Claim cuts, holds, refunds, etc. · 5 cases",
    "Card sales · 820 approvals",
    "Card payments not yet received · 7 cases",
    "(Each row shows a sample amount in KRW)",
    "September pharmacy ledger — Details",
    "Tabs: Sales · Purchases · Expected deposits"
  ],
  "media/portfolio/jikim-rx-card.jpg": [
    "Prescription — Send claim button, warning and close icons",
    "Tabs: Health insurance · Medical aid · Industrial accident insurance · Auto insurance · Other",
    "Issued — 01010 · 2022.10.29",
    "Patient — [blurred]",
    "Clinic — 01234567 · JK ENT Clinic (sample)"
  ],
  "media/portfolio/jikim-rx-ocr.jpg": [
    "Prescription auto-entry",
    "Top-performing AI-OCR enters prescriptions instantly — no barcode compatibility worries",
    "Prescription — Send claim button, warning and close icons",
    "Tabs: Health insurance · Medical aid · Industrial accident insurance · Auto insurance · Other",
    "Fields: Issued · Patient [blurred] · Clinic (JK ENT Clinic, sample) · License · Diagnosis (+) · Exemption code — None · Notes — Powdered dispensing",
    "Prescribed drugs: 7",
    "Table headers: Drug code · Drug name · Per dose · Per day · Total days · Copay",
    "(3 sample drug rows with delete icons)",
    "Drug cost",
    "Patient copay — KRW 1,200",
    "Dispensing fee — KRW 91,600"
  ],
  "media/portfolio/jikim-tax-tab.jpg": [
    "Tax",
    "Your pharmacy's business at a glance, based on real data",
    "Tax — Check tax schedule button",
    "Tabs: Profit and loss · Dispensing fees · Claims",
    "Yesterday's sales (sample amount) ›",
    "Expected deposits today (sample amount) › — Alert: There are unpaid card payments!",
    "When is data updated?",
    "Card: Add staff payroll! — Link national social insurance and manage recurring expenses ›",
    "This month's profit (sample amount) — vs. last month, up (sample amount)",
    "Total sales (sample amount) ›",
    "Drug purchases (sample amount) ›"
  ],
  "media/portfolio/jikim-tile-client.jpg": [
    "JEEKIM (logo)",
    "Client management · Engagement contracts"
  ],
  "media/portfolio/jikim-tile-samil.jpg": [
    "JEEKIM (logo)",
    "× Samil PwC · AI tax consultation for pharmacies"
  ],
  "media/portfolio/jikim-tile-tax.jpg": [
    "JEEKIM (logo)",
    "Comprehensive income tax estimate — product planning"
  ],
  "media/portfolio/mailbot-discord.jpg": [
    "Discord post by mail-bot (App), 2026.6.8",
    "Mail summary for 2026.06.08",
    "Urgent / reply now — None",
    "Needs checking or action — Google | Notice that Google account data is shared with Perplexity — confirm it was my own action",
    "Figma comments — [name] board | reply in thread + mentions (6/6, 6/7, 3 total)",
    "Figma comments — [name] design board | mention (6/7)",
    "Figma comments — Figma system | design board | batch notice of 3 new comments (6/7)",
    "For reference — Grammarly | Pro 50% off promotion",
    "For reference — Duolingo | English course encouragement notice",
    "For reference — AliExpress | review request"
  ],
  "media/portfolio/marketdesk-flow-card.jpg": [
    "← Flow board",
    "AI ‹ 2026.07 ›",
    "Trend for this period",
    "Headline: Worries about AI data center overinvestment shook the stock market, but strong HBM and memory earnings and the value chain spreading into power, components, and shipbuilding held up the trend",
    "Key points",
    "Body: bullet summaries of July market news on AI data centers and memory (KOSPI, Nvidia, Samsung, SK hynix, Micron), tagged NEW or \"2 months running\" with source counts"
  ],
  "media/portfolio/marketdesk-flow.jpg": [
    "Top nav: Flow board · My stocks · Industry reports · Company reports · News · Saved — Pro, user account",
    "← Flow board",
    "AI ‹ 2026.07 ›",
    "Trend for this period",
    "Headline: Worries about AI data center overinvestment shook the stock market, but strong HBM and memory earnings and the value chain spreading into power, components, and shipbuilding held up the trend",
    "Key points",
    "Body: 5 bullet summaries of July AI and memory news (data center investment, memory prices, HBM, value chain, telecom and IT AI infrastructure), each tagged NEW or \"2 months running\" with source counts",
    "Mixed signals",
    "Body: 1 bullet on record semiconductor exports vs. weak job creation and US big tech capital efficiency",
    "Trend risk signals",
    "Conditions under which the current trend could break. Signals to watch, not investment advice.",
    "Body: 3 bullets on risks (data center resale, AI capital shifting from GPU to memory, PCB and memory supply and trade friction)"
  ],
  "media/portfolio/marketdesk-home.jpg": [
    "Top nav: Flow board · My stocks · Industry reports · Company reports · News · Saved — Pro, user account, notifications, settings",
    "Lenses: Jobs · Planning/PM · Investing (edit) — Pro · Unlimited analysis",
    "Flow board — Timeline summaries of industry, company, and news trends →",
    "My stocks — Unrealized gain +KRW 644,219 (+54.4%) →",
    "Search — Search titles or subtitles · Reset",
    "My industries (7) · Sort — + Upload",
    "Industry tiles: AI · Semiconductors · IT and software · Real estate · Petrochemicals · Finance · Robotics",
    "Companies I follow (2): Samsung group · SK group"
  ],
  "media/portfolio/order-sync-diagram.svg": [
    "Pharmaceutical wholesaler’s ordering platform — order and box status sync (diagram)",
    "External · Wholesale mall — 1 order: tracked by order number; item lines 1 · 2",
    "Link key (planned) — Order number + item line → internal box ID; look up by order number in the admin",
    "Internal · Run by box — Box A: Picked up · Box B: Pickup postponed",
    "Only some boxes picked up → maps to the mall's \"partially shipped\" status",
    "Shipping status is pushed automatically from the internal admin to the mall",
    "Bugs found in testing (reported to the dev team): ① Orders missed at the edge of the API call time window ② In multi-box orders, shipping info applied only to the first box",
    "Diagram · Not an actual screen · Built by: dev team"
  ],
  "media/portfolio/payroll-calc.jpg": [
    "01 Different pay terms for every employee — still recalculating every time?",
    "Handle complex employment types and pay types in one place.",
    "Cut the repeated calculating and rechecking between Excel and notes!",
    "Employee info — Company: JEEKIM Pharmacy · Name: [sample employee] · Hired: 2026-01-01 · Type: Full-time · Payday: 2026-10-25",
    "+ Pay items — Taxable: Base pay (excl. meal allowance) · Taxable: Extra allowance · Taxable: Position allowance · Non-taxable: Meal allowance",
    "→ Calculation result — Total pay · Total deductions · Net pay"
  ],
  "media/portfolio/payroll-flow.jpg": [
    "Monthly payroll, made simple with this flow",
    "Register employees — Enter employee info and pay terms.",
    "↓ Auto-calculate pay — Calculated from the registered info.",
    "↓ Review payslip — Check payments and deductions.",
    "↓ Send to employees — Deliver the reviewed payslip."
  ],
  "media/portfolio/payroll-slip.jpg": [
    "02 Simple input, automatic calculation!",
    "Accurate auto-calculation lets you apply national social insurance premiums to payroll easily!",
    "See payments and deductions together.",
    "[sample employee] (Full-time) — October 2026 payslip",
    "Payments — Taxable: Base pay (excl. meal allowance) · Extra allowance · Position allowance · Non-taxable: Meal allowance — Total pay",
    "Deductions — National pension · Health insurance · Employment insurance · Industrial accident insurance · Income tax · Local income tax — Total deductions",
    "Net pay — (amount) KRW"
  ],
  "media/portfolio/payroll-types.jpg": [
    "03 Complex employment types and varied pay types, handled in one place",
    "Full-time, day laborer, freelancer, joining or leaving, any employment status — no problem!",
    "Pre-tax, after-tax, hourly, monthly — set up employees on any pay type easily.",
    "Sample employee cards: Full-time (hired 23.09.27) · Freelancer (hired 25.01.01) · Day laborer (hired 25.01.01)"
  ],
  "media/portfolio/qlink-mobile.png": [
    "Search titles, summaries, tags",
    "Folder chips: All · Work · Study · Music · Content",
    "Sort: Newest · Oldest · A–Z · Select",
    "Weekday work BGM — music.youtube.com · 8 hours ago — folder: Music",
    "IG hot-spot cafés — instagram.com · 8 hours ago — folder: Café tour",
    "Insta café interiors — instagram.com · 12 hours ago — folder: Content",
    "Algorithm problem set — leetcode.com · 1 day ago — folder: Study",
    "To-do (partly visible): One problem a day — weekdays 21:00 · next 11/02 21:00",
    "Bottom tabs: Home · Folders · To-dos · Settings"
  ],
  "media/portfolio/qlink-web.png": [
    "Search titles, summaries, tags",
    "Folder chips: All · Work · Study · Music · Content",
    "Sort: Newest · Oldest · A–Z · Select",
    "Weekday work BGM — music.youtube.com · 8 hours ago — folder: Music",
    "IG hot-spot cafés — instagram.com · 8 hours ago — folder: Café tour",
    "Insta café interiors — instagram.com · 12 hours ago — folder: Content",
    "Algorithm problem set — leetcode.com · 1 day ago — folder: Study",
    "To-do: Solve one problem a day — weekdays 21:00 · next 11/02 21:00",
    "To-do: One mock interview on weekends — weekends 10:00 · next 11/07",
    "+1 more",
    "Bottom tabs: Home · Folders · To-dos · Settings"
  ],
  "media/portfolio/quiket-app-archive.png": [
    "Your own archive, built up by subject",
    "SQLD — Exam and certification prep",
    "Certification — SQLD",
    "Upload materials · Make a quiz",
    "SQLD certification exam — 2026.06.27 — D-26",
    "My materials — See all quizzes ›",
    "Chapter 1 — SQLD basics — 3 parts"
  ],
  "media/portfolio/quiket-app-upload.png": [
    "Headline: Your own exam, made from your lecture notes",
    "Screen title: Add material",
    "Tabs: File · Image · Text",
    "Upload box: Select a file to upload — PDF, up to 50MB",
    "File row: filename.pdf · {n}KB · Upload complete (delete icon)"
  ],
  "media/portfolio/quiket-card.png": [
    "App Store listing: Quiket - AI quiz generation, exam study",
    "Developer: [name]",
    "Button: Open",
    "1 rating — 5.0",
    "Age rating — All ages",
    "Category — Education",
    "Developer — [name]"
  ],
  "media/portfolio/quiket-demo-chapters-crop.jpg": [
    "Screen title: Review material",
    "We organized your material so it's easy to read",
    "AI read the material and split it into chapters by topic. You can edit anything you don't like.",
    "Chapter name — Principles of Marketing (edit)",
    "Parts (4):",
    "1. STP strategy overview",
    "2. Segmentation",
    "3. Targeting — choosing a target market",
    "4. Positioning"
  ],
  "media/portfolio/quiket-demo-chapters.jpg": [
    "Screen title: Review material",
    "We organized your material so it's easy to read",
    "AI read the material and split it into chapters by topic. You can edit anything you don't like.",
    "Chapter name — Principles of Marketing (edit)",
    "Parts (4):",
    "1. STP strategy overview",
    "2. Segmentation",
    "3. Targeting — choosing a target market",
    "4. Positioning",
    "Button: Done"
  ],
  "media/portfolio/quiket-demo-upload-crop.jpg": [
    "Screen title: Add material",
    "Tabs: File · Image · Text",
    "Upload box: Select a file to upload — PDF, up to 50MB"
  ],
  "media/portfolio/quiket-demo-upload.jpg": [
    "Screen title: Add material",
    "Tabs: File · Image · Text",
    "Upload box: Select a file to upload — PDF, up to 50MB",
    "Button (disabled): Next"
  ],
  "media/portfolio/study-note-serving.jpg": [
    "Sidebar: Serving & AIOps notes — SKALA · 09.30–10.02",
    "Menu: Course intro and exercise guide (Home) · Model serving basics (Day 1) · MLOps pipeline (Day 2) · AIOps pipeline (Day 3) · FastAPI exercise code · Fill-in-the-blank exercises · HAIC project code · Writing the sub-note",
    "Sidebar: On this page — class schedule, how it runs, two kinds of evaluation, exercise scope, actual milestones, detailed schedule, evaluation link, sub-note (per person, Day 1–3)",
    "Sidebar buttons: Notepad · Print",
    "Title: Model serving & AIOps setup",
    "Intro: a study note that builds one model predicting the next-day close of a fictional stock, HAIC, step by step on one serving_app/ over 3 days: serving → MLOps → AIOps",
    "Chips: 3 days · 24 hours · Theory 50% · Practice 50% · [ collapse sidebar · M notepad",
    "Day 1 — Model serving basics: inference server with FastAPI (routing, Pydantic validation, health check, Lazy/Eager) · Open →",
    "Day 2 — MLOps pipeline: MLflow experiment tracking and registry, RMSE $4 gate, Docker containerization · Open →",
    "Day 3 — AIOps pipeline: monitoring metrics, drift detection, automatic retrain/redeploy loop · Open →",
    "Card: Write the sub-note — fill in the fields in submission format 1–5, auto-saved, export to Markdown and submit on Slack",
    "Card: FastAPI exercise code — fastapi_practice/ analysis of 7 examples, actual run results, HAIC structure mapping, 4 extension tasks",
    "Section: How to use this note"
  ],
  "media/portfolio/taxdesk-answer.png": [
    "User (RICHMAN): Am I subject to comprehensive taxation?",
    "Structured response (AnswerDTO)",
    "Route — HYBRID",
    "Answer: Yes. Your 2026 financial income (interest and dividends) exceeds the KRW 20 million threshold for comprehensive taxation (sample amounts). This is an estimate; please consult a tax professional for a final decision.",
    "Cited evidence: Income Tax Act §55①, §14②, §55, §15 — with source file names and scores",
    "Tools called (2): lookupMyIncome, classifyTaxation",
    "Cost · latency: prompt, completion, latency",
    "Notice: This is estimated information for the 2026 tax year; please consult a tax professional for a final decision."
  ],
  "media/portfolio/taxdesk-calc.png": [
    "User (RICHMAN): What is my final income tax?",
    "Structured response (AnswerDTO)",
    "Route — CALCULATION",
    "Answer: estimated income tax on your 2026 financial income under comprehensive taxation, plus local income tax charged separately, minus tax already withheld, giving the additional tax to pay (sample amounts). This is an estimate; please consult a tax professional.",
    "Tools called (3): lookupMyIncome, classifyTaxation, calculateTax",
    "Calculation steps — values returned by the tools:",
    "Body: step-by-step calculation (amount over the KRW 20 million threshold, gross-up eligible dividends, dividend gross-up, total income, tax base, ① comprehensive vs ② separate taxation, final tax = max(①, ②), local income tax 10%, tax already paid, additional tax due), citing Income Tax Act sections",
    "Summary: Final tax · Local income tax (separate) · Tax already paid · Additional tax to pay",
    "Cost · latency: prompt, completion, latency",
    "Notice: estimate for the 2026 tax year based only on financial income confirmed by SKALA Securities and information you provided; the actual tax may differ (other deductions and credits, other income), the exact amount is set when you file, and you should consult a tax professional."
  ],
  "media/portfolio/taxdesk-hold-2611-crop.jpg": [
    "Answer summary line: interest income + domestic dividends = taxable financial income total vs. the KRW 20 million threshold (Income Tax Act §14③6) → over the threshold → subject to comprehensive taxation (sample amounts)",
    "Body: You are subject to comprehensive taxation, but to calculate the tax I need your other comprehensive income (wages, business, pension, other). If you have none, reply \"none\" and I'll calculate it. Please give the 'income amount' from your withholding receipt or return, not gross pay or revenue.",
    "Caveats: financial income at unlinked (other) institutions is not confirmed · the high-dividend company special rule is not applied · income classified as non-taxable or separately taxed is excluded · based on payments confirmed as of the lookup date · tax not calculated because other income is unconfirmed",
    "Notice: This is practice estimate information for the 2026 tax year, not legal or tax advice. Please consult a tax professional for a final decision."
  ],
  "media/portfolio/taxdesk-hold-2611.jpg": [
    "User: How much tax do I owe?",
    "Answer summary line: interest income + domestic dividends = taxable financial income total vs. the KRW 20 million threshold (Income Tax Act §14③6) → over the threshold → subject to comprehensive taxation (sample amounts)",
    "Body: You are subject to comprehensive taxation, but to calculate the tax I need your other comprehensive income (wages, business, pension, other). If you have none, reply \"none\" and I'll calculate it. Please give the 'income amount' from your withholding receipt or return, not gross pay or revenue.",
    "Caveats: unlinked institutions not confirmed · high-dividend special rule not applied · non-taxable/separately taxed income excluded · based on payments confirmed as of lookup · tax not calculated because other income is unconfirmed",
    "Notice: practice estimate for the 2026 tax year, not legal or tax advice; consult a tax professional.",
    "Suggested questions — each button takes a different router branch: Rules (RAG) · Calculation (Tool) · Determination (RAG+Tool) · Tax-saving product application (confirm, then accept) · Out of scope (refuse) · No permission (refuse + alternative)",
    "Input: Type your question · Button: Send",
    "Right panel: domestic / foreign dividends; table Institution · Source · Count · Amount (Hana Bank — linked; SKALA Securities — own account); Product details (4)",
    "Panel notes: only own-account and MyData-linked institutions are included; amounts are payments confirmed as of lookup; other-institution income not yet confirmed — say \"no other income\" if none; the KRW 20 million determination is given in the chat after checking other income",
    "Panel: Evidence for this answer — what it looked at and how it calculated · HYBRID · Tools called: lookupMyIncome, classifyTaxation (external = unconfirmed)",
    "Applied rules: 2026 tax year · Income Tax Act and Restriction of Special Taxation Act amendments (effective 2026-07-01) · Supreme Court ruling 2026-08-20 · Tokens · Latency"
  ],
  "media/portfolio/taxdesk-income-panel-2611.jpg": [
    "Panel title: My financial income — what's confirmed and what's missing",
    "2026 tax year · looked up 2026-11-10 · Lookup complete",
    "Tiles: Own + linked accounts, taxable · Excluded from determination (non-taxable / separately taxed) · Other institutions (unlinked) — Unconfirmed (sample amounts)",
    "Table: Taxable type · Amount — Interest · Domestic dividends · Foreign dividends",
    "Table: Institution · Source · Count · Amount — Hana Bank (linked) · SKALA Securities (own account)",
    "Product details (4)",
    "Note: Only own-account (OWN_ACCOUNT) and MyData-linked (LINKED) institutions are included. Unlinked institutions don't appear here, which doesn't mean their income is zero.",
    "Note: Amounts are payments confirmed as of the lookup date; they change if more is paid by year-end.",
    "Note: Financial income at other (unlinked) institutions isn't confirmed yet. If you have none, tell the chat \"no other income\".",
    "Footer: The KRW 20 million determination is given in the chat after other-institution income is checked. This panel shows the confirmed scope, not a determination."
  ],
  "media/portfolio/taxdesk-no-source.png": [
    "Structured response (AnswerDTO)",
    "Route — REGULATION",
    "Answer: Sorry, information on the gross-up rate can't be found in the provided evidence. Please contact the National Tax Service call center (126). This is an estimate; please consult a tax professional for a final decision.",
    "Cited evidence: Income Tax Act §55①, §129①1, §55, §55① — with source file names and scores",
    "Cost · latency: prompt, completion, latency",
    "Notice: This is estimated information for the 2026 tax year; please consult a tax professional for a final decision.",
    "Footer: POST /chat · account: [account] · room: demo-1 · 2026-08-21 10:45:29 AM"
  ],
  "media/portfolio/taxdesk-reask.png": [
    "User (RICHMAN): What is my final income tax?",
    "Structured response (AnswerDTO)",
    "Route — CALCULATION",
    "Answer: Your 2026 financial income is subject to comprehensive taxation. To calculate the final income tax, I need your other comprehensive income (wages, business, pension, other). If you have any, tell me the amount; if not, reply \"none\" and I'll proceed. This is an estimate; please consult a tax professional.",
    "Tools called (2): lookupMyIncome, classifyTaxation",
    "Cost · latency: prompt, completion, latency",
    "Notice: This is estimated information for the 2026 tax year; please consult a tax professional for a final decision."
  ],
  "media/portfolio/templets-hub-home.jpg": [
    "Header buttons: Settings · + New template",
    "Tagline: Collect, edit, and analyze with AI design prompts for PPT, reports, resumes, and portfolios",
    "Tabs: PPT 305 · Reports 27 · Resumes 18 · Portfolios 14",
    "Search: Search by name, mood, or color — navy, white background, green accent…",
    "Style filters: All 305 · Simple · Modern · Business · Abstract · Luxury · Retro · Creative · Academic · Cartoon · Technical · Craft · Fun · Lecture · Religion · Social media · Event · Travel · Food · Sports · Health/wellness · Kids · Photo · Music/performance · Industry/manufacturing · Real estate/architecture · Law/politics · Fashion/beauty · Environment/ESG · Pets/animals · Pitch (each with a count)",
    "305 items · Sort: Most used",
    "Template cards: Minimal Zen · Clean Modern · Zero UI · White Paper — each labeled Simple · font name"
  ],
  "media/portfolio/userflow-figma-example.png": [
    "1. App launch flow"
  ],
  "media/portfolio/wireframe-1.png": [
    "Screen title: Enter part names"
  ]
};

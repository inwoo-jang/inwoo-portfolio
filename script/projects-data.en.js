/* ==========================================================
   script/projects-data.en.js — data for Quick View cards and summaries (English)
   - The source of truth for project details is the notebook page in portfolio.en.html (<article class="note__page">).
   - Each id matches the page's data-project-gallery value (the key that links a card to its notebook page).
   - Based on: the full portfolio project source book (2026-11-06) plus corrections from the latest fact sheet.
     Use only facts written there. Do not add new numbers or roles.
   - metrics[].scope: always fill it in for numbers that need context (team result, target, estimate, self-checked record).
   - role and scope keep these apart: planning vs. building, testing vs. running, team results vs. personal contribution.
   ========================================================== */
window.PROJECT_TYPES = ["Product", "Operations", "AI Engineering", "Frontend", "Backend", "Tool"];
/* My role keywords — separates product planning, product management and engineering */
window.PROJECT_ROLES = ["Product Planning", "PM", "Frontend", "Backend", "Full-stack", "AI Engineering"];

/* Projects to see first — project name → the key call I made → result and current status.
   Same order and wording as the featured projects on the home page (index.en.html). */
window.FEATURED = [
  {
    id: "order-sync",
    decision: "I set the rule for identifying each item by order number and line number and linking it to an internal box, plus the rules for partial and postponed pickups.",
    result: "That manual data entry went from about 1 hour to 10 minutes a day (my own record) · Once it was built, I cross-checked both systems' data and reported 2 bugs to QA",
    split: "Sync rules, data checks, QA: me · Build: dev team"
  },
  {
    id: "payroll",
    decision: "I defined the calculation rules and edge cases for each pay type, checked them against the tax software's results, and handed the dev team reference code.",
    result: "Used for real payroll in-house · I left the company during the customer pilot",
    split: "Planning and rule validation: me · Build: dev team"
  },
  {
    id: "quiket",
    decision: "As PM of a 7-person team, I coordinated the scope of the first release. Based on user testing, we changed the flow to: enter the subject name → upload materials → review and edit the chapters and parts the AI created.",
    result: "Launched on the App Store and Google Play (team result) · The new flow was checked in internal QA · Servers now shut down",
    split: "PM, planning, user testing: me · Production app: dev team"
  },
  {
    id: "taxdesk",
    decision: "The server controls the order of income lookup, tax determination and calculation. The model only classifies questions and explains answers. If an income figure isn't confirmed, it asks instead of calculating.",
    result: "After fixing the August failure (tax computed by assuming KRW 0), it now asks a follow-up question under the same risky conditions · Demo, not yet reviewed by a tax professional",
    split: "Designed solo · Built and tested with AI coding tools"
  }
];

window.PROJECTS = [
  /* ---------- Work — JEEKIM COMPANY ---------- */
  {
    id: "order-sync",
    roles: ["Product Planning", "PM"],
    status: "Went live",
    statusKind: "live",
    image: "media/portfolio/order-sync-diagram.svg",
    imageAlt: "Diagram of how order and item units map to box units (made by me)",
    book: "work",
    title: "Order and box status sync for a pharmaceutical wholesale mall",
    scope: "JEEKIM COMPANY · Went live",
    period: "2026.01–02",
    types: ["Product", "Operations"],
    overview: "Planned the sync rules connecting orders from an external wholesale mall with our box-based operations, and validated them by cross-checking the data.",
    problem: "Staff downloaded wholesale mall orders as Excel files and typed them into the admin by hand. The mall tracks orders and items, while we track boxes, so status and shipping info fell out of sync on partial or postponed pickups.",
    role: "Sync rules, data cross-checks, QA (me) · Build: dev team",
    build: [
      "A rule that identifies each item by order number and line number (the item's position in the order) and links it to an internal box",
      "Partial pickups and postponed pickups as separate statuses, mapped to the mall's ‘partially shipped’ status",
      "Cross-checked both systems' data and reported two bugs: orders dropped at time boundaries, and shipping info applied only to the first box"
    ],
    metrics: [
      { value: "About 1 hour → 10 minutes", label: "Daily manual order entry by staff", scope: "That task only · my own record" }
    ],
    resultNote: "Partial pickups now show up in settlement, and questions about mismatched statuses went down (based on my own checks).",
    summary: {
      problem: "External orders had to be re-entered into our system. External orders and items didn't match our internal box units, so status and shipping info fell out of sync on partial or postponed pickups.",
      decision: "I set the rule for identifying each item by order number and line number and linking it to an internal box. Partial pickups map to the mall's ‘partially shipped’ status, and postponed pickups get their own status.",
      result: "Once it was built, I cross-checked both systems' data and reported two bugs to QA: orders dropped at time boundaries, and shipping info applied only to the first box."
    },
    stack: ["API spec review", "Status rules", "Data cross-checks", "QA"]
  },
  {
    id: "payroll",
    roles: ["Product Planning", "PM"],
    image: "media/portfolio/payroll-slip.jpg",
    imageAlt: "Sample payslip screen (company marketing image, sample data)",
    status: "Internal use · Pilot",
    statusKind: "live",
    headline: "From an unused feature to real use",
    headlineScope: "Redefined calculation rules · Trained staff",
    book: "work",
    title: "Payslip service planning",
    scope: "JEEKIM COMPANY · Internal use and customer pilot",
    period: "2025.12–2026.05",
    types: ["Product"],
    overview: "Re-planned an unused payslip feature by defining payroll calculation rules that match how payroll is actually filed.",
    problem: "The existing feature calculated wrong, so nobody used it. Staff worked backward from the net amount to fill in the inputs, and when someone left, the calculation method left with them.",
    role: "Calculation rules, policy and screen planning, rule validation, staff training (me) · Build: dev team",
    build: [
      "Did the bookkeeping for about 30 clients myself to work out the calculation rules and edge cases",
      "Compared formulas against the tax software (WEHAGO) using scenarios for each pay type",
      "Moved the Excel calculation logic into Google Apps Script reference code and handed it to the dev team"
    ],
    metrics: [],
    resultNote: "After I shared the explanation and guide, the team started using it for real payroll, and I confirmed it reached a customer pilot. I left the company during the pilot.",
    summary: {
      problem: "The existing payslip feature calculated wrong, so nobody used it. Staff worked backward from the net amount to fill in the inputs, and when someone left, the calculation method left with them.",
      decision: "I did the bookkeeping for about 30 clients myself to define calculation rules and edge cases for each pay type, checked each scenario against the tax software (WEHAGO), and handed the dev team Apps Script reference code.",
      result: "After I shared the rules and a user guide, the team started using it for real payroll, and I confirmed it reached a customer pilot. I left the company during the pilot."
    },
    stack: ["Calculation rules", "WEHAGO cross-check", "Apps Script", "Rollout to staff"]
  },
  {
    id: "samil",
    image: "media/portfolio/jikim-tile-samil.jpg",
    imageAlt: "JEEKIM logo",
    roles: ["Product Planning", "PM"],
    status: "In beta testing",
    statusKind: "other",
    headline: "Where to answer and where to hand off",
    headlineScope: "AI service policy · Edge cases",
    book: "work",
    title: "AI tax consultation for pharmacies — with Samil PwC",
    scope: "JEEKIM COMPANY · In beta testing",
    period: "2026.01–06",
    types: ["Product", "AI Engineering"],
    overview: "Planned the screens and service policy for an AI consultation that answers pharmacy owners' tax, HR and admin questions.",
    problem: "We needed to define which questions the model answers and which go to an expert, and what happens next when it can't answer.",
    role: "Screens and service policy, consultation materials and Q&A review, partner coordination. The model, Q&A database and API were the partner's.",
    build: [
      "Agreed with the partner to try the FAQ with RAG first, before any tuning, to check the answer flow",
      "Separated out-of-scope questions, unanswerable questions and system errors, and defined the message and expert hand-off for each",
      "Requirements for showing the cited legal provisions, a disclaimer, chat history and bookmark retention, and a token usage cap"
    ],
    metrics: [],
    resultNote: "I took part in the beta and checked the FAQ answers. I left the company during the beta.",
    summary: {
      problem: "We expected to apply the existing model quickly, but the partner said tuning would take more than a month. It also wasn't clear which data would work best.",
      role: "Screens and answer policy, preparing consultation materials and reviewing Q&A, partner coordination, and beta checks. The partner accounting firm handled the model, Q&A database and API.",
      decision: "I agreed with the partner to start with the FAQ we could prepare right away, use it with RAG to check the answer flow, and tune only if needed. Recorded consultation audio needed collecting, cleaning and labeling, so I proposed saving it for a later phase after the first check (proposal only).",
      result: "In the beta I saw some FAQ questions answered within 10 seconds (observed on some questions). I left during the beta, so I couldn't see how it did in production."
    },
    related: ["taxdesk"],
    stack: ["AI service policy", "Edge cases", "Partner collaboration", "Screen design"]
  },
  {
    id: "pharmacy-link",
    image: "media/portfolio/jikim-home-card.jpg",
    imageAlt: "JEEKIM app home screen — Pharmacy Ledger and profit and loss",
    roles: ["Product Planning", "PM"],
    status: "Went live",
    statusKind: "live",
    headline: "Connecting agencies by sign-in method",
    headlineScope: "Connection flow · Edge cases",
    book: "work",
    title: "Pharmacy Ledger connection flow and partner site integration",
    scope: "JEEKIM COMPANY · Went live",
    period: "During 2024.10–2026.06",
    types: ["Product", "Operations"],
    overview: "Grouped the agency connections, which used to be set up one by one, by sign-in method, and planned how reports show up inside a partner's website.",
    problem: "During remote support I saw that pharmacies had to connect Hometax, the credit card sales service, the healthcare provider portal and the four social insurance services one at a time.",
    role: "Connection flow and edge-case planning, checks in live use. I did not build the authentication or design its security.",
    build: [
      "Hometax, the healthcare provider portal and the four social insurance services connect with one digital certificate; the credit card sales service connects with a separate account",
      "Defined the edge case where the Hometax certificate doesn't match",
      "Planned an iframe integration so partners' websites can show the profit and loss report and claims data"
    ],
    metrics: [],
    resultNote: "The improved connection flow and the iframe integration went into the live service.",
    stack: ["Connection flow", "Edge cases", "Partner integration", "Remote support"]
  },
  {
    id: "rx-ops",
    image: "media/portfolio/jikim-rx-card.jpg",
    imageAlt: "JEEKIM app prescription auto-entry screen (patient info blurred)",
    roles: ["Product Planning", "PM"],
    status: "Run on site",
    statusKind: "live",
    book: "work",
    title: "Prescription storage service operations and scan center",
    scope: "JEEKIM COMPANY",
    period: "During 2024.10–2026.06",
    types: ["Operations"],
    overview: "Planned automation for repetitive work in prescription pickup, scanning and storage, and ran the newly opened scan center.",
    problem: "It was hard to track the same box through ordering, pickup, scanning and storage, and scan uploads sometimes didn't match the order number.",
    role: "Planned the operations automation (the dev team built it); ran the scan center and set its work standards",
    build: [
      "Planned automation for tracking number matching, pickup requests and purchase order lists",
      "Changed a data field so the order number appears on the shipping label, and introduced box labels",
      "Daily targets, checklists, inbound and outbound rules, and manuals; staff assignments, training and quality control"
    ],
    metrics: [
      { value: "10 people · about 150,000 sheets a day", label: "Scan center size while I ran it", scope: "Service scale · not throughput I added" }
    ],
    resultNote: "",
    stack: ["Operations automation", "On-site operations", "Work standards", "Logistics process"]
  },
  {
    id: "income-tax",
    image: "media/portfolio/jikim-tile-tax.jpg",
    imageAlt: "JEEKIM logo",
    roles: ["Product Planning", "PM"],
    status: "Launched · Used for marketing",
    statusKind: "live",
    book: "work",
    title: "Comprehensive income tax estimate planning",
    scope: "JEEKIM COMPANY",
    period: "2025.01–03",
    types: ["Product"],
    overview: "Planned a comprehensive income tax estimate that maps Hometax API responses to our data model and to the calculation flow for each income type.",
    problem: "Fields returned by the Hometax API had to be mapped to our internal data and to the calculation flow for each income type.",
    role: "Planning. The dev team built it.",
    build: [
      "Mapped Hometax API response fields to our internal data model",
      "Laid out the calculation flow for each income type and the fields shown on screen",
      "Explained what each field and calculated result means to the developers and designers"
    ],
    metrics: [],
    resultNote: "It went into the live service and was used as a marketing feature.",
    stack: ["Hometax API", "API response mapping", "Calculation flow"]
  },
  {
    id: "client-contract",
    image: "media/portfolio/jikim-tile-client.jpg",
    imageAlt: "JEEKIM logo",
    roles: ["Product Planning", "PM"],
    status: "Planning and design stage",
    statusKind: "other",
    headline: "Starting before there's a business number",
    headlineScope: "Client management · Engagement contracts",
    book: "work",
    title: "Client management and engagement contract automation",
    scope: "JEEKIM COMPANY",
    period: "2025–2026.06",
    types: ["Product"],
    overview: "Planned client status tracking and a flow that takes prospective clients without a business registration number through to a contract and CMS (direct debit) payment.",
    problem: "Several people edited the client list in Excel at the same time and changes got lost. Contract prep also started before the client had a business registration number.",
    role: "Planning and ERD review, through to design handoff",
    build: [
      "Listed what to track by business type, industry and stage; separated permissions and data by role; checked against the backend ERD",
      "A separate list for prospective clients without a business registration number, planned through to CMS payment",
      "A spec template split into inputs, outputs, API format, rules and edge cases"
    ],
    metrics: [],
    resultNote: "The developers and designer told me it was easy to work with because the decisions they'd need to make during the build were already written down.",
    stack: ["Permissions and data separation", "ERD review", "CMS payment", "Spec template"]
  },

  /* ---------- SKALA bootcamp ---------- */
  {
    id: "taxdesk",
    roles: ["Product Planning", "AI Engineering", "Backend"],
    image: "media/portfolio/taxdesk-hold-2611-crop.jpg",
    imageAlt: "Consultation screen that asks for the income amount instead of calculating tax, because other comprehensive income isn't confirmed (synthetic data)",
    status: "Bootcamp project",
    statusKind: "edu",
    headline: "Code does the math",
    headlineScope: "Server-controlled flow · RAG · Spring AI",
    book: "skala",
    title: "TaxDesk — tax consultation on financial income",
    scope: "Personal project that started as a bootcamp exercise · Solo",
    period: "2026.08",
    periodDetail: "Built 2026.08 · Improved 2026.11",
    types: ["AI Engineering", "Backend"],
    overview: "A demo that answers tax questions about dividend and interest income for customers of a fictional brokerage (SKALA Securities). The server sets the processing order; the model classifies questions and explains answers.",
    problem: "A tax answer needs both the legal basis and the tax calculation. If the model guesses the numbers, the two stop matching.",
    role: "Designed solo · Built and tested with AI coding tools",
    build: [
      "The server sets the order, and code handles income lookup, tax determination and calculation, so the model never produces the numbers",
      "If any value isn't confirmed, it asks a follow-up question or holds instead of calculating",
      "Out-of-scope questions are rejected by rules first, without calling the model"
    ],
    metrics: [],
    resultNote: "This is a demo for practice, not a live service.",
    summary: {
      problem: "A tax answer needs both the legal basis and the tax calculation. In a manual test in August, a tax amount computed by treating other comprehensive income as KRW 0 went out as if it were a final answer.",
      decision: "The server controls the order — income lookup → tax determination → calculation — and no tools are registered with the model. If a value needed for the calculation isn't confirmed, it asks instead of calculating. If a lookup fails or there's no source, it holds the determination and the answer.",
      result: "I re-ran the same risky condition (subject to comprehensive taxation + other comprehensive income not entered) and confirmed it asks for the income amount without giving a calculation (2026-11-10, mock model). 15 determinations and tax amounts match an independent calculation but haven't been reviewed by a tax professional, and the 6 legal-citation cases that need a real model weren't run."
    },
    related: ["samil"],
    stack: ["Java", "Spring Boot", "Spring AI", "RAG", "Offline evaluation"]
  },
  {
    id: "gtsrb",
    roles: ["AI Engineering"],
    image: "media/portfolio/gtsrb-tradeoff.png",
    imageAlt: "Chart comparing accuracy and parameter count for each candidate model",
    status: "Bootcamp assignment",
    statusKind: "edu",
    book: "skala",
    title: "Making an in-car traffic sign recognition model lighter",
    scope: "Bootcamp assignment · 2 people",
    period: "2026.09",
    types: ["AI Engineering"],
    overview: "Made a 43-class GTSRB traffic sign model smaller to fit in-car constraints.",
    problem: "Accuracy was already 98.5%. Of the directions the assignment offered, I picked model compression, because in a car several recognition modules share the same memory.",
    role: "Chose the compression direction, ran my own experiments, compared them with the team's results, presented",
    build: [
      "Found that the fully connected layers held 96% of the parameters and compared candidates that shrink them",
      "Compared 21 controlled experiments across 3 seeds",
      "Found 888 burst-shot groups split across training and validation; did not use the test set to pick candidates"
    ],
    metrics: [
      { value: "8.33MB → 2.10MB", label: "Model size" },
      { value: "0.09%p", label: "Validation accuracy gap between the two final candidates (4.12MB and 2.10MB)", scope: "About the same as seed-to-seed variation" }
    ],
    resultNote: "One image at a time, the smaller model was actually slower; in batches it was faster. Night, backlight and rain are listed as untested.",
    stack: ["PyTorch", "CNN", "Model compression", "Experiment design"]
  },
  {
    id: "edu-up",
    roles: ["Frontend"],
    image: "media/portfolio/eduup-home.png",
    imageAlt: "EDU:UP home screen — recommended courses and books (mock data)",
    status: "Bootcamp project",
    statusKind: "edu",
    headline: "Five services behind one gateway",
    headlineScope: "4-person team · Frontend",
    book: "skala",
    title: "EDU:UP — education benefit points platform",
    scope: "Bootcamp project · 4-person team · Frontend",
    period: "2026.08",
    types: ["Frontend"],
    overview: "An education benefit points platform: answer one question about your job and interests, get 2 courses and 2 books recommended, and sign up from there.",
    problem: "With hundreds of options, choosing feels like a chore, so people put it off and their points expire at the end of the quarter.",
    role: "Frontend (Vue 3 screens and API calls through the gateway), plus write-ups of spec conflicts and requests to the backend. Problem definition (SRS) by the PM, servers and MSA by teammates (from a provided template), LLM recommendation service by a teammate.",
    build: [
      "Connected five services to the UI through a single gateway",
      "Split sign-up status into submitted (PENDING) and confirmed (ACTIVE), and showed ‘result unknown’ differently from ‘failed’",
      "Two levels of fallback screens when recommendations fail; the button is disabled while a sign-up is in progress to prevent duplicate sign-ups from the UI"
    ],
    metrics: [],
    resultNote: "Point balances were mock data. Testing concurrent sign-ups and double deductions, and handling cancellations, were left for the next sprint.",
    stack: ["Vue 3 · Pinia (mine)", "Spring Boot MSA (team)", "FastAPI · LLM recommendations (team)", "Agile · Scrum"]
  },
  {
    id: "relationship-design",
    roles: ["Product Planning", "Frontend"],
    status: "Bootcamp · Prototype",
    statusKind: "edu",
    image: "media/portfolio/gwangyebu-uiflow.png",
    imageAlt: "Navigation flow across Gwangyebu's 11 screens",
    book: "skala",
    title: "Gwangyebu — features, screens, ERD and API design",
    scope: "Bootcamp mini-project · Solo · 3 days",
    period: "2026.09",
    types: ["Product", "Frontend"],
    overview: "Redesigned, as an assignment, a relationship journal app I'd been using myself since 2026.05, and checked the flow with a Vue 3 prototype.",
    problem: "When I mapped features to pain points, AI relationship analysis, KakaoTalk import and reminders didn't connect to any of them. Recording and looking things up were enough, so I cut them.",
    role: "Solo design + frontend prototype (mock API). Server and database went as far as design docs.",
    build: [
      "Listed the calling screen for every API, and noted display-only values that aren't stored",
      "Designed duplicate checks at two layers (UI and database) and a 404 for other users' records, and checked both against the mock API",
      "Built 10 screens in Vue 3"
    ],
    metrics: [
      { value: "18", label: "Features" },
      { value: "11", label: "Screens" },
      { value: "6", label: "Tables" },
      { value: "33", label: "APIs" }
    ],
    resultNote: "I traced it all the way through: 4 pain points → 18 features → 11 screens → 6 tables → 33 APIs. The first version of the app (Next.js · Supabase) was built for my own use and never released.",
    stack: ["Vue 3", "Pinia", "ERD · dbml", "OpenAPI 3"]
  },

  /* ---------- Team ---------- */
  {
    id: "quiket",
    roles: ["Product Planning", "PM"],
    status: "Launched, since discontinued",
    statusKind: "other",
    image: "media/portfolio/quiket-card.png",
    imageAlt: "Quiket's App Store listing",
    book: "team",
    title: "Quiket — AI quiz study app",
    scope: "Side project · 7-person team · PM",
    period: "2026.03–07",
    types: ["Product"],
    overview: "A study app: upload your materials, the AI writes questions, and you retry the ones you got wrong.",
    problem: "Learners found it hard to turn lecture notes into review questions. For the launch, we had to fit the first release into the schedules of 4 developers and 2 designers.",
    role: "PM, planning and user testing; built a mini version myself to validate ideas. The dev team built the production app.",
    build: [
      "The mini version showed that short materials produced too many questions, so I set question counts by input length",
      "Applied the same MoSCoW priorities across the PRD, wireframes, specs and sprints",
      "Menus that weren't ready got an on-brand ‘coming soon’ message, while the data structure stayed as designed"
    ],
    metrics: [
      { value: "2026.07.10", label: "App Store launch (Google Play at the same time)", scope: "7-person team result · production app built by the dev team" },
      { value: "12 · 2 rounds", label: "User interviews · User tests" }
    ],
    resultNote: "It was picked as the club's PM MVP. After launch, teammates' work commitments led us to shut down the servers.",
    summary: {
      problem: "In the second user test (6 people, 8 hypotheses), people were still confused by the material structure even after we renamed ‘part’ to ‘chapter’, and they said they wanted to upload first and name things later.",
      role: "PM and planning (IA, user flow, functional spec, wireframes), ran user testing, and built a mini version myself to validate ideas. Team developers built the production app.",
      decision: "I made the chapter structure and input order the top fixes. Users now enter only the subject name first, upload their materials, then review and edit the chapter and part names the AI created.",
      result: "The new flow was checked in final internal QA and the final demo, but we didn't run another user test after the change. The team launched on the App Store and Google Play, and the servers are now shut down."
    },
    stack: ["Product planning", "User research", "Next.js · Gemini (mini version)"]
  },
  {
    id: "archivelink",
    roles: ["Product Planning", "PM"],
    image: "media/portfolio/qlink-web.png",
    imageAlt: "ArchiveLink web prototype (sample links)",
    status: "Live on web and iOS",
    statusKind: "live",
    headline: "Failed analysis as the default path",
    headlineScope: "2-person team · Web · App Store",
    book: "team",
    title: "ArchiveLink — AI bookmarks for links and QR codes",
    scope: "2-person team · Launched on web and iOS",
    period: "2026.05–06",
    types: ["Product", "Frontend"],
    overview: "A bookmark service: paste a link and the AI fills in the folder, name, description and tags.",
    problem: "Login walls and bot blocking meant the AI couldn't read many links. If failed auto-classification were treated as just an edge case, users would get stuck right there.",
    role: "All product planning + frontend prototype. The team's backend developer handled servers, database and infrastructure.",
    build: [
      "Designed the default flow so users can type in the details and save even when a link can't be analyzed",
      "Shipped the prototype first and locked it in as the requirements baseline, then moved it to React and TypeScript"
    ],
    metrics: [],
    resultNote: "Deployed on the web (archivelink.app), and the iOS app is on the App Store (listed 2026.07.30).",
    stack: ["React", "TypeScript", "PWA", "AI auto-classification"]
  },
  {
    id: "dacon",
    image: "media/portfolio/dacon-labeling-marked.jpg",
    imageAlt: "Labeling tool, Stage 2 — collision and entry frames, entry direction and escape space marked",
    roles: ["AI Engineering"],
    status: "Competition ended",
    statusKind: "other",
    book: "team",
    title: "DACON dashcam competition — recapture detection experiments and a labeling tool",
    scope: "Team entry · Competition",
    period: "2026.08–09",
    types: ["AI Engineering", "Tool"],
    overview: "A three-stage driving video analysis competition. I handled the Stage 1 recapture detection experiments and the team's labeling tool.",
    problem: "A model trained on synthetic data missed all 13 real recaptured clips I collected, and each teammate faced more than 1,000 clips to label by hand.",
    role: "Stage 1 experiments, built the labeling tool (with AI coding tools). A teammate handled the team's training infrastructure.",
    build: [
      "Found that 336 of 836 synthetic training samples were leaked from the evaluation originals, and removed them",
      "Switched from deep learning to video forensic features + logistic regression",
      "A labeling tool with keyboard judgments, ±7-frame fine-tuning and CSV resume; AI pre-labels are shown for reference only"
    ],
    metrics: [
      { value: "24th of 320 teams", label: "Final competition rank", scope: "Team result · my own interim submission ranked 16th" },
      { value: "20–30 seconds", label: "Target time per clip", scope: "Design target · not measured" }
    ],
    resultNote: "",
    stack: ["Python", "OpenCV", "Data leakage checks", "Keyboard UX"]
  },

  /* ---------- Personal ---------- */
  {
    id: "marketdesk",
    image: "media/portfolio/marketdesk-flow-card.jpg",
    imageAlt: "MarketDesk flow board — a month of trends in the AI industry, summarized",
    roles: ["Product Planning", "Full-stack", "AI Engineering"],
    status: "Built · In personal use",
    statusKind: "other",
    headline: "Report summaries by reading goal",
    headlineScope: "46 tasks · 15 decision records",
    book: "solo",
    title: "MarketDesk — AI report analysis and stock tracking",
    scope: "For my own use (not released)",
    period: "Started 2026.06",
    types: ["AI Engineering", "Backend"],
    overview: "A tool where AI summarizes research reports in a structured way for each reading goal (lens) and stacks them into trends by industry.",
    problem: "Even a single report was long and hard to get through, and industry reports and company reports didn't connect, so they never added up to a trend.",
    role: "Solo planning, build with AI, and testing on screen",
    build: [
      "Wrote each task with its goal, scope, edge cases, tests and done criteria, then rechecked the AI's build on screen",
      "Split the API server and parsing worker, connected by a queue; SHA-256 blocks duplicates and SimHash detects near-duplicates",
      "Found that the publish date was being filled with the upload date, and changed it so unknown values are entered by hand"
    ],
    metrics: [],
    resultNote: "It's finished and I use it myself. A function that checks numbers against the cited page was built, but it isn't connected to the upload flow.",
    stack: ["Next.js", "Hono", "PostgreSQL", "Queue and worker split"]
  },
  {
    id: "triage",
    roles: ["Product Planning", "AI Engineering"],
    status: "Demo",
    statusKind: "other",
    image: "media/portfolio/demo-triage.png",
    imageAlt: "Triage admin demo, first screen",
    book: "solo",
    title: "Work-experience program triage admin",
    scope: "AX hackathon, solo entry · Demo",
    period: "2026.06",
    types: ["Product", "AI Engineering"],
    overview: "An operations admin demo that ranks which participants' attendance to check first.",
    problem: "It was based on a scenario where one operator checks 8 weeks of attendance for 300 participants by hand.",
    role: "Planning, demo build and presentation in 6 hours",
    build: [
      "Defined “intervention value” as the allowance that could still be saved by stepping in now, and sorted check targets by it automatically",
      "A what-if simulator that recalculates the allowance when you enter attendance for the remaining weeks",
      "Code does the calculations and threshold checks, AI writes the summaries and messages, and a person makes the final call"
    ],
    metrics: [
      { value: "15–25 hours", label: "Manual check workload (300 people × 3–5 minutes each)", scope: "Estimated problem size · not measured" }
    ],
    resultNote: "",
    stack: ["Python", "Prompt design", "Role separation"]
  },
  {
    id: "classtrack",
    roles: ["Full-stack"],
    image: "media/portfolio/classtrack-dashboard.jpg",
    imageAlt: "ClassTrack dashboard — course and assignment totals with a class-day calendar",
    status: "Deployment exercise",
    statusKind: "other",
    headline: "Rules instead of a stored end date",
    headlineScope: "Spring Boot · Vue 3",
    book: "solo",
    title: "ClassTrack — course and assignment tracker",
    scope: "Build and deployment exercise",
    period: "2026.08",
    types: ["Backend", "Frontend"],
    overview: "A web app that tracks the courses I'm taking, their assignments and links to my work in one place.",
    problem: "The goal was to wire up the UI, server and data myself and practice container-based deployment.",
    role: "Solo design, build and deployment exercise",
    build: [
      "Calculates the class-day calendar from rules, without storing an end date",
      "A dev screen showing the API, service and database structure and the logs",
      "AOP logging, async link validation, multi-stage builds"
    ],
    metrics: [],
    resultNote: "I took it through deployment on my own. The deployed URL no longer loads (checked 2026-11).",
    stack: ["Spring Boot", "Vue 3", "AOP", "Docker"]
  },
  {
    id: "templets-hub",
    roles: ["Product Planning", "Frontend"],
    status: "Public",
    statusKind: "other",
    image: "media/portfolio/templets-hub-home.jpg",
    imageAlt: "Template Hub first screen — design prompts listed by category",
    book: "solo",
    title: "Template Hub — a collection of document design prompts",
    scope: "Small tool",
    period: "2026",
    types: ["Tool"],
    overview: "A hub that collects slide deck, report, resume and portfolio templates by category; pick one and it builds a prompt to give an AI.",
    problem: "While making promo images for Quiket, I learned that the hard part of prompting isn't getting a good result once, it's getting the same result every time.",
    role: "Built solo (with AI coding tools)",
    build: [
      "Pick a template and it generates a prompt to give an AI",
      "Templates and open-source resources sorted by document type and mood",
      "Search by name, mood or color; sorted by how often each is used"
    ],
    metrics: [],
    resultNote: "It's live at a public URL. As of 2026-11 it has 305 slide deck, 27 report, 18 resume and 14 portfolio templates.",
    stack: ["Prompt design", "GitHub Pages"]
  },
  {
    id: "vibe-guide",
    roles: ["Product Planning", "Frontend"],
    status: "Public",
    statusKind: "other",
    image: "media/portfolio/demo-vibe.png",
    imageAlt: "Vibe Coding Guide first screen",
    book: "solo",
    title: "Vibe Coding Guide",
    scope: "Small tool",
    period: "2026",
    types: ["Tool"],
    overview: "A website that helps people new to coding finish one full cycle of 8 steps, from planning to deployment.",
    problem: "The goal was to get beginners through one complete run, from planning to deployment.",
    role: "Built solo (with AI coding tools)",
    build: [
      "8 steps from planning to deployment — each with a prompt to give an AI and useful open-source tools",
      "API keys are used only in serverless functions",
      "The build must pass a key-leak check first"
    ],
    metrics: [],
    resultNote: "It's live at a public URL (checked 2026-11).",
    stack: ["Vercel serverless functions", "Prompt design"]
  },
  {
    id: "personal-tools",
    image: "media/portfolio/study-note-serving.jpg",
    imageAlt: "Study notes by subject — first screen of the Model Serving & AIOps notes",
    roles: ["Full-stack", "AI Engineering"],
    status: "Personal use",
    statusKind: "other",
    book: "solo",
    title: "Personal tools — other",
    scope: "Small tool",
    period: "2026",
    types: ["Tool"],
    overview: "A mail summary bot and an AI study coach web app — small tools I built for myself.",
    problem: "I wanted to cut down on the email I checked every day, and to stop losing what I'd asked AI.",
    role: "Built solo (with AI coding tools)",
    build: [
      "Mail summary bot — pulls Gmail over IMAP, summarizes by importance and sends it to Discord; runs every morning on GitHub Actions",
      "AI study coach — a question panel next to the textbook; the AI asks open-ended questions, grades written answers and saves the answer and pass/fail to a database"
    ],
    metrics: [],
    resultNote: "These are tools I built for my own use. I made a separate AI study coach for each subject.",
    stack: ["Python", "GitHub Actions", "Vue 3", "SQLite"]
  }
];

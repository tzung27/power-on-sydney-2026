// Builds the three English-first decks (Chinese as support) into OUT_DIR.
const path = require("path");
const pptxgen = require("pptxgenjs");
const { applyTheme } = require(process.env.PPTX_SKILL + "/scripts/apply_theme.js");
const { THEME, HEX, ZH, defineLayouts, content, dark, quoteCard, iconCircle, card } = require("./common");

const OUT = process.argv[2];
const FOOTER = "Power On: Windows Means Business · Sydney · Oct 27–28, 2026";

function newDeck(title) {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
  pres.title = title;
  pres.author = "Weblink · Power On Sydney prep";
  defineLayouts(pres, FOOTER);
  return pres;
}

const notes = (en, zh) => `${en}\n\n中文提示：${zh}`;

// ---------------------------------------------------------------- Deck 1
async function pitchDeck() {
  const pres = newDeck("Windows 11 Positioning and Demo");
  const C = pres.SchemeColor;

  pres.addSection({ title: "Open" });
  let s = dark(pres, "Open", "POWER ON · WINDOWS MEANS BUSINESS", "Make Every PC a Productivity Engine", "讓每一台電腦都成為公司的生產力");
  s.addText("Windows 11 Pro  ×  Intel Core Ultra  ×  Intel vPro   |   SMB refresh proposal", {
    x: 0.7, y: 4.15, w: 11.9, h: 0.4, fontSize: 16, color: "A9B9D6", margin: 0, isTextBox: true });
  quoteCard(pres, s, 0.7, 4.85, 7.4, 1.55, "Today we're not talking specs. We're talking about your business.", "今天不談規格，談你的生意。", true);
  s.addNotes(notes("Don't introduce the company first. Ask the room: how many Windows 10 PCs are still in your office? Ask for a show of hands so people see the problem themselves.",
    "開場不要先介紹公司，先請大家舉手：公司裡還有多少台 Windows 10？"));

  pres.addSection({ title: "Why now" });
  s = content(pres, "Why now", "The world of work has changed", "工作的世界已經變了：為什麼是現在");
  const why = [
    ["FaTriangleExclamation", "B45F06", "Windows 10 support ended", "No regular security updates since Oct 14, 2025", "Windows 10 已停止支援"],
    ["FaShieldHalved", HEX.accent2, "Attackers target SMBs", "Weaker defenses, equally valuable data", "攻擊鎖定中小企業"],
    ["FaTrain", HEX.accent1, "Work happens everywhere", "Trains, cafés and client sites are the office", "工作不在辦公室"],
    ["FaWandMagicSparkles", HEX.accent3, "AI is already in daily work", "Staff use it, often with personal accounts", "AI 已進入日常工作"],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, t, b, z] = why[i];
    await card(pres, s, 0.6 + (i % 2) * 3.95, 1.75 + Math.floor(i / 2) * 2.5, 3.75, 2.35, { icon: ic, iconFill: col, title: t, body: b, zh: z });
  }
  quoteCard(pres, s, 8.65, 1.75, 4.05, 4.85, "A PC that turns on isn't necessarily a secure PC.", "能開機，不等於安全。");
  s.addNotes(notes("One sentence per box, under a minute in total. Lean on the first box: still working does not mean secure. The fourth box sets up the AI slide: personal AI accounts put client data outside company control.",
    "四格各一句，總共一分鐘內。重點在第一格；第四格帶出影子 AI 的資料風險。"));

  s = content(pres, "Why now", "What business owners tell us", "老闆最常跟我們說的三句話");
  const pains = [
    ["FaLock", HEX.accent2, "Security", "“What if a laptop with client data goes missing?”", "電腦掉了怎麼辦？裡面有客戶資料。"],
    ["FaScrewdriverWrench", HEX.accent4, "Management", "“When a PC breaks, we wait days for the repair shop.”", "電腦壞了要等電腦行，一等就是一兩天。"],
    ["FaClock", HEX.accent1, "Productivity", "“My team spends hours on repetitive paperwork.”", "同事每天都在做重複的整理工作。"],
  ];
  for (let i = 0; i < 3; i++) {
    const [ic, col, t, b, z] = pains[i];
    await card(pres, s, 0.6 + i * 4.1, 1.85, 3.9, 2.9, { icon: ic, iconFill: col, title: t, body: b, zh: z, bodySize: 17 });
  }
  s.addText([
    { text: "Security, management and productivity are three sides of one problem.", options: { bold: true, fontSize: 18, color: C.text1, breakLine: true } },
    { text: "資安、管理、效率，是同一個問題的三個面向。問客戶：「哪一句最像你們公司？」", options: { fontSize: 13, color: C.text2, fontFace: ZH } },
  ], { x: 0.6, y: 5.1, w: 12.1, h: 1.0, margin: 0, isTextBox: true });
  s.addNotes(notes("Quoting what owners actually say lands better than statistics. Pause, then ask: which one sounds most like your company? Demo that part first.",
    "用老闆說過的話呈現痛點；講完停 3 秒，請客戶選一句，Demo 就先演那一段。"));

  pres.addSection({ title: "Positioning" });
  s = content(pres, "Positioning", "Windows 11 Pro: the work platform for SMBs", "Windows 11 Pro：中小企業的工作平台（四大支柱）");
  const pillars = [
    ["FaShieldHalved", HEX.accent2, "Secure out of the box", "Hardware root of trust, VBS, Credential Guard, Windows Hello, BitLocker", "出廠即安全"],
    ["FaBoxOpen", HEX.accent1, "Managed from day one", "Autopilot, Intune, Windows Autopatch, Intel vPro remote management", "開箱即管理"],
    ["FaWandMagicSparkles", HEX.accent3, "AI built in", "Copilot, Click to Do, Studio Effects, on-device AI on the NPU", "內建 AI"],
    ["FaUsers", HEX.accent4, "Nothing new to learn", "Same apps, peripherals and habits; data moves over", "不必重新學"],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, t, b, z] = pillars[i];
    await card(pres, s, 0.6 + i * 3.08, 1.85, 2.9, 3.2, { icon: ic, iconFill: col, title: t, body: b, zh: z });
  }
  quoteCard(pres, s, 0.6, 5.3, 12.1, 1.4, "Windows 11 isn't a new operating system. It's a new way of working.", "Windows 11 不是新的作業系統，是新的工作方式。");
  s.addNotes(notes("This is the core slide. The four pillars answer the three pains, and 'nothing new to learn' removes the mental cost of switching.",
    "整份簡報的核心：四個支柱對應三個痛點，「不必重新學」消除換機的心理成本。"));

  s = content(pres, "Positioning", "Protected and managed, from chip to cloud", "從晶片到雲端，一套完整的保護與管理（解決方案架構）");
  const layers = [
    ["AI & productivity", "員工看得到的價值", ["Microsoft 365 Copilot · agents", "Copilot on Windows", "Studio Effects · live captions", "On-device AI · NPU"], "F1ECFB", HEX.accent2],
    ["Management", "IT 或經銷商看得到", ["Windows Autopilot", "Microsoft Intune", "Windows Autopatch", "Intel vPro remote (AMT)"], "E2ECFC", HEX.accent1],
    ["Windows 11 Pro", "作業系統", ["Windows Hello", "BitLocker", "VBS · Credential Guard", "Smart App Control"], "EEF3FA", HEX.dk2],
    ["Device & silicon", "信任從這裡開始", ["Intel Core Ultra (CPU · GPU · NPU)", "Intel vPro · Hardware Shield", "TPM 2.0", "Secured firmware"], "E6EAF0", HEX.dk1],
  ];
  for (let i = 0; i < 4; i++) {
    const [t, z, chips, fill, col] = layers[i];
    const y = 1.75 + i * 1.22;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.35, y, w: 11.35, h: 1.08, rectRadius: 0.08, fill: { color: fill }, line: { color: fill }, objectName: t + " layer" });
    s.addText([{ text: t, options: { bold: true, fontSize: 15, color: col, breakLine: true } }, { text: z, options: { fontSize: 11, color: C.text2, fontFace: ZH } }],
      { x: 1.55, y, w: 2.3, h: 1.08, valign: "middle", margin: 0, isTextBox: true });
    for (let k = 0; k < 4; k++) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 3.95 + k * 2.17, y: y + 0.18, w: 2.05, h: 0.72, rectRadius: 0.06, fill: { color: "FFFFFF" }, line: { color: "D8DFEA" }, objectName: chips[k] });
      s.addText(chips[k], { x: 3.95 + k * 2.17, y: y + 0.18, w: 2.05, h: 0.72, fontSize: 12, color: C.text1, align: "center", valign: "middle", margin: 0.05, isTextBox: true });
    }
  }
  s.addShape(pres.shapes.LINE, { x: 0.95, y: 1.85, w: 0, h: 4.65, line: { color: HEX.accent6, width: 2, beginArrowType: "triangle" }, objectName: "Trust arrow" });
  s.addText("TRUST", { x: 0.45, y: 6.55, w: 1.0, h: 0.3, fontSize: 10, bold: true, color: C.accent6, align: "center", margin: 0, isTextBox: true });
  s.addNotes(notes("For IT, explain bottom-up: trust starts in the silicon. For owners, top-down: staff get AI, someone manages it automatically, protection is built in. One line for owners: every layer is looked after, and Microsoft and Intel designed it together.",
    "對 IT 由下往上講，對老闆由上往下講；一句話：「每一層都有人顧。」"));

  s = content(pres, "Positioning", "Why Intel vPro?", "為什麼是 Intel vPro：沒有 IT 的公司最有感");
  const vpro = [
    ["FaRotate", "Remote management", "Power on and repair remotely, even when Windows won't boot", "遠端管理：系統當機也能遠端修"],
    ["FaShieldHalved", "Below-the-OS protection", "Intel Hardware Shield guards firmware and BIOS", "作業系統底下的防護"],
    ["FaMicrochip", "NPU for on-device AI", "AI effects run faster and use less power", "NPU 裝置端 AI"],
    ["FaBriefcase", "Built for business", "A stable platform for long-term fleet use", "為企業長期使用設計"],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, t, b, z] = vpro[i];
    const y = 1.8 + i * 1.12;
    await iconCircle(pres, s, 0.6, y, 0.75, ic, HEX.accent1, t);
    s.addText([{ text: t + "  ", options: { bold: true, fontSize: 17, color: C.text1 } }, { text: z, options: { fontSize: 12, color: C.accent1, fontFace: ZH, breakLine: true } },
      { text: b, options: { fontSize: 14, color: C.text2 } }],
      { x: 1.6, y: y - 0.05, w: 6.2, h: 0.95, valign: "middle", margin: 0, isTextBox: true });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.3, y: 1.8, w: 4.4, h: 2.35, rectRadius: 0.12, fill: { color: HEX.dk1 }, line: { color: HEX.dk1 }, objectName: "Downtime callout" });
  s.addText([{ text: "Days → Hours", options: { bold: true, fontSize: 36, color: "FFFFFF", breakLine: true } },
    { text: "Downtime when a PC fails (illustrative)", options: { fontSize: 13, color: "C9D6EA", breakLine: true } },
    { text: "停機時間從「天」縮短到「小時」（示意）", options: { fontSize: 12, color: "C9D6EA", fontFace: ZH } }],
    { x: 8.6, y: 1.95, w: 3.9, h: 2.05, valign: "middle", margin: 0, isTextBox: true });
  quoteCard(pres, s, 8.3, 4.35, 4.4, 2.3, "When a PC breaks, you don't need a faster PC. You need one that gets fixed faster.", "你需要的不是更快的電腦，是更快被修好的電腦。");
  s.addNotes(notes("For companies without IT, explain vPro as: the technician doesn't need to come on site.", "用「電腦行不用到現場」說明 vPro 最好懂。"));

  s = content(pres, "Positioning", "AI is already in your workflow", "AI 已經在你的工作流程裡");
  const ai = [
    ["FaComments", HEX.accent1, "Copilot", "Summarize documents, draft emails, capture meeting actions", "摘要、草擬、整理會議重點"],
    ["FaBolt", HEX.accent2, "Click to Do", "Select anything on screen to summarize, rewrite or look it up (Copilot+ PC)", "框選畫面即可處理"],
    ["FaRobot", HEX.accent3, "Agents", "Hand repetitive processes to AI, grounded in your own data and rules", "依公司資料與規則完成流程"],
  ];
  for (let i = 0; i < 3; i++) {
    const [ic, col, t, b, z] = ai[i];
    await card(pres, s, 0.6 + i * 4.1, 1.85, 3.9, 3.0, { icon: ic, iconFill: col, title: t, body: b, zh: z });
  }
  quoteCard(pres, s, 0.6, 5.1, 12.1, 1.5, "AI isn't only in the cloud. It's on your desk, running on your NPU.", "AI 不只在雲端，它就在你的桌上、在你的 NPU 裡。");
  s.addNotes(notes("Go straight to the demo after this slide: rather than tell you, let me show you.", "這頁之後直接切 Demo：「與其講，不如直接看。」"));

  s = content(pres, "Positioning", "Customer pain → highlight → result", "痛點對應亮點與結果");
  const hdr = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.dk1 }, fontSize: 13 } });
  const cell = (en, zh) => ({ text: [{ text: en, options: { breakLine: !!zh } }, ...(zh ? [{ text: zh, options: { fontFace: ZH, color: HEX.accent1, fontSize: 11 } }] : [])], options: { fontSize: 13, color: HEX.dk1 } });
  const rows = [
    ["Lost laptop, leaked data", "筆電遺失、資料外洩", "BitLocker, Windows Hello, Intune remote wipe", "You lose the hardware, not the client data"],
    ["New hires wait 1–2 days", "新人到職要裝一兩天", "Windows Autopilot + Intune", "Productive on day one"],
    ["Waiting days for repairs", "電腦壞了要等人來修", "Intel vPro remote management", "Downtime from days to hours"],
    ["No idea who is patched", "不知道每台有沒有更新", "Windows Autopatch, Intune compliance reports", "Audit-ready reports"],
    ["Repetitive paperwork", "重複的整理與寫作", "Copilot, Click to Do, agents", "Hours back every week"],
    ["Poor video on the road", "外出視訊品質差、耗電", "Studio Effects on the NPU, Core Ultra efficiency", "Professional anywhere"],
  ];
  s.addTable([[hdr("Customer pain"), hdr("Windows 11 + Intel highlight"), hdr("Result")],
    ...rows.map((r) => [cell(r[0], r[1]), cell(r[2]), cell(r[3])])],
    { x: 0.6, y: 1.75, w: 12.1, colW: [3.6, 5.0, 3.5], rowH: 0.62, border: { type: "solid", color: "D8DFEA", pt: 0.75 }, fill: { color: "FFFFFF" }, valign: "middle", margin: 0.08 });
  s.addNotes(notes("Use this table to decide which demo segment to stretch. Point at the row the customer picked.", "依客戶選的痛點，決定 Demo 哪一段多停留。"));

  pres.addSection({ title: "Demo" });
  s = content(pres, "Demo", "Demo: a day in one employee's life", "Demo：跟著會計小美過一天（10 分鐘）");
  const day = [
    ["08:30", "Onboard", "Autopilot sets up the PC at sign-in", "到職：開箱登入自動設定"],
    ["10:00", "On the road", "Face sign-in, encrypted drive", "外出：臉部登入、資料加密"],
    ["14:00", "Get work done", "Copilot, Click to Do, the agent", "工作：AI 摘要與提案信"],
    ["15:30", "Meet clients", "Studio Effects on the NPU", "開會：視訊效果"],
    ["17:00", "Something breaks", "vPro remote repair", "出狀況：遠端修復"],
    ["17:30", "Wrap up", "Book the refresh assessment", "收尾：約健檢"],
  ];
  s.addShape(pres.shapes.LINE, { x: 1.1, y: 2.55, w: 11.2, h: 0, line: { color: "C9D3E3", width: 3 }, objectName: "Timeline" });
  for (let i = 0; i < 6; i++) {
    const [t, h, b, z] = day[i];
    const x = 0.6 + i * 2.03;
    s.addShape(pres.shapes.OVAL, { x: x + 0.72, y: 2.33, w: 0.44, h: 0.44, fill: { color: i === 4 ? HEX.accent4 : HEX.accent1 }, line: { color: "FFFFFF", width: 2 }, objectName: h + " dot" });
    s.addText(t, { x, y: 1.75, w: 1.9, h: 0.4, fontSize: 15, bold: true, color: C.accent1, align: "center", margin: 0, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 3.05, w: 1.9, h: 2.05, rectRadius: 0.08, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: h });
    s.addText([{ text: h, options: { bold: true, fontSize: 15, color: C.text1, breakLine: true } }, { text: b, options: { fontSize: 13, color: C.text2, breakLine: true } },
      { text: z, options: { fontSize: 11, color: C.accent1, fontFace: ZH } }], { x: x + 0.15, y: 3.2, w: 1.6, h: 1.85, valign: "top", margin: 0, paraSpaceAfter: 5, isTextBox: true });
  }
  s.addText("Before each segment say “Next you'll see…”; after it say “What this means is…”.   每段先說「接下來你會看到」，演完說「這代表」。",
    { x: 0.6, y: 5.4, w: 12.1, h: 0.6, fontSize: 13, color: C.text2, margin: 0, isTextBox: true });
  s.addNotes(notes("A story is easier to remember than a feature tour. Keep a recording of Autopilot and vPro on the desktop as a backup if the network fails.",
    "包裝成一天的故事；Autopilot 與 vPro 準備錄影備案。"));

  pres.addSection({ title: "Offer" });
  s = content(pres, "Offer", "One complete refresh offer", "一次到位的換機方案：裝置 + 軟體 + 服務");
  await card(pres, s, 0.6, 1.8, 3.9, 3.5, { icon: "FaLaptop", title: "Devices · by role", body: "S1 Essential: admin, front desk\nS2 Secure (vPro): finance, sales\nS3 AI (Copilot+ PC): managers, travelers", zh: "依職務分三級，不是每人都買最貴的" });
  await card(pres, s, 4.7, 1.8, 3.9, 3.5, { icon: "FaCloud", iconFill: HEX.accent2, title: "Software", body: "Windows 11 Pro\nMicrosoft 365 Business Premium (Intune, advanced security)", zh: "軟體授權與管理" });
  await card(pres, s, 8.8, 1.8, 3.9, 3.5, { icon: "FaHandshake", iconFill: HEX.accent3, title: "Services", body: "Autopilot deployment · data migration · on-site warranty · installments or leasing", zh: "部署、搬移、保固、分期租賃" });
  quoteCard(pres, s, 0.6, 5.5, 12.1, 1.2, "We don't sell a computer. We deliver a work environment that's ready to go.", "不是賣一台電腦，是交付一個準備好的工作環境。");
  s.addNotes(notes("Don't quote prices here. Say we configure by role; pricing comes in the next meeting.", "這頁不報價，報價留到下一次會議。"));

  s = content(pres, "Offer", "Why this approach grows partner revenue", "為何這樣賣能提升銷售（示範數字）");
  s.addChart(pres.charts.BAR, [{ name: "Average selling price (NT$)", labels: ["Devices only", "Role-based bundle"], values: [30000, 38000] }], {
    x: 0.6, y: 1.75, w: 5.6, h: 4.6, barDir: "col", chartColors: [HEX.accent6, HEX.accent1], showLegend: false,
    showTitle: true, title: "Avg. price per device, 18-PC deal (illustrative)", titleFontSize: 13, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk2, catAxisLabelFontSize: 13, catAxisLabelFontFace: "+mn-lt", valAxisHidden: true,
    valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" }, barGapWidthPct: 60,
  });
  const why2 = [
    ["FaMoneyBillTrendUp", "Higher average price", "Key roles move up to vPro and Copilot+ PC", "平均單價提升"],
    ["FaBoxOpen", "Higher attach rate", "Microsoft 365, deployment, migration, warranty", "加購率提升"],
    ["FaBolt", "Shorter sales cycle", "The demo lets decision-makers agree in one meeting", "成交週期縮短"],
    ["FaRotate", "Recurring revenue", "Managed Intune, Autopatch and vPro support as a monthly service", "經常性收入"],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, t, b, z] = why2[i];
    const y = 1.85 + i * 1.12;
    await iconCircle(pres, s, 6.6, y, 0.7, ic, HEX.accent3, t);
    s.addText([{ text: t + "  ", options: { bold: true, fontSize: 16, color: C.text1 } }, { text: z, options: { fontSize: 12, color: C.accent1, fontFace: ZH, breakLine: true } },
      { text: b, options: { fontSize: 14, color: C.text2 } }], { x: 7.5, y: y - 0.08, w: 5.2, h: 0.9, valign: "middle", margin: 0, isTextBox: true });
  }
  s.addText("Figures are illustrative for practice. 數字為練習用示範。", { x: 6.6, y: 6.4, w: 6.1, h: 0.3, fontSize: 10, color: C.accent6, margin: 0, isTextBox: true });
  s.addNotes(notes("Illustrative mix: 4 × S1, 11 × S2, 3 × S3 averages about NT$38,000 versus NT$30,000 for entry devices only, before services.",
    "示範組合：4 台 S1 + 11 台 S2 + 3 台 S3，平均約 NT$38,000；請換成實際報價。"));

  pres.addSection({ title: "Close" });
  s = dark(pres, "Close", "NEXT STEP", "A 30-minute refresh assessment", "下一步：30 分鐘換機健檢");
  const steps = [["1", "Inventory current PCs", "盤點現有電腦"], ["2", "Tier devices by role", "依職務分級"], ["3", "Timeline and budget plan", "換機時程與預算"]];
  for (let i = 0; i < 3; i++) {
    const x = 0.7 + i * 2.6;
    s.addShape(pres.shapes.OVAL, { x, y: 4.2, w: 0.55, h: 0.55, fill: { color: HEX.accent5 }, line: { color: HEX.accent5 }, objectName: "Step " + steps[i][0] });
    s.addText(steps[i][0], { x, y: 4.2, w: 0.55, h: 0.55, fontSize: 16, bold: true, color: HEX.dk1, align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText([{ text: steps[i][1], options: { fontSize: 15, color: "FFFFFF", bold: true, breakLine: true } }, { text: steps[i][2], options: { fontSize: 12, color: "C9D6EA", fontFace: ZH } }],
      { x: x + 0.7, y: 4.1, w: 1.8, h: 0.8, margin: 0, valign: "middle", isTextBox: true });
  }
  quoteCard(pres, s, 8.1, 3.95, 4.6, 2.6, "A PC refresh isn't a cost. It's trading risk for productivity.", "換機不是成本，是把風險換成生產力。", true);
  s.addNotes(notes("End with one action only. Take out your calendar and book the assessment on the spot.", "結尾只給一個行動，現場拿出行事曆約時間。"));

  const file = path.join(OUT, "01_Windows11_Positioning_Demo_EN.pptx");
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

// ---------------------------------------------------------------- Deck 2
async function agentDeck() {
  const pres = newDeck("Build Your Agent: Windows 11 Refresh Advisor");
  const C = pres.SchemeColor;

  pres.addSection({ title: "Open" });
  let s = dark(pres, "Open", "HANDS-ON LAB · DAY 1", "Build Your Agent: Windows 11 Refresh Advisor", "打造代理程式：Windows 11 換機顧問");
  quoteCard(pres, s, 0.7, 4.3, 7.4, 1.6, "Agents don't replace salespeople. They make every salesperson perform like a senior one.", "代理程式不取代業務，它讓每個業務都像資深業務。", true);
  s.addNotes(notes("Three minutes: the problem, the agent at work, the result.", "三分鐘：問題、代理程式現場運作、成果。"));

  pres.addSection({ title: "Problem and design" });
  s = content(pres, "Problem and design", "Every refresh proposal takes half a day", "業務每做一份換機建議要半天");
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 0.6, y: 1.8, w: 5.4, h: 4.6, rectRadius: 0.12, fill: { color: HEX.dk1 }, line: { color: HEX.dk1 }, objectName: "Time callout" });
  s.addText([{ text: "Half a day", options: { fontSize: 40, bold: true, color: "A9B9D6", breakLine: true } }, { text: "↓", options: { fontSize: 30, color: HEX.accent5, breakLine: true } },
    { text: "3 minutes", options: { fontSize: 54, bold: true, color: "FFFFFF", breakLine: true } }, { text: "per proposal · 每份提案", options: { fontSize: 14, color: "C9D6EA", fontFace: ZH } }],
    { x: 0.9, y: 2.0, w: 4.8, h: 4.2, align: "center", valign: "middle", margin: 0, isTextBox: true });
  const before = [
    ["FaFileLines", "Digging through spec sheets", "翻規格表"],
    ["FaComments", "Asking product managers", "問產品經理"],
    ["FaEnvelope", "Writing every email from scratch", "每封信從頭寫"],
    ["FaTriangleExclamation", "Advice differs from rep to rep", "每個業務的建議不一致"],
  ];
  for (let i = 0; i < 4; i++) {
    const y = 1.9 + i * 1.12;
    await iconCircle(pres, s, 6.5, y, 0.7, before[i][0], HEX.accent4, before[i][1]);
    s.addText([{ text: before[i][1], options: { fontSize: 17, bold: true, color: C.text1, breakLine: true } }, { text: before[i][2], options: { fontSize: 12, color: C.accent1, fontFace: ZH } }],
      { x: 7.4, y: y - 0.05, w: 5.3, h: 0.8, valign: "middle", margin: 0, isTextBox: true });
  }
  s.addNotes(notes("Today a rep digs through spec sheets, asks product managers and writes the email. The agent does it in three minutes with consistent advice.", "說明現況痛點，再翻到下一頁看代理程式怎麼做。"));

  s = content(pres, "Problem and design", "How the agent works", "代理程式如何運作（五個步驟）");
  const flow = [
    ["FaUserTie", "Rep describes the customer", "業務輸入客戶狀況"],
    ["FaListCheck", "Agent asks what's missing", "缺的資訊一次問完"],
    ["FaFileLines", "Applies our tier rules", "依知識檔分級配機"],
    ["FaChartLine", "Table and three reasons", "建議表與換機理由"],
    ["FaEnvelope", "Proposal email", "提案 email"],
  ];
  for (let i = 0; i < 5; i++) {
    const x = 0.6 + i * 2.48;
    await card(pres, s, x, 1.95, 2.2, 2.75, { icon: flow[i][0], iconFill: i === 4 ? HEX.accent3 : HEX.accent1, title: flow[i][1], zh: flow[i][2], titleSize: 15 });
    if (i < 4) s.addShape(pres.shapes.CHEVRON, { x: x + 2.25, y: 3.15, w: 0.18, h: 0.4, fill: { color: HEX.accent6 }, line: { color: HEX.accent6 }, objectName: "Arrow" });
  }
  quoteCard(pres, s, 0.6, 5.0, 12.1, 1.6, "Give it your data and your rules, and it gives you consistent answers.", "給它你的資料、你的規則，它就給你一致的答案。");
  s.addNotes(notes("The agent never invents models or prices: it only uses the tier sheet we uploaded.", "代理程式只用我們上傳的分級表，不會亂報價。"));

  s = content(pres, "Problem and design", "What's inside the agent", "代理程式的三個組成");
  await card(pres, s, 0.6, 1.8, 3.9, 2.9, { icon: "FaListCheck", title: "Instructions", body: "Role, data rules, a six-step conversation flow, tone and format", zh: "指令：工作守則與對話流程" });
  await card(pres, s, 4.7, 1.8, 3.9, 2.9, { icon: "FaFileLines", iconFill: HEX.accent2, title: "Knowledge", body: "Device tier sheet · Windows 10 refresh FAQ · talk tracks and email template", zh: "知識：三份檔案" });
  await card(pres, s, 8.8, 1.8, 3.9, 2.9, { icon: "FaBolt", iconFill: HEX.accent3, title: "Starter prompts", body: "Plan a refresh · Handle “it still works” · Write the email · Explain Copilot+ PC", zh: "開場提示：一鍵送出" });
  s.addText([{ text: "Built with Agent Builder in Microsoft 365 Copilot in about 30 minutes. Advanced: Copilot Studio topic + publish to Teams.", options: { fontSize: 14, color: C.text2, breakLine: true } },
    { text: "用 Microsoft 365 Copilot 的 Agent Builder 約 30 分鐘完成；進階版用 Copilot Studio 並發布到 Teams。", options: { fontSize: 12, color: C.accent1, fontFace: ZH } }],
    { x: 0.6, y: 5.0, w: 12.1, h: 0.8, margin: 0, isTextBox: true });
  s.addNotes(notes("If you can use Word, you can build an agent: no code, just clear rules and good data.", "會用 Word 的人，就會做代理程式。"));

  pres.addSection({ title: "Demo" });
  s = content(pres, "Demo", "Live demo: three minutes", "現場展示：3 分鐘腳本");
  const script = [
    ["0:00", "Open with the pain", "Half a day per proposal", "開場痛點"],
    ["0:25", "Open the agent", "It only uses our own data", "開啟代理程式"],
    ["0:45", "Plan a refresh", "25-person accounting firm", "點規劃換機方案"],
    ["1:20", "Walk the table", "S2 for accountants, total 18", "說明建議表"],
    ["1:55", "Write the email", "Ready to send", "產出提案信"],
    ["2:30", "Land the result", "3 minutes, consistent advice", "收尾成果"],
  ];
  for (let i = 0; i < 6; i++) {
    const [t, h, b, z] = script[i];
    const col = i % 3, row = Math.floor(i / 3);
    const x = 0.6 + col * 4.1, y = 1.8 + row * 1.65;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y, w: 3.9, h: 1.5, rectRadius: 0.1, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: h });
    s.addText(t, { x: x + 0.25, y: y + 0.2, w: 1.1, h: 0.5, fontSize: 22, bold: true, color: C.accent1, margin: 0, isTextBox: true });
    s.addText([{ text: h, options: { bold: true, fontSize: 16, color: C.text1, breakLine: true } }, { text: b, options: { fontSize: 14, color: C.text2, breakLine: true } },
      { text: z, options: { fontSize: 12, color: C.accent1, fontFace: ZH } }], { x: x + 1.35, y: y + 0.18, w: 2.4, h: 1.25, valign: "top", margin: 0, isTextBox: true });
  }
  s.addText("Finish at 2:50 with the key line.  2:50 用金句結尾。", { x: 0.6, y: 5.3, w: 12.1, h: 0.4, fontSize: 13, color: C.text2, margin: 0, isTextBox: true });
  s.addNotes(notes("While the agent is thinking, describe the customer scenario. Never stay silent.", "AI 回答時用等待時間講客戶情境，不要沉默。"));

  s = content(pres, "Demo", "Sample output: 18 PCs, tiered by role", "範例輸出：18 台依職務分級（示範資料）");
  const th = (t) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: HEX.dk1 }, fontSize: 13 } });
  const td = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 13, color: HEX.dk1 }, o) });
  s.addTable([
    [th("Role group 職務"), th("PCs"), th("Tier"), th("Main reason"), th("Unit price (NT$)"), th("Subtotal (NT$)")],
    [td("Accountants 會計人員"), td("11"), td("S2 Secure"), td("Client data, no IT, vPro remote repair"), td("35,000–40,000"), td("385,000–440,000")],
    [td("Partners & managers 主管"), td("3"), td("S3 AI"), td("Travel, daily video calls"), td("45,000–55,000"), td("135,000–165,000")],
    [td("Admin 行政"), td("4"), td("S1 Essential"), td("Office work at a fixed desk"), td("28,000–32,000"), td("112,000–128,000")],
    [td("Total 總計", { bold: true }), td("18", { bold: true }), td(""), td("Reference prices, subject to quote", { italic: true, color: HEX.dk2 }), td(""), td("632,000–733,000", { bold: true })],
  ], { x: 0.6, y: 1.8, w: 12.1, colW: [2.6, 0.8, 1.5, 3.6, 1.8, 1.8], rowH: 0.62, border: { type: "solid", color: "D8DFEA", pt: 0.75 }, fill: { color: "FFFFFF" }, valign: "middle", margin: 0.08 });
  quoteCard(pres, s, 0.6, 5.2, 12.1, 1.45, "From half a day to three minutes. The time saved is one more customer visit.", "從半天到三分鐘，省下的時間就是多拜訪一個客戶。");
  s.addNotes(notes("Point out that the S3 tier exceeds the NT$40,000 budget and the agent explains the trade-off.", "指出 S3 超出預算，代理程式有說明取捨。"));

  pres.addSection({ title: "Close" });
  s = dark(pres, "Close", "WHAT CHANGES", "Every rep gives senior-level advice", "每個業務都給出資深業務等級的建議");
  const impact = [["Faster", "3 min per proposal", "更快"], ["Consistent", "Same rules for every rep", "更一致"], ["Easy", "No code, built in 30 min", "更簡單"]];
  for (let i = 0; i < 3; i++) {
    s.addText([{ text: impact[i][0], options: { fontSize: 22, bold: true, color: HEX.accent5, breakLine: true } }, { text: impact[i][1], options: { fontSize: 14, color: "FFFFFF", breakLine: true } },
      { text: impact[i][2], options: { fontSize: 12, color: "C9D6EA", fontFace: ZH } }], { x: 0.7 + i * 2.6, y: 4.2, w: 2.4, h: 1.3, margin: 0, valign: "top", isTextBox: true });
  }
  quoteCard(pres, s, 8.1, 3.95, 4.6, 2.6, "If you can use Word, you can build an agent.", "會用 Word 的人，就會做代理程式。", true);
  s.addNotes(notes("Close with the key line and offer to share the instructions and knowledge files.", "以金句收尾，並表示可分享指令與知識檔。"));

  const file = path.join(OUT, "02_Agent_Lab_Demo_EN.pptx");
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

// ---------------------------------------------------------------- Deck 3
async function planDeck() {
  const pres = newDeck("90-Day SMB Acceleration Plan");
  const C = pres.SchemeColor;

  pres.addSection({ title: "Open" });
  let s = dark(pres, "Open", "DAY 2 · GROUP WORKSHOP REPORT", "90-Day SMB Acceleration Plan", "90 天 SMB 加速作戰計畫：安心辦公換機包");
  quoteCard(pres, s, 0.7, 4.3, 7.4, 1.6, "In 90 days, get 18 professional-services firms working with peace of mind.", "90 天內，讓 18 家專業服務業客戶換上安心辦公。", true);
  s.addNotes(notes("Open with the one-line plan. You have three minutes.", "用一句話開場，全程三分鐘。"));

  pres.addSection({ title: "Plan" });
  s = content(pres, "Plan", "Who we target and why", "目標客群與換機觸發點");
  await card(pres, s, 0.6, 1.8, 4.6, 4.8, { icon: "FaBullseye", title: "Target segment", body: "Professional-services firms in Greater Taipei with 25–100 people: accounting, law, consulting, architecture. Still on Windows 10. No dedicated IT.", zh: "雙北 25–100 人專業服務業，仍用 Windows 10，沒有專職 IT" });
  const pains = [["FaLock", "Client data leaks", "Legal and reputation risk", "客戶資料外洩"], ["FaScrewdriverWrench", "Waiting days for IT", "Outsourced support is slow", "等外包人員修電腦"], ["FaClock", "Hours on paperwork", "Documents and letters by hand", "文件整理耗時"]];
  for (let i = 0; i < 3; i++) {
    const y = 1.8 + i * 1.12;
    await iconCircle(pres, s, 5.6, y, 0.7, pains[i][0], HEX.accent4, pains[i][1]);
    s.addText([{ text: pains[i][1] + "  ", options: { fontSize: 16, bold: true, color: C.text1 } }, { text: pains[i][3], options: { fontSize: 12, color: C.accent1, fontFace: ZH, breakLine: true } },
      { text: pains[i][2], options: { fontSize: 14, color: C.text2 } }], { x: 6.5, y: y - 0.08, w: 6.2, h: 0.9, valign: "middle", margin: 0, isTextBox: true });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 5.6, y: 5.3, w: 7.1, h: 1.3, rectRadius: 0.1, fill: { color: "F1ECFB" }, line: { color: "F1ECFB" }, objectName: "Triggers" });
  s.addText([{ text: "Triggers: tax season (May), client audits, a lost or infected laptop", options: { fontSize: 15, bold: true, color: C.text1, breakLine: true } },
    { text: "換機觸發點：5 月報稅季前、客戶或主管機關稽核、發生遺失或中毒事件", options: { fontSize: 12, color: C.accent2, fontFace: ZH } }],
    { x: 5.85, y: 5.35, w: 6.6, h: 1.2, valign: "middle", margin: 0, isTextBox: true });
  s.addNotes(notes("Why this segment: sensitive data makes security tangible, no IT makes vPro and services valuable, and associations let us reach them efficiently.", "為什麼選這個客群：資安最有感、沒有 IT、可透過公會集中接觸。"));

  s = content(pres, "Plan", "The offer: Peace of Mind Refresh Bundle", "主打方案：安心辦公換機包");
  const parts = [
    ["FaLaptop", HEX.accent1, "Devices", "Intel vPro Windows 11 Pro laptops; Copilot+ PCs for managers", "裝置"],
    ["FaCloud", HEX.accent2, "Software", "Microsoft 365 Business Premium", "軟體"],
    ["FaHandshake", HEX.accent3, "Services", "Autopilot deployment, data migration, 3-year on-site warranty", "服務"],
    ["FaCoins", HEX.accent4, "Financing", "36-month installments or leasing", "分期與租賃"],
  ];
  for (let i = 0; i < 4; i++) {
    const [ic, col, t, b, z] = parts[i];
    await card(pres, s, 0.6 + i * 3.08, 1.85, 2.9, 3.3, { icon: ic, iconFill: col, title: t, body: b, zh: z });
  }
  quoteCard(pres, s, 0.6, 5.4, 12.1, 1.25, "SMB owners don't buy specs. They buy peace of mind.", "SMB 老闆不買規格，買的是「不用煩惱」。");
  s.addNotes(notes("Without Business Premium, Autopilot, Intune and advanced security don't work, and peace of mind is just a slogan. It also creates monthly recurring revenue.", "為什麼一定要包 M365 商務進階版。"));

  s = content(pres, "Plan", "The 90-day rhythm", "90 天活動節奏：名單 → 會議 → 成交");
  const phases = [
    ["Days 1–30", "Leads", "Train 10 core resellers (pitch + agent). Co-branded email: “Windows 10 support has ended. Is your client data safe?”", "建立名單：經銷商訓練、共同品牌 EDM", HEX.accent1],
    ["Days 31–60", "Meetings", "Resellers run 30-minute refresh assessments with our demo units. Two security seminars with the accountants' association.", "轉成會議：換機健檢、公會資安講座", HEX.accent2],
    ["Days 61–90", "Deals", "Proposal within a week of each assessment. Quarter-end promotion and financing. Record one customer story.", "轉成訂單：一週內提案、季末促銷", HEX.accent3],
  ];
  for (let i = 0; i < 3; i++) {
    const [d, t, b, z, col] = phases[i];
    const x = 0.6 + i * 4.1;
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 1.8, w: 3.9, h: 0.75, rectRadius: 0.1, fill: { color: col }, line: { color: col }, objectName: d });
    s.addText([{ text: d + "  ", options: { fontSize: 14, color: "FFFFFF" } }, { text: t, options: { fontSize: 18, bold: true, color: "FFFFFF" } }], { x: x + 0.25, y: 1.8, w: 3.4, h: 0.75, valign: "middle", margin: 0, isTextBox: true });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x, y: 2.7, w: 3.9, h: 2.3, rectRadius: 0.1, fill: { color: HEX.lt2 }, line: { color: HEX.lt2 }, objectName: t + " detail" });
    s.addText([{ text: b, options: { fontSize: 14, color: C.text1, breakLine: true } }, { text: z, options: { fontSize: 12, color: C.accent1, fontFace: ZH } }],
      { x: x + 0.25, y: 2.85, w: 3.4, h: 2.05, valign: "top", margin: 0, paraSpaceAfter: 8, isTextBox: true });
  }
  s.addText("The assessment is the key step: it is where the demo happens.   健檢是關鍵一步，Demo 在這裡發生。", { x: 0.6, y: 5.35, w: 12.1, h: 0.5, fontSize: 14, bold: true, color: C.text1, margin: 0, isTextBox: true });
  s.addNotes(notes("Stress the assessment step. Everything in month one exists to fill assessments in month two.", "強調健檢是關鍵一步。"));

  s = content(pres, "Plan", "KPI funnel: 600 leads → 18 customers", "KPI 漏斗與轉換率");
  s.addChart(pres.charts.BAR, [{ name: "Funnel", labels: ["Leads 名單", "Assessments 健檢", "Proposals 提案", "Deals 成交"], values: [600, 90, 45, 18] }], {
    x: 0.6, y: 1.75, w: 7.4, h: 4.8, barDir: "bar", chartColors: [HEX.accent1], showLegend: false, catAxisOrientation: "maxMin",
    showTitle: true, title: "90-day funnel (count)", titleFontSize: 13, titleColor: HEX.dk1, titleFontFace: "+mn-lt",
    showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 13, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt",
    catAxisLabelColor: HEX.dk2, catAxisLabelFontSize: 13, catAxisLabelFontFace: ZH, valAxisHidden: true,
    valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" }, barGapWidthPct: 50,
  });
  const rates = [["15%", "lead → assessment"], ["50%", "assessment → proposal"], ["40%", "proposal → deal"]];
  for (let i = 0; i < 3; i++) {
    s.addText([{ text: rates[i][0], options: { fontSize: 30, bold: true, color: C.accent1, breakLine: true } }, { text: rates[i][1], options: { fontSize: 13, color: C.text2 } }],
      { x: 8.4, y: 1.8 + i * 1.1, w: 4.3, h: 1.0, margin: 0, valign: "middle", isTextBox: true });
  }
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 8.4, y: 5.2, w: 4.3, h: 1.35, rectRadius: 0.1, fill: { color: HEX.dk1 }, line: { color: HEX.dk1 }, objectName: "Devices callout" });
  s.addText([{ text: "≈ 540 devices", options: { fontSize: 26, bold: true, color: "FFFFFF", breakLine: true } }, { text: "18 customers × 30 PCs · review every 30 days", options: { fontSize: 12, color: "C9D6EA", breakLine: true } },
    { text: "約 540 台，每 30 天檢核", options: { fontSize: 12, color: "C9D6EA", fontFace: ZH } }], { x: 8.65, y: 5.25, w: 3.9, h: 1.25, valign: "middle", margin: 0, isTextBox: true });
  s.addNotes(notes("Say the conversion rates out loud so the numbers sound grounded. If day 30 shows 8% instead of 15%, budget moves from email to seminars.", "把轉換率說出來；第 30 天落後就調整預算。"));

  s = content(pres, "Plan", "What we need, and the risks we'll manage", "需要的資源與風險對策");
  const asks = [["1", "Demo units", "Our highest-converting step", "示範機"], ["2", "Traditional Chinese content", "Ready-to-use for resellers", "繁體中文素材"], ["3", "Co-marketing funds", "For the association seminars", "聯合行銷基金"]];
  s.addText("OUR ASKS  資源需求", { x: 0.6, y: 1.8, w: 5.6, h: 0.35, fontSize: 13, bold: true, color: C.accent1, charSpacing: 2, margin: 0, isTextBox: true });
  for (let i = 0; i < 3; i++) {
    const y = 2.3 + i * 1.3;
    s.addShape(pres.shapes.OVAL, { x: 0.6, y, w: 0.7, h: 0.7, fill: { color: HEX.accent1 }, line: { color: HEX.accent1 }, objectName: "Ask " + asks[i][0] });
    s.addText(asks[i][0], { x: 0.6, y, w: 0.7, h: 0.7, fontSize: 20, bold: true, color: "FFFFFF", align: "center", valign: "middle", margin: 0, isTextBox: true });
    s.addText([{ text: asks[i][1] + "  ", options: { fontSize: 17, bold: true, color: C.text1 } }, { text: asks[i][3], options: { fontSize: 12, color: C.accent1, fontFace: ZH, breakLine: true } },
      { text: asks[i][2], options: { fontSize: 14, color: C.text2 } }], { x: 1.5, y: y - 0.08, w: 4.8, h: 0.9, valign: "middle", margin: 0, isTextBox: true });
  }
  await card(pres, s, 6.8, 1.8, 5.9, 2.25, { icon: "FaGraduationCap", iconFill: HEX.accent4, title: "Risk: resellers are new to Intune and Autopilot", body: "Mitigation: we deliver deployment as a service; resellers just sell.", zh: "對策：部署服務由代理商代工" });
  await card(pres, s, 6.8, 4.25, 5.9, 2.25, { icon: "FaCoins", iconFill: HEX.accent4, title: "Risk: customers lack budget", body: "Mitigation: phase the refresh and offer leasing.", zh: "對策：分批換機與租賃方案" });
  s.addNotes(notes("Prioritize the asks: demo units first because the demo converts best.", "資源依優先順序說，示範機第一。"));

  pres.addSection({ title: "Close" });
  s = dark(pres, "Close", "OUR COMMITMENT", "18 customers · 540 devices · 90 days", "18 家客戶 · 約 540 台 · 90 天");
  s.addText([{ text: "A distributor's job is to help every reseller sell like the vendor itself.", options: { fontSize: 16, color: "FFFFFF", breakLine: true } },
    { text: "代理商的工作，是讓每一家經銷商都賣得像原廠。", options: { fontSize: 13, color: "C9D6EA", fontFace: ZH } }], { x: 0.7, y: 4.2, w: 7.3, h: 1.2, margin: 0, isTextBox: true });
  quoteCard(pres, s, 8.1, 3.95, 4.6, 2.6, "We're not selling computers. We're helping customers shut down their risk before tax season.", "我們不是在賣電腦，是在幫客戶在報稅季前把風險關掉。", true);
  s.addNotes(notes("Close with the key line, then thank the group.", "以金句收尾並感謝小組。"));

  const file = path.join(OUT, "03_SMB_90Day_Plan_Report_EN.pptx");
  await pres.writeFile({ fileName: file });
  await applyTheme(file, THEME);
  return file;
}

(async () => {
  for (const f of [pitchDeck, agentDeck, planDeck]) console.log("wrote", await f());
})().catch((e) => { console.error(e); process.exit(1); });

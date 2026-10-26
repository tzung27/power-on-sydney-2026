// Builds the Chinese step-by-step guide (DOCX) with the exported diagrams.
const fs = require("fs");
const path = require("path");
const {
  Document, Packer, Paragraph, TextRun, ImageRun, Table, TableRow, TableCell, WidthType, ShadingType, BorderStyle,
  HeadingLevel, AlignmentType, LevelFormat, PageBreak, Header, Footer, PageNumber, TableOfContents, TabStopType,
} = require("docx");

const OUT = process.argv[2];
const DIAG = path.join(__dirname, "diag");
const C = { navy: "0D1B33", ink: "1F2A3D", muted: "55627A", blue: "0A5BD3", jac: "6B42C4", green: "16764A", orange: "B45F06",
  line: "D8DFEA", tintBlue: "E2ECFC", tintJac: "F1ECFB", tintGreen: "E0F2E8", tintOrange: "FBEEDD", tintGrey: "EEF3FA" };
const FONT = { ascii: "Segoe UI", hAnsi: "Segoe UI", eastAsia: "Microsoft JhengHei", cs: "Segoe UI" };
const TW = 9026; // A4 with 1" margins
let body = [];
let numbering = [];
let listId = 0;

// "**bold**" inline markup → runs
function runs(text, o = {}) {
  return String(text).split("**").map((part, i) => new TextRun({ text: part, bold: o.bold || i % 2 === 1, color: o.color, size: o.size, italics: o.italics, font: o.font }));
}
const P = (text, o = {}) => body.push(new Paragraph({ children: runs(text, o), spacing: { after: o.after ?? 120, line: 340 }, alignment: o.align }));
let PB = true; // page break before each chapter (combined guide only)
const H1 = (text) => { body.push({ __chapter: text }); body.push(new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)], pageBreakBefore: PB })); };
const H2 = (text) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] }));
const H3 = (text) => body.push(new Paragraph({ heading: HeadingLevel.HEADING_3, children: [new TextRun(text)] }));

function bullets(items, level = 0) {
  items.forEach((it) => body.push(new Paragraph({ numbering: { reference: "bullets", level }, children: runs(it), spacing: { after: 60, line: 320 } })));
}
// Numbered steps that restart for every list; each item may carry detail bullets.
function steps(items, cont = false) {
  const ref = `steps-${cont ? listId : ++listId}`;
  if (!cont) numbering.push({ reference: ref, levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "步驟 %1.", alignment: AlignmentType.LEFT,
    style: { paragraph: { indent: { left: 900, hanging: 900 } }, run: { bold: true, color: C.blue } } }] });
  items.forEach((it) => {
    const [title, ...detail] = Array.isArray(it) ? it : [it];
    body.push(new Paragraph({ numbering: { reference: ref, level: 0 }, children: runs(title, { bold: true }), spacing: { before: 120, after: 60 } }));
    detail.forEach((d) => body.push(new Paragraph({ numbering: { reference: "bullets", level: 1 }, children: runs(d), spacing: { after: 40, line: 320 } })));
  });
}

const border = { style: BorderStyle.SINGLE, size: 4, color: C.line };
const borders = { top: border, bottom: border, left: border, right: border };
function cell(text, width, o = {}) {
  const lines = String(text).split("\n");
  return new TableCell({
    width: { size: width, type: WidthType.DXA }, borders,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: "auto" } : undefined,
    margins: { top: 70, bottom: 70, left: 110, right: 110 },
    children: lines.map((l) => new Paragraph({ children: runs(l, { bold: o.bold, color: o.color, size: o.size || 20 }), spacing: { after: 30, line: 300 } })),
  });
}
function table(headers, rows, widths, o = {}) {
  const sum = widths.reduce((a, b) => a + b, 0);
  const w = widths.map((x) => Math.round((x / sum) * TW));
  w[w.length - 1] += TW - w.reduce((a, b) => a + b, 0);
  const head = new TableRow({ tableHeader: true, children: headers.map((h, i) => cell(h, w[i], { fill: C.navy, color: "FFFFFF", bold: true })) });
  const body2 = rows.map((r, ri) => new TableRow({ cantSplit: true, children: r.map((v, i) => cell(v, w[i], { fill: o.zebra && ri % 2 ? C.tintGrey : undefined, bold: o.boldFirst && i === 0 })) }));
  body.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: w, rows: [head, ...body2] }));
  body.push(new Paragraph({ children: [], spacing: { after: 120 } }));
}
// Shaded single-cell box for tips, warnings and copyable text.
function box(title, lines, fill = C.tintBlue, color = C.blue) {
  const kids = [];
  if (title) kids.push(new Paragraph({ children: [new TextRun({ text: title, bold: true, color })], spacing: { after: 60 } }));
  lines.forEach((l) => kids.push(new Paragraph({ children: runs(l, { size: 20 }), spacing: { after: 40, line: 300 } })));
  body.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], rows: [new TableRow({ cantSplit: true, children: [new TableCell({
    width: { size: TW, type: WidthType.DXA }, shading: { fill, type: ShadingType.CLEAR, color: "auto" },
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    margins: { top: 140, bottom: 140, left: 200, right: 200 }, children: kids })] })] }));
  body.push(new Paragraph({ children: [], spacing: { after: 120 } }));
}
const tip = (title, lines) => box(title, lines, C.tintBlue, C.blue);
const warn = (title, lines) => box(title, lines, C.tintOrange, C.orange);
const code = (title, text) => box(title, text.split("\n"), C.tintGrey, C.muted);
function quotes(pairs) {
  const kids = [new Paragraph({ children: [new TextRun({ text: "金句 KEY LINES", bold: true, color: C.jac })], spacing: { after: 80 } })];
  pairs.forEach(([zh, en]) => {
    kids.push(new Paragraph({ children: [new TextRun({ text: "「" + zh + "」", bold: true, size: 24, color: C.navy })], spacing: { after: 20 } }));
    kids.push(new Paragraph({ children: [new TextRun({ text: en, italics: true, font: "Cambria", size: 21, color: C.muted })], spacing: { after: 100 } }));
  });
  body.push(new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: [TW], rows: [new TableRow({ cantSplit: true, children: [new TableCell({
    width: { size: TW, type: WidthType.DXA }, shading: { fill: C.tintJac, type: ShadingType.CLEAR, color: "auto" },
    borders: { top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" }, right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" } },
    margins: { top: 160, bottom: 100, left: 220, right: 220 }, children: kids })] })] }));
  body.push(new Paragraph({ children: [], spacing: { after: 160 } }));
}
function img(n, alt) {
  const data = fs.readFileSync(path.join(DIAG, `slide-${String(n).padStart(2, "0")}.png`));
  body.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { before: 120, after: 200 },
    children: [new ImageRun({ type: "png", data, transformation: { width: 600, height: 338 }, altText: { title: alt, description: alt, name: alt } })] }));
}

function writeAll() {
// ------------------------------------------------------------------ cover
body.push(new Paragraph({ spacing: { before: 2400, after: 200 }, children: [new TextRun({ text: "POWER ON: WINDOWS MEANS BUSINESS · SYDNEY", bold: true, color: C.blue, size: 22, characterSpacing: 40 })] }));
body.push(new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: "雪梨活動實作與演練操作手冊", bold: true, size: 56, color: C.navy })] }));
body.push(new Paragraph({ spacing: { after: 600 }, children: [new TextRun({ text: "代理程式實作・裝置探索提問・Windows 11 簡報演練・SMB 90 天計畫・Envisioning・實機操作", size: 26, color: C.muted })] }));
table(["項目", "內容"], [
  ["活動日期", "2026 年 10 月 27–28 日（二、三）"],
  ["地點", "Microsoft 辦公室，Level 27, 1 Denison St, North Sydney"],
  ["搭配簡報", "01_Windows11_Positioning_Demo_EN.pptx\n02_Agent_Lab_Demo_EN.pptx\n03_SMB_90Day_Plan_Report_EN.pptx"],
  ["使用方式", "照步驟操作，對照流程圖與功能圖理解每一步的目的"],
], [1, 3], { boldFirst: true });
P("說明：場次內容為依官方議程題目所做的預測與準備；產品功能、介面名稱與數據請以 Microsoft、Intel 現場與官方資料為準。機型、價格與客戶案例為練習用的虛構示範資料。", { color: C.muted, size: 18 });
body.push(new Paragraph({ children: [new PageBreak()] }));
body.push(new Paragraph({ children: [new TextRun({ text: "目錄", bold: true, size: 32, color: C.navy })], spacing: { after: 200 } }));
body.push(new TableOfContents("目錄", { hyperlink: true, headingStyleRange: "1-2" }));

// ------------------------------------------------------------------ ch1
H1("第 1 章　手冊導覽");
P("這本手冊把兩天活動中需要「動手做」或「上台講」的內容，整理成可以照著做的步驟。每一章都包含：**目的**、**流程圖或功能圖**、**詳細步驟**、**檢查表**與**金句**。");
img(1, "兩日活動功能地圖");
H2("1.1 章節與產出一覽");
table(["章節", "對應場次", "建議時間", "產出"], [
  ["第 2 章", "打造您的代理程式：實作實驗室（D1 下午）", "30–70 分", "可展示的換機顧問代理程式"],
  ["第 3 章", "裝置探索提問：分組練習（D1 下午）", "40 分", "提問題庫與異議回應"],
  ["第 4 章", "完美簡報：Windows 11 定位與展示演練（D1 下午）", "60 分", "英文定位簡報 + 10 分鐘 Demo"],
  ["第 5 章", "SMB 加速小組工作坊（D2 上午）", "45 分 + 3 分報告", "一頁式 90 天作戰計畫"],
  ["第 6 章", "經銷商適用的 Envisioning Framework（D2 上午）", "60 分", "客戶工作坊流程與範例"],
  ["第 7 章", "實機操作示範（D2 下午）", "30 分", "12 項功能試玩紀錄"],
], [1.1, 3.6, 1.4, 2.6], { zebra: true });
H2("1.2 出發前的準備");
bullets([
  "筆電與充電器、I 型轉接頭（澳洲 230V）。",
  "Microsoft 365 公司帳號可登入並開啟 MFA；確認能進入 m365copilot.com 的「代理程式 → 建立代理程式」。",
  "第 2 章的三份知識檔已存成 Word 檔放在桌面。",
  "三份簡報檔已下載，並用第 4、5 章的計時表各演練兩次。",
]);

// ------------------------------------------------------------------ ch2
H1("第 2 章　實作一：打造您的代理程式");
H2("2.1 情境與目標");
P("我們要做一個「**Windows 11 換機顧問**」代理程式。經銷商業務輸入客戶狀況，代理程式依照我們自己的機型分級表與 FAQ，產出配機建議表、三個換機理由、加購建議與寄給老闆的提案 email。");
table(["面向", "說明"], [
  ["誰在用", "經銷商業務，拜訪中小企業客戶前後使用"],
  ["痛點", "每份換機建議要半天：翻規格表、問產品經理、自己寫 email，而且每個業務的建議不一致"],
  ["成果", "3 分鐘產出一致的建議；只引用我們上傳的資料，不會亂報價"],
  ["展示的能力", "依據自有資料回答（grounding）、遵循商業規則（instructions）、產出可直接用的成果"],
], [1, 4], { boldFirst: true });
H3("功能架構");
P("代理程式由四個部分組成：業務的輸入與開場提示、規範行為的 Instructions、作為唯一資料來源的三份知識檔，以及四種輸出。");
img(2, "代理程式架構圖");
H2("2.2 事前準備檢查表");
table(["☐", "項目", "如何確認"], [
  ["☐", "Microsoft 365 帳號", "登入 m365copilot.com，左側看得到「代理程式（Agents）」"],
  ["☐", "建立權限", "點「建立代理程式」可進入編輯畫面；若沒有，請 IT 確認系統管理中心設定"],
  ["☐", "三份知識檔", "依 2.3 節內容存成 01、02、03 三個 Word 檔"],
  ["☐", "（進階）Copilot Studio", "可登入 copilotstudio.microsoft.com，沒有授權就先申請試用"],
], [0.4, 2, 5], {});
H2("2.3 準備三份知識檔");
P("把以下內容分別貼到 Word，依標題存檔。機型與價格為示範資料，正式使用時換成實際產品線與報價。");
H3("01_商用機型分級表.docx");
table(["等級", "規格重點", "適用對象", "參考價（NT$）"], [
  ["S1 入門辦公", "Intel Core Ultra 5、16GB、512GB、Windows Hello", "櫃台、行政、門市", "28,000–32,000"],
  ["S2 安全管理（主力）", "Core Ultra 5 + Intel vPro、16GB、512GB、指紋 + 臉部辨識、Hardware Shield", "會計、財務、人資、業務；處理敏感資料；沒有專職 IT", "35,000–40,000"],
  ["S3 AI 生產力（Copilot+ PC）", "Core Ultra 7 + vPro、NPU 40+ TOPS、32GB、1TB", "主管、常外出與視訊者", "45,000–55,000"],
  ["S4 效能工作站", "Core Ultra 9 + 獨立顯示卡、32–64GB", "設計、工程、CAD、影音", "60,000 起"],
], [1.6, 2.8, 2.4, 1.3], { boldFirst: true });
code("分級規則（一併寫入檔案）", "1. 處理客戶或財務敏感資料、或公司沒有專職 IT → 至少 S2。\n2. 主管、經常外出、每週視訊超過 5 小時 → S3。\n3. 設計、工程、影音 → S4。\n4. 只做文書、固定座位、預算低於每台 NT$32,000 → S1，但主管與財務人員仍建議 S2 以上。\n5. 同一家公司建議不超過 3 種等級。\n建議加購：Microsoft 365 商務進階版、Autopilot 部署服務、資料搬移服務、3 年到府保固、擴充基座與螢幕。");
H3("02_Win10換機FAQ.docx");
table(["問題", "回答重點"], [
  ["Windows 10 什麼時候停止支援？", "2025/10/14 已終止支援；ESU 只提供安全修補且費用遞增，只適合過渡"],
  ["電腦還能用，為什麼要換？", "能開機不等於安全；沒有更新的電腦是最容易被攻擊的入口"],
  ["舊電腦能直接升級嗎？", "需要 TPM 2.0、支援的處理器與安全開機；約 5 年以上的電腦多半不符合，也沒有 NPU"],
  ["換 Windows 11 的好處？", "安全（硬體信任根、VBS、Hello、BitLocker）、管理（Intune、Autopilot）、生產力與 AI"],
  ["員工要重新學嗎？", "操作與 Windows 10 相近，一般半天內適應"],
  ["Intel vPro 對 SMB 有什麼用？", "遠端開機與修復（作業系統當機也能處理）、Hardware Shield 韌體層防護"],
  ["資料怎麼搬？", "Windows 備份 + OneDrive，或加購資料搬移服務"],
], [2, 4], {});
H3("03_話術與郵件範本.docx");
code("內容", "三個換機理由寫法：客戶的痛點 → 我們的解法 → 帶來的結果（一句話完成）。\n異議回應：「Windows 10 還能用」→ 能開機不等於安全；「預算不夠」→ 分批換或租賃；「怕員工不會用」→ 操作相近，提供 1 小時上手課程。\nemail 範本：主旨［公司名稱］Windows 11 換機建議與預算規劃；內文依序寫換機規劃表摘要、三個效益、導入方式、總預算（參考價）與實機體驗邀約。");
H2("2.4 建置流程圖");
P("整個建置分 8 個步驟，第 7 步測試不通過時回到 Instructions 修改，直到驗收表全部打勾。");
img(3, "建置流程圖");
img(16, "基礎版建置時間配置");
H2("2.5 詳細操作步驟（基礎版：Agent Builder）");
tip("介面文字", ["介面可能是英文或中文，以下兩種都標示。按鈕位置若略有不同，找相同名稱即可。"]);
steps([
  ["開啟 Microsoft 365 Copilot（約 1 分鐘）", "瀏覽器開啟 m365copilot.com，或 Windows 上的 Microsoft 365 Copilot App，用公司帳號登入。", "左側欄點 **代理程式（Agents）** → **建立代理程式（Create agent）**。"],
  ["切到「設定（Configure）」分頁（約 1 分鐘）", "「描述（Describe）」是用對話建立；實作時用「設定」直接填欄位，結果最可控。"],
  ["填寫名稱與描述（約 2 分鐘）", "名稱：**Windows 11 換機顧問**。", "描述：協助經銷商業務為中小企業規劃 Windows 10 到 Windows 11 的換機方案，產出配機建議表、換機理由與提案 email。"],
  ["貼上 Instructions（約 3 分鐘）", "把下方方框的指令整段貼到「指令（Instructions）」欄位。"],
]);
code("Instructions（整段複製）", "# 角色\n你是「Windows 11 換機顧問」，協助台灣的經銷商業務，為 10–200 人的中小企業規劃 Windows 10 到 Windows 11 的換機方案。\n# 資料來源（嚴格遵守）\n- 機型與價格只能使用知識檔「01_商用機型分級表」，不得自行編造型號、規格或價格。\n- Windows 10／11 的說明以「02_Win10換機FAQ」為準。\n- 話術與 email 格式依照「03_話術與郵件範本」。\n- 知識檔找不到答案時，直接說「這部分需要再確認」，並列出要詢問客戶的問題。\n# 對話流程\n1. 缺少資訊時先一次問完（最多 4 題）：電腦總數與 Windows 10 台數、主要使用情境、每台預算、有沒有專職 IT。\n2. 依分級規則把人員分組，指定建議等級與數量。\n3. 用表格輸出：職務群組｜台數｜建議等級｜主要理由｜單價區間｜小計區間，最後一列為總計。\n4. 列出 3 個換機理由，每個用「痛點 → 解法 → 結果」一句話寫成。\n5. 建議最多 3 個加購項目並說明好處。\n6. 使用者要求時，依範本產出給客戶老闆的 email（300 字以內）。\n# 語氣與格式\n- 繁體中文、台灣用語，專業但口語；若使用者以英文提問，改用英文回答。\n- 金額使用新台幣並註明「參考價，以正式報價為準」。\n- 不貶低其他品牌，不承諾折扣或交期。");
steps([
  ["加入知識（約 5 分鐘）", "在 **知識（Knowledge）** 選 **上傳檔案**，上傳 01、02、03 三個檔案。", "網頁搜尋建議 **關閉**，避免引用來路不明的價格。", "看不到上傳選項時，把檔案放到 OneDrive 或 SharePoint，改用「加入 SharePoint／OneDrive」貼上連結。", "上傳後等 1–3 分鐘讓檔案處理完成。"],
  ["設定 4 個開場提示（約 3 分鐘）", "依下表建立「開場提示（Starter prompts）」。展示時點一下就能送出。"],
], true);
table(["標題", "提示內容（中文）", "English version"], [
  ["規劃換機方案", "客戶是 25 人的會計師事務所，有 18 台 Windows 10 電腦，常外出查帳，擔心資料外洩，沒有專職 IT，預算每台 4 萬元以內。請建議換機方案。", "The customer is a 25-person accounting firm with 18 Windows 10 PCs, no dedicated IT and a budget under NT$40,000 per device. Recommend a refresh plan."],
  ["回應「還能用」", "客戶說 Windows 10 還能用，不想現在換，我要怎麼回應？給我三種說法。", "The customer says Windows 10 still works. Give me three ways to respond."],
  ["寫提案信", "把剛才的方案寫成一封給客戶老闆的 email。", "Turn that plan into an email to the customer's owner."],
  ["解釋 Copilot+ PC", "用老闆聽得懂的話，說明 Copilot+ PC 和一般 Windows 11 電腦差在哪裡，100 字以內。", "In under 60 words, explain how a Copilot+ PC differs from a regular Windows 11 PC."],
], [1.2, 3, 3], {});
steps([
  ["在右側測試窗格試跑（約 8 分鐘）", "依序點四個開場提示，對照 2.7 節的驗收表。", "答案不對就回到 Instructions 修改，改完直接再測，不必重建。"],
  ["建立並分享（約 2 分鐘）", "按 **建立（Create）**；分享範圍先選「只有我」，正式使用再改為組織中的特定人員。", "把代理程式釘選在左側欄，展示時一鍵開啟；也可在 Teams 的 Copilot 中使用。"],
], true);
H2("2.6 代理程式的對話流程");
P("下圖是 Instructions 定義的運作邏輯：資訊不齊全時先補問，齊全後依序輸出分組、表格、理由與加購，最後視需要產出 email。測試時可對照這張圖判斷代理程式是否「照規則走」。");
img(4, "代理程式對話流程");
H2("2.7 測試驗收表");
table(["☐", "測試", "通過標準"], [
  ["☐", "提示 1：規劃換機方案", "輸出表格，台數加總為 18；會計人員建議 S2 並提到 vPro 與資料保護"],
  ["☐", "提示 1：預算取捨", "主管若建議 S3，有說明超出預算的取捨；價格只出現分級表區間並註明參考價"],
  ["☐", "提示 1：換機理由", "有 3 個「痛點 → 解法 → 結果」的理由"],
  ["☐", "提示 2：還能用", "引用 2025/10/14 終止支援與安全風險"],
  ["☐", "提示 3：提案信", "套用範本、300 字內、有總預算與實機體驗邀約"],
  ["☐", "提示 4：Copilot+ PC", "提到 NPU 與裝置上 AI，100 字以內"],
  ["☐", "防呆：推薦 MacBook", "不貶低品牌，回到知識檔範圍"],
  ["☐", "防呆：只說「要換電腦」", "先補問需求，不直接推薦"],
], [0.4, 2.2, 5], {});
H2("2.8 進階版：Copilot Studio 加上「換機評估」主題");
P("進階版把需求訪談做成固定流程，每次都問同樣四題，並發布到 Teams 讓整個業務團隊使用。");
steps([
  ["建立代理程式", "開啟 copilotstudio.microsoft.com → 建立 → 新代理程式 → 切到「設定」；名稱、描述、Instructions 與基礎版相同，並上傳三份知識檔。"],
  ["新增主題「換機評估」", "主題 → 新增主題 → 從空白開始；觸發描述填「使用者想要評估或規劃客戶的電腦換機方案」。"],
  ["加入四個提問節點", "依下表設定問題、識別類型與變數名稱。"],
]);
table(["問題", "識別為", "變數"], [
  ["客戶目前有幾台 Windows 10 電腦？", "數字", "Win10Count"],
  ["主要的使用情境是？", "多重選項：行政文書／外勤業務／視訊會議多／設計工程", "UseCase"],
  ["每台預算大約多少？", "數字", "Budget"],
  ["公司有專職 IT 人員嗎？", "布林（是／否）", "HasIT"],
], [3, 3, 1.4], {});
steps([
  ["加入「產生式回答」節點", "輸入以公式組合變數，資料來源選代理程式的知識。"],
  ["結尾加入提問", "「需要我把方案寫成給老闆的 email 嗎？」選「是」時引導輸入「寫提案信」。"],
  ["測試並發布到 Teams", "在測試窗格輸入「我想幫客戶規劃換機」，確認依序問了四題；發布 → 通道 → 加入 Teams 與 Microsoft 365 Copilot。"],
], true);
code("產生式回答的輸入公式", "\"請依分級規則規劃換機方案：Windows 10 共 \" & Topic.Win10Count & \" 台，主要情境：\" & Topic.UseCase & \"，每台預算 NT$\" & Topic.Budget & \"，有專職 IT：\" & Topic.HasIT");
H2("2.9 3 分鐘展示腳本");
P("搭配簡報檔 **02_Agent_Lab_Demo_EN.pptx**。英文講稿在每頁的備忘稿中。");
table(["時間", "動作", "說法（中文）", "English line"], [
  ["0:00", "開場痛點", "業務每做一份換機建議要半天", "Every refresh proposal takes half a day."],
  ["0:25", "開啟代理程式", "它只讀我們自己的分級表與 FAQ", "It only uses our own tier sheet and FAQ."],
  ["0:45", "點「規劃換機方案」", "等待時說明客戶：25 人會計師事務所", "A 25-person accounting firm."],
  ["1:20", "說明表格", "會計人員配 S2，台數剛好 18", "Accountants get S2; the total is exactly 18."],
  ["1:55", "點「寫提案信」", "可以直接寄出的 email", "An email that's ready to send."],
  ["2:30", "收尾", "從半天縮到 3 分鐘，建議一致", "From half a day to three minutes."],
], [0.7, 1.6, 2.6, 2.6], {});
H2("2.10 常見問題排除");
table(["狀況", "處理方式"], [
  ["找不到「建立代理程式」", "管理員可能關閉權限；現場改用講師提供的實驗帳號，回台灣請 IT 確認設定"],
  ["自己編機型或價格", "關閉網頁搜尋，並在 Instructions 最上方加「知識檔沒有的機型或價格，一律回答需要再確認」"],
  ["沒有引用上傳的檔案", "等 2–3 分鐘；或在提示中點名「請依 01_商用機型分級表 回答」"],
  ["台數加總錯誤", "在 Instructions 第 3 點補「輸出前自行檢查台數加總」"],
  ["回答太長", "加上「每次回答不超過 250 字，表格除外」"],
], [2, 5], {});
quotes([["代理程式不取代業務，它讓每個業務都像資深業務。", "Agents don't replace salespeople. They make every salesperson perform like a senior one."],
  ["給它你的資料、你的規則，它就給你一致的答案。", "Give it your data and your rules, and it gives you consistent answers."],
  ["會用 Word 的人，就會做代理程式。", "If you can use Word, you can build an agent."]]);

// ------------------------------------------------------------------ ch3
H1("第 3 章　實作二：裝置探索提問");
H2("3.1 提問漏斗");
P("好的探索提問讓客戶自己說出「需要換」。順序很重要：先問事實，客戶比較願意回答；痛點問出來後才談影響與期望；最後才確認預算與決策。");
img(5, "裝置探索提問漏斗");
H2("3.2 分組練習怎麼跑");
steps([
  ["分組與角色（2 分鐘）", "三人一組：業務、客戶、觀察員；每輪輪換。"],
  ["客戶看角色卡（1 分鐘）", "扮演客戶的人看 3.3 節角色卡；「隱藏痛點」不主動說，業務問對了才透露。"],
  ["演練（8 分鐘）", "業務依漏斗順序提問，目標是問出隱藏痛點與下一步。"],
  ["回饋（4 分鐘）", "觀察員依 3.6 節評分表給分並說明一個優點、一個改進點。"],
  ["輪換三輪", "每人都當過一次業務；最後全組挑出最好用的三個問題。"],
]);
H2("3.3 練習用客戶角色卡");
table(["角色", "規模與現況", "表面需求", "隱藏痛點", "決策者"], [
  ["A 林會計師事務所", "25 人；18 台 Win10 筆電、6 年；無 IT", "電腦有點慢", "同事在高鐵遺失筆電（有報稅資料）；報稅季常當機", "合夥會計師；每台 4 萬內"],
  ["B 連鎖烘焙總部", "60 人；總部 35 台、門市 24 台；IT 1 人", "門市電腦常出問題", "IT 每週跑門市；新人裝機兩天；行銷想用 AI", "營運長"],
  ["C 精密零件製造廠", "150 人；辦公 70 台、產線 20 台；IT 2 人", "客戶要求資安稽核", "30 台無法升級；工程部想換 Mac 但 CAD 只支援 Windows", "總經理與財務長"],
], [1.5, 2.2, 1.4, 2.6, 1.4], { boldFirst: true });
H2("3.4 提問題庫與參考接話");
table(["階段", "問題", "參考接話"], [
  ["現況", "這些電腦大多用了幾年？還有幾台是 Windows 10？", "Windows 10 已停止安全更新。這 18 台裡，哪幾位同事的資料最敏感？"],
  ["現況", "同事一天最常用的三個軟體是什麼？", "這些在 Windows 11 都能直接用，不用重新學。報稅季跑起來順嗎？"],
  ["痛點", "如果請同事抱怨一件電腦的事，最常抱怨什麼？", "當機一次大概浪費多少時間？有沒有檔案沒存到？"],
  ["痛點", "過去一年有沒有電腦壞掉或資料遺失？", "那台電腦被別人開機，資料拿得到嗎？新機有 BitLocker 與 Hello，遺失也讀不到。"],
  ["痛點", "新同事從拿到電腦到能工作要多久？", "如果電腦寄到家、登入就自動裝好，對你們有幫助嗎？（Autopilot）"],
  ["安全", "客戶或主管機關對資料保護有要求嗎？", "稽核時能回答「遺失怎麼保護」嗎？Intune 可以直接出報表。"],
  ["管理", "電腦出問題時誰處理？多久能解決？", "有 vPro 的電腦可遠端修，連開不了機都能處理。"],
  ["AI", "同事有在用 ChatGPT、Copilot 嗎？", "個人帳號貼進去的資料不在公司控管下；公司帳號的 Copilot Chat 有企業資料保護。"],
  ["AI", "哪件工作最花時間又最重複？", "這正是 AI 擅長的；下次帶電腦來現場示範好嗎？"],
  ["決策", "最希望什麼時候完成？有不能停機的時段嗎？", "倒推：3 月前完成、2 月下單、1 月確認方案。"],
  ["決策", "除了您，還有誰參與決定？", "我準備兩個版本，下次三位一起看 30 分鐘？"],
  ["決策", "預算怎麼編？一次、分期或租賃？", "可以分兩批換，或用租賃攤成每月固定支出。"],
], [0.8, 3, 3.6], {});
H2("3.5 異議處理");
table(["客戶說", "參考回應", "English"], [
  ["Windows 10 還能用", "能開機不代表安全；先換資料最敏感的幾台", "Turning on isn't the same as being secure."],
  ["預算不夠", "三種等級依職務配置；可分期或租賃", "Not everyone needs the top model."],
  ["我們在考慮換 Mac", "先確認會計與報稅軟體能否在 Mac 上跑、誰來管理", "Check your software and who will manage it."],
  ["AI 我們用不到", "每月說明信就是 AI 最擅長的；這台電腦會用 4–5 年", "You're buying a PC ready for the next five years."],
  ["我們跟電腦行合作很久", "我們和您的電腦行一起合作，他們繼續在地服務", "We can work together with your local shop."],
], [1.6, 3.2, 2.6], { boldFirst: true });
H2("3.6 觀察員評分表");
table(["項目", "2 分", "1 分", "0 分"], [
  ["開場說明目的與時間", "清楚說明並取得同意", "有說但沒確認", "直接開始問"],
  ["漏斗順序", "現況→痛點→影響→期望→決策", "跳過一段", "一開始就推產品"],
  ["問出隱藏痛點", "問出角色卡上的隱藏痛點", "只問到表面需求", "沒問痛點"],
  ["量化影響", "連到時間、金錢或風險", "提到但沒追問", "沒有"],
  ["複述確認", "用客戶的話複述並取得確認", "不完整", "沒有"],
  ["下一步", "時間 + 決策者 + 行動", "只說再聯絡", "沒有"],
], [2, 2.2, 1.6, 1.6], { boldFirst: true, zebra: true });
P("滿分 12 分：10 分以上可以直接帶客戶；7 分以下建議再練一輪。", { color: C.muted });
quotes([["問對問題，客戶會自己說服自己。", "Ask the right questions, and customers will convince themselves."],
  ["先問電腦，再問工作，最後問生意。", "Ask about the computers, then the work, then the business."],
  ["客戶記得的不是你說了什麼，而是你問了什麼。", "Customers don't remember what you said. They remember what you asked."]]);

// ------------------------------------------------------------------ ch4
H1("第 4 章　實作三：Windows 11 定位簡報與展示演練");
H2("4.1 一句話定位與四大支柱");
code("定位陳述", "對於仍在使用 Windows 10、沒有專職 IT 卻要保護客戶資料的中小企業，搭載 Intel Core Ultra 與 Intel vPro 的 Windows 11 Pro 商用電腦，是一套「出廠即安全、開箱即管理、內建 AI」的工作平台。它讓員工更有效率、讓老闆不必擔心資料外洩，而且沿用公司現有的軟體與習慣，不必重新學。");
table(["支柱", "English", "內容", "對應痛點"], [
  ["出廠即安全", "Secure out of the box", "硬體信任根、VBS、Credential Guard、Windows Hello、BitLocker、Hardware Shield", "資料外洩"],
  ["開箱即管理", "Managed from day one", "Autopilot、Intune、Windows Autopatch、vPro 遠端管理", "等人來修、新人裝機"],
  ["內建 AI", "AI built in", "Copilot、Click to Do、Studio Effects、NPU 裝置端 AI、代理程式", "重複的整理工作"],
  ["不必重新學", "Nothing new to learn", "既有軟體與周邊相容，操作相近，資料可搬移", "換機的心理成本"],
], [1.3, 1.7, 3.2, 1.6], { boldFirst: true });
H2("4.2 解決方案架構");
img(6, "Windows 11 加 Intel 解決方案架構");
table(["對象", "講解方向", "一句話"], [
  ["IT 主管", "由下往上：晶片與 TPM 建立信任 → Windows 11 隔離憑證與加密 → Intune 檢查合規、Autopatch 更新、vPro 頻外管理 → 員工安全地使用 AI", "信任從晶片開始"],
  ["老闆", "由上往下：員工用 AI 更快完成工作 → 背後有人自動管理 → 系統本身有防護 → 從晶片就是商用設計", "你只需要專心做生意"],
], [1.2, 4.6, 1.6], { boldFirst: true });
H2("4.3 10 分鐘 Demo 流程");
img(7, "Demo 流程");
table(["時間", "段落", "操作步驟", "說法"], [
  ["0:00", "開場", "請客戶從三個痛點選一個最在意的", "今天跟著會計小美過一天"],
  ["1:00", "到職", "播放 60 秒 Autopilot 錄影：開機 → 登入公司帳號 → 自動安裝 Office 與原則", "新電腦寄到家，登入就設定好"],
  ["2:30", "登入與保護", "蓋上再打開筆電用臉部登入；開啟「設定 → 隱私權與安全性 → 裝置加密」", "遺失的是硬體，不是客戶資料"],
  ["4:00", "工作", "Copilot 摘要 PDF；Click to Do 框選表格改寫；開代理程式寫提案信", "重複的寫作交給 AI"],
  ["6:30", "開會", "開相機，切換背景模糊、自動取景、眼神校正；打開即時字幕（Win + Ctrl + L）", "在哪裡開會都專業"],
  ["8:00", "出狀況", "切到管理工具，示範 vPro 遠端開機與遠端看 BIOS 畫面", "系統開不了機也能遠端修"],
  ["9:15", "收尾", "三個痛點各一句，提出 30 分鐘換機健檢並約時間", "換機是把風險換成生產力"],
], [0.7, 1.1, 3.6, 2.2], {});
img(8, "Demo 各段時間配置");
H2("4.4 痛點對應亮點");
table(["客戶痛點", "Windows 11 + Intel 亮點", "結果"], [
  ["筆電遺失、資料外洩", "BitLocker、Windows Hello、Intune 遠端抹除", "遺失的是硬體，不是資料"],
  ["新人要裝一兩天", "Windows Autopilot + Intune", "到職第一天就能工作"],
  ["電腦壞了要等人來修", "Intel vPro 遠端管理", "停機從天縮短到小時"],
  ["不知道有沒有更新", "Windows Autopatch、Intune 合規報表", "稽核拿得出報表"],
  ["重複的整理與寫作", "Copilot、Click to Do、代理程式", "每週省下數小時"],
  ["外出視訊品質差", "Studio Effects（NPU）、Core Ultra 能效", "在哪裡都專業"],
], [2, 3, 2.2], { boldFirst: true, zebra: true });
H2("4.5 為何這樣賣能提升銷售");
img(9, "依職務配置對平均單價的影響");
bullets(["**平均單價提升**：關鍵職務升級到 vPro 與 Copilot+ PC，總預算仍可控。",
  "**加購率提升**：Microsoft 365 商務進階版、部署、搬移與保固是整套的一部分。",
  "**成交週期縮短**：Demo 讓決策者在同一場會議形成共識。",
  "**經常性收入**：Intune、Autopatch 與 vPro 支援可以做成月費託管服務。",
  "**可複製**：同一套簡報與 Demo 給所有經銷商使用。"]);
H2("4.6 演練準備檢查表");
table(["☐", "項目"], [
  ["☐", "Windows Hello 已註冊臉部並測試三次"],
  ["☐", "準備 3 頁客戶 PDF 與一張 Excel 表"],
  ["☐", "代理程式已釘選，開場提示可正常執行"],
  ["☐", "Autopilot 與 vPro 錄影或截圖放在桌面（網路斷線備案）"],
  ["☐", "開啟專注模式關閉通知，桌面清乾淨"],
  ["☐", "電源、轉接頭、HDMI／USB-C 轉接器"],
  ["☐", "用 01_Windows11_Positioning_Demo_EN.pptx 計時演練兩次"],
], [0.4, 7], {});
quotes([["Windows 11 不是新的作業系統，是新的工作方式。", "Windows 11 isn't a new operating system. It's a new way of working."],
  ["電腦壞的時候，你需要的不是更快的電腦，是更快被修好的電腦。", "When a PC breaks, you don't need a faster PC. You need one that gets fixed faster."],
  ["換機不是成本，是把風險換成生產力。", "A PC refresh isn't a cost. It's trading risk for productivity."]]);

// ------------------------------------------------------------------ ch5
H1("第 5 章　第二天：SMB 加速小組工作坊");
H2("5.1 六個步驟");
P("把上午四場簡報的內容組成一份能執行的 90 天計畫。分組角色：引導者（控時間）、記錄者（填計畫）、挑戰者（質疑數字）、報告者（上台 3 分鐘）。");
img(10, "90 天作戰計畫六個步驟");
steps([
  ["選定目標客群（7 分）", "從計畫的客群定義中選一個最有把握的區隔，越具體越好。", "範例：雙北 25–100 人專業服務業，仍用 Windows 10，沒有專職 IT。"],
  ["寫下痛點與換機觸發點（7 分）", "三個最痛的事＋讓客戶「現在」決定換的事件（稽核、旺季前、遺失事件）。"],
  ["設計主打方案（8 分）", "裝置＋軟體＋服務＋付款方式，取一個客戶聽得懂的名字，例如「安心辦公換機包」。"],
  ["規劃開發活動（8 分）", "第 1 個月建立名單、第 2 個月轉成會議、第 3 個月轉成訂單。"],
  ["設定 KPI 與檢核點（7 分）", "名單 → 健檢 → 提案 → 成交，每 30 天檢核一次。"],
  ["列出需要的資源與風險（8 分）", "需要 Microsoft／Intel 提供什麼，以及最大風險與對策。"],
]);
H2("5.2 90 天時程");
img(11, "90 天時程");
H2("5.3 KPI 漏斗");
img(12, "KPI 漏斗");
table(["步驟", "數量", "轉換率", "算法"], [
  ["名單", "600", "—", "公會會員與經銷商客戶名單"],
  ["健檢會議", "90", "15%", "600 × 15%"],
  ["提案", "45", "50%", "90 × 50%"],
  ["成交", "18 家", "40%", "45 × 40%；每家約 30 台 → 約 540 台"],
], [1.5, 1, 1, 4], { boldFirst: true });
H2("5.4 範例：一頁式計畫");
table(["項目", "內容"], [
  ["目標客群", "雙北 25–100 人專業服務業（會計、法律、顧問、建築師），仍有 Windows 10，沒有專職 IT"],
  ["三個痛點", "客戶資料外洩的風險；電腦問題要等外包；文件整理耗時"],
  ["主打方案", "安心辦公換機包：vPro 筆電（主管配 Copilot+ PC）＋ M365 商務進階版 ＋ 部署、搬移、3 年保固；36 期分期或租賃"],
  ["需要的資源", "示範機 20 台、繁體中文素材、聯合行銷基金（講座）"],
  ["風險與對策", "經銷商不熟 Intune → 部署服務代工；預算不足 → 分批與租賃"],
], [1.4, 5.6], { boldFirst: true });
H2("5.5 3 分鐘報告");
P("搭配簡報檔 **03_SMB_90Day_Plan_Report_EN.pptx**（7 頁，英文為主）。");
table(["時間", "內容", "English line"], [
  ["0:00", "一句話計畫", "In 90 days, get 18 professional-services firms working with peace of mind."],
  ["0:20", "客群與痛點", "Why this segment, its three pains and triggers."],
  ["1:00", "主打方案", "The Peace of Mind Refresh Bundle, plus installments."],
  ["1:40", "90 天節奏", "Leads, assessments, deals. The assessment is the key step."],
  ["2:20", "KPI 與資源", "600 leads to 18 customers; demo units, content, funds."],
  ["2:45", "金句收尾", "We're helping customers shut down their risk before tax season."],
], [0.8, 1.8, 4.8], {});
quotes([["計畫的價值不在寫得多完整，而在 30 天後還有沒有人在跑。", "A plan's value isn't how complete it looks. It's whether anyone is still running it 30 days later."],
  ["代理商的工作，是讓每一家經銷商都賣得像原廠。", "A distributor's job is to help every reseller sell like the vendor itself."]]);

// ------------------------------------------------------------------ ch6
H1("第 6 章　Envisioning Framework：60 分鐘客戶工作坊");
H2("6.1 和探索提問的差別");
table(["比較", "探索提問（第 3 章）", "Envisioning（本章）"], [
  ["方向", "從現在往回看：問題在哪裡", "從未來往回推：理想的樣子"],
  ["時機", "第一次拜訪", "客戶有興趣後的第二次會議"],
  ["產出", "痛點清單與換機時程", "優先情境、導入藍圖、預算框架"],
  ["成交影響", "找到換機理由", "擴大成交範圍（裝置＋AI＋服務）"],
], [1.2, 3, 3], { boldFirst: true });
H2("6.2 工作坊流程");
img(13, "Envisioning 60 分鐘工作坊流程");
steps([
  ["會前準備（前 1 天）", "複習探索提問筆記，挑出 3 個痛點。", "依客戶產業挑 8–10 張情境卡。", "準備一台 Copilot+ PC 與已建立的代理程式。"],
  ["確認業務目標（0–10 分）", "只問：「明年這個時候，公司最希望有什麼不一樣？」把答案寫在白板最上方。", "English: \"A year from now, what's the one thing you most want to be different?\""],
  ["情境發想（10–25 分）", "逐張翻卡問：「這件事會發生嗎？做到了對目標有幫助嗎？」有共鳴的留下。"],
  ["現場展示（25–35 分）", "挑最有反應的情境示範，並讓客戶自己操作一次。"],
  ["價值 × 難度排序（35–45 分）", "把卡片放進矩陣；左上角「高價值、低難度」是第一波。"],
  ["倒推藍圖（45–55 分）", "針對第一波情境寫出需要的裝置、Microsoft 365 功能與服務。"],
  ["約定下一步（55–60 分）", "「我下週三前寄導入路徑與預算，週五 30 分鐘確認。」"],
]);
H2("6.3 價值 × 難度矩陣");
img(14, "價值與難度矩陣");
H2("6.4 範例產出");
table(["項目", "結論"], [
  ["業務目標", "明年報稅季接案量增加 20%，不增加人力"],
  ["第一波情境", "單據整理（Click to Do + Copilot）、客戶說明信（代理程式）、外出資料保護"],
  ["需要的裝置", "會計 11 台 vPro 安全款、主管 3 台 Copilot+ PC、行政 4 台入門款"],
  ["需要的軟體與服務", "M365 商務進階版 18 套；Autopilot 部署、資料搬移、代理程式建置、AI 上手課程"],
  ["90 天路徑", "第 1 月下單部署 → 第 2 月上線訓練 → 第 3 月（報稅季前）檢視成效"],
], [1.6, 5.4], { boldFirst: true });
quotes([["先讓客戶看見未來，價格就只是通往未來的門票。", "Once customers can see the future, the price is just the ticket to get there."],
  ["探索提問找到問題，Envisioning 找到範圍。", "Discovery finds the problem. Envisioning finds the scope."]]);

// ------------------------------------------------------------------ ch7
H1("第 7 章　實機操作：Intel Windows 裝置試玩清單");
H2("7.1 先確認機器規格");
steps([
  ["看處理器與 vPro", "按 Win + Pause 或「設定 → 系統 → 系統資訊」記下處理器型號；機身的 vPro 標誌代表具備 Intel vPro。"],
  ["看有沒有 NPU", "Ctrl + Shift + Esc 開工作管理員 →「效能」分頁，有 NPU 項目代表可執行裝置端 AI。"],
  ["確認是否為 Copilot+ PC", "NPU 40+ TOPS 才有 Click to Do、Recall、即時字幕翻譯等功能；Copilot 鍵本身不代表是 Copilot+ PC。"],
]);
H2("7.2 功能地圖");
img(15, "實機操作功能地圖");
H2("7.3 12 項試玩清單");
table(["☐", "功能", "怎麼操作", "對客戶說"], [
  ["☐", "Windows Hello", "Win + L 鎖定後看向鏡頭", "一秒登入，不用把密碼貼在螢幕上"],
  ["☐", "存在感應", "設定 → 隱私權與安全性 → 存在感應", "離開座位，電腦自己會鎖"],
  ["☐", "裝置加密", "設定 → 隱私權與安全性 → 裝置加密", "電腦掉了，別人也讀不到資料"],
  ["☐", "Copilot", "按 Copilot 鍵，摘要 PDF 或草擬 email", "重複的寫作交給 AI"],
  ["☐", "Click to Do", "按住 Win 再點擊，或 Win + Q", "看到什麼就能處理什麼"],
  ["☐", "Recall", "若已開啟，Win + J 自然語言搜尋", "預設關閉、需 Hello 驗證、資料在本機"],
  ["☐", "Snap 版面配置", "Win + Z 選擇分割版面", "一個螢幕同時開報表、email 與會議"],
  ["☐", "Studio Effects", "Win + A 快速設定中切換效果", "AI 效果交給 NPU，不卡又省電"],
  ["☐", "即時字幕", "Win + Ctrl + L，播放英文影片", "跟國外客戶開會，字幕即時翻譯"],
  ["☐", "開機與喚醒", "蓋上 10 秒再打開計時", "打開就能工作，跟手機一樣"],
  ["☐", "續航與溫度", "詢問主訓練師續航表現，感受溫度與風扇", "出差一整天不用找插座"],
  ["☐", "vPro 遠端管理", "請主訓練師示範遠端開機或看 BIOS 畫面", "開不了機也能遠端修"],
], [0.4, 1.5, 3, 2.6], {});
quotes([["讓客戶摸到，比讓客戶聽到有用十倍。", "Letting customers touch it is ten times more powerful than telling them about it."],
  ["NPU 是讓 AI 安靜工作的引擎：不卡、不吵、不耗電。", "The NPU is the engine that lets AI work quietly: no lag, no fan noise, no battery drain."]]);

// ------------------------------------------------------------------ appendix
H1("附錄 A　金句中英對照");
table(["場合", "中文", "English"], [
  ["開場", "今天不談規格，談你的生意。", "Today we're not talking specs. We're talking about your business."],
  ["Win10 終止支援", "能開機，不等於安全。", "A PC that turns on isn't necessarily a secure PC."],
  ["定位", "Windows 11 不是新的作業系統，是新的工作方式。", "Windows 11 isn't a new operating system. It's a new way of working."],
  ["vPro", "你需要的不是更快的電腦，是更快被修好的電腦。", "You don't need a faster PC. You need one that gets fixed faster."],
  ["資料保護", "遺失的是硬體，不是你的客戶資料。", "You lose the hardware, not your client data."],
  ["方案", "不是賣一台電腦，是交付一個準備好的工作環境。", "We don't sell a computer. We deliver a work environment that's ready to go."],
  ["結尾", "換機不是成本，是把風險換成生產力。", "A PC refresh isn't a cost. It's trading risk for productivity."],
  ["代理程式", "代理程式不取代業務，它讓每個業務都像資深業務。", "Agents don't replace salespeople. They make every salesperson perform like a senior one."],
  ["探索提問", "問對問題，客戶會自己說服自己。", "Ask the right questions, and customers will convince themselves."],
  ["SMB", "SMB 老闆不買規格，買的是「不用煩惱」。", "SMB owners don't buy specs. They buy peace of mind."],
  ["90 天計畫", "我們不是在賣電腦，是在幫客戶在報稅季前把風險關掉。", "We're not selling computers. We're helping customers shut down their risk before tax season."],
  ["Envisioning", "客戶自己選的方案，不需要被說服。", "A plan customers choose themselves doesn't need selling."],
], [1.3, 3, 3.2], { zebra: true });
H1("附錄 B　簡報檔使用說明");
table(["檔案", "用途", "頁數", "搭配章節"], [
  ["01_Windows11_Positioning_Demo_EN.pptx", "Windows 11 定位簡報與 Demo 動線；英文為主、中文輔助，每頁備忘稿有英文講稿與中文提示", "12", "第 4 章"],
  ["02_Agent_Lab_Demo_EN.pptx", "代理程式實驗室 3 分鐘展示", "7", "第 2 章"],
  ["03_SMB_90Day_Plan_Report_EN.pptx", "第二天小組工作坊 3 分鐘報告", "7", "第 5 章"],
], [3, 3.4, 0.6, 1], {});
tip("修改建議", ["示範數字（機型價格、平均單價、KPI）請換成實際資料後再對外使用。", "簡報使用主題色與版面配置，可在 PowerPoint 的「設計」與「投影片母片」統一調整。"]);

}

// ------------------------------------------------------------------ document
function makeDoc(children, title, headerText) {
  return new Document({
    creator: "Power On Sydney prep", title,
    styles: {
      default: { document: { run: { font: FONT, size: 21, color: C.ink } } },
      paragraphStyles: [
        { id: "TOC1", name: "toc 1", basedOn: "Normal", next: "Normal", run: { size: 20, bold: true, font: FONT }, paragraph: { spacing: { before: 60, after: 0, line: 260 } } },
        { id: "TOC2", name: "toc 2", basedOn: "Normal", next: "Normal", run: { size: 18, font: FONT }, paragraph: { spacing: { before: 0, after: 0, line: 250 }, indent: { left: 360 } } },
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 36, bold: true, color: C.navy, font: FONT }, paragraph: { spacing: { before: 0, after: 240 }, outlineLevel: 0 } },
        { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 28, bold: true, color: C.blue, font: FONT }, paragraph: { spacing: { before: 320, after: 140 }, outlineLevel: 1, keepNext: true } },
        { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 23, bold: true, color: C.ink, font: FONT }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2, keepNext: true } },
      ],
    },
    numbering: { config: [
      { reference: "bullets", levels: [
        { level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 540, hanging: 300 } } } },
        { level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 1260, hanging: 300 } } } }] },
      ...numbering] },
    sections: [{
      properties: { page: { size: { width: 11906, height: 16838 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } } },
      headers: { default: new Header({ children: [new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: headerText, size: 16, color: C.muted })] })] }) },
      footers: { default: new Footer({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: "第 ", size: 16, color: C.muted }), new TextRun({ children: [PageNumber.CURRENT], size: 16, color: C.muted }), new TextRun({ text: " 頁", size: 16, color: C.muted })] })] }) },
      children,
    }],
  });
}
const isMarker = (x) => x && x.__chapter !== undefined;
function fresh() { body = []; numbering = []; listId = 0; writeAll(); }

// Split-file names, in chapter order.
const SPLIT = ["01_手冊導覽", "02_實作一_打造您的代理程式", "03_實作二_裝置探索提問", "04_實作三_Windows11定位簡報與展示演練",
  "05_第二天_SMB加速小組工作坊", "06_Envisioning_Framework客戶工作坊", "07_實機操作_Intel_Windows裝置試玩清單", "附錄A_金句中英對照", "附錄B_簡報檔使用說明"];

(async () => {
  // Combined guide: cover, TOC, every chapter on a new page.
  PB = true; fresh();
  const all = makeDoc(body.filter((x) => !isMarker(x)), "雪梨活動實作與演練操作手冊", "Power On 雪梨｜實作與演練操作手冊");
  fs.writeFileSync(OUT, await Packer.toBuffer(all)); console.log("wrote", OUT);

  // One file per chapter/appendix. Content is regenerated so no object is shared between documents.
  const splitDir = process.argv[3];
  if (!splitDir) return;
  fs.mkdirSync(splitDir, { recursive: true });
  PB = false; fresh();
  const starts = body.map((x, i) => (isMarker(x) ? i : -1)).filter((i) => i >= 0);
  if (starts.length !== SPLIT.length) throw new Error(`expected ${SPLIT.length} chapters, found ${starts.length}`);
  for (let k = 0; k < starts.length; k++) {
    PB = false; fresh(); // rebuild so each document gets its own paragraph objects
    const title = body[starts[k]].__chapter;
    const part = body.slice(starts[k] + 1, k + 1 < starts.length ? starts[k + 1] : body.length);
    part.push(new Paragraph({ spacing: { before: 240 }, children: [new TextRun({
      text: `本檔摘自《雪梨活動實作與演練操作手冊》的「${title.replace(/\s+/g, " ")}」。場次內容為預測與準備，機型、價格、KPI 與客戶案例為練習用的虛構示範資料。`, size: 16, color: C.muted })] }));
    const file = path.join(splitDir, SPLIT[k] + ".docx");
    fs.writeFileSync(file, await Packer.toBuffer(makeDoc(part, title.replace(/\s+/g, " "), "Power On 雪梨｜" + title.replace(/\s+/g, " "))));
    console.log("wrote", file);
  }
})().catch((e) => { console.error(e); process.exit(1); });

// Draws the Word guide's diagrams and charts as native PowerPoint shapes (one per slide); export_slides.ps1 turns them into PNGs.
const pptxgen = require("pptxgenjs");
const { HEX } = require("./common");

const F = "Microsoft JhengHei";
const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.33 x 7.5
const W = 13.33;
const COL = { blue: HEX.accent1, jac: HEX.accent2, green: HEX.accent3, orange: HEX.accent4, navy: HEX.dk1, grey: HEX.accent6, sky: HEX.accent5 };
const TINT = { blue: "E2ECFC", jac: "EFE8FB", green: "E0F2E8", orange: "FBEEDD", navy: "E6EAF0", grey: "EEF3FA" };

function slide(title, sub) {
  const s = pres.addSlide();
  s.background = { color: "FFFFFF" };
  s.addText(title, { x: 0.5, y: 0.3, w: W - 1, h: 0.6, fontFace: F, fontSize: 26, bold: true, color: HEX.dk1, margin: 0 });
  if (sub) s.addText(sub, { x: 0.5, y: 0.9, w: W - 1, h: 0.4, fontFace: F, fontSize: 15, color: HEX.dk2, margin: 0 });
  return s;
}
function box(s, x, y, w, h, text, o = {}) {
  const fill = o.fill || TINT.grey, line = o.line || fill;
  s.addShape(o.shape || pres.shapes.ROUNDED_RECTANGLE, { x, y, w, h, rectRadius: 0.08, fill: { color: fill }, line: { color: line, width: o.lineW || 1, dashType: o.dash || "solid" } });
  const runs = Array.isArray(text) ? text : [{ text, options: {} }];
  s.addText(runs.map((r, i) => ({ text: r.text, options: Object.assign({ fontFace: F, fontSize: o.size || 15, color: o.color || HEX.dk1, bold: !!o.bold, breakLine: i < runs.length - 1 }, r.options) })),
    { x: x + 0.08, y, w: w - 0.16, h, align: o.align || "center", valign: "middle", margin: 0.04 });
}
const t = (text, options = {}) => ({ text, options });
function arrow(s, x1, y1, x2, y2, o = {}) {
  s.addShape(pres.shapes.LINE, { x: Math.min(x1, x2), y: Math.min(y1, y2), w: Math.abs(x2 - x1), h: Math.abs(y2 - y1),
    flipH: x2 < x1, flipV: y2 < y1, line: { color: o.color || HEX.accent6, width: o.width || 2, endArrowType: "triangle", dashType: o.dash || "solid" } });
}
function label(s, x, y, w, h, text, o = {}) {
  s.addText(text, { x, y, w, h, fontFace: F, fontSize: o.size || 12, color: o.color || HEX.dk2, bold: !!o.bold, align: o.align || "center", valign: "middle", margin: 0 });
}

// D01 two-day map
let s = slide("圖 1-1　兩日活動功能地圖", "每個場次對應本手冊的章節與要帶回台灣的成果");
const days = [
  ["第 1 天 · 10/27（二）", COL.blue, TINT.blue, [["上午：四場主題演講", "預習頁"], ["實作一：打造代理程式", "第 2 章"], ["實作二：裝置探索提問", "第 3 章"], ["實作三：Windows 11 簡報演練", "第 4 章"]]],
  ["第 2 天 · 10/28（三）", COL.jac, TINT.jac, [["上午：SMB 四場簡報", "預習頁"], ["SMB 加速小組工作坊", "第 5 章"], ["Envisioning Framework", "第 6 章"], ["下午：實機操作示範", "第 7 章"]]],
];
days.forEach(([d, c, tint, items], k) => {
  const x = 0.5 + k * 4.6;
  box(s, x, 1.55, 4.3, 0.65, d, { fill: c, color: "FFFFFF", bold: true, size: 17 });
  items.forEach(([n, ch], i) => box(s, x, 2.4 + i * 1.12, 4.3, 0.95, [t(n, { bold: true }), t(ch, { color: c, fontSize: 12 })], { fill: tint, align: "left" }));
});
box(s, 10.0, 2.4, 2.85, 4.31, [t("帶回台灣的成果", { bold: true, fontSize: 17 }), t(" "), t("① 換機顧問代理程式"), t("② 探索提問題庫"), t("③ 英文定位簡報 + Demo"), t("④ 90 天作戰計畫"), t("⑤ Envisioning 工作坊")],
  { fill: HEX.dk1, color: "FFFFFF", size: 14, align: "left" });
arrow(s, 9.45, 4.55, 9.95, 4.55, { color: COL.navy, width: 3 });

// D02 agent architecture
s = slide("圖 2-1　代理程式架構圖", "Windows 11 換機顧問：輸入、規則、知識與輸出");
box(s, 4.9, 3.2, 3.5, 1.6, [t("Windows 11 換機顧問", { bold: true, fontSize: 19 }), t("Agent（Microsoft 365 Copilot）", { fontSize: 12, color: "C9D6EA" })], { fill: HEX.dk1, color: "FFFFFF" });
box(s, 0.5, 2.6, 3.4, 1.2, [t("業務輸入", { bold: true }), t("客戶人數、Win10 台數、用途、預算", { fontSize: 12 })], { fill: TINT.blue });
box(s, 0.5, 4.2, 3.4, 1.2, [t("開場提示 × 4", { bold: true }), t("一鍵送出常用問題", { fontSize: 12 })], { fill: TINT.blue });
arrow(s, 3.9, 3.2, 4.9, 3.7); arrow(s, 3.9, 4.8, 4.9, 4.3);
box(s, 4.65, 1.45, 4.0, 1.15, [t("Instructions 指令", { bold: true }), t("角色・資料規則・六步對話流程・語氣", { fontSize: 12 })], { fill: TINT.jac });
arrow(s, 6.65, 2.6, 6.65, 3.2);
["01 機型分級表", "02 Win10 換機 FAQ", "03 話術與郵件範本"].forEach((k, i) => box(s, 3.75 + i * 2.0, 5.55, 1.85, 0.95, [t(k, { fontSize: 12, bold: true })], { fill: TINT.green }));
label(s, 3.75, 6.55, 5.85, 0.35, "Knowledge 知識檔（只依據這三份回答）", { color: COL.green, bold: true });
arrow(s, 6.65, 5.55, 6.65, 4.8);
["配機建議表", "三個換機理由", "加購建議", "提案 email"].forEach((k, i) => box(s, 9.6, 1.9 + i * 1.18, 3.2, 0.95, [t(k, { bold: true })], { fill: TINT.orange }));
arrow(s, 8.4, 4.0, 9.6, 2.4); arrow(s, 8.4, 4.0, 9.6, 3.55); arrow(s, 8.4, 4.0, 9.6, 4.75); arrow(s, 8.4, 4.0, 9.6, 5.95);

// D03 build flowchart
s = slide("圖 2-2　建置流程圖（Agent Builder）", "依序完成 8 個步驟；測試未通過時回到指令修改");
const steps = ["開啟 Microsoft 365 Copilot", "建立代理程式・切到「設定」", "填寫名稱與描述", "貼上 Instructions", "上傳三份知識檔", "設定 4 個開場提示"];
// snake layout: row 1 left→right, row 2 right→left
steps.forEach((k, i) => {
  const col = i < 3 ? i : 5 - i, x = 0.5 + col * 4.2, y = 1.6 + (i < 3 ? 0 : 1.55);
  box(s, x, y, 3.6, 0.95, [t(`${i + 1}. ${k}`, { bold: true })], { fill: TINT.blue });
  if (i < 2) arrow(s, x + 3.6, y + 0.48, x + 4.2, y + 0.48);
  if (i >= 3 && i < 5) arrow(s, x, y + 0.48, x - 0.6, y + 0.48);
});
arrow(s, 10.7, 2.55, 10.7, 3.15);
arrow(s, 2.3, 4.1, 2.3, 4.5);
s.addShape(pres.shapes.DIAMOND, { x: 0.9, y: 4.5, w: 2.8, h: 1.4, fill: { color: TINT.orange }, line: { color: COL.orange, width: 1.5 } });
label(s, 0.9, 4.5, 2.8, 1.4, "7. 測試：通過驗收？", { bold: true, size: 14, color: HEX.dk1 });
arrow(s, 2.3, 5.9, 2.3, 6.3, { color: COL.orange });
label(s, 2.4, 5.9, 0.6, 0.4, "否", { color: COL.orange, bold: true, align: "left" });
box(s, 0.9, 6.3, 2.8, 0.85, [t("修改 Instructions", { bold: true }), t("補規則、限制字數", { fontSize: 12 })], { fill: TINT.jac });
s.addShape(pres.shapes.LINE, { x: 0.65, y: 6.72, w: 0.25, h: 0, line: { color: COL.jac, width: 2 } });
s.addShape(pres.shapes.LINE, { x: 0.65, y: 5.2, w: 0, h: 1.52, line: { color: COL.jac, width: 2 } });
arrow(s, 0.65, 5.2, 0.9, 5.2, { color: COL.jac });
arrow(s, 3.7, 5.2, 4.5, 5.2, { color: COL.green });
label(s, 3.75, 4.75, 0.7, 0.4, "是", { color: COL.green, bold: true });
box(s, 4.5, 4.75, 3.4, 0.9, [t("8. 建立並分享", { bold: true }), t("釘選在左側欄", { fontSize: 12 })], { fill: TINT.green });
arrow(s, 7.9, 5.2, 8.6, 5.2, { color: COL.green });
box(s, 8.6, 4.75, 4.25, 0.9, [t("3 分鐘展示演練 ×2", { bold: true }), t("準備錄影備案", { fontSize: 12 })], { fill: HEX.dk1, color: "FFFFFF" });

// D04 runtime conversation flow
s = slide("圖 2-3　代理程式對話流程", "Instructions 定義的六步流程：先補資訊，再依規則輸出");
box(s, 0.5, 1.7, 2.6, 1.0, [t("業務輸入客戶狀況", { bold: true })], { fill: TINT.blue });
arrow(s, 3.1, 2.2, 3.7, 2.2);
s.addShape(pres.shapes.DIAMOND, { x: 3.7, y: 1.45, w: 2.7, h: 1.5, fill: { color: TINT.orange }, line: { color: COL.orange, width: 1.5 } });
label(s, 3.7, 1.45, 2.7, 1.5, "四項資訊齊全？", { bold: true, size: 14, color: HEX.dk1 });
arrow(s, 5.05, 2.95, 5.05, 3.75, { color: COL.orange });
label(s, 5.15, 3.1, 0.6, 0.4, "否", { color: COL.orange, bold: true, align: "left" });
box(s, 3.6, 3.75, 2.9, 1.25, [t("一次問完（最多 4 題）", { bold: true }), t("台數・情境・預算・有無 IT", { fontSize: 12 })], { fill: TINT.jac });
s.addShape(pres.shapes.LINE, { x: 1.8, y: 4.38, w: 1.8, h: 0, line: { color: COL.jac, width: 2 } });
arrow(s, 1.8, 4.38, 1.8, 2.7, { color: COL.jac });
arrow(s, 6.4, 2.2, 7.0, 2.2, { color: COL.green });
label(s, 6.4, 1.7, 0.6, 0.4, "是", { color: COL.green, bold: true });
const out = [["依分級規則分組", "S1 / S2 / S3 / S4"], ["輸出配機表格", "職務・台數・等級・小計"], ["三個換機理由", "痛點 → 解法 → 結果"], ["加購建議（≤3）", "M365・部署・保固"]];
out.forEach(([a, b], i) => {
  const y = 1.7 + i * 1.2;
  box(s, 7.0, y, 3.1, 1.0, [t(a, { bold: true }), t(b, { fontSize: 12 })], { fill: TINT.green });
  if (i < 3) arrow(s, 8.55, y + 1.0, 8.55, y + 1.2);
});
arrow(s, 10.1, 5.8, 10.7, 5.8);
s.addShape(pres.shapes.DIAMOND, { x: 10.7, y: 5.1, w: 2.2, h: 1.4, fill: { color: TINT.orange }, line: { color: COL.orange, width: 1.5 } });
label(s, 10.7, 5.1, 2.2, 1.4, "要寫 email？", { bold: true, size: 13, color: HEX.dk1 });
arrow(s, 11.8, 5.1, 11.8, 3.2, { color: COL.green });
label(s, 11.9, 4.0, 0.6, 0.4, "是", { color: COL.green, bold: true, align: "left" });
box(s, 10.7, 2.1, 2.2, 1.1, [t("提案 email", { bold: true }), t("300 字內", { fontSize: 12 })], { fill: TINT.orange });

// D05 discovery funnel
s = slide("圖 3-1　裝置探索提問漏斗", "由淺入深五個階段：先問事實，再問痛點與影響，最後才談決策");
const fun = [["現況", "有幾台、用多久、做什麼", "「這些電腦大多用了幾年？」"], ["痛點", "哪裡卡、哪裡慢、哪裡怕", "「同事最常抱怨什麼？」"], ["影響", "痛點讓公司損失什麼", "「當機一次浪費多少時間？」"], ["期望", "理想的樣子", "「如果遺失也讀不到資料，符合期待嗎？」"], ["決策", "誰決定、何時、多少錢", "「除了您，還有誰參與決定？」"]];
const fcol = [COL.blue, COL.orange, COL.jac, COL.green, COL.navy];
fun.forEach(([a, b, q], i) => {
  const w = 7.2 - i * 1.0, x = 0.5 + (7.2 - w) / 2, y = 1.55 + i * 1.08;
  box(s, x, y, w, 0.92, [t(a + "　", { bold: true, fontSize: 18 }), t(b, { fontSize: 13 })], { fill: fcol[i], color: "FFFFFF", shape: pres.shapes.RECTANGLE });
  label(s, 8.0, y, 4.85, 0.92, q, { align: "left", size: 14, color: HEX.dk1 });
});
label(s, 0.5, 7.0, 12.3, 0.35, "70／30 原則：客戶說 70%，業務說 30%；每次回答後先用一句話複述再追問", { color: COL.blue, bold: true, size: 13 });

// D06 W11 architecture
s = slide("圖 4-1　Windows 11 + Intel 解決方案架構", "由下而上建立信任；Microsoft Entra ID 串起每一層的身分與合規");
const lay = [["AI 與生產力", "員工看得到", ["Microsoft 365 Copilot・代理程式", "Copilot on Windows", "Studio Effects・即時字幕", "裝置端 AI（NPU）"], TINT.jac, COL.jac],
  ["管理", "IT／經銷商看得到", ["Windows Autopilot", "Microsoft Intune", "Windows Autopatch", "Intel vPro 遠端（AMT）"], TINT.blue, COL.blue],
  ["作業系統", "Windows 11 Pro", ["Windows Hello", "BitLocker", "VBS・Credential Guard", "Smart App Control"], TINT.grey, HEX.dk2],
  ["裝置與晶片", "信任從這裡開始", ["Intel Core Ultra（CPU・GPU・NPU）", "Intel vPro・Hardware Shield", "TPM 2.0", "安全韌體"], TINT.navy, HEX.dk1]];
lay.forEach(([a, b, chips, tint, c], i) => {
  const y = 1.5 + i * 1.3;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: 1.2, y, w: 11.65, h: 1.15, rectRadius: 0.08, fill: { color: tint }, line: { color: tint } });
  s.addText([{ text: a, options: { bold: true, fontSize: 16, color: c, breakLine: true, fontFace: F } }, { text: b, options: { fontSize: 11, color: HEX.dk2, fontFace: F } }], { x: 1.35, y, w: 2.2, h: 1.15, valign: "middle", margin: 0 });
  chips.forEach((k, j) => box(s, 3.6 + j * 2.32, y + 0.17, 2.2, 0.81, [t(k, { fontSize: 12 })], { fill: "FFFFFF", line: "D8DFEA" }));
});
arrow(s, 0.75, 6.65, 0.75, 1.55, { color: HEX.dk2, width: 2.5 });
label(s, 0.3, 6.75, 0.9, 0.35, "信任", { bold: true });

// D07 demo flow
s = slide("圖 4-2　Demo 流程：一位員工的一天（10 分鐘）", "七段式故事；藍字為每段開始時間");
const dm = [["開場", "選痛點", "0:00"], ["到職", "Autopilot", "1:00"], ["登入保護", "Hello・加密", "2:30"], ["工作", "Copilot・Click to Do・代理程式", "4:00"], ["開會", "Studio Effects", "6:30"], ["出狀況", "vPro 遠端修復", "8:00"], ["收尾", "約 30 分鐘健檢", "9:15"]];
dm.forEach(([a, b, tm], i) => {
  const x = 0.5 + i * 1.8;
  s.addShape(pres.shapes.CHEVRON, { x, y: 2.0, w: 1.85, h: 1.3, fill: { color: i === 5 ? COL.orange : i === 6 ? COL.green : COL.blue }, line: { color: "FFFFFF", width: 1 } });
  label(s, x + 0.5, 2.0, 1.1, 1.3, a, { color: "FFFFFF", bold: true, size: 13 });
  label(s, x, 3.45, 1.75, 0.4, tm, { color: COL.blue, bold: true, size: 15 });
  box(s, x, 3.95, 1.68, 1.7, [t(b, { fontSize: 13 })], { fill: TINT.grey });
});
box(s, 0.5, 6.0, 12.35, 0.85, [t("每段開頭說「接下來你會看到」，結尾說「這代表」；客戶選的痛點段落多停 1 分鐘", { bold: true })], { fill: HEX.dk1, color: "FFFFFF", size: 14 });

// D08 demo timing chart
s = slide("圖 4-3　Demo 各段時間配置（秒）", "總長 600 秒；「工作」段最長，因為 AI 功能最需要時間呈現");
s.addChart(pres.charts.BAR, [{ name: "秒", labels: ["開場", "到職", "登入與保護", "工作", "開會", "出狀況", "收尾"], values: [60, 90, 90, 150, 90, 75, 45] }], {
  x: 0.5, y: 1.4, w: 12.3, h: 5.7, barDir: "bar", catAxisOrientation: "maxMin", chartColors: [COL.blue], showLegend: false,
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 14, dataLabelColor: HEX.dk1, dataLabelFontFace: F,
  catAxisLabelFontFace: F, catAxisLabelFontSize: 15, catAxisLabelColor: HEX.dk1, valAxisHidden: true,
  valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" }, barGapWidthPct: 45 });

// D09 ASP chart
s = slide("圖 4-4　依職務配置對平均單價的影響（示範數字）", "18 台案例：只賣入門款 vs. 依職務分級（4 台 S1 + 11 台 S2 + 3 台 S3）");
s.addChart(pres.charts.BAR, [{ name: "平均單價（NT$）", labels: ["只賣入門款", "依職務分級"], values: [30000, 37917] }], {
  x: 0.5, y: 1.4, w: 6.0, h: 5.7, barDir: "col", chartColors: [COL.grey, COL.blue], showLegend: false,
  showTitle: true, title: "每台平均單價（NT$）", titleFontFace: F, titleFontSize: 15, titleColor: HEX.dk1,
  showValue: true, dataLabelPosition: "outEnd", dataLabelFormatCode: "#,##0", dataLabelFontSize: 15, dataLabelColor: HEX.dk1, dataLabelFontFace: F,
  catAxisLabelFontFace: F, catAxisLabelFontSize: 14, catAxisLabelColor: HEX.dk1, valAxisHidden: true, valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" } });
s.addChart(pres.charts.BAR, [
  { name: "S1 入門", labels: ["只賣入門款", "依職務分級"], values: [18, 4] },
  { name: "S2 安全（vPro）", labels: ["只賣入門款", "依職務分級"], values: [0, 11] },
  { name: "S3 AI（Copilot+）", labels: ["只賣入門款", "依職務分級"], values: [0, 3] }], {
  x: 6.8, y: 1.4, w: 6.0, h: 5.7, barDir: "col", barGrouping: "stacked", chartColors: [COL.grey, COL.blue, COL.jac], showLegend: true, legendPos: "b", legendFontFace: F, legendFontSize: 13,
  showTitle: true, title: "18 台的等級組成（台）", titleFontFace: F, titleFontSize: 15, titleColor: HEX.dk1,
  showValue: true, dataLabelPosition: "ctr", dataLabelFormatCode: "0;;;", dataLabelFontSize: 13, dataLabelColor: "FFFFFF", dataLabelFontFace: F,
  catAxisLabelFontFace: F, catAxisLabelFontSize: 14, catAxisLabelColor: HEX.dk1, valAxisHidden: true, valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" } });

// D10 90-day six steps
s = slide("圖 5-1　90 天作戰計畫：六個步驟（共 45 分鐘）", "每一步的產出都填進一頁式計畫");
const six = [["選定目標客群", "7 分", "一個具體區隔"], ["痛點與觸發點", "7 分", "三痛點＋觸發事件"], ["設計主打方案", "8 分", "裝置＋軟體＋服務"], ["規劃開發活動", "8 分", "名單→會議→成交"], ["KPI 與檢核點", "7 分", "漏斗與轉換率"], ["資源與風險", "8 分", "三項需求＋對策"]];
six.forEach(([a, m, o], i) => {
  const x = 0.5 + (i % 3) * 4.2, y = 1.6 + Math.floor(i / 3) * 2.6;
  s.addShape(pres.shapes.OVAL, { x, y, w: 0.9, h: 0.9, fill: { color: COL.blue }, line: { color: COL.blue } });
  label(s, x, y, 0.9, 0.9, String(i + 1), { color: "FFFFFF", bold: true, size: 22 });
  box(s, x + 1.05, y - 0.05, 2.75, 1.0, [t(a, { bold: true, fontSize: 16 }), t(m, { fontSize: 12, color: COL.blue })], { fill: TINT.blue, align: "left" });
  box(s, x + 1.05, y + 1.1, 2.75, 0.75, [t("產出：" + o, { fontSize: 13 })], { fill: TINT.grey, align: "left" });
  if (i % 3 < 2) arrow(s, x + 3.85, y + 0.45, x + 4.15, y + 0.45);
});
arrow(s, 11.3, 3.5, 11.3, 4.05, { dash: "dash" });

// D11 Gantt
s = slide("圖 5-2　90 天時程（週）", "第 30、60、90 天設檢核點，落後 30% 以上即調整");
const gx = 3.4, gw = 9.4, wk = gw / 13;
for (let w = 0; w < 13; w++) label(s, gx + w * wk, 1.45, wk, 0.35, `W${w + 1}`, { size: 11 });
const tasks = [["經銷商訓練（10 家）", 0, 2, COL.blue], ["共同品牌 EDM", 1, 4, COL.blue], ["示範機巡迴", 4, 5, COL.jac], ["30 分鐘換機健檢", 4, 5, COL.jac], ["公會資安講座 ×2", 5, 3, COL.jac], ["健檢後一週內提案", 6, 6, COL.green], ["季末促銷與分期", 9, 4, COL.green], ["客戶案例影片", 11, 2, COL.green]];
tasks.forEach(([n, st, len, c], i) => {
  const y = 1.95 + i * 0.6;
  label(s, 0.5, y, 2.8, 0.45, n, { align: "left", size: 13, color: HEX.dk1 });
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: gx + st * wk, y: y + 0.05, w: len * wk, h: 0.36, rectRadius: 0.06, fill: { color: c }, line: { color: c } });
});
[[4.3, "Day 30 檢核"], [8.6, "Day 60 檢核"], [12.9, "Day 90 成果"]].forEach(([wkpos, txt]) => {
  const x = gx + wkpos * wk;
  s.addShape(pres.shapes.LINE, { x, y: 1.85, w: 0, h: 4.9, line: { color: COL.orange, width: 1.5, dashType: "dash" } });
  label(s, x - 0.8, 6.8, 1.6, 0.35, txt, { color: COL.orange, bold: true, size: 12 });
});
[["名單", COL.blue], ["會議", COL.jac], ["成交", COL.green]].forEach(([n, c], i) => {
  s.addShape(pres.shapes.RECTANGLE, { x: 0.5 + i * 1.0, y: 6.85, w: 0.25, h: 0.25, fill: { color: c }, line: { color: c } });
  label(s, 0.8 + i * 1.0, 6.8, 0.6, 0.35, n, { align: "left", size: 12 });
});

// D12 KPI funnel
s = slide("圖 5-3　KPI 漏斗：600 份名單 → 18 家客戶", "轉換率：名單→健檢 15%、健檢→提案 50%、提案→成交 40%；每家約 30 台");
s.addChart(pres.charts.BAR, [{ name: "數量", labels: ["名單", "健檢會議", "提案", "成交"], values: [600, 90, 45, 18] }], {
  x: 0.5, y: 1.4, w: 8.5, h: 5.7, barDir: "bar", catAxisOrientation: "maxMin", chartColors: [COL.blue], showLegend: false,
  showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 15, dataLabelColor: HEX.dk1, dataLabelFontFace: F,
  catAxisLabelFontFace: F, catAxisLabelFontSize: 15, catAxisLabelColor: HEX.dk1, valAxisHidden: true, valGridLine: { color: "E3E8F0", size: 0.5 }, catGridLine: { style: "none" }, barGapWidthPct: 40 });
[["15%", "名單 → 健檢"], ["50%", "健檢 → 提案"], ["40%", "提案 → 成交"]].forEach(([p, n], i) => {
  s.addText([{ text: p, options: { fontSize: 30, bold: true, color: COL.blue, breakLine: true, fontFace: F } }, { text: n, options: { fontSize: 14, color: HEX.dk2, fontFace: F } }], { x: 9.4, y: 1.6 + i * 1.3, w: 3.4, h: 1.1, margin: 0 });
});
box(s, 9.4, 5.6, 3.4, 1.2, [t("≈ 540 台", { bold: true, fontSize: 24 }), t("18 家 × 30 台", { fontSize: 13, color: "C9D6EA" })], { fill: HEX.dk1, color: "FFFFFF" });

// D13 envisioning process + time
s = slide("圖 6-1　Envisioning 60 分鐘工作坊流程", "從業務目標出發，客戶自己選出情境、排序並形成導入路徑");
const env = [["確認目標", 10, COL.navy], ["情境發想", 15, COL.blue], ["現場展示", 10, COL.jac], ["價值×難度排序", 10, COL.orange], ["倒推藍圖", 10, COL.green], ["約定下一步", 5, HEX.dk2]];
let cx = 0.5; const unit = 12.35 / 60;
env.forEach(([n, m, c]) => {
  s.addShape(pres.shapes.RECTANGLE, { x: cx, y: 1.7, w: m * unit, h: 1.2, fill: { color: c }, line: { color: "FFFFFF", width: 2 } });
  label(s, cx, 1.7, m * unit, 1.2, `${n}\n${m} 分`, { color: "FFFFFF", bold: true, size: m <= 5 ? 11 : 14 });
  cx += m * unit;
});
[0, 10, 25, 35, 45, 55, 60].forEach((m) => label(s, 0.5 + m * unit - 0.3, 2.95, 0.6, 0.3, String(m), { size: 11 }));
const envDetail = [["會前準備", "挑 8–10 張情境卡\n準備 Copilot+ PC 與代理程式"], ["確認目標", "問：明年此時，公司最希望有什麼不一樣？"], ["情境發想", "逐張翻卡：會發生嗎？做到了有幫助嗎？"], ["現場展示", "讓客戶自己操作一次"], ["排序與藍圖", "左上角（高價值・低難度）先做，倒推裝置、軟體、服務"], ["下一步", "週三寄導入路徑與預算，週五確認"]];
envDetail.forEach(([a, b], i) => box(s, 0.5 + (i % 3) * 4.15, 3.6 + Math.floor(i / 3) * 1.75, 3.95, 1.55, [t(a, { bold: true, fontSize: 15 }), t(b, { fontSize: 13 })], { fill: i === 0 ? TINT.orange : TINT.grey, align: "left" }));

// D14 value-effort matrix
s = slide("圖 6-2　價值 × 難度矩陣（範例：林會計師事務所）", "縱軸＝對業務目標的價值，橫軸＝導入難度");
const mx = 2.2, my = 1.5, mw = 10.4, mh = 5.3;
const quad = [["第一波：立即做", TINT.green, COL.green, 0, 0, ["單據整理（Click to Do）", "客戶說明信（代理程式）", "外出資料保護（Hello・BitLocker・vPro）"]],
  ["第二波：規劃做", TINT.blue, COL.blue, 1, 0, ["會議摘要（M365 Copilot）", "新人到職自動設定（Autopilot）"]],
  ["順手做", TINT.grey, HEX.dk2, 0, 1, ["Snap 版面配置教學"]],
  ["暫不做", TINT.orange, COL.orange, 1, 1, ["客製化 AI 模型"]]];
quad.forEach(([n, tint, c, qx, qy, items]) => {
  const x = mx + qx * mw / 2, y = my + qy * mh / 2;
  s.addShape(pres.shapes.RECTANGLE, { x, y, w: mw / 2, h: mh / 2, fill: { color: tint }, line: { color: "FFFFFF", width: 3 } });
  label(s, x + 0.2, y + 0.15, mw / 2 - 0.4, 0.45, n, { color: c, bold: true, size: 16, align: "left" });
  items.forEach((k, j) => box(s, x + 0.25, y + 0.7 + j * 0.62, mw / 2 - 0.5, 0.52, [t(k, { fontSize: 13 })], { fill: "FFFFFF", line: "D8DFEA", align: "left" }));
});
label(s, 0.4, my, 1.6, mh, "高價值\n\n↑\n價值\n↓\n\n低價值", { bold: true, size: 13 });
label(s, mx, 6.9, mw, 0.4, "低難度　←　導入難度　→　高難度", { bold: true, size: 13 });

// D15 hands-on feature map
s = slide("圖 7-1　實機操作功能地圖（12 項）", "紫色標籤＝需要 Copilot+ PC（NPU 40+ TOPS）；功能與快捷鍵以現場機器為準");
const groups = [["安全與登入", COL.blue, TINT.blue, [["Windows Hello 臉部登入", 0], ["存在感應自動鎖定", 0], ["裝置加密／BitLocker", 0]]],
  ["AI 與生產力", COL.jac, TINT.jac, [["Copilot 鍵與 Copilot", 0], ["Click to Do", 1], ["Recall（預設關閉）", 1], ["Snap 版面配置", 0]]],
  ["會議與溝通", COL.green, TINT.green, [["Windows Studio Effects", 2], ["即時字幕／翻譯", 1]]],
  ["效能與管理", COL.orange, TINT.orange, [["開機與喚醒速度", 0], ["續航與溫度", 0], ["vPro 遠端管理", 0]]]];
groups.forEach(([g, c, tint, items], i) => {
  const x = 0.5 + i * 3.12;
  box(s, x, 1.55, 2.95, 0.7, [t(g, { bold: true, fontSize: 16 })], { fill: c, color: "FFFFFF" });
  items.forEach(([n, tag], j) => {
    const y = 2.45 + j * 1.05;
    box(s, x, y, 2.95, 0.9, [t(n, { fontSize: 13, bold: true })], { fill: tint, align: "left" });
    if (tag) { s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x: x + 1.95, y: y + 0.06, w: 0.95, h: 0.3, rectRadius: 0.1, fill: { color: COL.jac }, line: { color: COL.jac } });
      label(s, x + 1.95, y + 0.06, 0.95, 0.3, tag === 2 ? "NPU" : "Copilot+", { color: "FFFFFF", size: 9, bold: true }); }
  });
});

// D16 lab time doughnut
s = slide("圖 2-4　基礎版建置時間配置（約 25 分鐘）", "測試最花時間：留足時間對照驗收清單修改指令");
s.addChart(pres.charts.DOUGHNUT, [{ name: "分鐘", labels: ["開啟與切換設定", "名稱與描述", "貼上指令", "上傳知識", "開場提示", "測試驗收", "建立與分享"], values: [2, 2, 3, 5, 3, 8, 2] }], {
  x: 0.5, y: 1.4, w: 12.3, h: 5.8, holeSize: 55, chartColors: [HEX.accent6, HEX.dk2, COL.jac, COL.green, COL.sky, COL.blue, COL.orange],
  showLegend: true, legendPos: "r", legendFontFace: F, legendFontSize: 15, legendColor: HEX.dk1,
  showValue: true, showPercent: false, dataLabelColor: "FFFFFF", dataLabelFontSize: 14, dataLabelFontFace: F, dataLabelFormatCode: '0"分"' });

pres.writeFile({ fileName: process.argv[2] }).then((f) => console.log("wrote", f));

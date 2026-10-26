// Shared theme, icons and slide helpers for the Power On Sydney decks.
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa6");

const THEME = {
  name: "Power On Sydney",
  headFontFace: "Segoe UI Semibold",
  bodyFontFace: "Segoe UI",
  colors: {
    dk1: "0D1B33", lt1: "FFFFFF", dk2: "3B4A63", lt2: "EEF3FA",
    accent1: "0A5BD3", accent2: "6B42C4", accent3: "16764A", accent4: "B45F06",
    accent5: "5C9CFF", accent6: "8A97AD", hlink: "0A5BD3", folHlink: "6B42C4",
  },
};
const HEX = THEME.colors;
const ZH = "Microsoft JhengHei";

async function icon(name, color = "FFFFFF", size = 256) {
  const Comp = fa[name];
  if (!Comp) throw new Error(`icon ${name} not found`);
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(Comp, { color: "#" + color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

// Layouts: dark title/closing, light content. Footer and number live on the layout.
function defineLayouts(pres, footer) {
  const C = pres.SchemeColor;
  pres.defineSlideMaster({
    title: "DARK_TITLE",
    background: { color: C.text1 },
    objects: [
      { placeholder: { options: { name: "kicker", type: "body", x: 0.7, y: 1.0, w: 11.9, h: 0.45, fontSize: 14, color: C.accent5, bold: true, charSpacing: 3, margin: 0 }, text: "" } },
      { placeholder: { options: { name: "title", type: "title", x: 0.7, y: 1.6, w: 11.9, h: 1.7, fontSize: 44, bold: true, color: C.background1, valign: "top", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "zh", type: "body", x: 0.7, y: 3.35, w: 11.9, h: 0.6, fontSize: 22, color: "C9D6EA", fontFace: ZH, margin: 0 }, text: "" } },
      { text: { text: footer, options: { x: 0.7, y: 6.85, w: 9, h: 0.3, fontSize: 10, color: "8EA2C4", margin: 0 } } },
    ],
  });
  pres.defineSlideMaster({
    title: "CONTENT",
    background: { color: C.background1 },
    margin: [0.5, 0.6, 0.6, 0.6],
    objects: [
      { placeholder: { options: { name: "title", type: "title", x: 0.6, y: 0.35, w: 12.1, h: 0.75, fontSize: 32, bold: true, color: C.text1, valign: "top", align: "left", margin: 0 }, text: "" } },
      { placeholder: { options: { name: "zh", type: "body", x: 0.6, y: 1.1, w: 12.1, h: 0.4, fontSize: 16, color: C.text2, fontFace: ZH, margin: 0 }, text: "" } },
      { text: { text: footer, options: { x: 0.6, y: 7.0, w: 9, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
    ],
    slideNumber: { x: 12.2, y: 7.0, w: 0.5, h: 0.3, fontSize: 10, color: HEX.accent6, align: "right" },
  });
}

function content(pres, section, en, zh) {
  const s = pres.addSlide({ masterName: "CONTENT", sectionTitle: section });
  s.addText(en, { placeholder: "title" });
  s.addText(zh, { placeholder: "zh" });
  return s;
}

function dark(pres, section, kicker, en, zh) {
  const s = pres.addSlide({ masterName: "DARK_TITLE", sectionTitle: section });
  s.addText(kicker, { placeholder: "kicker" });
  s.addText(en, { placeholder: "title" });
  s.addText(zh, { placeholder: "zh" });
  return s;
}

// The deck's motif: a jacaranda quote card labelled KEY LINE 金句.
function quoteCard(pres, s, x, y, w, h, en, zh, onDark = false) {
  const C = pres.SchemeColor;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.12, objectName: "Key line card",
    fill: { color: onDark ? "24345A" : "F1ECFB" }, line: { color: onDark ? "24345A" : "F1ECFB" },
  });
  s.addText("KEY LINE  金句", {
    x: x + 0.3, y: y + 0.2, w: w - 0.6, h: 0.3, fontSize: 11, bold: true, charSpacing: 2,
    color: onDark ? "C3A8FF" : C.accent2, margin: 0, isTextBox: true,
  });
  s.addText([
    { text: "“" + en + "”", options: { fontFace: "Cambria", italic: true, fontSize: h > 1.8 ? 22 : 18, color: onDark ? "FFFFFF" : C.text1, breakLine: true } },
    { text: "「" + zh + "」", options: { fontFace: ZH, fontSize: 13, color: onDark ? "C9D6EA" : C.text2 } },
  ], { x: x + 0.3, y: y + 0.5, w: w - 0.6, h: h - 0.65, valign: "top", margin: 0, paraSpaceAfter: 6, isTextBox: true });
}

async function iconCircle(pres, s, x, y, d, iconName, fill, name) {
  s.addShape(pres.shapes.OVAL, { x, y, w: d, h: d, fill: { color: fill }, line: { color: fill }, objectName: name || "Icon circle" });
  const pad = d * 0.25;
  s.addImage({ data: await icon(iconName), x: x + pad, y: y + pad, w: d - 2 * pad, h: d - 2 * pad, altText: name || iconName });
}

// Card with icon, English heading, body and Chinese caption.
async function card(pres, s, x, y, w, h, o) {
  const C = pres.SchemeColor;
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.1, fill: { color: o.fill || HEX.lt2 }, line: { color: o.fill || HEX.lt2 }, objectName: o.title,
  });
  let ty = y + 0.25;
  if (o.icon) { await iconCircle(pres, s, x + 0.25, y + 0.25, 0.6, o.icon, o.iconFill || HEX.accent1, o.title + " icon"); ty = y + 1.0; }
  const runs = [{ text: o.title, options: { bold: true, fontSize: o.titleSize || 17, color: C.text1, breakLine: true } }];
  if (o.body) runs.push({ text: o.body, options: { fontSize: o.bodySize || 14, color: C.text2, breakLine: !!o.zh } });
  if (o.zh) runs.push({ text: o.zh, options: { fontSize: 12, color: C.accent1, fontFace: ZH } });
  s.addText(runs, { x: x + 0.25, y: ty, w: w - 0.5, h: y + h - ty - 0.15, valign: "top", margin: 0, paraSpaceAfter: 5, isTextBox: true });
}

module.exports = { THEME, HEX, ZH, icon, defineLayouts, content, dark, quoteCard, iconCircle, card };

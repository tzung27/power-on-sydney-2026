# Power On: Windows Means Business · Sydney 行前準備

Microsoft × Intel 合作夥伴活動（2026/10/27–28，North Sydney）的行前指南、場次預習、實作步驟、簡報檔與操作手冊。

> 場次內容為依官方議程題目所做的預測與準備；產品功能、介面與數據請以 Microsoft／Intel 官方資料為準。機型、價格、KPI 與客戶案例皆為練習用的虛構示範資料。

## 內容

| 路徑 | 說明 |
|---|---|
| `site/` | 行前指南網站（9 頁，靜態 HTML）。用瀏覽器開啟 `site/index.html`；右上角 **EN 英文** 可展開全部英文 |
| `deliverables/01_Windows11_Positioning_Demo_EN.pptx` | Windows 11 定位簡報與 Demo 動線（12 頁，英文為主、中文輔助，備忘稿含講稿） |
| `deliverables/02_Agent_Lab_Demo_EN.pptx` | 代理程式實驗室 3 分鐘展示（7 頁） |
| `deliverables/03_SMB_90Day_Plan_Report_EN.pptx` | 第二天小組工作坊 3 分鐘報告（7 頁） |
| `deliverables/Power_On_雪梨_實作與演練操作手冊.docx` / `.pdf` | 35 頁操作手冊：詳細步驟、流程圖、功能圖、圖表、檢查表與金句 |
| `行前準備.docx` | 原始行前資訊 |
| `tools/` | 重新產生網站、簡報與手冊的腳本 |

## 重新產生

網站（Python 3）：

```bash
cd tools/site
python en_apply.py          # 把英文區塊加進中文頁面片段 → frag/
python build.py ../../site  # 組合成完整網站
```

簡報與手冊（Node.js；PNG 匯出與目錄更新需要 Windows 上的 PowerPoint／Word）：

```bash
cd tools/office
npm install
node decks.js ../../deliverables            # 需設定 PPTX_SKILL 指向 apply_theme.js 所在位置
node diagrams.js diagrams.pptx              # 再用 export_slides.ps1 匯出 diag/*.png
node guide.js ../../deliverables/手冊.docx   # 再用 finish_docx.ps1 更新目錄並輸出 PDF
```

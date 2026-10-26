import pathlib, sys

HERE = pathlib.Path(__file__).parent
FRAG = HERE / "frag"
OUT = pathlib.Path(sys.argv[1])

# key, output file, <title>, nav label, group
PAGES = [
    ("home", "index.html", "雪梨行前指南", "行前指南", "總覽"),
    ("d1-keynotes", "day1-keynotes.html", "D1 主題演講預習", "主題演講", "DAY 1"),
    ("d1-lab", "day1-agent-lab.html", "代理程式實作實驗室", "代理程式實驗室", "DAY 1"),
    ("d1-discovery", "day1-discovery.html", "裝置探索提問練習", "探索提問", "DAY 1"),
    ("d1-pitch", "day1-pitch.html", "Windows 11 完美簡報", "完美簡報", "DAY 1"),
    ("d2-sessions", "day2-sessions.html", "D2 SMB 場次預習", "SMB 場次", "DAY 2"),
    ("d2-workshop", "day2-smb-workshop.html", "SMB 加速小組工作坊", "小組工作坊", "DAY 2"),
    ("d2-envision", "day2-envisioning.html", "Envisioning 實戰手冊", "Envisioning", "DAY 2"),
    ("d2-handson", "day2-hands-on.html", "實機操作示範清單", "實機示範", "DAY 2"),
]

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com">'
         '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>'
         '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500'
         '&family=Noto+Sans+TC:wght@400;500;700;900&family=Noto+Serif+TC:wght@700&display=swap">')


def nav(cur):
    groups, out = {}, []
    for k, f, t, label, g in PAGES:
        groups.setdefault(g, []).append((k, f, label))
    for g, items in groups.items():
        links = "".join(
            f'<a href="{f}"{" aria-current=\"page\"" if k == cur else ""}>{label}</a>' for k, f, label in items)
        out.append(f'<div class="nav-group"><span class="nav-label">{g}</span>{links}</div>')
    return ('<header class="topbar"><div class="wrap">'
            '<div class="brand-row"><a class="brand" href="index.html"><b>Power On · Sydney</b><span>WINDOWS MEANS BUSINESS · 2026.10.27–28</span></a>'
            '<button class="en-toggle" type="button" data-en-toggle aria-pressed="false" title="展開或收合全部英文">EN 英文</button></div>'
            f'<nav class="nav" aria-label="頁面">{"".join(out)}</nav></div></header>')


def pager(i):
    parts = []
    if i > 0:
        k, f, t, label, g = PAGES[i - 1]
        parts.append(f'<a href="{f}"><small>← 上一頁</small><span>{g} · {t}</span></a>')
    if i < len(PAGES) - 1:
        k, f, t, label, g = PAGES[i + 1]
        parts.append(f'<a class="next" href="{f}"><small>下一頁 →</small><span>{g} · {t}</span></a>')
    return f'<div class="wrap"><nav class="pager" aria-label="上下頁">{"".join(parts)}</nav></div>'


FOOT = ('<footer class="foot"><div class="wrap">本站為個人行前準備用。場次內容為依官方議程題目所做的預測與準備，'
        '實際內容、產品功能與數據請以 Microsoft／Intel 現場與官方資料為準。示範資料（機型、價格、客戶）皆為虛構情境。</div></footer>')

for i, (k, f, t, label, g) in enumerate(PAGES):
    body = (FRAG / f"{k}.html").read_text(encoding="utf-8")
    head = (f'<title>{t}</title>\n<meta name="claude:viewport-fit-sides" content="cover">\n'
            f'{FONTS}\n<link rel="stylesheet" href="style.css?v=3">\n')
    inner = f'{nav(k)}\n<main>\n{body}\n</main>\n{pager(i)}\n{FOOT}\n<script src="app.js?v=3"></script>\n'
    if f == "index.html":
        # artifact entry page: the publish skeleton supplies doctype/html/body
        (HERE / "publish-index.html").write_text(head + inner, encoding="utf-8")
    html = ('<!doctype html>\n<html lang="zh-Hant">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
            f'{head}</head>\n<body>\n{inner}</body>\n</html>\n')
    (OUT / f).write_text(html, encoding="utf-8")
    print("wrote", f, len(html))

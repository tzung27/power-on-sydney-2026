import sys, fitz
from PIL import Image
pdf, prefix, per = sys.argv[1], sys.argv[2], 6
doc = fitz.open(pdf)
pages = []
for p in doc:
    pix = p.get_pixmap(dpi=70)
    pages.append(Image.frombytes("RGB", (pix.width, pix.height), pix.samples))
w, h = pages[0].size
for i in range(0, len(pages), per):
    sheet = Image.new("RGB", (w * 3 + 20, h * 2 + 10), (130, 130, 130))
    for k, im in enumerate(pages[i:i + per]):
        sheet.paste(im, ((k % 3) * (w + 10), (k // 3) * (h + 10)))
    sheet.save(f"{prefix}-{i // per + 1}.png"); print(f"{prefix}-{i // per + 1}.png")

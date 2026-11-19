#!/usr/bin/env python3
"""用最终确认的 Logo（深蓝拨片 + 民谣吉他琴头）生成 App 全部图标资源。

用法:
  python3 gen-final-assets.py <源图.png> <工程根目录>

工程根目录下需包含 www/ 与 android/app/src/main/res/。
"""
import sys
import os
from PIL import Image

src = sys.argv[1]
project = sys.argv[2]
res = os.path.join(project, "android", "app", "src", "main", "res")

im = Image.open(src).convert("RGBA")
w, h = im.size
s = min(w, h)
im = im.crop(((w - s) // 2, (h - s) // 2, (w + s) // 2, (h + s) // 2))

# 欢迎页 logo（白底，圆角由 CSS 处理）
www_dir = os.path.join(project, "www")
os.makedirs(www_dir, exist_ok=True)
im.resize((800, 800), Image.LANCZOS).convert("RGB").save(os.path.join(www_dir, "logo.png"))


def save_full(size, path):
    """legacy 图标：白底画布，Logo 整图铺满。"""
    bg = Image.new("RGBA", (size, size), (255, 255, 255, 255))
    bg.alpha_composite(im.resize((size, size), Image.LANCZOS))
    bg.save(path)


def save_foreground(size, path):
    """adaptive 前景：透明画布，Logo 缩进到中心安全区 70/108。"""
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    area = round(size * 70 / 108)
    pad = (size - area) // 2
    canvas.alpha_composite(im.resize((area, area), Image.LANCZOS), (pad, pad))
    canvas.save(path)


def save_background(size, path):
    Image.new("RGBA", (size, size), (255, 255, 255, 255)).save(path)


legacy = {"mdpi": 48, "hdpi": 72, "xhdpi": 96, "xxhdpi": 144, "xxxhdpi": 192}
foreground = {"mdpi": 108, "hdpi": 162, "xhdpi": 216, "xxhdpi": 324, "xxxhdpi": 432}

for den, sz in legacy.items():
    d = os.path.join(res, "mipmap-" + den)
    os.makedirs(d, exist_ok=True)
    save_full(sz, os.path.join(d, "ic_launcher.png"))
    save_full(sz, os.path.join(d, "ic_launcher_round.png"))
    save_background(sz, os.path.join(d, "ic_launcher_background.png"))

for den, sz in foreground.items():
    d = os.path.join(res, "mipmap-" + den)
    os.makedirs(d, exist_ok=True)
    save_foreground(sz, os.path.join(d, "ic_launcher_foreground.png"))

print("DONE:", project)

import os
import shutil
import subprocess
import sys

def run(cmd, cwd=None, check=True):
    print(f"\n$ {cmd}", flush=True)
    res = subprocess.run(cmd, shell=True, cwd=cwd, text=True, capture_output=False)
    if check and res.returncode != 0:
        raise RuntimeError(f"Command failed ({res.returncode}): {cmd}")
    return res.returncode

print("=== System Info ===", flush=True)
print("CPUs:", os.cpu_count(), flush=True)
run("free -h", check=False)
run("node -v || true", check=False)
run("ffmpeg -version | head -n 2 || true", check=False)

# Install CJK Traditional Chinese fonts + Chromium runtime libs + Node 22 if needed
run("apt-get update -qq", check=True)
run("DEBIAN_FRONTEND=noninteractive apt-get install -y -qq fonts-noto-cjk fontconfig libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2t64 || DEBIAN_FRONTEND=noninteractive apt-get install -y -qq fonts-noto-cjk fontconfig libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2", check=True)
run("fc-cache -fv > /dev/null && fc-match 'sans-serif:lang=zh-tw' && fc-match 'serif:lang=zh-tw'", check=False)

node_ver = subprocess.run("node -v", shell=True, text=True, capture_output=True).stdout.strip()
need_node = True
if node_ver.startswith("v"):
    try:
        major = int(node_ver[1:].split(".")[0])
        if major >= 22:
            need_node = False
    except Exception:
        pass

if need_node:
    print("Installing Node.js 22...", flush=True)
    run("curl -fsSL https://deb.nodesource.com/setup_22.x | bash - > /dev/null && apt-get install -y -qq nodejs", check=True)
    run("node -v", check=True)

# Unpack project bundle
proj = "/content/project"
if os.path.exists(proj):
    shutil.rmtree(proj)
os.makedirs(proj, exist_ok=True)
run(f"tar -xzf /content/project_bundle.tar.gz -C {proj}", check=True)

# Install hyperframes in /content/project
run("npm install --no-audit --no-fund --silent", cwd=proj, check=True)
run("npx hyperframes browser ensure", cwd=proj, check=True)
run("npx hyperframes doctor --json", cwd=proj, check=False)

# Run hyperframes check across key timestamps covering all 15 frames
check_ts = "12,35,68,96,132,166,196,222,256,288,320,352,390,422,445"
rc = run(
    f"npx hyperframes check --at {check_ts} --snapshots --json > /content/check_report.json",
    cwd=proj,
    check=False,
)
print(f"hyperframes check exited with code {rc}", flush=True)

import json
with open("/content/check_report.json", "r", encoding="utf-8") as f:
    rep = json.load(f)
print("check ok:", rep.get("ok"), "browserSkipped:", rep.get("browserSkipped"), flush=True)
for section in ("lint", "runtime", "layout", "motion"):
    sec = rep.get(section)
    if sec:
        summary = sec if not isinstance(sec, dict) else {k: v for k, v in sec.items() if k != "findings"}
        print(f"  {section}: {summary}", flush=True)
        findings = sec.get("findings") or sec.get("errors") or []
        if findings:
            print(f"    sample findings ({len(findings)}):", findings[:8], flush=True)

# Capture 15 clean midpoint snapshots & build a 3x5 contact sheet JPG
snap_dir = "/content/snaps"
os.makedirs(snap_dir, exist_ok=True)
run(f"npx hyperframes snapshot --at {check_ts} --output {snap_dir}", cwd=proj, check=False)

import glob
from PIL import Image, ImageDraw

pngs = sorted(glob.glob(f"{snap_dir}/*.png") or glob.glob(f"{proj}/snapshots/*.png"))
print(f"Found {len(pngs)} snapshot PNGs:", pngs[:5], "...", flush=True)
if pngs:
    tw, th = 640, 360
    cols = 3
    rows = (len(pngs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows * th), (235, 230, 220))
    for i, p in enumerate(pngs):
        im = Image.open(p).convert("RGB").resize((tw, th), Image.Resampling.LANCZOS)
        x = (i % cols) * tw
        y = (i // cols) * th
        sheet.paste(im, (x, y))
    sheet.save("/content/contact-sheet.jpg", quality=90)
    print("Saved /content/contact-sheet.jpg", os.path.getsize("/content/contact-sheet.jpg"), flush=True)


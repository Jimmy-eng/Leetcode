import glob
import os
import subprocess
from PIL import Image

proj = "/content/project"
snap_dir = "/content/snaps2"
os.makedirs(snap_dir, exist_ok=True)

def run(cmd, cwd=proj, check=True):
    print(f"\n$ {cmd}", flush=True)
    r = subprocess.run(cmd, shell=True, cwd=cwd, text=True)
    if check and r.returncode != 0:
        raise RuntimeError(f"Failed ({r.returncode}): {cmd}")
    return r.returncode

run("tar -xzf /content/patch_bundle.tar.gz -C /content/project", cwd="/content", check=True)
check_ts = "12,35,68,96,132,166,196,222,256,288,320,352,390,422,445"
rc = run(f"npx hyperframes check --at {check_ts} --snapshots --no-cache --json > /content/check_report2.json", check=False)
print("check2 exit code:", rc, flush=True)

import json
with open("/content/check_report2.json", "r", encoding="utf-8") as f:
    rep = json.load(f)
print("check2 ok:", rep.get("ok"), "browserSkipped:", rep.get("browserSkipped"), flush=True)
for section in ("lint", "runtime", "layout", "contrast", "motion"):
    sec = rep.get(section)
    if sec:
        summary = sec if not isinstance(sec, dict) else {k: v for k, v in sec.items() if k != "findings"}
        print(f"  {section}: {summary}", flush=True)

run(f"npx hyperframes snapshot --at {check_ts} --output {snap_dir}", check=True)
pngs = sorted(glob.glob(f"{snap_dir}/*.png"))
print(f"Captured {len(pngs)} PNGs", flush=True)
if pngs:
    tw, th = 640, 360
    cols = 3
    rows = (len(pngs) + cols - 1) // cols
    sheet = Image.new("RGB", (cols * tw, rows * th), (235, 230, 220))
    for i, p in enumerate(pngs):
        im = Image.open(p).convert("RGB").resize((tw, th), Image.Resampling.LANCZOS)
        sheet.paste(im, ((i % cols) * tw, (i // cols) * th))
    sheet.save("/content/contact-sheet2.jpg", quality=90)
    print("Saved /content/contact-sheet2.jpg", os.path.getsize("/content/contact-sheet2.jpg"), flush=True)

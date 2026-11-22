import os
import subprocess
import time

proj = "/content/project"
out_mp4 = "/content/239_Sliding_Window_Maximum_教學.mp4"

t0 = time.time()
cmd = [
    "npx", "hyperframes", "render",
    "--quality", "looks",
    "--workers", "2",
    "--browser-timeout", "120",
    "--output", out_mp4,
]
print(f"Starting render on {os.cpu_count()} vCPUs: {' '.join(cmd)}", flush=True)
proc = subprocess.Popen(cmd, cwd=proj, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, bufsize=1)
for line in proc.stdout:
    print(line, end="", flush=True)
rc = proc.wait()
elapsed = time.time() - t0
print(f"\nRender finished in {elapsed:.1f}s with exit code {rc}", flush=True)
if rc != 0:
    raise RuntimeError(f"Render failed with exit code {rc}")

if not os.path.exists(out_mp4):
    raise RuntimeError(f"Output file missing: {out_mp4}")

size_mb = os.path.getsize(out_mp4) / (1024 * 1024)
print(f"Output size: {size_mb:.2f} MB", flush=True)

probe = subprocess.run(
    ["ffprobe", "-v", "error", "-show_format", "-show_streams", out_mp4],
    text=True,
    capture_output=True,
)
print("\n=== ffprobe ===", flush=True)
print(probe.stdout, flush=True)
if probe.stderr:
    print(probe.stderr, flush=True)

import asyncio
import inspect
import json
import os
import re
import subprocess
import sys
from pathlib import Path

CODE_ROOT = Path(r"D:\@高通面試\leetcode\239_Sliding_Window_Maximum\code")
PY_LIBS_DIR = CODE_ROOT / ".py_libs"
if PY_LIBS_DIR.exists():
    sys.path.insert(0, str(PY_LIBS_DIR))

import edge_tts
PROJECT_DIR = CODE_ROOT / "project"
TMP_DIR = CODE_ROOT / ".tmp"
VOICE_DIR = PROJECT_DIR / "assets" / "voice"
SCRIPT_PATH = PROJECT_DIR / "SCRIPT.md"
META_PATH = PROJECT_DIR / "audio_meta.json"

VOICE_NAME = "zh-TW-YunJheNeural"
LEAD_PAD_S = 0.25
TAIL_PAD_S = 0.55

ASCII_TOKEN_RE = re.compile(r"^[A-Za-z0-9_.\-+:/]+$")
PUNCT_ONLY_RE = re.compile(r"^[.?!,;:—–\-，。！？、；：「」『』（）()\[\]]+$")


def parse_script_md(path: Path) -> list[dict]:
    """Parse SCRIPT.md using the exact same rules as faceless-explainer/scripts/audio.mjs."""
    raw = path.read_text(encoding="utf-8")
    out: list[dict] = []
    cur = None

    def flush() -> None:
        nonlocal cur
        if cur and cur["text"].strip():
            out.append({"frame": cur["frame"], "text": cur["text"].strip()})
        cur = None

    for line in raw.splitlines():
        m_head = re.match(r"^#{2,3}\s+.*?\(frame\s+(\d+)\)", line, re.IGNORECASE)
        if m_head:
            flush()
            cur = {"frame": int(m_head.group(1)), "text": ""}
            continue
        if cur is None:
            continue
        if re.match(r"^\s*\*\*", line):
            continue
        m_body = re.match(r"^(?: {4,}|\t)(.+)$", line)
        if m_body:
            part = m_body.group(1).strip()
            cur["text"] = f"{cur['text']} {part}".strip() if cur["text"] else part

    flush()
    return out


def normalize_for_tts(text: str) -> str:
    """Normalize code/complexity tokens only for natural Taiwanese Mandarin pronunciation."""
    replacements = [
        ("O(n log n)", "O of n log n"),
        ("O(nk)", "O of n k"),
        ("O(n)", "O of n"),
        ("O(k)", "O of k"),
        ("std::deque", "S T D deque"),
        ("nums[dq.back()]", "nums dq back"),
        ("nums[i]", "nums i"),
        ("dq.front()", "dq front"),
        ("Max-Heap", "Max Heap"),
    ]
    out = text
    for src, dst in replacements:
        out = out.replace(src, dst)
    return out


def is_ascii_word(token: str) -> bool:
    return bool(ASCII_TOKEN_RE.match(token))


def group_word_events(events: list[dict]) -> list[dict]:
    """
    Group raw Chinese WordBoundary tokens into readable 2-8 char phrases,
    while keeping English/alphanumeric tokens intact and preserving exact bounds.
    """
    cleaned = []
    for ev in events:
        t = str(ev.get("text", "")).strip()
        if not t or PUNCT_ONLY_RE.match(t):
            continue
        start = float(ev["start"])
        end = max(float(ev["end"]), start + 0.02)
        cleaned.append({"text": t, "start": start, "end": end})

    if not cleaned:
        return []

    grouped: list[dict] = []
    cur: dict | None = None

    for tok in cleaned:
        t = tok["text"]
        if cur is None:
            cur = dict(tok)
            continue

        cur_ascii = is_ascii_word(cur["text"])
        tok_ascii = is_ascii_word(t)
        gap = tok["start"] - cur["end"]

        if cur_ascii or tok_ascii or gap > 0.16:
            grouped.append(cur)
            cur = dict(tok)
            continue

        # Both are non-ASCII (CJK): merge if combined length stays <= 8 chars
        # and current token is still short (< 4 chars) or next is single-char.
        combined_len = len(cur["text"]) + len(t)
        if combined_len <= 8 and (len(cur["text"]) < 4 or len(t) <= 2):
            cur["text"] = cur["text"] + t
            cur["end"] = max(cur["end"], tok["end"])
        else:
            grouped.append(cur)
            cur = dict(tok)

    if cur is not None:
        grouped.append(cur)

    # Second pass: merge any leftover 1-char CJK tokens into adjacent CJK token if <= 8 chars
    merged: list[dict] = []
    for item in grouped:
        if (
            merged
            and not is_ascii_word(item["text"])
            and not is_ascii_word(merged[-1]["text"])
            and len(item["text"]) == 1
            and len(merged[-1]["text"]) + 1 <= 8
            and (item["start"] - merged[-1]["end"]) <= 0.25
        ):
            merged[-1]["text"] += item["text"]
            merged[-1]["end"] = max(merged[-1]["end"], item["end"])
        else:
            merged.append(item)

    return merged


def fallback_split_from_sentences(sent_events: list[dict], raw_text: str, raw_audio_dur: float) -> list[dict]:
    """Split text proportionally into 2-6 char chunks if WordBoundary yields nothing."""
    segments = [s for s in sent_events if str(s.get("text", "")).strip()]
    if not segments:
        segments = [{"text": raw_text, "start": 0.0, "end": max(raw_audio_dur, 0.5)}]

    out: list[dict] = []
    for seg in segments:
        txt = re.sub(r"[，。！？、；：「」『』（）()\[\],.?!;:—]+", " ", seg["text"]).strip()
        if not txt:
            continue
        pieces: list[str] = []
        for word in txt.split():
            if is_ascii_word(word):
                pieces.append(word)
            else:
                for idx in range(0, len(word), 4):
                    pieces.append(word[idx : idx + 4])
        total_chars = sum(len(p) for p in pieces) or 1
        seg_start = float(seg["start"])
        seg_dur = max(float(seg["end"]) - seg_start, 0.2)
        cursor = seg_start
        for p in pieces:
            dur = seg_dur * (len(p) / total_chars)
            out.append({"text": p, "start": cursor, "end": cursor + dur})
            cursor += dur
    return out


def probe_duration(path: Path) -> float:
    out = subprocess.check_output(
        [
            "ffprobe",
            "-v",
            "error",
            "-show_entries",
            "format=duration",
            "-of",
            "csv=p=0",
            str(path),
        ],
        text=True,
    ).strip()
    return round(float(out), 2)


async def synth_one(frame_num: int, spoken_raw: str) -> tuple[dict, bool]:
    TMP_DIR.mkdir(parents=True, exist_ok=True)
    VOICE_DIR.mkdir(parents=True, exist_ok=True)

    tts_text = normalize_for_tts(spoken_raw)
    tmp_mp3 = TMP_DIR / f"voice_{frame_num:02d}.mp3"
    out_wav = VOICE_DIR / f"{frame_num:02d}.wav"
    meta_cache = TMP_DIR / f"voice_{frame_num:02d}.meta.json"

    if out_wav.exists() and out_wav.stat().st_size > 10_000 and meta_cache.exists():
        cached = json.loads(meta_cache.read_text(encoding="utf-8"))
        print(
            f"Frame {frame_num:02d}: cached {cached['duration_s']:6.2f}s | "
            f"{len(cached['words']):2d} word tokens -> {cached['path']}",
            flush=True,
        )
        return cached, True

    sig = inspect.signature(edge_tts.Communicate.__init__)
    kwargs = {"voice": VOICE_NAME}
    if "boundary" in sig.parameters:
        kwargs["boundary"] = "WordBoundary"

    word_events: list[dict] = []
    sent_events: list[dict] = []
    max_attempts = 8

    for attempt in range(1, max_attempts + 1):
        word_events.clear()
        sent_events.clear()
        try:
            comm = edge_tts.Communicate(tts_text, **kwargs)
            with tmp_mp3.open("wb") as f_mp3:
                async for chunk in comm.stream():
                    ctype = chunk.get("type")
                    if ctype == "audio":
                        f_mp3.write(chunk["data"])
                    elif ctype == "WordBoundary":
                        start = chunk["offset"] / 1e7
                        dur = chunk["duration"] / 1e7
                        word_events.append(
                            {"text": chunk.get("text", ""), "start": start, "end": start + dur}
                        )
                    elif ctype == "SentenceBoundary":
                        start = chunk["offset"] / 1e7
                        dur = chunk["duration"] / 1e7
                        sent_events.append(
                            {"text": chunk.get("text", ""), "start": start, "end": start + dur}
                        )
            if not tmp_mp3.exists() or tmp_mp3.stat().st_size <= 1000:
                raise edge_tts.exceptions.NoAudioReceived("Downloaded MP3 too small or empty")
            break
        except Exception as err:
            try:
                tmp_mp3.unlink(missing_ok=True)
            except OSError:
                pass
            if attempt >= max_attempts:
                raise
            delay = min(12.0, 2.5 * attempt)
            print(
                f"[Frame {frame_num:02d}] attempt {attempt}/{max_attempts} failed "
                f"({type(err).__name__}: {err}); retrying in {delay:.1f}s...",
                flush=True,
            )
            await asyncio.sleep(delay)

    raw_mp3_dur = probe_duration(tmp_mp3)

    # Transcode MP3 -> 44.1 kHz mono WAV with 0.25s lead-in and 0.55s tail padding
    delay_ms = int(round(LEAD_PAD_S * 1000))
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-loglevel",
            "error",
            "-i",
            str(tmp_mp3),
            "-af",
            f"adelay={delay_ms}|{delay_ms},apad=pad_dur={TAIL_PAD_S}",
            "-ar",
            "44100",
            "-ac",
            "1",
            str(out_wav),
        ],
        check=True,
    )

    try:
        tmp_mp3.unlink(missing_ok=True)
    except OSError:
        pass

    duration_s = probe_duration(out_wav)
    grouped = group_word_events(word_events)
    if not grouped:
        grouped = fallback_split_from_sentences(sent_events, tts_text, raw_mp3_dur)

    words = []
    for idx, w in enumerate(grouped):
        s = round(min(duration_s, max(0.0, w["start"] + LEAD_PAD_S)), 3)
        e = round(min(duration_s, max(s + 0.02, w["end"] + LEAD_PAD_S)), 3)
        words.append({"id": f"w{idx}", "text": w["text"], "start": s, "end": e})

    rel_path = f"assets/voice/{frame_num:02d}.wav"
    result = {
        "frame": frame_num,
        "path": rel_path,
        "duration_s": duration_s,
        "words": words,
    }
    meta_cache.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"Frame {frame_num:02d}: {duration_s:6.2f}s | {len(words):2d} word tokens "
        f"(raw={len(word_events)}, sent={len(sent_events)}) -> {rel_path}",
        flush=True,
    )
    return result, False


async def main() -> None:
    os.environ["TEMP"] = str(TMP_DIR)
    os.environ["TMP"] = str(TMP_DIR)

    lines = parse_script_md(SCRIPT_PATH)
    if len(lines) != 15:
        raise RuntimeError(f"Expected 15 lines in SCRIPT.md, parsed {len(lines)}")

    voices = []
    for idx, item in enumerate(lines):
        v, was_cached = await synth_one(item["frame"], item["text"])
        voices.append(v)
        if not was_cached and idx < len(lines) - 1:
            await asyncio.sleep(1.5)

    meta = {
        "bgm": None,
        "bgm_pending": False,
        "voices": voices,
        "sfx": [],
    }
    META_PATH.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    total = round(sum(v["duration_s"] for v in voices), 2)
    print(f"\nDone! Wrote {META_PATH} (15 voices, total {total}s)", flush=True)


if __name__ == "__main__":
    asyncio.run(main())

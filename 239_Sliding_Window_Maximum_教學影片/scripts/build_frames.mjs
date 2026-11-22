#!/usr/bin/env node
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PROJECT_DIR = "D:/@高通面試/leetcode/239_Sliding_Window_Maximum/code/project";
const FRAMES_DIR = join(PROJECT_DIR, "compositions/frames");
const STORYBOARD_PATH = join(PROJECT_DIR, "STORYBOARD.md");

mkdirSync(FRAMES_DIR, { recursive: true });

const C = {
  cream: "#FAF9F5",
  tile: "#EFE9DE",
  tileStrong: "#ECE3D4",
  ink: "#141413",
  muted: "#5E5A50",
  faint: "#8E8779",
  coral: "#CC785C",
  coralDark: "#9A4E34",
  coralSoft: "#F5E5DD",
  navy: "#181715",
  navyElev: "#252320",
  teal: "#5DB8A6",
  amber: "#E8A55A",
  green: "#5A8A55",
  greenSoft: "#E3EEDF",
  red: "#B8483A",
  redSoft: "#F7E1DC",
  blue: "#2563EB",
  blueSoft: "#DBEAFE",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
  hair: "rgba(20, 20, 19, 0.14)",
  hairStrong: "rgba(20, 20, 19, 0.24)",
};

// Crisp inline vector icons (zero reliance on Unicode symbol/emoji fonts -> zero tofu boxes)
const SVG_SPIKE = `<svg style="display:inline-block;vertical-align:-3px;margin-right:12px;" width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M1 12h22M4.2 4.2l15.6 15.6M19.8 4.2L4.2 19.8" stroke="${C.coral}" stroke-width="3.2" stroke-linecap="round"/></svg>`;
const SVG_CROWN = (color = C.green, size = 34) => `<svg style="display:inline-block;vertical-align:-4px;margin-left:8px;" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}"><path d="M3 18h18v2H3v-2zm0-2l2-9 4.5 4.5L12 5l2.5 6.5L19 7l2 9H3z"/></svg>`;
const SVG_ARROW_R = (color = C.coral, size = 34) => `<svg style="display:inline-block;vertical-align:-5px;margin:0 6px;" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M4 12h15m-5-6l6 6-6 6" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SVG_ARROW_L = (color = C.red, size = 34) => `<svg style="display:inline-block;vertical-align:-5px;margin:0 6px;" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M20 12H5m5-6l-6 6 6 6" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SVG_CHECK = (color = C.green, size = 30) => `<svg style="display:inline-block;vertical-align:-4px;margin-right:8px;" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="${color}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const SVG_CROSS = (color = C.red, size = 30) => `<svg style="display:inline-block;vertical-align:-4px;margin-right:8px;" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="${color}" stroke-width="3.4" stroke-linecap="round"/></svg>`;
const DOT = (color) => `<span style="display:inline-block;width:20px;height:20px;border-radius:9999px;background:${color};vertical-align:-2px;margin-right:6px;"></span>`;

function sharedCss(p) {
  return `
@font-face { font-family: 'EB Garamond'; src: url('assets/fonts/EBGaramond_400.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: block; }
@font-face { font-family: 'EB Garamond'; src: url('assets/fonts/EBGaramond_400_italic.woff2') format('woff2'); font-weight: 400; font-style: italic; font-display: block; }
@font-face { font-family: 'EB Garamond'; src: url('assets/fonts/EBGaramond_700.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: block; }
@font-face { font-family: 'Inter'; src: url('assets/fonts/Inter_400.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: block; }
@font-face { font-family: 'Inter'; src: url('assets/fonts/Inter_500.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: block; }
@font-face { font-family: 'Inter'; src: url('assets/fonts/Inter_700.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: block; }
@font-face { font-family: 'JetBrains Mono'; src: url('assets/fonts/JetBrainsMono_400.woff2') format('woff2'); font-weight: 400; font-style: normal; font-display: block; }
@font-face { font-family: 'JetBrains Mono'; src: url('assets/fonts/JetBrainsMono_500.woff2') format('woff2'); font-weight: 500; font-style: normal; font-display: block; }
@font-face { font-family: 'JetBrains Mono'; src: url('assets/fonts/JetBrainsMono_700.woff2') format('woff2'); font-weight: 700; font-style: normal; font-display: block; }

* { box-sizing: border-box; margin: 0; padding: 0; }
#root {
  position: relative;
  width: 1920px;
  height: 1080px;
  overflow: hidden;
  container-type: size;
  font-family: 'Inter', sans-serif;
  font-variant-numeric: lining-nums;
  color: ${C.ink};
}
.${p}-bg {
  position: absolute;
  inset: 0;
  background: ${C.cream};
}
.${p}-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 1920px;
  height: 896px;
  padding: 46px 76px 26px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.${p}-kicker {
  font-family: 'JetBrains Mono', monospace;
  font-size: 32px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${C.muted};
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-weight: 700;
}
.${p}-pill {
  font-family: 'JetBrains Mono', monospace;
  font-size: 30px;
  padding: 8px 24px;
  border-radius: 9999px;
  border: 2px solid ${C.hairStrong};
  background: ${C.tile};
  color: ${C.ink};
  font-weight: 700;
}
.${p}-pill-hard {
  background: ${C.redSoft};
  border-color: ${C.red};
  color: ${C.red};
}
.${p}-pill-green {
  background: ${C.greenSoft};
  border-color: ${C.green};
  color: ${C.green};
}
.${p}-serif {
  font-family: 'EB Garamond', serif;
  font-variant-numeric: lining-nums;
  font-weight: 500;
  letter-spacing: -0.02em;
  line-height: 1.12;
  color: ${C.ink};
}
.${p}-mono {
  font-family: 'JetBrains Mono', monospace;
}
.${p}-tile {
  background: ${C.tile};
  border: 2px solid ${C.hair};
  border-radius: 20px;
  padding: 26px 34px;
}
.${p}-card {
  background: ${C.cream};
  border: 2px solid ${C.hairStrong};
  border-radius: 20px;
  padding: 26px 34px;
  box-shadow: 0 2px 6px rgba(20,20,19,0.06), 0 8px 24px rgba(20,20,19,0.04);
}
.${p}-navy-card {
  background: ${C.navy};
  border: 2px solid rgba(250,249,245,0.16);
  border-radius: 20px;
  padding: 28px 36px;
  color: ${C.cream};
}
.${p}-split-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  align-items: stretch;
}
.${p}-triptych {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}
.${p}-arr-row {
  display: flex;
  gap: 16px;
  align-items: center;
  padding: 22px 22px;
  background: ${C.tile};
  border: 2px solid ${C.hair};
  border-radius: 20px;
  position: relative;
}
.${p}-acell {
  flex: 1;
  text-align: center;
  background: ${C.cream};
  border: 4px solid ${C.hairStrong};
  border-radius: 16px;
  padding: 16px 6px;
  font-family: 'JetBrains Mono', monospace;
}
.${p}-acell-v { font-size: 62px; font-weight: 700; display: block; line-height: 1.06; }
.${p}-acell-idx { font-size: 28px; color: ${C.muted}; display: block; margin-top: 6px; font-weight: 600; white-space: nowrap; }
.${p}-acell-win { background: ${C.coralSoft}; border-color: ${C.coral}; }
.${p}-acell-max { background: ${C.greenSoft}; border-color: ${C.green}; }
.${p}-acell-max .${p}-acell-v { color: ${C.green}; }
.${p}-acell-cur { background: ${C.blueSoft}; border-color: ${C.blue}; }
.${p}-acell-cur .${p}-acell-v { color: ${C.blue}; }
.${p}-acell-kill { background: ${C.redSoft}; border-color: ${C.red}; opacity: 0.62; }
.${p}-acell-kill .${p}-acell-v { color: ${C.red}; text-decoration: line-through; }
.${p}-acell-dim { opacity: 0.44; }

.${p}-dq-tube {
  background: ${C.cream};
  border: 4px solid ${C.hairStrong};
  border-left: 10px dashed ${C.red};
  border-right: 10px dashed ${C.blue};
  border-radius: 20px;
  padding: 20px 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.${p}-dq-chip {
  padding: 12px 24px;
  border-radius: 16px;
  border: 4px solid ${C.purple};
  background: ${C.purpleSoft};
  font-family: 'JetBrains Mono', monospace;
  font-size: 42px;
  font-weight: 700;
  color: ${C.purple};
  text-align: center;
  line-height: 1.15;
  display: inline-flex;
  align-items: center;
}
.${p}-dq-head { border-color: ${C.green}; background: ${C.greenSoft}; color: ${C.green}; }
.${p}-dq-kill { border-color: ${C.red}; background: ${C.redSoft}; color: ${C.red}; text-decoration: line-through; opacity: 0.72; }
.${p}-callout {
  background: ${C.tileStrong};
  border-left: 8px solid ${C.coral};
  border-radius: 14px;
  padding: 20px 30px;
  font-size: 38px;
  font-weight: 700;
  color: ${C.ink};
  display: flex;
  align-items: center;
  justify-content: space-between;
}
`;
}

function wrapTemplate({ id, p, duration, extraCss = "", body, script }) {
  return `<template id="tpl-${id}">
  <style>
${sharedCss(p)}
${extraCss}
  </style>
  <div id="root" lang="zh-Hant-TW" data-composition-id="${id}" data-start="0" data-duration="${duration}" data-width="1920" data-height="1080">
    <div class="clip ${p}-bg" id="${p}-bg" data-start="0" data-duration="${duration}" data-track-index="0"></div>
    <div class="clip ${p}-stage" id="${p}-stage" data-start="0" data-duration="${duration}" data-track-index="1">
${body}
    </div>
  </div>
  <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
  <script>
    (function () {
      window.__timelines = window.__timelines || {};
      var tl = gsap.timeline({ paused: true });
${script}
      tl.to({}, { duration: ${duration} }, 0);
      window.__timelines["${id}"] = tl;
    })();
  </script>
</template>
`;
}

const frames = [];

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 01 — Hook (22.83s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "01-hook.html",
  id: "01-hook",
  content: wrapTemplate({
    id: "01-hook",
    p: "f01",
    duration: 22.83,
    extraCss: `
.f01-hero-title { font-size: 98px; line-height: 1.12; }
.f01-hero-sub { font-size: 40px; color: ${C.muted}; font-weight: 600; margin-top: 14px; }
.f01-slot-row { display: flex; gap: 18px; margin-top: 16px; }
.f01-slot { flex: 1; padding: 16px 18px; border-radius: 14px; border: 3px solid ${C.hairStrong}; background: ${C.cream}; font-family: 'JetBrains Mono', monospace; text-align: center; }
.f01-badge-out { display: inline-block; margin-top: 8px; padding: 6px 14px; border-radius: 10px; background: ${C.redSoft}; color: ${C.red}; font-size: 28px; font-weight: 700; }
`,
    body: `
      <div class="f01-kicker" id="f01-kicker">
        <span>${SVG_SPIKE}LEETCODE 239 · SLIDING WINDOW MAXIMUM</span>
        <span class="f01-pill f01-pill-hard">HARD 迷思破解</span>
      </div>

      <div id="f01-hero">
        <div class="f01-serif f01-hero-title">
          比你晚畢業、實力又比你強<br>
          <span id="f01-hero-accent" style="color:${C.coral}; font-weight:700;">前面學長直接淘汰！</span>
        </div>
        <div class="f01-hero-sub" id="f01-sub">不用死背公式 —— 用「校隊選拔」一句大白話直覺秒殺這題</div>
      </div>

      <div class="f01-split-2" style="grid-template-columns: 1.15fr 1.15fr 0.85fr; gap: 24px;">
        <div class="f01-tile" id="f01-c1" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">① 校隊三年滑動制度</div>
          <div style="font-size:38px; font-weight:700; line-height:1.35;">學長滿三年畢業出框<br>永遠退場不再回來</div>
          <div class="f01-slot-row">
            <div class="f01-slot" style="border-color:${C.red}; background:${C.redSoft}; color:${C.red};">
              <div style="font-size:36px; font-weight:700;">高三 175</div>
              <div class="f01-badge-out">到點出局 pop_front</div>
            </div>
          </div>
        </div>

        <div class="f01-card" id="f01-c2" style="border-color:${C.coral}; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coral}; font-weight:700;">② 強勢新學弟登場</div>
          <div style="font-size:38px; font-weight:700; line-height:1.35;">比你晚畢業 ＋ 實力更強<br><span style="color:${C.red};">這輩子再也當不上隊長！</span></div>
          <div class="f01-slot-row">
            <div class="f01-slot" style="opacity:0.65;">
              <div style="font-size:36px; font-weight:700; text-decoration:line-through; color:${C.red};">175cm 淘汰</div>
            </div>
            <div class="f01-slot" id="f01-new-champ" style="border-color:${C.green}; background:${C.greenSoft}; color:${C.green};">
              <div style="font-size:36px; font-weight:700;">高一 190 ${SVG_CROWN(C.green, 30)}</div>
            </div>
          </div>
        </div>

        <div class="f01-navy-card" id="f01-c3" style="display:flex; flex-direction:column; justify-content:space-between; align-items:flex-start;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.amber}; font-weight:700;">核心演算法目標</div>
          <div class="f01-serif" style="font-size:112px; color:${C.cream}; line-height:0.95;">O(n)</div>
          <div style="font-size:34px; color:rgba(250,249,245,0.88); font-weight:600; line-height:1.35;">一次掃描完成<br>單調遞減雙端佇列</div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f01-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out" }, 0);
      tl.fromTo("#f01-hero", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo("#f01-sub", { opacity: 0.35, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 4.9);
      tl.fromTo(["#f01-c1", "#f01-c2", "#f01-c3"], { opacity: 0.25, y: 16 }, { opacity: 0.3, y: 0, duration: 0.5, ease: "power3.out" }, 0.3);
      tl.to("#f01-c1", { opacity: 1, duration: 0.55, ease: "power3.out" }, 7.0);
      tl.to("#f01-c2", { opacity: 1, duration: 0.55, ease: "power3.out" }, 10.2);
      tl.fromTo("#f01-new-champ", { scale: 0.92 }, { scale: 1.04, duration: 0.45, ease: "power3.out" }, 12.6);
      tl.to("#f01-new-champ", { scale: 1.0, duration: 0.35 }, 13.6);
      tl.to("#f01-hero-accent", { color: "${C.red}", duration: 0.4 }, 15.6);
      tl.to("#f01-c3", { opacity: 1, duration: 0.65, ease: "power3.out" }, 17.5);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 02 — Problem Spec (25.93s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "02-problem-spec.html",
  id: "02-problem-spec",
  content: wrapTemplate({
    id: "02-problem-spec",
    p: "f02",
    duration: 25.93,
    extraCss: `
.f02-win-bar { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
`,
    body: `
      <div class="f02-kicker" id="f02-kicker">
        <span>${SVG_SPIKE}00 PROBLEM SPEC · 題意與兩個新手必踩細節</span>
        <span class="f02-pill">n = 8 · k = 3</span>
      </div>

      <div id="f02-title">
        <div class="f02-serif" style="font-size:74px;">視窗從最左邊每次右滑一格，何時開始記答案？</div>
      </div>

      <div id="f02-arr-box">
        <div class="f02-win-bar">
          <span style="color:${C.coralDark};">目前視窗 k = 3：[ 0 .. 2 ]（滿 3 格 ${SVG_CHECK(C.green, 28)} 最大值 = 3）</span>
          <span style="color:${C.muted};">陣列 nums 共 n = 8 格</span>
        </div>
        <div class="f02-arr-row" id="f02-arr">
          <div class="f02-acell f02-acell-win" id="f02-c0"><span class="f02-acell-v">1</span><span class="f02-acell-idx">i=0 未滿</span></div>
          <div class="f02-acell f02-acell-win" id="f02-c1"><span class="f02-acell-v">3</span><span class="f02-acell-idx">i=1 未滿</span></div>
          <div class="f02-acell f02-acell-max" id="f02-c2"><span class="f02-acell-v">-1</span><span class="f02-acell-idx" style="color:${C.green}; font-weight:700;">i=2 (k-1)</span></div>
          <div class="f02-acell" id="f02-c3"><span class="f02-acell-v">-3</span><span class="f02-acell-idx">i=3</span></div>
          <div class="f02-acell" id="f02-c4"><span class="f02-acell-v">5</span><span class="f02-acell-idx">i=4</span></div>
          <div class="f02-acell" id="f02-c5"><span class="f02-acell-v">3</span><span class="f02-acell-idx">i=5</span></div>
          <div class="f02-acell" id="f02-c6"><span class="f02-acell-v">6</span><span class="f02-acell-idx">i=6</span></div>
          <div class="f02-acell" id="f02-c7"><span class="f02-acell-v">7</span><span class="f02-acell-idx">i=7</span></div>
        </div>
      </div>

      <div class="f02-split-2">
        <div class="f02-card" id="f02-rule1" style="border-color:${C.coral}; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coral}; font-weight:700;">細節 ① · 何時才開始收答案？</div>
          <div style="font-size:48px; font-weight:700; margin:10px 0; font-family:'JetBrains Mono',monospace;">i &gt;= k - 1 <span style="font-family:'Inter',sans-serif; font-size:36px; color:${C.muted};">(索引 2 起算)</span></div>
          <div style="font-size:34px; color:${C.muted}; font-weight:600;">i=0、i=1 都還沒湊滿 k 格，絕對不能記錄！</div>
        </div>
        <div class="f02-tile" id="f02-rule2" style="border-color:${C.green}; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">細節 ② · 總共產出幾個答案？</div>
          <div style="font-size:48px; font-weight:700; margin:10px 0; font-family:'JetBrains Mono',monospace;">n - k + 1 = <span id="f02-ans-cnt" style="color:${C.green};">6 個</span></div>
          <div style="font-size:34px; color:${C.muted}; font-weight:600;">例：8 - 3 + 1 = 6 ${SVG_ARROW_R(C.green, 30)} [3, 3, 5, 5, 6, 7]</div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f02-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f02-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo("#f02-arr-box", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 1.8);
      tl.fromTo(["#f02-c0", "#f02-c1", "#f02-c2", "#f02-c3", "#f02-c4", "#f02-c5", "#f02-c6", "#f02-c7"],
        { opacity: 0.2, y: 12 }, { opacity: 1, y: 0, duration: 0.38, stagger: 0.08, ease: "power3.out" }, 2.4);
      tl.fromTo(["#f02-rule1", "#f02-rule2"], { opacity: 0.25, y: 16 }, { opacity: 0.3, y: 0, duration: 0.45, ease: "power3.out" }, 1.0);
      tl.to("#f02-rule1", { opacity: 1, duration: 0.55, ease: "power3.out" }, 10.0);
      tl.to(["#f02-c0", "#f02-c1"], { backgroundColor: "${C.tile}", borderColor: "${C.faint}", duration: 0.4 }, 11.8);
      tl.to("#f02-c2", { scale: 1.06, duration: 0.4, ease: "power2.out" }, 14.7);
      tl.to("#f02-c2", { scale: 1.0, duration: 0.4, ease: "power2.out" }, 16.0);
      tl.to("#f02-rule2", { opacity: 1, duration: 0.6, ease: "power3.out" }, 17.1);
      tl.to("#f02-ans-cnt", { scale: 1.12, duration: 0.4, ease: "power2.out" }, 23.0);
      tl.to("#f02-ans-cnt", { scale: 1.0, duration: 0.4 }, 23.8);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 03 — Brute Force TLE (27.78s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "03-brute-tle.html",
  id: "03-brute-tle",
  content: wrapTemplate({
    id: "03-brute-tle",
    p: "f03",
    duration: 27.78,
    extraCss: `
.f03-scan-chip { display: inline-block; padding: 10px 18px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 36px; font-weight: 700; border: 3px solid ${C.hairStrong}; background: ${C.cream}; }
.f03-overlap { background: #FBF0D9; border-color: ${C.amber}; color: #8A530B; }
`,
    body: `
      <div class="f03-kicker" id="f03-kicker">
        <span>${SVG_SPIKE}WHY NOT BRUTE FORCE · 為什麼暴力法必爆？</span>
        <span class="f03-pill f03-pill-hard">TLE 超時警告</span>
      </div>

      <div id="f03-title">
        <div class="f03-serif" style="font-size:74px;">每滑一格就重掃 k 個數 ${SVG_ARROW_R(C.red, 54)} 五十億次運算直接超時！</div>
      </div>

      <div class="f03-split-2">
        <div class="f03-tile" id="f03-left" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.muted}; font-weight:700;">暴力法：重複比對大量相鄰數字</div>
            <div style="margin-top:20px; display:flex; flex-direction:column; gap:14px;">
              <div style="display:flex; gap:12px; align-items:center;">
                <span style="font-family:'JetBrains Mono',monospace; font-size:30px; font-weight:700; width:150px;">Win 0:</span>
                <span class="f03-scan-chip">1</span>
                <span class="f03-scan-chip f03-overlap">3</span>
                <span class="f03-scan-chip f03-overlap">-1</span>
              </div>
              <div style="display:flex; gap:12px; align-items:center;">
                <span style="font-family:'JetBrains Mono',monospace; font-size:30px; font-weight:700; width:150px;">Win 1:</span>
                <span class="f03-scan-chip f03-overlap">3</span>
                <span class="f03-scan-chip f03-overlap">-1</span>
                <span class="f03-scan-chip">-3</span>
              </div>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:baseline; border-top:2px solid ${C.hair}; padding-top:16px;">
            <span class="f03-serif" style="font-size:102px; font-weight:500;">O(n · k)</span>
            <span style="font-size:34px; color:${C.red}; font-weight:700;">3 和 -1 白白重比好幾次！</span>
          </div>
        </div>

        <div class="f03-card" id="f03-right" style="border-color:${C.red}; background:${C.redSoft}; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.red}; font-weight:700;">CONSTRAINTS · 極限測資實算</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:38px; font-weight:700; margin-top:14px; color:${C.ink};">n = 100,000 × k = 50,000</div>
          </div>
          <div class="f03-serif" id="f03-big-num" style="font-size:96px; color:${C.red}; font-weight:700; letter-spacing:-0.03em;">5,000,000,000</div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:32px; color:${C.ink}; font-weight:600;">1 秒上限 ≈ 10⁸ 次 (差 50 倍)</span>
            <span id="f03-tle-stamp" style="background:${C.red}; color:${C.cream}; font-family:'JetBrains Mono',monospace; font-size:36px; font-weight:700; padding:10px 24px; border-radius:12px; display:inline-flex; align-items:center;">${SVG_CROSS(C.cream, 28)}TLE 超時必炸</span>
          </div>
        </div>
      </div>

      <div class="f03-callout" id="f03-goal">
        <span>破局關鍵目標：框往右滑一格，<span style="color:${C.coral};">不重掃、直接秒知最大值 O(n)！</span></span>
        <span class="f03-mono" style="color:${C.coralDark}; font-size:34px;">O(nk) ${SVG_ARROW_R(C.coralDark, 30)} O(n)</span>
      </div>
`,
    script: `
      tl.fromTo("#f03-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f03-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f03-left", "#f03-right"], { opacity: 0.25, y: 16 }, { opacity: 0.3, y: 0, duration: 0.45, ease: "power3.out" }, 0.4);
      tl.to("#f03-left", { opacity: 1, duration: 0.55, ease: "power3.out" }, 1.6);
      tl.to("#f03-right", { opacity: 1, duration: 0.6, ease: "power3.out" }, 9.7);
      tl.fromTo("#f03-big-num", { scale: 0.88 }, { scale: 1.04, duration: 0.55, ease: "power3.out" }, 14.6);
      tl.to("#f03-big-num", { scale: 1.0, duration: 0.35 }, 16.0);
      tl.fromTo("#f03-tle-stamp", { scale: 1.2, opacity: 0.4 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 19.2);
      tl.fromTo("#f03-goal", { opacity: 0.25, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, 22.8);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 04 — Deque & 4 Notations (31.35s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "04-deque-notations.html",
  id: "04-deque-notations",
  content: wrapTemplate({
    id: "04-deque-notations",
    p: "f04",
    duration: 31.35,
    extraCss: `
.f04-grid-2x2 { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
.f04-sym { font-family: 'JetBrains Mono', monospace; font-size: 38px; font-weight: 700; display: flex; align-items: center; gap: 14px; margin-bottom: 8px; }
.f04-desc { font-size: 36px; font-weight: 600; color: ${C.ink}; line-height: 1.35; }
`,
    body: `
      <div class="f04-kicker" id="f04-kicker">
        <span>${SVG_SPIKE}THE TOOL · 雙端佇列 Deque 與 4 個必背符號</span>
        <span class="f04-pill">std::deque&lt;int&gt;</span>
      </div>

      <div id="f04-title">
        <div class="f04-serif" style="font-size:74px;">前後都能開門的「候補名單走廊」</div>
      </div>

      <div class="f04-dq-tube" id="f04-tube">
        <div style="text-align:left;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.red}; font-weight:700;">${SVG_ARROW_L(C.red, 28)}前門 front()</div>
          <div style="font-size:28px; color:${C.muted}; font-weight:600;">最大老大 ${SVG_CROWN(C.green, 24)} / 過期踢出</div>
        </div>
        <div style="display:flex; gap:18px; align-items:center;">
          <span class="f04-dq-chip f04-dq-head">idx 1 : 值 3 ${SVG_CROWN(C.green, 30)}</span>
          ${SVG_ARROW_R(C.muted, 34)}
          <span class="f04-dq-chip">idx 2 : 值 -1</span>
        </div>
        <div style="text-align:right;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.blue}; font-weight:700;">後門 back()${SVG_ARROW_R(C.blue, 28)}</div>
          <div style="font-size:28px; color:${C.muted}; font-weight:600;">踢弱舊人 / 新人進場</div>
        </div>
      </div>

      <div class="f04-grid-2x2">
        <div class="f04-card" id="f04-n1">
          <span class="f04-sym" style="color:${C.blue};">① i</span>
          <div class="f04-desc">剛走進視窗右邊的新人索引位置</div>
        </div>
        <div class="f04-card" id="f04-n2" style="border-color:${C.coral};">
          <span class="f04-sym" style="color:${C.coralDark};">② i - k + 1 <span id="f04-ex" style="background:${C.coralSoft}; color:${C.coralDark}; padding:4px 14px; border-radius:10px; font-size:32px;">例 4-3+1 = 2</span></span>
          <div class="f04-desc">視窗最左界底線（小於它就出框了！）</div>
        </div>
        <div class="f04-tile" id="f04-n3">
          <span class="f04-sym" style="color:${C.purple};">③ dq (deque)</span>
          <div class="f04-desc">左大 ${SVG_ARROW_R(C.purple, 28)} 右小排好隊的候補索引名單</div>
        </div>
        <div class="f04-tile" id="f04-n4" style="border-color:${C.green};">
          <span class="f04-sym" style="color:${C.green};">④ nums[dq.front()] ${SVG_CROWN(C.green, 30)}</span>
          <div class="f04-desc">O(1) 秒取：隊頭門牌對應的當前最大值</div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f04-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f04-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo("#f04-tube", { opacity: 0.3, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.65, ease: "power3.out" }, 2.0);
      tl.fromTo(["#f04-n1", "#f04-n2", "#f04-n3", "#f04-n4"], { opacity: 0.25, y: 14 }, { opacity: 0.3, y: 0, duration: 0.45, ease: "power3.out" }, 1.0);
      tl.to("#f04-n1", { opacity: 1, duration: 0.55, ease: "power3.out" }, 14.5);
      tl.to("#f04-n2", { opacity: 1, duration: 0.55, ease: "power3.out" }, 17.2);
      tl.fromTo("#f04-ex", { scale: 0.88 }, { scale: 1.06, duration: 0.45, ease: "power3.out" }, 20.0);
      tl.to("#f04-ex", { scale: 1.0, duration: 0.35 }, 21.0);
      tl.to("#f04-n3", { opacity: 1, duration: 0.55, ease: "power3.out" }, 24.5);
      tl.to("#f04-n4", { opacity: 1, duration: 0.55, ease: "power3.out" }, 26.2);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 05 — Why Store Index Not Value (35.50s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "05-why-index.html",
  id: "05-why-index",
  content: wrapTemplate({
    id: "05-why-index",
    p: "f05",
    duration: 35.50,
    extraCss: `
.f05-layer { border-radius: 16px; padding: 18px 24px; border: 2px solid ${C.hairStrong}; background: ${C.cream}; }
`,
    body: `
      <div class="f05-kicker" id="f05-kicker">
        <span>${SVG_SPIKE}LAB 1 · 為什麼要寫 nums[dq.back()]？</span>
        <span class="f05-pill">存 index，不存數值！</span>
      </div>

      <div id="f05-title">
        <div class="f05-serif" style="font-size:74px;">剝洋蔥看懂「門牌 vs 數值」，並用反例秒懂為何存索引</div>
      </div>

      <div class="f05-split-2">
        <div class="f05-tile" id="f05-left" style="display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.purple}; font-weight:700;">① 剝洋蔥兩步查值</div>
          <div class="f05-layer" id="f05-onion1" style="border-color:${C.purple};">
            <div style="font-family:'JetBrains Mono',monospace; font-size:36px; font-weight:700; color:${C.purple};">內層：dq.back() ${SVG_ARROW_R(C.purple, 28)} 2</div>
            <div style="font-size:32px; color:${C.muted}; font-weight:600;">先從隊尾取出「位置門牌」idx 2</div>
          </div>
          <div class="f05-layer" id="f05-onion2" style="border-color:${C.blue};">
            <div style="font-family:'JetBrains Mono',monospace; font-size:36px; font-weight:700; color:${C.blue};">外層：nums[2] ${SVG_ARROW_R(C.blue, 28)} -1</div>
            <div style="font-size:32px; color:${C.muted}; font-weight:600;">再拿門牌套進 nums 查出真正數字</div>
          </div>
          <div style="font-size:34px; font-weight:700; color:${C.ink};">結論：寫法雖長，其實只是「拿位置去查數」！</div>
        </div>

        <div class="f05-card" id="f05-right" style="border-color:${C.coral}; display:flex; flex-direction:column; justify-content:space-between; gap:14px;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">② 反例實驗：nums = [5, 1, 5], k = 2</div>
          <div style="display:flex; gap:16px;">
            <div class="f05-acell f05-acell-kill" style="padding:12px 8px; opacity:0.85;"><span class="f05-acell-v" style="font-size:52px;">5</span><span class="f05-acell-idx" style="font-size:28px; color:${C.red};">idx 0 出框</span></div>
            <div class="f05-acell f05-acell-win" style="padding:12px 8px;"><span class="f05-acell-v" style="font-size:52px;">1</span><span class="f05-acell-idx" style="font-size:28px;">idx 1</span></div>
            <div class="f05-acell f05-acell-max" style="padding:12px 8px;"><span class="f05-acell-v" style="font-size:52px;">5</span><span class="f05-acell-idx" style="font-size:28px; color:${C.green};">idx 2 框內</span></div>
          </div>
          <div id="f05-bad" style="background:${C.redSoft}; border:2px solid ${C.red}; border-radius:14px; padding:14px 20px;">
            <div style="font-size:33px; font-weight:700; color:${C.red}; display:flex; align-items:center;">${SVG_CROSS(C.red, 28)}若只存值 dq=[5]：分不清是 0 號還是 2 號！</div>
          </div>
          <div id="f05-good" style="background:${C.greenSoft}; border:2px solid ${C.green}; border-radius:14px; padding:14px 20px;">
            <div style="font-size:33px; font-weight:700; color:${C.green}; display:flex; align-items:center;">${SVG_CHECK(C.green, 28)}存索引 dq=[0, 2]：0 &lt; 1 一眼判出過期！</div>
          </div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f05-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f05-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f05-left", "#f05-right"], { opacity: 0.25, y: 14 }, { opacity: 0.3, y: 0, duration: 0.45, ease: "power3.out" }, 0.4);
      tl.to("#f05-left", { opacity: 1, duration: 0.55, ease: "power3.out" }, 2.6);
      tl.fromTo("#f05-onion1", { opacity: 0.35 }, { opacity: 1, duration: 0.5, ease: "power3.out" }, 8.2);
      tl.fromTo("#f05-onion2", { opacity: 0.35 }, { opacity: 1, duration: 0.5, ease: "power3.out" }, 10.9);
      tl.to("#f05-right", { opacity: 1, duration: 0.6, ease: "power3.out" }, 17.6);
      tl.fromTo("#f05-bad", { opacity: 0.25 }, { opacity: 1, duration: 0.5, ease: "power3.out" }, 22.3);
      tl.fromTo("#f05-good", { opacity: 0.25 }, { opacity: 1, duration: 0.55, ease: "power3.out" }, 29.8);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 06 — Scenario A: Kick Rule (32.60s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "06-kick-rule.html",
  id: "06-kick-rule",
  content: wrapTemplate({
    id: "06-kick-rule",
    p: "f06",
    duration: 32.60,
    extraCss: `
.f06-bars { display: flex; align-items: flex-end; justify-content: center; gap: 50px; height: 350px; padding-top: 20px; }
.f06-bwrap { display: flex; flex-direction: column; align-items: center; }
.f06-bar { width: 170px; border-radius: 18px 18px 8px 8px; border: 4px solid; display: flex; align-items: flex-start; justify-content: center; padding-top: 16px; font-family: 'JetBrains Mono', monospace; font-size: 54px; font-weight: 700; }
.f06-blbl { font-family: 'JetBrains Mono', monospace; font-size: 32px; font-weight: 700; margin-top: 12px; text-align: center; }
`,
    body: `
      <div class="f06-kicker" id="f06-kicker">
        <span>${SVG_SPIKE}LAB 2A · 核心淘汰規則 A：什麼時候「必踢」？</span>
        <span class="f06-pill">新人 &gt;= 隊尾 ${SVG_ARROW_R(C.ink, 26)} pop_back</span>
      </div>

      <div id="f06-title">
        <div class="f06-serif" style="font-size:72px;">新來的「數值更大 ＋ 更晚出框」${SVG_ARROW_R(C.coral, 50)} 舊的通通從後門踢光！</div>
      </div>

      <div class="f06-split-2" style="grid-template-columns: 1.35fr 0.9fr;">
        <div class="f06-tile" id="f06-stage-card" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div class="f06-bars">
            <div class="f06-bwrap" id="f06-b3">
              <div class="f06-bar" id="f06-bar3" style="height:210px; background:${C.cream}; border-color:${C.ink}; color:${C.ink};">3</div>
              <div class="f06-blbl" style="color:${C.muted};">原隊長 · <span style="color:${C.red};">比 5 弱且早死</span></div>
            </div>
            <div class="f06-bwrap" id="f06-bneg1">
              <div class="f06-bar" id="f06-barneg1" style="height:120px; background:${C.cream}; border-color:${C.ink}; color:${C.ink};">-1</div>
              <div class="f06-blbl" style="color:${C.muted};">原隊尾 · <span style="color:${C.red};">先踢出！</span></div>
            </div>
            <div id="f06-arrow" style="font-family:'JetBrains Mono',monospace; font-size:40px; color:${C.coral}; font-weight:700; align-self:center; display:flex; align-items:center;">${SVG_ARROW_L(C.coral, 36)}踢光</div>
            <div class="f06-bwrap" id="f06-b5">
              <div class="f06-bar" style="height:290px; background:${C.greenSoft}; border-color:${C.green}; color:${C.green};">5 ${SVG_CROWN(C.green, 38)}</div>
              <div class="f06-blbl" style="color:${C.green};">新人：最強＋最長壽</div>
            </div>
          </div>
        </div>

        <div class="f06-navy-card" id="f06-why" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.amber}; font-weight:700;">雙重碾壓定理</div>
          <div id="f06-r1" style="font-size:36px; line-height:1.45; border-bottom:1px solid rgba(250,249,245,0.16); padding-bottom:16px;">
            <b style="color:${C.coral};">1. 實力輸：</b>-1, 3 都打不過 5
          </div>
          <div id="f06-r2" style="font-size:36px; line-height:1.45; border-bottom:1px solid rgba(250,249,245,0.16); padding-bottom:16px;">
            <b style="color:${C.teal};">2. 壽命輸：</b>5 較晚進框，更晚過期
          </div>
          <div id="f06-eq" style="background:rgba(204,120,92,0.18); border:2px solid ${C.coral}; border-radius:14px; padding:16px 20px;">
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:700; color:${C.amber};">邊界細節：相等 (&lt;=) 也踢！</div>
            <div style="font-size:30px; color:rgba(250,249,245,0.9); margin-top:4px;">留較晚過期的新位置就好</div>
          </div>
        </div>
      </div>

      <div class="f06-callout" id="f06-bot">
        <span>只要 5 還在視窗裡一天，前面的 -1 和 3 永遠不可能當最大值 ${SVG_ARROW_R(C.coral, 32)} 直接踢光！</span>
      </div>
`,
    script: `
      tl.fromTo("#f06-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f06-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo("#f06-stage-card", { opacity: 0.3, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }, 0.4);
      tl.fromTo(["#f06-b3", "#f06-bneg1"], { opacity: 0.25, y: 20 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.2, ease: "power3.out" }, 5.2);
      tl.fromTo("#f06-b5", { opacity: 0.2, y: 26, scale: 0.94 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }, 7.5);
      tl.fromTo("#f06-why", { opacity: 0.28, x: 16 }, { opacity: 1, x: 0, duration: 0.55, ease: "power3.out" }, 9.9);
      tl.fromTo("#f06-r1", { opacity: 0.3 }, { opacity: 1, duration: 0.45 }, 11.1);
      tl.fromTo("#f06-r2", { opacity: 0.3 }, { opacity: 1, duration: 0.45 }, 12.7);
      tl.fromTo("#f06-bot", { opacity: 0.25, y: 12 }, { opacity: 1, y: 0, duration: 0.5 }, 16.8);
      tl.fromTo("#f06-arrow", { opacity: 0.3, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45 }, 19.5);
      tl.to(["#f06-barneg1", "#f06-bar3"], { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", color: "${C.red}", opacity: 0.45, duration: 0.5, stagger: 0.45 }, 21.4);
      tl.fromTo("#f06-eq", { opacity: 0.3 }, { opacity: 1, duration: 0.55 }, 25.0);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 07 — Scenario B: Keep Successor (32.82s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "07-keep-rule.html",
  id: "07-keep-rule",
  content: wrapTemplate({
    id: "07-keep-rule",
    p: "f07",
    duration: 32.82,
    extraCss: `
.f07-bar { width: 175px; border-radius: 18px 18px 8px 8px; border: 4px solid; display: flex; align-items: flex-start; justify-content: center; padding-top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 50px; font-weight: 700; }
`,
    body: `
      <div class="f07-kicker" id="f07-kicker">
        <span>${SVG_SPIKE}LAB 2B · 核心保留規則 B：為什麼較小的新人不能丟？</span>
        <span class="f07-pill">新人 &lt; 隊尾 ${SVG_ARROW_R(C.ink, 26)} 留作接班人</span>
      </div>

      <div id="f07-title">
        <div class="f07-serif" style="font-size:72px;">雖然現在打不過老大，但它「活得比較久」${SVG_ARROW_R(C.green, 50)} 未來接班！</div>
      </div>

      <div class="f07-split-2">
        <div class="f07-tile" id="f07-left" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-size:38px; font-weight:700; color:${C.ink};">階段 ①：現在 (3 還在框裡)</div>
          <div style="display:flex; align-items:flex-end; justify-content:center; gap:52px; height:250px;">
            <div class="f07-bar" style="height:225px; background:${C.greenSoft}; border-color:${C.green}; color:${C.green};">3 ${SVG_CROWN(C.green, 34)}</div>
            <div class="f07-bar" id="f07-sub-wait" style="height:125px; background:${C.blueSoft}; border-color:${C.blue}; color:${C.blue};">-1</div>
          </div>
          <div style="font-size:34px; text-align:center; font-weight:600; color:${C.ink};">
            千萬別踢 <span style="color:${C.blue}; font-weight:700;">-1</span>！它比較晚進框，壽命更長
          </div>
        </div>

        <div class="f07-card" id="f07-right" style="border-color:${C.green}; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-size:38px; font-weight:700; color:${C.green};">階段 ②：視窗右滑，老隊長出框！</div>
          <div style="display:flex; align-items:flex-end; justify-content:center; gap:52px; height:250px;">
            <div class="f07-bar" id="f07-old-retire" style="height:225px; background:${C.redSoft}; border-color:${C.red}; border-style:dashed; color:${C.red}; opacity:0.5; font-size:36px;">3 出框</div>
            <div class="f07-bar" id="f07-new-king" style="height:125px; background:${C.greenSoft}; border-color:${C.green}; color:${C.green};">-1 ${SVG_CROWN(C.green, 34)}</div>
          </div>
          <div style="font-size:34px; text-align:center; font-weight:700; color:${C.green};">
            3 從前門退休 ${SVG_ARROW_R(C.green, 30)} -1 順理成章接班變老大！
          </div>
        </div>
      </div>

      <div class="f07-callout" id="f07-bot">
        <span>因此候補名單會自然維持 <span style="color:${C.coral};">「左大 ${SVG_ARROW_R(C.coral, 30)} 右小」單調遞減順序！</span></span>
        <span class="f07-mono" style="color:${C.muted}; font-size:32px;">Monotonic Decreasing</span>
      </div>
`,
    script: `
      tl.fromTo("#f07-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f07-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f07-left", "#f07-right"], { opacity: 0.25, y: 16 }, { opacity: 0.3, y: 0, duration: 0.45 }, 0.5);
      tl.to("#f07-left", { opacity: 1, duration: 0.6, ease: "power3.out" }, 4.0);
      tl.to("#f07-sub-wait", { scale: 1.08, duration: 0.45, ease: "power2.out" }, 8.8);
      tl.to("#f07-sub-wait", { scale: 1.0, duration: 0.35 }, 9.8);
      tl.to("#f07-right", { opacity: 1, duration: 0.65, ease: "power3.out" }, 15.7);
      tl.fromTo("#f07-old-retire", { x: 0, opacity: 0.9 }, { x: -16, opacity: 0.42, duration: 0.6, ease: "power3.out" }, 19.9);
      tl.fromTo("#f07-new-king", { scale: 0.9 }, { scale: 1.08, duration: 0.5, ease: "power3.out" }, 23.1);
      tl.to("#f07-new-king", { scale: 1.0, duration: 0.35 }, 24.5);
      tl.fromTo("#f07-bot", { opacity: 0.25, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 27.5);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 08 — 3-Step Mantra (26.70s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "08-three-steps.html",
  id: "08-three-steps",
  content: wrapTemplate({
    id: "08-three-steps",
    p: "f08",
    duration: 26.70,
    extraCss: `
.f08-step-card { background: ${C.cream}; border: 2px solid ${C.hairStrong}; border-radius: 20px; padding: 30px 32px; display: flex; flex-direction: column; justify-content: space-between; box-shadow: 0 2px 6px rgba(20,20,19,0.06); }
.f08-code-chip { font-family: 'JetBrains Mono', monospace; font-size: 32px; padding: 14px 18px; border-radius: 12px; font-weight: 700; display: block; text-align: center; }
`,
    body: `
      <div class="f08-kicker" id="f08-kicker">
        <span>${SVG_SPIKE}THE 3-STEP MANTRA · 把兩條規則濃縮成黃金三口訣</span>
        <span class="f08-pill">每一輪迴圈固定做這三件事</span>
      </div>

      <div id="f08-title">
        <div class="f08-serif" style="font-size:74px;">頭出框就踢 · 尾比我小就踢 · 隊頭就是答案</div>
      </div>

      <div class="f08-triptych" style="min-height: 430px;">
        <div class="f08-step-card" id="f08-s1" style="border-top: 12px solid ${C.red};">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.red}; font-weight:700;">STEP 1 · 前門檢查</div>
            <div style="font-size:50px; font-weight:700; margin-top:12px; color:${C.ink};">頭出框就踢</div>
            <div style="font-size:34px; color:${C.muted}; margin-top:14px; line-height:1.45; font-weight:500;">看隊頭索引是否已經小於左界 <span class="f08-mono">i - k + 1</span>，是就請出前門</div>
          </div>
          <code class="f08-code-chip" style="background:${C.redSoft}; color:${C.red};">dq.pop_front()</code>
        </div>

        <div class="f08-step-card" id="f08-s2" style="border-top: 12px solid ${C.coral};">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coral}; font-weight:700;">STEP 2 · 後門清場</div>
            <div style="font-size:50px; font-weight:700; margin-top:12px; color:${C.ink};">尾比我小就踢</div>
            <div style="font-size:34px; color:${C.muted}; margin-top:14px; line-height:1.45; font-weight:500;">隊尾所有小於等於新人的舊人全踢掉，再把新人進駐隊尾</div>
          </div>
          <code class="f08-code-chip" style="background:${C.coralSoft}; color:${C.coralDark};">pop_back() + push(i)</code>
        </div>

        <div class="f08-step-card" id="f08-s3" style="border-top: 12px solid ${C.green};">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">STEP 3 · 湊滿收割</div>
            <div style="font-size:50px; font-weight:700; margin-top:12px; color:${C.ink};">隊頭就是答案</div>
            <div style="font-size:34px; color:${C.muted}; margin-top:14px; line-height:1.45; font-weight:500;">只要 <span class="f08-mono">i &gt;= k - 1</span> 視窗滿格，直接把隊頭數值存入答案</div>
          </div>
          <code class="f08-code-chip" style="background:${C.greenSoft}; color:${C.green};">nums[dq.front()]</code>
        </div>
      </div>

      <div class="f08-callout" id="f08-bot">
        <span>三步口訣背起來！接下來馬上帶入 LeetCode 官方範例慢動作實戰一遍 ${SVG_ARROW_R(C.coral, 32)}</span>
      </div>
`,
    script: `
      tl.fromTo("#f08-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f08-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f08-s1", "#f08-s2", "#f08-s3"], { opacity: 0.25, y: 16 }, { opacity: 0.3, y: 0, duration: 0.45 }, 0.4);
      tl.to("#f08-s1", { opacity: 1, duration: 0.6, ease: "power3.out" }, 5.1);
      tl.to("#f08-s2", { opacity: 1, duration: 0.6, ease: "power3.out" }, 11.8);
      tl.to("#f08-s3", { opacity: 1, duration: 0.6, ease: "power3.out" }, 18.5);
      tl.fromTo("#f08-bot", { opacity: 0.25, y: 12 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 23.6);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 09 — Walkthrough 1/3: i = 0, 1, 2 (34.21s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "09-walkthrough-1.html",
  id: "09-walkthrough-1",
  content: wrapTemplate({
    id: "09-walkthrough-1",
    p: "f09",
    duration: 34.21,
    extraCss: `
.f09-stepbox { background: ${C.cream}; border: 3px solid ${C.hairStrong}; border-radius: 18px; padding: 20px 24px; display: flex; flex-direction: column; justify-content: space-between; }
`,
    body: `
      <div class="f09-kicker" id="f09-kicker">
        <span>${SVG_SPIKE}官方範例實戰 (1/3) · nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3</span>
        <span class="f09-pill" id="f09-state-pill">Step: i = 0 ${SVG_ARROW_R(C.ink, 24)} 2</span>
      </div>

      <div id="f09-arr-wrap">
        <div class="f09-arr-row">
          <div class="f09-acell" id="f09-c0"><span class="f09-acell-v">1</span><span class="f09-acell-idx">i=0</span></div>
          <div class="f09-acell" id="f09-c1"><span class="f09-acell-v">3</span><span class="f09-acell-idx">i=1</span></div>
          <div class="f09-acell" id="f09-c2"><span class="f09-acell-v">-1</span><span class="f09-acell-idx">i=2</span></div>
          <div class="f09-acell f09-acell-dim" id="f09-c3"><span class="f09-acell-v">-3</span><span class="f09-acell-idx">3</span></div>
          <div class="f09-acell f09-acell-dim" id="f09-c4"><span class="f09-acell-v">5</span><span class="f09-acell-idx">4</span></div>
          <div class="f09-acell f09-acell-dim" id="f09-c5"><span class="f09-acell-v">3</span><span class="f09-acell-idx">5</span></div>
          <div class="f09-acell f09-acell-dim" id="f09-c6"><span class="f09-acell-v">6</span><span class="f09-acell-idx">6</span></div>
          <div class="f09-acell f09-acell-dim" id="f09-c7"><span class="f09-acell-v">7</span><span class="f09-acell-idx">7</span></div>
        </div>
      </div>

      <div class="f09-triptych" style="min-height: 295px;">
        <div class="f09-stepbox" id="f09-st0" style="border-top:10px solid ${C.blue};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:700; color:${C.blue};">i = 0 · val = 1</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">1 直接進隊尾<br>dq = [ <span style="color:${C.purple};">0:1 ${SVG_CROWN(C.purple, 26)}</span> ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.muted}; font-weight:700;">視窗 1/3 未滿 · 不記</div>
        </div>

        <div class="f09-stepbox" id="f09-st1" style="border-top:10px solid ${C.coral};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:700; color:${C.coralDark};">i = 1 · val = 3</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">3 &gt;= 1 <span style="color:${C.red};">踢掉 0:1 !</span><br>dq = [ <span style="color:${C.green};">1:3 ${SVG_CROWN(C.green, 26)}</span> ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.muted}; font-weight:700;">視窗 2/3 未滿 · 不記</div>
        </div>

        <div class="f09-stepbox" id="f09-st2" style="border-top:10px solid ${C.green};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; font-weight:700; color:${C.green};">i = 2 · val = -1</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">-1 &lt; 3 留當接班人!<br>dq = [ <span style="color:${C.green};">1:3 ${SVG_CROWN(C.green, 26)}</span>, <span style="color:${C.purple};">2:-1</span> ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.green}; font-weight:700; display:flex; align-items:center;">${SVG_CHECK(C.green, 26)}滿 3 格 ${SVG_ARROW_R(C.green, 24)} 記 3！</div>
        </div>
      </div>

      <div class="f09-split-2" style="grid-template-columns: 1.3fr 0.9fr;">
        <div class="f09-dq-tube" id="f09-dq-live">
          <span style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.muted}; font-weight:700;">即時 dq:</span>
          <div style="display:flex; gap:14px; align-items:center;">
            <span class="f09-dq-chip f09-dq-kill" id="f09-chip0">0:1 踢</span>
            <span class="f09-dq-chip f09-dq-head" id="f09-chip1">1:3 ${SVG_CROWN(C.green, 28)}</span>
            <span class="f09-dq-chip" id="f09-chip2">2:-1</span>
          </div>
        </div>
        <div class="f09-card" id="f09-res-box" style="border-color:${C.green}; display:flex; align-items:center; justify-content:space-between;">
          <span style="font-size:34px; font-weight:700; color:${C.green};">目前答案 res =</span>
          <span style="font-family:'JetBrains Mono',monospace; font-size:48px; font-weight:700;">[ <span id="f09-res3" style="background:${C.greenSoft}; color:${C.green}; padding:6px 22px; border-radius:12px;">3</span> ]</span>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f09-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f09-arr-wrap", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f09-st0", "#f09-st1", "#f09-st2", "#f09-dq-live", "#f09-res-box"], { opacity: 0.25 }, { opacity: 0.28, duration: 0.4 }, 0.4);

      tl.to("#f09-c0", { backgroundColor: "${C.blueSoft}", borderColor: "${C.blue}", duration: 0.3 }, 1.6);
      tl.to("#f09-c1", { backgroundColor: "${C.blueSoft}", borderColor: "${C.blue}", duration: 0.3 }, 2.1);
      tl.to(["#f09-c0", "#f09-c1"], { backgroundColor: "${C.cream}", borderColor: "${C.hairStrong}", duration: 0.3 }, 3.0);

      // Step i = 0 (11.59s)
      tl.to("#f09-c0", { backgroundColor: "${C.coralSoft}", borderColor: "${C.coral}", duration: 0.35 }, 11.5);
      tl.to("#f09-st0", { opacity: 1, duration: 0.5 }, 11.6);
      tl.to("#f09-dq-live", { opacity: 1, duration: 0.45 }, 12.6);
      tl.fromTo("#f09-chip0", { opacity: 0.2, scale: 0.88, backgroundColor: "${C.greenSoft}", borderColor: "${C.green}", color: "${C.green}" }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 12.9);

      // Step i = 1 (17.51s)
      tl.to("#f09-c1", { backgroundColor: "${C.greenSoft}", borderColor: "${C.green}", duration: 0.35 }, 17.5);
      tl.to("#f09-st1", { opacity: 1, duration: 0.5 }, 17.6);
      tl.to("#f09-chip0", { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", color: "${C.red}", opacity: 0.52, scale: 0.9, duration: 0.45 }, 20.1);
      tl.fromTo("#f09-chip1", { opacity: 0.2, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 21.3);

      // Step i = 2 (24.68s)
      tl.to("#f09-c2", { backgroundColor: "${C.blueSoft}", borderColor: "${C.blue}", duration: 0.35 }, 24.6);
      tl.to("#f09-st2", { opacity: 1, duration: 0.5 }, 24.7);
      tl.fromTo("#f09-chip2", { opacity: 0.2, scale: 0.88 }, { opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 26.9);
      tl.to("#f09-res-box", { opacity: 1, duration: 0.45 }, 30.2);
      tl.fromTo("#f09-res3", { scale: 0.78, opacity: 0.3 }, { scale: 1.12, opacity: 1, duration: 0.4, ease: "power3.out" }, 31.1);
      tl.to("#f09-res3", { scale: 1.0, duration: 0.3 }, 32.0);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 10 — Walkthrough 2/3: i = 3 & i = 4 CLIMAX (33.75s)
// Shows pre-existing deque [1:3, 2:-1, 3:-3] before i=4 kicks them!
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "10-walkthrough-2.html",
  id: "10-walkthrough-2",
  content: wrapTemplate({
    id: "10-walkthrough-2",
    p: "f10",
    duration: 33.75,
    extraCss: `
.f10-phase { background: ${C.cream}; border: 3px solid ${C.hairStrong}; border-radius: 18px; padding: 20px 26px; display: flex; flex-direction: column; justify-content: space-between; }
`,
    body: `
      <div class="f10-kicker" id="f10-kicker">
        <span>${SVG_SPIKE}官方範例實戰 (2/3) · 全場高潮 i = 3 ${SVG_ARROW_R(C.ink, 24)} i = 4</span>
        <span class="f10-pill f10-pill-hard" id="f10-l-badge">左界 L = 4 - 3 + 1 = 2</span>
      </div>

      <div id="f10-arr-wrap">
        <div class="f10-arr-row">
          <div class="f10-acell f10-acell-dim"><span class="f10-acell-v">1</span><span class="f10-acell-idx">0</span></div>
          <div class="f10-acell f10-acell-win" id="f10-c1"><span class="f10-acell-v">3</span><span class="f10-acell-idx">1 ${SVG_CROWN(C.coral, 22)}</span></div>
          <div class="f10-acell f10-acell-win" id="f10-c2"><span class="f10-acell-v">-1</span><span class="f10-acell-idx">2</span></div>
          <div class="f10-acell f10-acell-win" id="f10-c3"><span class="f10-acell-v">-3</span><span class="f10-acell-idx">3</span></div>
          <div class="f10-acell f10-acell-dim" id="f10-c4"><span class="f10-acell-v">5</span><span class="f10-acell-idx">4</span></div>
          <div class="f10-acell f10-acell-dim"><span class="f10-acell-v">3</span><span class="f10-acell-idx">5</span></div>
          <div class="f10-acell f10-acell-dim"><span class="f10-acell-v">6</span><span class="f10-acell-idx">6</span></div>
          <div class="f10-acell f10-acell-dim"><span class="f10-acell-v">7</span><span class="f10-acell-idx">7</span></div>
        </div>
      </div>

      <div class="f10-split-2" style="grid-template-columns: 0.92fr 1.38fr; gap: 26px;">
        <div class="f10-phase" id="f10-card3" style="border-color:${C.blue};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.blue}; font-weight:700;">i = 3 · val = -3 (L = 1)</div>
          <div style="font-size:33px; font-weight:700; line-height:1.45;">
            ① 隊頭 <span class="f10-mono">1 &gt;= 1</span> 還沒出框<br>
            ② <span class="f10-mono">-3 &lt; -1</span> 留著排隊尾<br>
            dq = [ 1:3 ${SVG_CROWN(C.green, 24)}, 2:-1, 3:-3 ]
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:34px; font-weight:700; color:${C.green};">${SVG_ARROW_R(C.green, 28)}res = [ 3, <span id="f10-res-3b" style="background:${C.greenSoft}; padding:4px 14px; border-radius:10px;">3</span> ]</div>
        </div>

        <div class="f10-phase" id="f10-card4" style="border-color:${C.coral}; background:#FDF7F3;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">高潮 i = 4 · val = 5 (左界推進到 L = 2！)</div>
          <div style="display:flex; flex-direction:column; gap:10px;">
            <div id="f10-act1" style="background:${C.redSoft}; border:2px solid ${C.red}; border-radius:12px; padding:10px 18px; font-size:32px; font-weight:700; color:${C.red};">
              STEP 1 前門除老：隊頭 1 &lt; 2 ${SVG_ARROW_R(C.red, 26)} 1:3 退休 pop_front!
            </div>
            <div id="f10-act2" style="background:${C.coralSoft}; border:2px solid ${C.coral}; border-radius:12px; padding:10px 18px; font-size:32px; font-weight:700; color:${C.coralDark};">
              STEP 2 後門全清：5 &gt;= -3 且 -1 ${SVG_ARROW_R(C.coralDark, 26)} 連踢兩人 pop_back!
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-family:'JetBrains Mono',monospace; font-size:34px; font-weight:700; color:${C.green};">dq = [ 4:5 ${SVG_CROWN(C.green, 24)} ]</span>
            <span style="font-family:'JetBrains Mono',monospace; font-size:34px; font-weight:700;">res = [ 3, 3, <span id="f10-res-5" style="background:${C.greenSoft}; color:${C.green}; padding:4px 14px; border-radius:10px;">5</span> ]</span>
          </div>
        </div>
      </div>

      <div class="f10-dq-tube" id="f10-tube">
        <span class="f10-dq-chip f10-dq-head" id="f10-chip-13" style="font-size:38px; padding:10px 20px;">1:3 隊長</span>
        <span class="f10-dq-chip f10-dq-head" id="f10-chip-45" style="font-size:40px; padding:10px 24px;">4:5 ${SVG_CROWN(C.green, 28)}</span>
        <div style="display:flex; gap:12px;">
          <span class="f10-dq-chip" id="f10-chip-2m1" style="font-size:38px; padding:10px 20px;">2:-1</span>
          <span class="f10-dq-chip" id="f10-chip-3m3" style="font-size:38px; padding:10px 20px;">3:-3</span>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f10-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f10-arr-wrap", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f10-card3", "#f10-card4", "#f10-tube"], { opacity: 0.25 }, { opacity: 0.35, duration: 0.4 }, 0.3);
      // pre-existing deque members visible inside tube!
      tl.to("#f10-tube", { opacity: 1, duration: 0.45 }, 1.2);
      tl.fromTo("#f10-chip-45", { opacity: 0.15, scale: 0.9 }, { opacity: 0.15, scale: 0.9, duration: 0.2 }, 0);

      // i = 3 (3.25s)
      tl.to("#f10-card3", { opacity: 1, duration: 0.55 }, 3.2);
      tl.to("#f10-c3", { backgroundColor: "${C.blueSoft}", borderColor: "${C.blue}", duration: 0.4 }, 4.2);
      tl.fromTo("#f10-chip-3m3", { opacity: 0.25, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.45 }, 9.2);
      tl.to("#f10-res-3b", { scale: 1.12, duration: 0.35 }, 12.9);
      tl.to("#f10-res-3b", { scale: 1.0, duration: 0.3 }, 13.5);

      // i = 4 climax (16.04s)
      tl.to("#f10-card4", { opacity: 1, duration: 0.55 }, 16.0);
      tl.to("#f10-c1", { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", opacity: 0.55, duration: 0.45 }, 16.5);
      tl.to("#f10-c4", { backgroundColor: "${C.greenSoft}", borderColor: "${C.green}", opacity: 1, duration: 0.45 }, 17.4);
      tl.to("#f10-l-badge", { scale: 1.08, duration: 0.35 }, 19.3);
      tl.to("#f10-l-badge", { scale: 1.0, duration: 0.3 }, 20.1);

      // STEP 1: pop_front 1:3 (20.68s)
      tl.fromTo("#f10-act1", { opacity: 0.35 }, { opacity: 1, duration: 0.45 }, 20.6);
      tl.to("#f10-chip-13", { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", color: "${C.red}", x: -24, opacity: 0.45, duration: 0.55 }, 21.6);

      // STEP 2: pop_back 3:-3 & 2:-1 (25.90s)
      tl.fromTo("#f10-act2", { opacity: 0.35 }, { opacity: 1, duration: 0.45 }, 25.9);
      tl.to(["#f10-chip-3m3", "#f10-chip-2m1"], { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", color: "${C.red}", x: 24, opacity: 0.45, duration: 0.45, stagger: 0.35 }, 26.8);

      // 4:5 takes crown + res=[3,3,5] (30.11s)
      tl.to("#f10-chip-45", { opacity: 1, scale: 1.04, duration: 0.5 }, 30.1);
      tl.to("#f10-chip-45", { scale: 1.0, duration: 0.3 }, 31.0);
      tl.to("#f10-res-5", { scale: 1.15, duration: 0.35 }, 31.6);
      tl.to("#f10-res-5", { scale: 1.0, duration: 0.3 }, 32.3);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 11 — Walkthrough 3/3: i = 5, 6, 7 + Final Output (30.46s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "11-walkthrough-3.html",
  id: "11-walkthrough-3",
  content: wrapTemplate({
    id: "11-walkthrough-3",
    p: "f11",
    duration: 30.46,
    extraCss: `
.f11-stepbox { background: ${C.cream}; border: 3px solid ${C.hairStrong}; border-radius: 18px; padding: 20px 24px; display: flex; flex-direction: column; justify-content: space-between; }
.f11-ans-pill { display: inline-block; padding: 8px 22px; border-radius: 12px; font-family: 'JetBrains Mono', monospace; font-size: 46px; font-weight: 700; background: ${C.greenSoft}; color: ${C.green}; border: 2px solid ${C.green}; }
`,
    body: `
      <div class="f11-kicker" id="f11-kicker">
        <span>${SVG_SPIKE}官方範例實戰 (3/3) · i = 5 ${SVG_ARROW_R(C.ink, 24)} 7 一氣呵成收官！</span>
        <span class="f11-pill f11-pill-green">陣列只從左到右掃 1 遍</span>
      </div>

      <div id="f11-arr-wrap">
        <div class="f11-arr-row">
          <div class="f11-acell f11-acell-dim"><span class="f11-acell-v">1</span><span class="f11-acell-idx">0</span></div>
          <div class="f11-acell f11-acell-dim"><span class="f11-acell-v">3</span><span class="f11-acell-idx">1</span></div>
          <div class="f11-acell f11-acell-dim"><span class="f11-acell-v">-1</span><span class="f11-acell-idx">2</span></div>
          <div class="f11-acell f11-acell-dim"><span class="f11-acell-v">-3</span><span class="f11-acell-idx">3</span></div>
          <div class="f11-acell f11-acell-dim" id="f11-c4"><span class="f11-acell-v">5</span><span class="f11-acell-idx">4</span></div>
          <div class="f11-acell f11-acell-win" id="f11-c5"><span class="f11-acell-v">3</span><span class="f11-acell-idx">5</span></div>
          <div class="f11-acell" id="f11-c6"><span class="f11-acell-v">6</span><span class="f11-acell-idx">6</span></div>
          <div class="f11-acell" id="f11-c7"><span class="f11-acell-v">7</span><span class="f11-acell-idx">7 ${SVG_CROWN(C.green, 22)}</span></div>
        </div>
      </div>

      <div class="f11-triptych" style="min-height: 280px;">
        <div class="f11-stepbox" id="f11-st5" style="border-top:10px solid ${C.blue};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.blue}; font-weight:700;">i = 5 · val = 3</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">3 &lt; 5 留當接班人<br>dq = [ <span style="color:${C.green};">4:5 ${SVG_CROWN(C.green, 24)}</span>, 5:3 ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">${SVG_ARROW_R(C.green, 26)}隊頭還是 5！記 5</div>
        </div>

        <div class="f11-stepbox" id="f11-st6" style="border-top:10px solid ${C.coral};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">i = 6 · val = 6</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">6 把前面 <span style="color:${C.red};">3 與 5 踢光</span><br>dq = [ <span style="color:${C.green};">6:6 ${SVG_CROWN(C.green, 24)}</span> ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">${SVG_ARROW_R(C.green, 26)}記下第 5 個答案 6</div>
        </div>

        <div class="f11-stepbox" id="f11-st7" style="border-top:10px solid ${C.green};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">i = 7 · val = 7</div>
          <div style="font-size:34px; font-weight:700; line-height:1.4;">7 踢掉 <span style="color:${C.red};">6:6</span> 登基<br>dq = [ <span style="color:${C.green};">7:7 ${SVG_CROWN(C.green, 24)}</span> ]</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">${SVG_ARROW_R(C.green, 26)}記下最後一個 7！</div>
        </div>
      </div>

      <div class="f11-card" id="f11-final" style="border-color:${C.green}; display:flex; align-items:center; justify-content:space-between; padding:22px 34px;">
        <span style="font-size:36px; font-weight:700; color:${C.ink}; display:flex; align-items:center;">${SVG_CHECK(C.green, 32)}完整 6 個答案一次收齊：res = [</span>
        <div style="display:flex; gap:16px; align-items:center;">
          <span class="f11-ans-pill" id="f11-a0">3</span>
          <span class="f11-ans-pill" id="f11-a1">3</span>
          <span class="f11-ans-pill" id="f11-a2">5</span>
          <span class="f11-ans-pill" id="f11-a3">5</span>
          <span class="f11-ans-pill" id="f11-a4">6</span>
          <span class="f11-ans-pill" id="f11-a5">7</span>
        </div>
        <span style="font-size:36px; font-weight:700; color:${C.ink};">]</span>
      </div>
`,
    script: `
      tl.fromTo("#f11-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f11-arr-wrap", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f11-st5", "#f11-st6", "#f11-st7", "#f11-final"], { opacity: 0.25 }, { opacity: 0.3, duration: 0.4 }, 0.4);
      tl.fromTo(["#f11-a3", "#f11-a4", "#f11-a5"], { opacity: 0.2 }, { opacity: 0.2, duration: 0.2 }, 0);

      // i = 5 (3.16s)
      tl.to("#f11-c5", { backgroundColor: "${C.blueSoft}", borderColor: "${C.blue}", duration: 0.35 }, 3.1);
      tl.to("#f11-st5", { opacity: 1, duration: 0.5 }, 3.2);
      tl.to("#f11-final", { opacity: 1, duration: 0.45 }, 7.0);
      tl.to("#f11-a3", { opacity: 1, scale: 1.08, duration: 0.35 }, 7.5);
      tl.to("#f11-a3", { scale: 1.0, duration: 0.3 }, 8.1);
      // i = 6 (8.80s)
      tl.to("#f11-c6", { backgroundColor: "${C.coralSoft}", borderColor: "${C.coral}", duration: 0.35 }, 8.8);
      tl.to("#f11-st6", { opacity: 1, duration: 0.5 }, 8.9);
      tl.to("#f11-a4", { opacity: 1, scale: 1.08, duration: 0.35 }, 13.9);
      tl.to("#f11-a4", { scale: 1.0, duration: 0.3 }, 14.5);
      // i = 7 (15.34s)
      tl.to("#f11-c7", { backgroundColor: "${C.greenSoft}", borderColor: "${C.green}", duration: 0.35 }, 15.3);
      tl.to("#f11-st7", { opacity: 1, duration: 0.5 }, 15.4);
      tl.to("#f11-a5", { opacity: 1, scale: 1.08, duration: 0.35 }, 19.2);
      tl.to("#f11-a5", { scale: 1.0, duration: 0.3 }, 19.8);
      // Roll-call pulse for [3, 3, 5, 5, 6, 7]
      tl.to("#f11-a0", { scale: 1.15, duration: 0.25 }, 25.88); tl.to("#f11-a0", { scale: 1.0, duration: 0.25 }, 26.25);
      tl.to("#f11-a1", { scale: 1.15, duration: 0.25 }, 26.46); tl.to("#f11-a1", { scale: 1.0, duration: 0.25 }, 26.85);
      tl.to("#f11-a2", { scale: 1.15, duration: 0.25 }, 27.09); tl.to("#f11-a2", { scale: 1.0, duration: 0.25 }, 27.40);
      tl.to("#f11-a3", { scale: 1.15, duration: 0.25 }, 27.55); tl.to("#f11-a3", { scale: 1.0, duration: 0.25 }, 27.90);
      tl.to("#f11-a4", { scale: 1.15, duration: 0.25 }, 28.04); tl.to("#f11-a4", { scale: 1.0, duration: 0.25 }, 28.40);
      tl.to("#f11-a5", { scale: 1.15, duration: 0.25 }, 28.61); tl.to("#f11-a5", { scale: 1.0, duration: 0.25 }, 29.05);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 12 — C++ 10-Line Code + Python Mapping (34.54s)
// Right cards dim at 0.35 on start and light up cleanly on voice cue!
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "12-cpp-code.html",
  id: "12-cpp-code",
  content: wrapTemplate({
    id: "12-cpp-code",
    p: "f12",
    duration: 34.54,
    extraCss: `
.f12-code-win {
  background: ${C.navy};
  border: 2px solid rgba(250, 249, 245, 0.18);
  border-radius: 20px;
  overflow: hidden;
  font-family: 'JetBrains Mono', monospace;
  color: ${C.cream};
  display: flex;
  flex-direction: column;
}
.f12-code-bar {
  background: ${C.navyElev};
  padding: 14px 28px;
  font-size: 32px;
  color: rgba(250, 249, 245, 0.80);
  border-bottom: 1px solid rgba(250, 249, 245, 0.14);
  display: flex;
  justify-content: space-between;
  font-weight: 600;
}
.f12-code-body {
  padding: 20px 26px;
  font-size: 32px;
  line-height: 1.46;
  white-space: pre;
}
.f12-lgrp {
  padding: 4px 16px;
  margin: 0 -16px;
  border-left: 8px solid transparent;
  border-radius: 6px;
}
.f12-kw { color: ${C.coral}; font-weight: 700; }
.f12-ty { color: ${C.amber}; font-weight: 700; }
.f12-cm { color: #9D968B; }
.f12-st { color: ${C.teal}; }
.f12-anno {
  background: ${C.cream};
  border: 2px solid ${C.hairStrong};
  border-radius: 18px;
  padding: 20px 26px;
}
`,
    body: `
      <div class="f12-kicker" id="f12-kicker">
        <span>${SVG_SPIKE}C++ CORE · 10 行標準滿分最佳解（可直接背誦）</span>
        <span class="f12-pill">Time O(n) / Space O(k)</span>
      </div>

      <div style="display:grid; grid-template-columns: 1.92fr 1fr; gap: 28px; flex: 1; margin-top: 16px; min-height: 0;">
        <div class="f12-code-win" id="f12-win">
          <div class="f12-code-bar"><span>solution.cpp</span><span>std::deque&lt;int&gt;</span></div>
          <div class="f12-code-body"><div class="f12-lgrp" id="f12-g0"><span class="f12-ty">deque</span>&lt;<span class="f12-kw">int</span>&gt; dq; <span class="f12-ty">vector</span>&lt;<span class="f12-kw">int</span>&gt; res;
res.reserve(nums.size() - k + <span class="f12-st">1</span>);</div><div class="f12-lgrp" id="f12-gfor"><span class="f12-kw">for</span> (<span class="f12-kw">int</span> i = <span class="f12-st">0</span>; i &lt; (<span class="f12-kw">int</span>)nums.size(); ++i) {</div><div class="f12-lgrp" id="f12-g1">  <span class="f12-kw">if</span> (!dq.empty() &amp;&amp; dq.front() &lt; i - k + <span class="f12-st">1</span>)
    dq.pop_front();               <span class="f12-cm">// 1. 頭踢過期</span></div><div class="f12-lgrp" id="f12-g2">  <span class="f12-kw">while</span> (!dq.empty() &amp;&amp; nums[dq.back()] &lt;= nums[i])
    dq.pop_back();                <span class="f12-cm">// 2. 尾踢廢物</span></div><div class="f12-lgrp" id="f12-g3">  dq.push_back(i);                <span class="f12-cm">// 3. 新人入尾</span></div><div class="f12-lgrp" id="f12-g4">  <span class="f12-kw">if</span> (i &gt;= k - <span class="f12-st">1</span>)                 <span class="f12-cm">// 4. 滿框記隊頭</span>
    res.push_back(nums[dq.front()]);</div>}</div>
        </div>

        <div style="display:flex; flex-direction:column; gap:18px; justify-content:space-between;">
          <div class="f12-anno" id="f12-a1" style="border-color:${C.coral};">
            <div style="font-size:36px; font-weight:700; color:${C.coralDark};">① 為什麼過期用 if ？</div>
            <div style="font-size:32px; color:${C.muted}; margin-top:6px; line-height:1.4; font-weight:600;">每次只滑 1 格，最多過期 1 個，不必寫 while</div>
          </div>
          <div class="f12-anno" id="f12-a2">
            <div style="font-size:36px; font-weight:700; color:${C.ink};">② while &lt;= 尾踢＋入尾</div>
            <div style="font-size:32px; color:${C.muted}; margin-top:6px; line-height:1.4; font-weight:600;">比新人弱的從後門清光，再推入 i 滿框記 res</div>
          </div>
          <div class="f12-tile" id="f12-a3" style="padding:20px 26px;">
            <div style="font-size:34px; font-weight:700; color:${C.blue};">③ Python collections.deque</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:31px; color:${C.ink}; margin-top:8px; font-weight:700; line-height:1.4;">popleft() · pop() · append(i)</div>
          </div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f12-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f12-win", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f12-a1", "#f12-a2", "#f12-a3"], { opacity: 0.32, y: 14 }, { opacity: 0.35, y: 0, duration: 0.45 }, 0.3);
      // Init deque + reserve (4.99s)
      tl.to("#f12-g0", { backgroundColor: "rgba(204,120,92,0.22)", borderLeftColor: "${C.coral}", duration: 0.4 }, 4.99);
      tl.to("#f12-g0", { backgroundColor: "rgba(0,0,0,0)", borderLeftColor: "transparent", duration: 0.4 }, 10.5);
      // Step 1: if pop_front (12.69s)
      tl.to("#f12-g1", { backgroundColor: "rgba(204,120,92,0.26)", borderLeftColor: "${C.coral}", duration: 0.4 }, 12.6);
      tl.to("#f12-a1", { opacity: 1, duration: 0.5 }, 15.4);
      tl.to("#f12-g1", { backgroundColor: "rgba(0,0,0,0)", borderLeftColor: "transparent", duration: 0.35 }, 19.0);
      // Step 2: while pop_back (19.30s)
      tl.to("#f12-g2", { backgroundColor: "rgba(232,165,90,0.24)", borderLeftColor: "${C.amber}", duration: 0.4 }, 19.3);
      tl.to("#f12-a2", { opacity: 1, duration: 0.5 }, 19.8);
      tl.to("#f12-g2", { backgroundColor: "rgba(0,0,0,0)", borderLeftColor: "transparent", duration: 0.35 }, 22.8);
      // Step 3: push_back(i) (22.90s)
      tl.to("#f12-g3", { backgroundColor: "rgba(93,184,166,0.22)", borderLeftColor: "${C.teal}", duration: 0.4 }, 22.9);
      tl.to("#f12-g3", { backgroundColor: "rgba(0,0,0,0)", borderLeftColor: "transparent", duration: 0.35 }, 25.1);
      // Step 4: if i >= k - 1 (25.29s)
      tl.to("#f12-g4", { backgroundColor: "rgba(90,138,85,0.28)", borderLeftColor: "${C.green}", duration: 0.4 }, 25.2);
      // Python (29.00s)
      tl.to("#f12-a3", { opacity: 1, duration: 0.5 }, 29.0);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 13 — Lab 3: Amortized O(n) Two Tickets (35.91s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "13-amortized-on.html",
  id: "13-amortized-on",
  content: wrapTemplate({
    id: "13-amortized-on",
    p: "f13",
    duration: 35.91,
    body: `
      <div class="f13-kicker" id="f13-kicker">
        <span>${SVG_SPIKE}LAB 3 · 面試必追問：均攤時間複雜度證明</span>
        <span class="f13-pill">「兩張門票」法則</span>
      </div>

      <div id="f13-title">
        <div class="f13-serif" style="font-size:74px;">for 迴圈裡包著 while，為什麼不是 O(nk) 而是 O(n)？</div>
      </div>

      <div class="f13-split-2" style="grid-template-columns: 1.25fr 0.9fr;">
        <div class="f13-tile" id="f13-left" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-size:34px; font-weight:700; color:${C.muted};">每人一輩子最多 2 張票：${DOT(C.green)}進場 1 次 ＋ ${DOT(C.red)}離場 1 次</div>
          <div style="display:flex; gap:14px; justify-content:space-between; margin:16px 0;">
            <div class="f13-acell f13-acell-kill" id="f13-t8" style="padding:14px 8px;"><span class="f13-acell-v" style="font-size:52px;">8</span><span class="f13-acell-idx" style="font-size:26px;">${DOT(C.green)}進 ${DOT(C.red)}出</span></div>
            <div class="f13-acell f13-acell-kill" id="f13-t6" style="padding:14px 8px;"><span class="f13-acell-v" style="font-size:52px;">6</span><span class="f13-acell-idx" style="font-size:26px;">${DOT(C.green)}進 ${DOT(C.red)}出</span></div>
            <div class="f13-acell f13-acell-kill" id="f13-t4" style="padding:14px 8px;"><span class="f13-acell-v" style="font-size:52px;">4</span><span class="f13-acell-idx" style="font-size:26px;">${DOT(C.green)}進 ${DOT(C.red)}出</span></div>
            <div class="f13-acell f13-acell-kill" id="f13-t2" style="padding:14px 8px;"><span class="f13-acell-v" style="font-size:52px;">2</span><span class="f13-acell-idx" style="font-size:26px;">${DOT(C.green)}進 ${DOT(C.red)}出</span></div>
            <div class="f13-acell f13-acell-cur" id="f13-t9" style="padding:14px 8px;"><span class="f13-acell-v" style="font-size:52px;">9</span><span class="f13-acell-idx" style="font-size:26px;">${DOT(C.blue)}進場</span></div>
          </div>
          <div style="font-size:36px; font-weight:700; text-align:center; color:${C.ink};">
            就算 9 一口氣連踢 4 個 ${SVG_ARROW_R(C.coral, 30)} <span style="color:${C.coralDark};">離場後永不再回來！</span>
          </div>
        </div>

        <div class="f13-card" id="f13-right" style="border-color:${C.ink}; display:flex; flex-direction:column; justify-content:center; align-items:center; text-align:center; gap:14px;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:38px; color:${C.coral}; font-weight:700;">總進出操作合計 &lt;= 2n</div>
          <div class="f13-serif" id="f13-time" style="font-size:108px; color:${C.ink}; line-height:1;">Time O(n)</div>
          <div class="f13-mono" id="f13-space" style="font-size:44px; color:${C.green}; font-weight:700; background:${C.greenSoft}; padding:8px 26px; border-radius:12px;">Space O(k)</div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f13-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f13-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f13-left", "#f13-right"], { opacity: 0.25, y: 14 }, { opacity: 0.32, y: 0, duration: 0.45 }, 0.4);
      tl.to("#f13-left", { opacity: 1, duration: 0.6 }, 10.4);
      tl.fromTo(["#f13-t8", "#f13-t6", "#f13-t4", "#f13-t2"], { backgroundColor: "${C.cream}", borderColor: "${C.hairStrong}", opacity: 1 }, { backgroundColor: "${C.cream}", opacity: 1, duration: 0.3 }, 10.4);
      tl.fromTo("#f13-t9", { opacity: 0.2, y: -12, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }, 20.0);
      tl.to(["#f13-t2", "#f13-t4", "#f13-t6", "#f13-t8"], { backgroundColor: "${C.redSoft}", borderColor: "${C.red}", opacity: 0.52, duration: 0.45, stagger: 0.25 }, 21.6);
      tl.to("#f13-right", { opacity: 1, duration: 0.6 }, 27.0);
      tl.fromTo("#f13-time", { scale: 0.88 }, { scale: 1.04, duration: 0.45, ease: "power3.out" }, 31.3);
      tl.to("#f13-time", { scale: 1.0, duration: 0.3 }, 32.1);
      tl.fromTo("#f13-space", { scale: 0.88 }, { scale: 1.05, duration: 0.45, ease: "power3.out" }, 33.2);
      tl.to("#f13-space", { scale: 1.0, duration: 0.3 }, 34.0);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 14 — Interview Survival Kit (31.47s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "14-interview-faq.html",
  id: "14-interview-faq",
  content: wrapTemplate({
    id: "14-interview-faq",
    p: "f14",
    duration: 31.47,
    extraCss: `
.f14-pit { padding: 14px 18px; border-radius: 12px; background: ${C.redSoft}; border: 2px solid ${C.red}; font-size: 32px; font-weight: 700; color: ${C.red}; display: flex; align-items: center; }
`,
    body: `
      <div class="f14-kicker" id="f14-kicker">
        <span>${SVG_SPIKE}INTERVIEW SURVIVAL KIT · 面試實戰保命錦囊</span>
        <span class="f14-pill">最後三招上機必備</span>
      </div>

      <div id="f14-title">
        <div class="f14-serif" style="font-size:74px;">備案解法 · 常見變形追問 · 新手三大地雷</div>
      </div>

      <div class="f14-triptych" style="min-height: 490px;">
        <div class="f14-tile" id="f14-c1" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">① 忘記 Deque 的備案</div>
            <div style="font-size:48px; font-weight:700; line-height:1.25; margin-top:14px;">Max-Heap<br>＋ 延遲刪除</div>
            <div style="font-size:33px; color:${C.muted}; margin-top:16px; line-height:1.45;">將 {nums[i], i} 放進大頂堆，僅當堆頂過期才彈出</div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:34px; color:${C.ink}; font-weight:700; background:${C.cream}; padding:14px 20px; border-radius:12px; border:2px solid ${C.hairStrong};">O(n log n) 穩過不超時</div>
        </div>

        <div class="f14-tile" id="f14-c2" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700;">② 追問：視窗最小值？</div>
            <div style="font-family:'JetBrains Mono',monospace; font-size:66px; font-weight:700; margin-top:26px; display:flex; align-items:center;">
              &lt;= <span id="f14-flip" style="color:${C.green}; display:inline-flex; align-items:center;">${SVG_ARROW_R(C.green, 44)} &gt;=</span>
            </div>
            <div style="font-size:34px; color:${C.muted}; margin-top:16px; line-height:1.45;">隊尾淘汰條件反轉成大於等於，立刻改為「單調遞增」佇列</div>
          </div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.green}; font-weight:700; background:${C.greenSoft}; padding:14px 20px; border-radius:12px;">只改 1 個符號一秒搞定</div>
        </div>

        <div class="f14-card" id="f14-c3" style="border-color:${C.red}; display:flex; flex-direction:column; justify-content:space-between;">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.red}; font-weight:700;">③ 新手 3 大地雷檢查</div>
          <div class="f14-pit" id="f14-p1">${SVG_CROSS(C.red, 28)}直接存數值（無法判過期）</div>
          <div class="f14-pit" id="f14-p2">${SVG_CROSS(C.red, 28)}取值忘寫 !dq.empty()</div>
          <div class="f14-pit" id="f14-p3">${SVG_CROSS(C.red, 28)}i &lt; k - 1 就搶記答案</div>
        </div>
      </div>
`,
    script: `
      tl.fromTo("#f14-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f14-title", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f14-c1", "#f14-c2", "#f14-c3"], { opacity: 0.25, y: 14 }, { opacity: 0.32, y: 0, duration: 0.45 }, 0.4);
      tl.to("#f14-c1", { opacity: 1, duration: 0.6 }, 4.0);
      tl.to("#f14-c2", { opacity: 1, duration: 0.6 }, 14.0);
      tl.fromTo("#f14-flip", { scale: 0.8 }, { scale: 1.12, duration: 0.45, ease: "power3.out" }, 18.8);
      tl.to("#f14-flip", { scale: 1.0, duration: 0.3 }, 19.6);
      tl.to("#f14-c3", { opacity: 1, duration: 0.55 }, 22.3);
      tl.fromTo("#f14-p1", { opacity: 0.35, x: 14 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 24.7);
      tl.fromTo("#f14-p2", { opacity: 0.35, x: 14 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 25.8);
      tl.fromTo("#f14-p3", { opacity: 0.35, x: 14 }, { opacity: 1, x: 0, duration: 0.45, ease: "power3.out" }, 27.5);
`
  })
});

// ═══════════════════════════════════════════════════════════════════════════
// FRAME 15 — Final Summary Poster (16.88s)
// ═══════════════════════════════════════════════════════════════════════════
frames.push({
  file: "15-recap.html",
  id: "15-recap",
  content: wrapTemplate({
    id: "15-recap",
    p: "f15",
    duration: 16.88,
    extraCss: `
.f15-chip {
  flex: 1;
  background: ${C.tile};
  border: 2px solid ${C.hairStrong};
  border-radius: 20px;
  padding: 36px 26px;
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
}
`,
    body: `
      <div class="f15-kicker" id="f15-kicker" style="justify-content:center; gap:10px;">
        <span>${SVG_SPIKE}LEETCODE 239 · 考前 10 秒定格總複習</span>
      </div>

      <div id="f15-hero" style="text-align:center;">
        <div class="f15-serif" style="font-size:94px; line-height:1.1;">存索引不存值 · 單調遞減雙端佇列</div>
      </div>

      <div style="display:flex; gap:30px; width:100%;" id="f15-pillars">
        <div class="f15-chip" id="f15-m1">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.red}; font-weight:700;">STEP 1</div>
          <div style="font-size:48px; font-weight:700;">① 頭出框就踢</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.muted};">dq.pop_front()</div>
        </div>
        <div class="f15-chip" id="f15-m2">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coral}; font-weight:700;">STEP 2</div>
          <div style="font-size:48px; font-weight:700;">② 尾比我小就踢</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.muted};">pop_back + push(i)</div>
        </div>
        <div class="f15-chip" id="f15-m3" style="border-color:${C.coral}; background:${C.coralSoft};">
          <div style="font-family:'JetBrains Mono',monospace; font-size:32px; color:${C.coralDark}; font-weight:700;">STEP 3</div>
          <div style="font-size:48px; font-weight:700; color:${C.coralDark};">③ 隊頭就是答案</div>
          <div style="font-family:'JetBrains Mono',monospace; font-size:30px; color:${C.coralDark};">nums[dq.front()]</div>
        </div>
      </div>

      <div class="f15-navy-card" id="f15-footer" style="display:flex; justify-content:space-between; align-items:center; padding:24px 44px;">
        <span style="font-family:'JetBrains Mono',monospace; font-size:38px; color:${C.amber}; font-weight:700;">Time O(n) · Space O(k)</span>
        <span style="font-size:36px; font-weight:700; color:${C.cream};">穩穩一次寫過 LeetCode 239！</span>
      </div>
`,
    script: `
      tl.fromTo("#f15-kicker", { opacity: 0, y: -14 }, { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, 0);
      tl.fromTo("#f15-hero", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, 0.05);
      tl.fromTo(["#f15-m1", "#f15-m2", "#f15-m3", "#f15-footer"], { opacity: 0.3, y: 14 }, { opacity: 0.35, y: 0, duration: 0.4 }, 0.3);
      tl.to("#f15-m1", { opacity: 1, duration: 0.5 }, 3.8);
      tl.to("#f15-m2", { opacity: 1, duration: 0.5 }, 5.2);
      tl.to("#f15-m3", { opacity: 1, duration: 0.5 }, 6.8);
      tl.to("#f15-footer", { opacity: 1, duration: 0.6 }, 9.0);
`
  })
});

for (const f of frames) {
  writeFileSync(join(FRAMES_DIR, f.file), f.content, "utf8");
  console.log(`Wrote ${f.file}`);
}

let sb = readFileSync(STORYBOARD_PATH, "utf8");
sb = sb.replace(/^- status:\s*(?:outline|built)\s*$/gm, "- status: animated");
writeFileSync(STORYBOARD_PATH, sb, "utf8");
console.log("Updated STORYBOARD.md.");

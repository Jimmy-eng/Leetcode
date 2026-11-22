---
workflow: faceless-explainer
flow: automation
storyboard: yes
message: "比你晚進來還比你大，前面直接淘汰——用存索引的單調遞減雙端佇列，三個口訣把滑動視窗最大值從 O(nk) 降到 O(n)"
destination: youtube-desktop
aspect: 1920x1080
language: zh-TW
audience: 演算法新手，以及準備高通與科技業面試、想徹底秒懂 LeetCode 239 (Hard) 的工程師
length: 453s
angle: concept-explainer with process
voice: zh-TW-YunJheNeural
style_preset: code-editorial
---

## Intent

將 `239_Sliding_Window_Maximum.html`（v2 新手極速秒懂版）轉製成一支 16:9 完整繁體中文教學解說影片（v2 升級版：15 幕、約 4 分半鐘），目標是讓完全沒學過 Monotonic Deque 的新手也能一步步聽懂。以溫潤紙感筆記風格呈現，拆解「校隊選拔」與「前後雙門走廊」白話比喻、`n - k + 1` 與 `i - k + 1` 公式推導、為何存索引不存值（`[5, 1, 5]` 反例）、必踢 vs 要留接班候補獨立兩幕實驗、官方範例 `[1,3,-1,-3,5,3,6,7], k=3` 三幕慢動作演練、10 行 C++ 核心代碼（附 Python 對照）、均攤 $O(n)$ 兩張門票證明，以及面試加分錦囊。

## Customizations

- 採用 `edge-tts` 台灣男聲 (`zh-TW-YunJheNeural`) 作為 host 旁白音軌，搭配同步繁體中文字幕。
- 程式碼主軸以 C++ (`std::deque`) 為主，輔以 Python (`collections.deque`) 快速對照。
- 視覺直接還原原 HTML 的 3 個白話實驗與迷你劇場（指標剝洋蔥、高度柱踢/留對照、滑動視窗與單調佇列動畫、均攤 O(n) 門票計數器）。

## Notes

- 最終輸出 MP4 放置於 `D:\@高通面試\leetcode\239_Sliding_Window_Maximum\`。
- 所有專案碼、`node_modules`、音檔、字幕、`.tmp` 與 `.cache` 嚴格限定在 `D:\@高通面試\leetcode\239_Sliding_Window_Maximum\code\`，避免佔用 C 槽暫存。
- `google-colab-cli` 已登入驗證（餘額 `384.08 compute units`）。
- **零本機重算力政策（Zero-Local-Heavy-Compute Policy）**：因本機筆電 RAM 吃緊，後續所有會啟動 headless Chrome 或高記憶體負載的步驟（`hyperframes check`、`snapshot`、`render`）一律改由 **Colab CPU VM**（必要時才降級至最便宜 `--gpu T4`）遠端執行；本機僅負責撰寫輕量 HTML/腳本與打包上傳，取得結果後立即執行 `colab stop` 釋放資源。

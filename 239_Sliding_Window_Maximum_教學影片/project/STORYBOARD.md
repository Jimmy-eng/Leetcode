---
format: 1920x1080
duration: 453s
message: "比你晚進來還比你大，前面直接淘汰——用存索引的單調遞減雙端佇列，三個口訣把滑動視窗最大值從 O(nk) 降到 O(n)"
arc: concept-explainer with process
audience: 演算法新手，以及準備高通與科技業面試、想徹底秒懂 LeetCode 239 (Hard) 的工程師
mode: collaborative
music: none
---

## Video direction

- Thesis: 破除 LeetCode 239 Hard 恐懼，用「校隊選拔淘汰直覺」與「前後雙門候補走廊」兩階段拆解單調遞減雙端佇列，再以官方範例 `i=0..7` 逐拍動畫走通全流程與 C++/Python 實作。
- Palette & temperature: 採用 `code-editorial` 暖紙質感——暖米白畫布 `#FAF9F5`、暖淺砂卡片 `#EFE9DE`、暖炭黑 `#141413` 主墨色、赤陶橘 `#CC785C` 作為單一亮點電壓色，程式碼框採暖深炭 `#181715`。語意角色色固定：最大領跑/接班勝出 `#5A8A55`、過期淘汰/地雷警告 `#B8483A`、新人進場 `#2563EB`、候補索引 `#7C3AED`。禁止純白 `#FFFFFF`、純黑 `#000000` 與霓虹發光。
- Typography & YouTube 16:9 hierarchy: 1920×1080 畫布內全數採用 `cqw` 相對單位。主標題 `4.6–5.6cqw`、重點結論與數字卡片 `2.4–3.2cqw`、陣列格數值 `3.2–3.4cqw`、一般內文與代碼註解不低於 `1.75–1.9cqw`（確保手機/YouTube 縮圖狀態依然一眼清晰）。標題字體為 EB Garamond（搭襯線中文）、內文為 Inter（搭黑體中文）、索引與程式語法為 JetBrains Mono。
- Safe area & caption band: 畫面主要構圖嚴格保留於上方 83%（`y = 0..896px`），下方 17%（`y = 900..1080px`）淨空予卡拉OK雙色強調字幕條。
- Motion discipline: 全片採用長尾平順收斂（`power3.out`），嚴禁彈跳/過衝、連續循環或無止盡微幅晃動；每個視覺卡片與高亮點精準對齊語音 `audio_meta.json` WordBoundary 時間點逐層揭示（絕不在 `t=0` 一次傾倒整頁），非尾幕不主動做離場動畫，轉場交由主時間軸 `transitions.mjs` 負責。

## Changes from v1

1. 11 幕擴充為 15 幕，降低資訊密度、每幕只講透一個觀念。
2. 補上具體數字推導：視窗總數 `n - k + 1`（`8 - 3 + 1 = 6`）與左界公式 `i - k + 1`（`4 - 3 + 1 = 2`），並導入「校隊選拔」與「前後雙門候補走廊」生活比喻。
3. 將「必踢（劇本 A）」與「要留當接班候補（劇本 B）」拆成獨立兩幕（Frame 6、Frame 7），且將官方範例 `[1,3,-1,-3,5,3,6,7], k=3` 拆成 3 幕同舞台慢動作演練（Frame 9–11），單獨放慢 `i=4` 頭尾雙踢高潮。
4. C++ 代碼、均攤 $O(n)$ 兩張門票證明與面試錦囊（Max-Heap 備案、最小值改號、3 大地雷）皆補齊「為什麼這樣寫」的細節。
5. Sketch v2.1 視覺定案：全面放大 16:9 YouTube 橫幅字級（標題 `4.8–5.6cqw`、內文/標籤 ≥ `1.8cqw`），Frame 12 代碼斷行排版零裁切。

## Frame 1 — 破題：用「校隊選拔」一句話秒懂 Hard 題

- scene: 暖米白紙感封面標題「LeetCode 239 · Sliding Window Maximum」與「Hard」標籤，接著亮出校隊選拔比喻卡：「比你晚畢業、實力又比你強 ➔ 前面的學長直接淘汰！」，下方預告核心結論「用一次掃描拿下 O(n)」。
- voiceover: "很多人看到 LeetCode 239 標著 Hard 就直接關掉。但其實這題背後只有一句超白話的生活直覺：想像一個球隊選拔，如果有個新來的學弟，比你晚畢業、實力又比你強——那你這輩子都不可能當隊長了，直接淘汰！只要懂這句話，你就能看懂這題最核心的演算法。"
- duration: 22.83s
- transition_in: cut
- status: animated
- src: compositions/frames/01-hook.html
- type: hook
- persuasion: Counterintuitive simplification + analogy
- beat: Curiosity + relief
- blueprint: kinetic-type-beats
- focal: 5.2cqw 主標題「比你晚畢業、實力又比你強 ➔ 前面學長直接淘汰！」與右下角 O(n) 目標鎖定卡。
- roles: 頂欄 kicker + Hard 警戒膠囊 | 左上主視覺命題標題 | 下方兩張校隊比喻對照卡（學長離校 vs 強大新學弟淘汰規則）+ 右側深色 `O(n)` 結語磚。

Scene 1 (0.0–4.5s): 頂部 `✱ LEETCODE 239 · BEGINNER EDITION` 與紅色 `HARD` 標籤率先顯現，主標第一行「很多人看到 Hard 題就關掉？」與 `239` 主視覺切入。
Scene 2 (4.9–16.7s): 旁白轉折後亮出「校隊選拔直覺」卡片群：左卡顯示學長（先畢業、較弱）遭劃線淘汰，中卡突出強大新學弟（更晚畢業＋更強）觸發 `pop_back` 直覺，節奏停落在「這輩子不可能當隊長 ➔ 直接淘汰！」。
Scene 3 (17.4–22.83s): 右側暖深炭結語卡「O(n) 核心直覺」穩定滑入定格，宣告「這就是單調雙端佇列全部秘密」。

## Frame 2 — 題意拆解：滑動視窗怎麼滑？總共有幾個答案？

- scene: 中央展示長度 n=8 的陣列 [1,3,-1,-3,5,3,6,7] 與寬度 k=3 的橘色視窗框，逐格示範從未滿 k 格（i=0,1 不記答案）到 i=k-1=2 產出第一個答案，一路滑到最後產出 n-k+1=6 個最大值。
- voiceover: "先搞懂題目在問什麼：給你一個長度 n 的數字陣列，還有一個寬度為 k 的視窗框框，從最左邊每次往右滑一格。注意兩個新手必踩的細節：第一，剛開始還沒湊滿 k 格時，不算答案，要從索引 k 減 1 才開始記錄；第二，總共會產出 n 減 k 加 1 個最大值。像這題長度 8、視窗寬度 3，最後就會有 6 個答案。"
- duration: 25.93s
- transition_in: crossfade
- status: animated
- src: compositions/frames/02-problem-spec.html
- type: pain_point
- persuasion: Concretization + worked example
- beat: Orientation + clarity
- blueprint: device-surface-showcase
- focal: 長度 n=8 陣列軌道 `[1, 3, -1, -3, 5, 3, 6, 7]` 與同步右滑的橘框視窗 `k=3`、綠色答案標記 `max = 3`。
- roles: 頂欄 Spec kicker + `k = 3` 膠囊 | 中上 8 格陣列條與橘色覆蓋視窗框 | 下方雙欄結論卡（左：`i ≥ k - 1` 收割起點；右：`n - k + 1 = 6` 總數公式）。

Scene 1 (0.0–8.5s): `00 PROBLEM SPEC` 進場，8 格陣列 `[1, 3, -1, -3, 5, 3, 6, 7]` 依序展開並覆蓋寬度 `k=3` 橘色框；視窗輕滑示意從左到右推進。
Scene 2 (9.0–17.0s): 下方左卡亮起「① 何時開始記答案？ `i >= k - 1`」，陣列上方同步點亮 `i=0 (1/3 未滿)`、`i=1 (2/3 未滿)` 為淡灰警告，直到 `i=2 (k-1 滿框✅)` 轉綠跳出第一個最大值 `3`。
Scene 3 (17.1–25.93s): 下方右卡亮起「② 總共有幾個答案？」，逐項代入 `n = 8`、`k = 3`，得出 `8 - 3 + 1 = 6 個最大值` 並框出最終 6 個視窗軌跡。

## Frame 3 — 為什麼直覺暴力法會 TLE 超時？

- scene: 左側顯示暴力法巢狀掃描：每右滑一格就把框內 k 個數重新比一次得到 O(nk)；右側顯示 Constraints（n ≤ 10^5, k = 5×10^4），運算計數器飛快跳升突破 5×10^9 次並重重蓋上紅色「TLE 超時」印章。
- voiceover: "最直覺的寫法，當然是框框每往右移一格，就把框裡 k 個數字全部重比一遍，這叫做暴力法，時間複雜度是 O(nk)。問題來了，題目測資最大到十萬筆！如果視窗寬度是五萬，乘起來會衝破五十億次運算，電腦一秒根本跑不完，絕對直接超時。我們必須想辦法：框框滑一格，不要重掃，直接秒知最大值！"
- duration: 27.78s
- transition_in: crossfade
- status: animated
- src: compositions/frames/03-brute-tle.html
- type: pain_point
- persuasion: Statistical proof + stakes
- beat: Tension + recognition
- blueprint: dataviz-countup
- focal: 右側紅色警戒卡巨大數字 `5,000,000,000` 次運算計數器與 `TLE 超時必炸` 印章。
- roles: 左欄「暴力法重複掃描」對照卡（標示每次重掃 k 格導致 `O(n·k)`）| 右欄「測資規模核爆區」（Constraints `10^5 × 5×10^4` 計數器 + 紅色 TLE 章）| 底部赤陶橘目標宣言條。

Scene 1 (0.0–9.0s): 左欄暴力法重掃視圖進場，上下兩輪視窗 `[1, 3, -1]` 與 `[3, -1, -3]` 標示大量重疊計算區域，大字亮出時間複雜度 `O(n · k)`。
Scene 2 (9.7–21.0s): 右欄 `Constraints` 揭露 `n ≤ 10^5` 與 `k = 5×10^4`，計數文字衝破 `5,000,000,000` 次（對比 1 秒上限 `10^8`），於「絕對直接超時」句尾拍下鮮紅 `✗ TLE 超時必炸` 徽章。
Scene 3 (21.4–27.78s): 底部目標宣言「框滑一格不重掃 ➔ 秒知最大值 O(n)」點亮收束，為下一幕引出 `deque` 做足鋪墊。

## Frame 4 — 認識雙端佇列 Deque 與 4 個關鍵符號

- scene: 上半部繪製「前後雙門候補走廊（Deque）」：左邊前門標示「頭 front（最大👑/最早過期）」、右邊後門標示「尾 back（最新進來）」；下半部依序亮出 4 張符號卡：i、i-k+1（帶入 4-3+1=2 實算）、dq、nums[dq.front()]。
- voiceover: "要做到秒知最大值，我們要請出主角：雙端佇列 deque，簡稱 dq。把它想像成一條前後都能開門的候補名單走廊，裡面的人永遠照實力從左大排到右小。開始前只要認得四個符號：i 是剛走進框框的新人位置；i 減 k 加 1 是框框最左邊的底線，例如走到第 4 格、框寬 3 格，左界就是 4 減 3 加 1 等於 2，小於 2 代表已經滑出框外；而名單最前面 dq.front() 對應的數字，就是現在這框的最大值！"
- duration: 31.35s
- transition_in: cut
- status: animated
- src: compositions/frames/04-deque-notations.html
- type: product_intro
- persuasion: Analogy + progressive disclosure
- beat: Clarity + anticipation
- blueprint: grid-card-assemble
- focal: 上半部前後開門 `std::deque` 走廊圖解（左側紅色 `front` 出門 ＋ 右側藍色 `back` 進出門）與 4 張關鍵符號卡片網格。
- roles: 中上「雙門通道管線圖」| 下半 2×2 四張變數定義卡（`i`、`i - k + 1` 附帶 `4-3+1=2` 計算實例、`dq`、`nums[dq.front()]`）。

Scene 1 (0.0–12.5s): 主角 `std::deque (dq)` 前後雙門走廊進場：左門 `◀ 前門 front (最早過期/最大 👑)`、右門 `後門 back (最新進來) ▶`，並示範內部候選晶片由大到小排列 `[idx 1 : 3] ➔ [idx 2 : -1]`。
Scene 2 (13.0–25.8s): 2×2 符號網格隨旁白節奏依序揭開：先亮 Card 1 `i`（剛進框的新人索引），接續亮 Card 2 `i - k + 1`（框框左界底線）並實時點亮計算貼紙 `4 - 3 + 1 = 2`（小於 2 出框）。
Scene 3 (25.9–31.35s): 亮出 Card 3 `dq`（左大到右小候補名單）與 Card 4 `nums[dq.front()]`（綠色皇冠標記當前視窗最大值）。

## Frame 5 — 剝洋蔥實驗：為什麼 dq 存「位置索引」不存「數值」？

- scene: 雙欄對照還原 Lab 1：左欄動畫箭頭示範剝洋蔥兩步查值——dq.back() 拿到索引 2，套入 nums[2] 才查到 -1；右欄反例 nums=[5,1,5], k=2 滑到 [1,5] 時，只存值會出現兩個分不清誰過期的「5」，改存 idx 0 與 idx 2 立刻一眼辨識。
- voiceover: "新手第一關最容易卡在這裡：為什麼程式碼寫得這麼繞，要寫 nums[dq.back()]？記住一句剝洋蔥口訣：dq 裡存的只是位置門牌，外面包一層 nums 中括號，才是去查那個位置的數字。為什麼不乾脆直接存數字就好？你看 5、1、5 這組例子：當視窗滑到後兩格 1 和 5，如果你只存數字 5，看到隊頭是 5，你根本分不出它是已經掉出框外的 0 號，還是剛進來的 2 號！存索引，就能同時知道位置跟數值，一舉兩得。"
- duration: 35.5s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/05-why-index.html
- type: feature_showcase
- persuasion: Counterexample + concretization
- beat: Aha + comprehension
- blueprint: comparison-split
- focal: 左欄「剝洋蔥雙層查值拆解卡」與右欄 `[5, 1, 5], k = 2` 撞名反例辨識實驗。
- roles: 左欄 `nums[dq.back()]` 雙層解析步驟塊 | 右欄 `[5, 1, 5]` 陣列條與「❌ 只存值撞名誤判」vs「✅ 存索引一眼辨出 idx 0 / idx 2」對比塊。

Scene 1 (0.0–14.0s): 左欄「剝洋蔥拆解」分兩拍進場：內層 `dq.back()` 亮紫取出門牌 `idx 2`；外層包覆 `nums[2]` 亮藍取出實際數值 `-1`。
Scene 2 (14.5–28.6s): 右欄「反例實驗 `[5, 1, 5], k = 2`」顯現並鎖定 `[1, 5]` 視窗，上方警示框顯示若 `dq` 只存 `[5, 5]` 將無法分辨左頭的 `5` 是「已過期的 idx 0」還是「仍在框內的 idx 2」。
Scene 3 (29.0–35.5s): 右下方切換亮綠正解框：`dq` 改存索引 `[0, 2]`，`0 < L(1)` 一眼揪出 `idx 0` 過期並點出「一舉兩得：同時掌控位置＋數值」。

## Frame 6 — 劇本 A（必踢）：新人比較大，隊尾直接踢光！

- scene: 專注呈現高度柱狀圖劇本 A：視窗內原有高度柱 3（隊長）與 -1（隊尾），右側出現更高大的新人柱 5 進場；對比數值大小與剩餘壽命後，-1 與 3 依序變紅加上刪除線從隊尾踢飛，5 戴上皇冠成為唯一新老大，底部備註「相等（<=）也一併踢舊留新」。
- voiceover: "再來看最核心的淘汰規則：什麼時候要把隊尾踢掉？假設名單裡原本有 3 和負 1，現在新來了一個更大的 5。你想想，5 不只數值比他們大，而且比較晚進框，也就是會比他們更晚滑出視窗！這代表只要 5 還在框框裡一天，前面的負 1 跟 3 永遠不可能當老大，留著純佔空間，直接從後門通通踢光！順帶一提，遇到一樣大的數字我們也用小於等於一起踢掉，留下較晚過期的新位置就好。"
- duration: 32.6s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/06-kick-rule.html
- type: feature_showcase
- persuasion: Analogy + before/after contrast
- beat: Aha + delight
- blueprint: comparison-split
- focal: 高度柱狀舞台上「較弱又短命的 `3` 與 `-1`」面對「更高大且長壽的新人 `5 👑`」全面碾壓淘汰對照。
- roles: 中央高度柱舞台（左：舊人 `3` 與 `-1`；右：強勢新人 `5 👑` + `雙重碾壓` 箭頭）| 雙條件檢查牌（數值輸 ＋ 壽命輸）| 底部相等值 `<=` 一同踢舊留新提醒條。

Scene 1 (0.0–9.5s): 中央舞台擺出隊內舊將 `3` 與 `-1` 兩根柱，隨後右側升起更高的藍色/綠色巨人柱 `5`。
Scene 2 (9.9–24.2s): 雙重條件牌逐條亮起「數值比你大 ＋ 進框比較晚（更晚過期）」；`-1` 與 `3` 依序變淡紅並蓋上踢除章從後門清場，`5` 正式戴上 👑。
Scene 3 (24.9–32.6s): 底部展開邊界提示：「遇到相等（`nums[dq.back()] <= nums[i]`）一樣踢舊留新，留下壽命更長的新索引」。

## Frame 7 — 劇本 B（要留）：新人比較小，反而要留著當接班人！

- scene: 專注呈現高度柱狀圖劇本 B：原本隊長是 3，新來較矮的 -1 進場；上方打上綠色標籤「活得比 3 久 ➔ 留作接班候補」；隨後視窗向右滑一格，3 掉出左界從前門離場，原先留下的 -1 立刻亮起綠框戴上皇冠接班當老大！
- voiceover: "反過來，如果新來的數字比較小呢？例如老大是 3，新來一個負 1。這時候千萬不能把負 1 踢掉！因為雖然負 1 現在打不過 3，但它比 3 晚進框、活得比較久。你看，當視窗繼續往右滑，老隊長 3 遲早會掉出框外從前門離開；這時候，當初留在後面的負 1 就會立刻順理成章接班，變成下一個視窗的最大值！這就是為什麼名單會自動維持左大右小的單調遞減順序。"
- duration: 32.82s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/07-keep-rule.html
- type: feature_showcase
- persuasion: Causal chain + contrast
- beat: Aha + fascination
- blueprint: comparison-split
- focal: 兩幕時間對照欄：「階段① `3 👑` 強勢但快退休，`-1` 較矮卻活得久不能踢」與「階段② `3` 出框退場，`-1 👑` 無縫接班」。
- roles: 左欄「當下情況：先保留不踢」| 右欄「未來接班：視窗右滑後 `3` 畢業，`-1` 變最大」| 底部結論條（隊列自然形成左大右小單調遞減）。

Scene 1 (0.0–15.0s): 左欄展示隊長 `3 👑` 與矮小新人 `-1`，標出紅色禁止踢除標語「雖然現在打不過 3，但它比 3 晚進框、壽命較長」。
Scene 2 (15.7–26.6s): 右欄亮起下一輪畫面：老隊長 `3` 化為虛線出框退休，原本留著候補的 `-1` 立刻轉綠戴上皇冠 `-1 👑` 登基。
Scene 3 (27.5–32.82s): 底部單調遞減階梯標籤亮起：「自然維持左大 ➔ 右小單調遞減佇列」。

## Frame 8 — 三步口訣總整理：每一輪只做這 3 件事

- scene: 橫向三聯卡片（Triptych）整合前三幕概念：Card 1 紅色標籤「STEP 1 · 頭出框就踢 (`dq.front() < i-k+1` ➔ `pop_front`)」、Card 2 橘色標籤「STEP 2 · 尾比我小就踢 (`nums[dq.back()] <= nums[i]` ➔ `pop_back` 再入尾)」、Card 3 綠色標籤「STEP 3 · 隊頭就是答案 (`i >= k-1` ➔ `res.push_back(nums[dq.front()])`)」。
- voiceover: "把剛才兩條規則合在一起，整個演算法每一輪就只剩三步口訣：第一步，頭出框就踢，看排第一的老隊長是不是已經掉到左界外面，是就從前門踢掉；第二步，尾比我小就踢，把隊尾所有小於等於新人的舊元素從後門踢光，再把新人索引放進隊尾；第三步，只要視窗湊滿 k 格，直接把隊頭的數值收進答案。是不是超好記？"
- duration: 26.7s
- transition_in: crossfade
- status: animated
- src: compositions/frames/08-three-steps.html
- type: product_intro
- persuasion: Rule of three + signposting
- beat: Confidence + orientation
- blueprint: grid-card-assemble
- focal: 三聯大字口訣卡（紅頂條 `STEP 1 頭出框就踢` / 橘頂條 `STEP 2 尾比我小就踢` / 綠頂條 `STEP 3 隊頭就是答案`）。
- roles: 橫向 3 等分 Triptych 口訣卡（每張含步驟號、4字大字口訣、條件說明與單行 C++ 語法晶片）| 底部準備實戰引導條。

Scene 1 (0.0–5.0s): 標題欄進場建立「每一輪就做這 3 件事」。
Scene 2 (5.1–18.4s): 左卡紅色 `STEP 1 · 頭出框就踢` (`dq.pop_front()`) 與中卡赤陶橘 `STEP 2 · 尾比我小就踢` (`pop_back + push(i)`) 隨旁白節奏依序展開點亮。
Scene 3 (18.5–26.7s): 右卡綠色 `STEP 3 · 隊頭就是答案` (`nums[dq.front()]`) 揭開並點亮底部過渡卡「口訣準備完畢 ➔ 下一步慢動作代入官方範例！」。

## Frame 9 — 範例慢動作實戰 (1/3)：熱身與第一個視窗（i = 0, 1, 2）

- scene: 開啟固定教學模擬器舞台：上方 8 格陣列 [1,3,-1,-3,5,3,6,7] 與滑動框、左下雙端佇列管 dq（idx:val）、右下三步即時判定板與 res 區。慢動作走完 i=0（入 0:1，未滿）、i=1（3 踢掉 0:1，剩 [1:3]，未滿）、i=2（-1<3 保留，dq=[1:3,2:-1]，滿 3 格記下 res=[3]）。
- voiceover: "現在我們拿官方範例 1、3、負 1、負 3、5、3、6、7，視窗寬度 k 等於 3，慢動作實戰一遍！先看前三步：i 等於 0，數字 1 進場，放進隊列，視窗還不滿三格不記答案。i 等於 1，新來的 3 比隊尾 1 大，把 1 從後門踢掉，換 3 坐頭位，還是不滿三格。i 等於 2，負 1 比 3 小，留著當接班人排後面；這時終於湊滿三個數字，直接記下隊頭 3，拿到第一個答案！"
- duration: 34.21s
- transition_in: cut
- status: animated
- src: compositions/frames/09-walkthrough-1.html
- type: social_proof
- persuasion: Worked example with real numbers
- beat: Comprehension + momentum
- blueprint: device-surface-showcase
- focal: 上方 8 格即時陣列視窗追蹤條 `[1, 3, -1, -3, 5, 3, 6, 7]` 與下方 3 格步進動作紀錄（`i=0` / `i=1` 踢舊 / `i=2` 記 `res=[3]`）搭配即時狀態區。
- roles: 頂部統一模擬舞台（8格陣列＋橘色滑動範圍＋即時 `dq` 顯示＋即時 `res` 答案列）| 下方三步驟漸進拆解卡 `i=0`、`i=1`、`i=2`。

Scene 1 (0.0–11.5s): 固定模擬舞台進場，依序掃亮官方範例 `[1, 3, -1, -3, 5, 3, 6, 7]` 與 `k = 3` 條件。
Scene 2 (11.6–24.5s): `i=0 (val=1)` 步驟卡亮起，陣列第 0 格與 `dq=[0:1]` 點亮並標示 `未滿3格`；隨即 `i=1 (val=3)` 步驟卡展開，演示 `3 >= 1` 把 `0:1` 劃線踢出，`1:3 👑` 登基。
Scene 3 (24.6–34.21s): `i=2 (val=-1)` 步驟卡展開，視窗首度湊滿 3 格 `[1, 3, -1]`，`-1` 留作 `2:-1` 候補，`res = [3]` 轉綠鎖定拿到第一個答案！

## Frame 10 — 範例慢動作實戰 (2/3)：高潮轉折——頭踢過期＋尾踢清場（i = 3, 4）

- scene: 沿用同舞台演練 i=3 與高潮步驟 i=4：i=3 時負 3 保留排入隊尾 dq=[1:3,2:-1,3:-3]，res 收下第 2 個 3；接著 i=4 (值 5) 進場、左界推到 idx 2，畫面放慢分解「① 1:3 小於左界 2 從前門飛出」與「② 3:-3, 2:-1 小於 5 從後門連環踢出」，dq 換血為 [4:5]，res=[3,3,5]。
- voiceover: "接著是整題最精彩的地方！i 等於 3，負 3 進場，視窗滑到 1 到 3 號；原本的老大 1 號 3 剛好還沒出框，負 3 也比隊尾負 1 小，所以排到隊尾，答案再記一次 3。重點來了！i 等於 4，數字 5 進場，視窗左界推進到 2！第一步立刻抓到隊頭 1 號已經小於 2，請老隊長 3 從前門退休；第二步，新來的 5 比隊尾負 3 和負 1 都大，一口氣從後門全數清空，5 直接接管老大，答案收進 5！"
- duration: 33.75s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/10-walkthrough-2.html
- type: social_proof
- persuasion: Demonstration + climax reveal
- beat: Fascination + aha
- blueprint: device-surface-showcase
- focal: `i = 4` 雙門並動高潮演繹：紅標提示 `L = 2` 將 `1:3` 從前門請出，同時 `5` 從後門連環清光 `3:-3` 與 `2:-1`。
- roles: 同舞台 8 格陣列滑窗（推進至 `[2..4]`，標紅 `1 出框`）| 左卡 `i=3` 步驟與 `res=[3, 3]` | 右大型高潮卡 `i=4` 分兩階段亮起 `前門退休` + `後門清場` + `res=[3, 3, 5]`。

Scene 1 (0.0–14.0s): 左卡 `i=3 (val=-3)` 進場，陣列框置於 `[1..3]`，`1:3 👑` 仍在框內、`-3` 留尾得 `[1:3, 2:-1, 3:-3]`，`res` 收下第二個 `[3, 3]`。
Scene 2 (14.2–25.8s): 進入高潮 `i=4 (val=5)`！上方陣列窗向右移到 `[2..4]` 並標示紅色 `左界 L = 4-3+1 = 2`；STEP 1 警鈴響起：`dq.front()=1 < 2` 觸發 `1:3` 從前門 `pop_front` 紅線退場！
Scene 3 (25.9–33.75s): STEP 2 雙連擊：`5` 先後把 `3:-3` 與 `2:-1` 從後門 `pop_back` 清光，獨自 `4:5 👑` 接管老大，綠色答案收進 **`res = [3, 3, 5]`**。

## Frame 11 — 範例慢動作實戰 (3/3)：一路清場收官（i = 5, 6, 7）

- scene: 沿用同舞台演練最後三格：i=5 (值 3) 留隊 [4:5,5:3] 記 5；i=6 (值 6) 踢光 5:3 與 4:5 記 6；i=7 (值 7) 踢掉 6:6 記 7，最後全陣列一次掃完並高亮完整答案清單 res = [3, 3, 5, 5, 6, 7]。
- voiceover: "最後三格就一氣呵成了！i 等於 5，3 比 5 小先排在後面，隊頭還是 5，再記一次 5。i 等於 6，更大的 6 進場，把前面的 3 和 5 全部從隊尾踢掉，記下 6。最後 i 等於 7，7 進場踢掉 6，收進最後一個最大值 7。你看，整趟下來陣列只從左到右掃了一次，就精準拿到完整答案：3、3、5、5、6、7！"
- duration: 30.46s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/11-walkthrough-3.html
- type: social_proof
- persuasion: Demonstration + resolution
- beat: Mastery + delight
- blueprint: device-surface-showcase
- focal: 最後三格橫向快節奏推演卡 (`i=5`, `i=6`, `i=7`) 與底部逐顆點亮的完整輸出答案條 `res = [3, 3, 5, 5, 6, 7]`。
- roles: 同舞台 8 格陣列終盤位置 `[5..7]` | 三欄步進動作卡（`i=5` 保留、`i=6` 雙踢、`i=7` 登基）| 底部總收割答案清單橫幅。

Scene 1 (0.0–8.7s): 左側 `i=5 (val=3)` 進場，顯示 `3 < 5` 留下當接班人 `[4:5 👑, 5:3]`，記下第四個答案 `5`（`res = [3, 3, 5, 5]`）。
Scene 2 (8.8–20.4s): 中欄 `i=6 (val=6)` 踢光 `5:3` 與 `4:5` 記下 `6`；緊接著右欄 `i=7 (val=7)` 踢掉 `6:6` 收進 `7`。
Scene 3 (20.5–30.46s): 底部綠色收官橫幅展現「僅一次線性掃描」，6 顆答案膠囊 `3`、`3`、`5`、`5`、`6`、`7` 隨旁白點名逐顆跳亮定格！

## Frame 12 — C++ 10 行核心代碼逐行對照（附 Python）

- scene: 暖深藍 code-editorial 程式碼視窗佔左側，顯示完整且換行不裁切的 C++ `maxSlidingWindow`（11 行含 `deque<int> dq` 與 `res.reserve(n-k+1)`），右側貼出三張對應詳解卡，隨旁白逐段高亮：`if` 過期檢查（註記為何不用 `while`）、`while (<=)` 尾踢、`push_back(i)`、`i >= k - 1` 記錄與 Python API 對照。
- voiceover: "把剛才的步驟翻譯成 C++，核心竟然只要十行！先開一個存整數索引的 std::deque，再用 reserve 預先配好答案空間。迴圈裡嚴格照四個順序：第一，用 if 檢查隊頭是不是小於 i 減 k 加 1，因為每次只滑一格，最多只會過期一個，不用寫 while；第二，用 while 把小於等於 nums[i] 的隊尾全踢掉；第三，把索引 i 推進隊尾；第四，等 i 大於等於 k 減 1，就把隊頭數值收進 res。如果你寫 Python，也只要換成 deque 的 popleft 和 pop 就一模一樣！"
- duration: 34.54s
- transition_in: cut
- status: animated
- src: compositions/frames/12-cpp-code.html
- type: feature_showcase
- persuasion: Progressive disclosure + mapping
- beat: Clarity + confidence
- blueprint: panel-edit-live-sync
- focal: 左側暖深炭 `#181715` 11 行完整 C++ 核心代碼視窗（寬比例 `1.92fr`、字級 `1.75cqw` 完整零裁切）與右側逐段同步高亮解釋卡。
- roles: 左大型 `code-win` (`solution.cpp`) | 右欄三張語義卡片（① 為什麼過期用 `if` 不用 `while` ② `while <=` 單調清尾 ③ Python `collections.deque` API 速查）。

Scene 1 (0.0–10.0s): 暖深炭程式碼視窗進場，第 1–2 行 `deque<int> dq;`、`res.reserve(...)` 高亮揭示。
Scene 2 (10.1–28.5s): 隨旁白四步點讀，依次亮起程式碼高亮條與右欄卡片：`if` 除老（強調只滑一格故用 `if`）、`while <=` 尾踢（卡片 2）、`push_back(i)`、以及 `i >= k - 1` 收割隊頭。
Scene 3 (29.0–34.54s): 右下 Python 對照卡展開：`popleft()` 對應 `pop_front()`、`pop()` 對應 `pop_back()`、`append(i)` 對應 `push_back(i)`。

## Frame 13 — 面試必考追問：for 包 while 為什麼還是 O(n)？

- scene: 還原 Lab 3 門票計數器：上方陣列 [8, 6, 4, 2] 每個數字上都印著 1 顆綠點（進場券 1 次）與 1 顆紅點（離場券 1 次）；當 9 進場時 while 連踢 4 個，4 顆紅點依序打孔標記「已離場、不再回來」；右側計數儀表鎖定「總進出 <= 2n ➔ Time O(n) · Space O(k)」。
- voiceover: "面試寫完這段程式碼，面試官百分之百會追問：你這個 for 迴圈裡面還包著一個 while 迴圈，時間複雜度怎麼會是 O(n)，而不是 O(nk)？這時候用兩張門票來回答就無敵了！把每個元素想成一輩子只有兩張票：一張進場券、一張離場券。就算某一步 9 進場，一口氣連踢四個人，這四個人用完離場券之後就永遠不會再回來！所以 n 個元素全部加起來，總進出次數絕不超過 2n，均攤下來就是嚴格的 O(n)，空間則是 O(k)！"
- duration: 35.91s
- transition_in: crossfade
- status: animated
- src: compositions/frames/13-amortized-on.html
- type: benefit_highlight
- persuasion: Concretization + statistical proof
- beat: Aha + conviction
- blueprint: dataviz-countup
- focal: 每個元素的「一生兩張門票（🟢 進場券 1 次 ＋ 🔴 離場券 1 次）」演練列與右側 `總進出 <= 2n ➔ Time O(n) · Space O(k)` 證明卡。
- roles: 頂部提問句「for 包 while 為什麼不是 O(nk)？」| 左欄最壞情況示範 `[8, 6, 4, 2]` + 巨人 `9` 進場 | 右欄結論儀表板（`<= 2n`、`Time O(n)`、`Space O(k)`）。

Scene 1 (0.0–10.0s): 大字亮出面試高頻疑問：「`for` 迴圈裡包 `while`，為什麼不是 `O(nk)`？」。
Scene 2 (10.4–26.5s): 亮出門票機制與 `[8, 6, 4, 2]` 雙票標籤；第 20 秒巨人 `9` 登場，一口氣用完前方 4 人的 🔴 離場券（轉灰打叉「永不回來」）。
Scene 3 (27.0–35.91s): 右欄證明定格：`最多進出合計 <= 2n ➔ Time O(n)`，末尾補齊空間複雜度 `Space O(k)`（最多只暫存一框尺寸）。

## Frame 14 — 面試實戰保命錦囊：Heap 備案、最小值變形與 3 大地雷

- scene: 三張並排實戰錦囊卡：①「忘記 Deque 的備案」展示 Max-Heap `{nums[i], i}` 延遲刪除複雜度 `O(n log n)`；②「變形題：視窗最小值」將 `<=` 翻轉發亮成 `>=`；③「新手 3 大地雷檢查表」列出勿存數值、必寫 `!dq.empty()`、`i >= k - 1` 才存答案。
- voiceover: "最後再送你三個面試實戰保命錦囊！第一，如果面試太緊張一時忘記單調佇列，可以先寫 Max-Heap 搭配延遲刪除，把數值跟索引丟進大頂堆，雖然是 O(n log n)，但穩過不會超時；第二，如果面試官追問改成求滑動視窗最小值，只要把隊尾淘汰條件的小於等於改成大於等於，一秒搞定！第三，動手寫時千萬別踩三個坑：別存數值、取值前一定要判空、還要等 i 大於等於 k 減 1 才記答案。"
- duration: 31.47s
- transition_in: push-slide LEFT
- status: animated
- src: compositions/frames/14-interview-faq.html
- type: benefit_highlight
- persuasion: Comparison + practical guardrails
- beat: Foresight + confidence
- blueprint: grid-card-assemble
- focal: 橫向三張大型實戰錦囊卡（① Max-Heap 退路 ② 改求最小值反轉符號 ③ 新手 3 大地雷警報條）。
- roles: Card 1 應急替代方案 | Card 2 變形題秒答對照（`<= ➔ >=`）| Card 3 上機防錯紅框清單（3 項逐一跳亮）。

Scene 1 (0.0–13.9s): Title bar 開場，Card 1「忘記 Deque 的穩過備案」展開：`priority_queue<{val, idx}>` + 延遲刪除 `O(n log n)`。
Scene 2 (14.0–21.5s): Card 2「面試追問變形：滑動視窗最小值」展開，中心算符由 `<=` 發亮翻轉為 `>=`（改為單調遞增佇列）。
Scene 3 (22.3–31.47s): Card 3「新手 3 大地雷」三行警報隨口播順序逐條亮紅提示：✗ 直接存數值、✗ 忘寫 `!dq.empty()`、✗ `i < k - 1` 搶記答案。

## Frame 15 — 一張圖帶走：三步口訣定格複習

- scene: 暖米白極簡定格記憶頁：上方標題「存索引不存值 · 單調遞減雙端佇列」，中央三張核心口訣卡「① 頭出框就踢 (`pop_front`) · ② 尾比我小就踢 (`pop_back`) · ③ 隊頭就是答案 (`nums[dq.front()]`)」，下方一行鎖定「Time O(n) · Space O(k) · LeetCode 239」。
- voiceover: "最後十秒幫你定格複習：存索引不存值，每一輪頭出框就踢、尾比我小就踢、湊滿 k 格隊頭就是答案！記住這套單調雙端佇列模板，下次面試遇到 LeetCode 239，就能穩穩用 O(n) 一次寫過！"
- duration: 16.88s
- transition_in: crossfade
- status: animated
- src: compositions/frames/15-recap.html
- type: branding
- persuasion: Callback + distillation
- beat: Mastery + satisfaction
- blueprint: titlecard-reveal
- focal: 置中 5.1cqw 主結語「存索引不存值 · 單調遞減雙端佇列」與橫排三張終極口訣鎖定牌。
- roles: 置中主標題與副標 | 橫向 3 枚精簡口訣卡片 | 底部複雜度簽章條（`Time O(n) · Space O(k)`），最後數秒安靜定格收尾。

Scene 1 (0.0–8.5s): 中央 5.1cqw 主標題揭示「存索引不存值 · 單調遞減雙端佇列」，三枚口訣卡片隨旁白「頭出框就踢 / 尾比我小就踢 / 隊頭就是答案」依序點亮。
Scene 2 (8.9–16.88s): 底部單調深調鎖定條「Time O(n) · Space O(k) · 一次掃描拿下 LeetCode 239」浮現並純淨靜止留白至片尾。

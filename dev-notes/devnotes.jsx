export const devNotes = [
  {
    id: 2,
    date: '2025-04-04',
    tags: ['資料清理'],
    title: 'Know Your Data: False Assumption on The Data Can Trip You',
    summary: '蒐集和清理 podcast 資料時的小趣事 (崩潰🫠)，與資深老粉才知道的 podcast 集數問題。',
    content: `# Know Your Data: False Assumption on The Data Can Trip You
這個專案中的 podcast 資料主要來自 SoundOn 跟 Spotify。由於資料格式比較混亂，而且重複爬取的機會不高（一週一集且需要的資料不多，暫時手動加即可），所以基本上是用 Python script 加工人智慧快速整理，再以集數排序一遍而已。

但在網頁都寫完了，最後人工 review 準備部署的時候才發現，集數跟標題竟然對不上！

> 如果猜得到問題出在哪的話，肯定是資深老粉 XD
> 
> 我已經重刷 7~8 次了，都沒特別注意到這個問題。

問題出在：
- 你知道 EP60 有兩集嗎？它們的集數是「EP60_1」和「EP60_2」。
- 你知道沒有 EP27 嗎？這集因為「用太輕鬆的口吻講鄰居弟弟故事」事件，阿斷在幫標題加註的時候不小心手殘誤刪。詳情可聽 EP28 開頭（ps：可以到 Timecode 頁面直接聽喔！）

最後把已經整理好的資料格式全部打掉，開獨立的 id 欄位，並把集數的型別從 Number 改成 String，網頁的 code 也是改了大半才處理好。**清理資料時，需要先檢查自己對資料的假設，驗證過後再開始寫應用，不然中途改資料格式真的超崩潰...。**

---- by 資深好味粉角 🧊
`,
  },
  {
    id: 1,
    date: '2025-04-03',
    tags: ['感謝'],
    title: 'The Beginning: Why I Start This Project & Acknowledgments to the Community',
    summary: '開始做這個 side project 的動機，以及感謝好味社群整理的詳細資料。',
    content: `# The Beginning: Why I Start This Project & Acknowledgments to the Community
最初做這個專案的動機是因為當時在自學 NLP，想找個題目來練習刻學到的各種演算法，同時希望能更貼近實際應用時會遇到的情境，因此決定不使用現成的資料集，而是從蒐集資料開始從頭做起。因為平時很常聽好味 podcast ，所以就直接以此為目標。
實際做下去才發現坑好多好大，資料集弄到一半，想說都整理了，好像可以搞個網頁，結果就花了一堆時間在 vibe coding 網頁 XD （發現自己真的是前端 + UI 苦手...）。
希望可以盡快把網頁告一段落，然後回頭去整理逐字稿，重新繼續 NLP 的研究。

最後，在此感謝陳亞（好味Line社群的熊熊）、Line 社群的我也想當一顆蕾夢、好味粉，和其他好味社群成員共同整理的[Podcast timecode 目錄](https://docs.google.com/document/d/1OcOFIrW8E7Olt6hkEBPtNTOhgYOEMorK3e8iquSp01Q)、[哼猜學堂](https://docs.google.com/spreadsheets/d/1jeXH7BUyFj5VFDdQL_HBApARkfpq5f1x1PA7l_TWKCg) Google 文件，此網站大多數的資料都是來自於此。當然，也要感謝好味三人組錄這麼好聽的 podcast。

---- by 資深好味粉角 🧊
`,
  },
];

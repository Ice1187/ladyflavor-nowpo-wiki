
## Transcribing
- openai-whisper model large
```bash
for f in audios/*; do
  output_file="transcripts/$(basename "${f%.*}.txt")"
  if [ ! -f "$output_file" ]; then
    whisper --model large --output_dir transcripts -f all --language zh --initial_prompt '嗨 大家好 歡迎來到好味小姐開束縛 我還你原型' --device cuda "$f"
  else
    echo "Skipping $f, corresponding transcript already exists."
  fi
done
```

## Might Be Useful
- NLP Research
  - [中文詞彙網路 by LOPE @ NTU](https://lopentu.github.io/CwnWeb/)
  - [NER by CKIP Lab @ sinica](https://ckip.iis.sinica.edu.tw/project/ner)
- Lady Flavor Fans
  - [Dcard 好味小姐版](https://www.dcard.tw/f/ladyflavor)
  - [好味Podcast timecode](https://docs.google.com/document/d/1OcOFIrW8E7Olt6hkEBPtNTOhgYOEMorK3e8iquSp01Q/edit#heading=h.ci4rwf2rz0jf)
  - [腦波弱頻道 影片timecode](https://docs.google.com/document/d/1I0l976mZZqDftVVj7Xm8sxN0kL3PoY7k8ELVoEgAbEc/edit)
  - 據說有粉絲整理的逐字稿?

## TODO
- [x] use small LM to translate China Chinese to Taiwan Chinese -> OpenCC
- [ ] missing transcritps of episode 4-9, 27, 50-99, 223
- [x] there are episodes `60_1` and `60_2`, fuck

### Single episode
- [ ] main topic
- [ ] topic tags (main topic + subtopics, like Gaole, 體檢)
- [x] timecode of certain discussion
- [x] Full text search
- [ ] Word Cloud

### Cross episode
- [ ] reocurring topics (國小作文100題、排泄)
- [x] Full text search -> ckiptagger + mongodb text search
- [ ] Trend / Topic of Year
- [ ] Word Cloud
- [ ] Guess episode by keywords
  ```
  Top 5 keywords in episode 1: 面試, 公司, 工作, 問題, 設計
  Top 5 keywords in episode 2: 蜈蚣, 蟑螂, 馬路, 壁虎, 尾巴
  Top 5 keywords in episode 3: 牙刷, 牙齒, 刷牙, 舞龍, 舞獅
  Top 5 keywords in episode 4: 遊戲, crush, candy, 抽到, 角色
  Top 5 keywords in episode 5: 上廁所, 大便, 褲子, 衣服, 便秘
  ```
- [ ] NER to recognize podcaster and their pets?

### General Improvement
- [ ] Build feedback pipeline (timecode, tags)
- [ ] Guideline of providing feedback for non-technical audience, who don't know how to use GitHub
- [ ] Mapping wrong words to correct words
```
好位小姐 -> 好味小姐
開束服 -> 開束縛
deco -> 短褲
秋規 -> 秋葵
蜜香 -> 米香
碼碼 -> 媽媽
翠翠   -> 脆脆
崔崔   -> 脆脆
陳翠安 -> 陳脆安
陳春彩 -> 陳脆安
陳川   -> 陳脆安
陳彈   -> 陳脆安
陳帥   -> 陳脆安
宥偉帆 -> 尤葦帆
宥帆   -> 尤葦帆
游偉帆 -> 尤葦帆
游蕙凡 -> 尤葦帆
黃連夢 -> 黃蕾夢
黃一夢 -> 黃蕾夢
雷姆 -> 蕾夢
孟孟 -> 夢夢
氣婆 -> 氣泡

# trivial
找鳥 -> 早鳥
暈喘 -> 暈船
企鵝不舍 -> 鍥而不捨
極幻式 -> 集換式
麒麟王 -> 棋靈王
遊戲網 -> 遊戲王
傑克摩托 -> 傑克與魔豆
惠本 -> 繪本
```

## 免責聲明與歸屬 / Disclaimer and Attribution
本專案包含使用 OpenAI 的 Whisper 模型從好味小姐開束縛 podcast 生成的文字稿。請注意以下事項：

所有權：我並不擁有 podcast 內容或文字稿的所有權。Podcast 及其內容的所有權均屬於該節目的原創作者和主持人。

用途：提供此文字稿僅為方便聽眾及 podcast 創作者使用。目的是為了支持那些偏好或需要文本格式的使用者能夠更容易地獲取節目內容。

非商業用途：此文字稿無意用於商業用途。它僅作為一種公開資源，旨在支持 podcast 內容的傳播。

內容準確性：此文字稿由自動化工具生成，可能包含錯誤或不準確之處。建議您參考原始 podcast 以獲取最準確的內容表達。

如果您是此 podcast 創作者或權利持有人，對於公開此文字稿有任何疑慮，請聯絡我，我將盡快處理您的問題。

This repository contains a transcript generated from the audio of 好味小姐開束縛 podcast using OpenAI's Whisper model. Please note the following:

Ownership: I do not own the content of the podcast or the transcript. All rights to the podcast and its content are owned by the original creators and hosts of the podcast.

Purpose: The transcript is provided here solely for the convenience of the audience and the creators of the podcast. It is intended to facilitate access to the content for those who prefer or require a text-based format.

No Commercial Use: This transcript is not intended for commercial use. It is made available as a public resource to support the dissemination of the podcast's content.

Content Accuracy: The transcript was automatically generated and may contain errors or inaccuracies. It is recommended to refer to the original podcast audio for the most accurate representation of the content.

If you are the creator or rights holder of the podcast and have any concerns about this transcript being publicly available, please contact me, and I will address your concerns promptly.

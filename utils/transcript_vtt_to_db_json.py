import os
import re
import json
from sys import argv
import opencc
import webvtt
from tokenizer import get_ws_model, tokenize_sentences


def main():
  if len(argv) < 2:
    print(f'{argv[0]} transcript1.vtt [transcript2.vtt ...]')
    return

  transcript_files = argv[1:]

  ws = get_ws_model('./ckiptagger/data')
  s2tw_converter = opencc.OpenCC('s2tw.json')
  output = []
  for transcript_file in transcript_files:
    if not transcript_file.endswith('.vtt'):
      print(f'{transcript_file} is not a .vtt')
      continue

    title = os.path.splitext(os.path.basename(transcript_file))[0]
    episode_id = int(re.search(r'EP(\d+)', title).group(1))
    captions = webvtt.read(transcript_file)

    timecodes = []
    texts = []
    for caption in captions:
      timecodes.append(caption.start[:-4])  # remove the floating parts of second
      text = s2tw_converter.convert(caption.text.strip())
      texts.append(text)
    tokenized_texts = tokenize_sentences(texts, ws)

    output.append({
      'episode_id': episode_id,
      'title': title,
      'transcript': [
        {'timecode': timecode, 'text': text} for timecode, text in zip(timecodes, tokenized_texts)
      ]
    })

  with open('episodes.json', 'w') as f:
    json.dump(output, f)

  print('[+] Dump to episodes.json')
  print('''
[*] To import episodes.json to Mongodb:
  1. docker cp ./episodes.json mongodb:/episodes.json
  2. docker exec -it mongodb bash
  3. mongoimport --db podcast_analysis --collection episodes --file /episodes.json --jsonArray

[*] To create text index for full text search:
  1. docker exec -it mongodb mongosh
  2. use podcast_analysis
  3. db.episodes.createIndex({ transcript: "text" })
''')

main()

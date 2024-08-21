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
  #s2tw_converter = opencc.OpenCC('s2tw.json')
  output = []
  for transcript_file in transcript_files:
    if not transcript_file.endswith('.vtt'):
      print(f'{transcript_file} is not a .vtt')
      continue

    title = os.path.splitext(os.path.basename(transcript_file))[0]
    # Capture the episode number and optional part, e.g., 60_1 and 60_2
    episode_match = re.search(r'EP(\d+)(?:_(\d+))?', title)
    # Extract episode number
    episode_number = int(episode_match.group(1))
    # Extract episode part, or default to 1 if not present
    episode_part = int(episode_match.group(2)) if episode_match.group(2) else None

    captions = webvtt.read(transcript_file)
    timecodes = []
    texts = []
    for caption in captions:
      timecodes.append(caption.start[:-4])  # remove the floating parts of second
      #text = s2tw_converter.convert(caption.text.strip())
      texts.append(caption.text.strip())
    tokenized_texts = tokenize_sentences(texts, ws)

    output.append({
      'episode_number': episode_number,
      'episode_part': episode_part,
      'title': title,
      'transcript': [
        {'timecode': timecode, 'text': text} for timecode, text in zip(timecodes, tokenized_texts)
      ]
    })

  with open('episodes.json', 'w') as f:
    json.dump(output, f)

#  print('[+] Dump to episodes.json')
#  print('''
#[*] To import episodes.json to Mongodb:
#  1. docker cp ./episodes.json mongodb:/episodes.json
#  2. docker exec -it mongodb bash
#  3. mongoimport --db podcast_analysis --collection episodes --file /episodes.json --jsonArray
#
#[*] To create text index for full text search:
#  1. docker exec -it mongodb mongosh
#  2. use podcast_analysis
#  3. db.episodes.createIndex({ transcript: "text" })
#''')

main()

import os
import re
import json
from sys import argv
import opencc
from tokenizer import get_ws_model, tokenize_sentences


def tokenize_transcript(transcript, ws):
  sentence_list = transcript.split('\n')
  tokenized_transcript = tokenize_sentences(sentence_list, ws)
  return tokenized_transcript

def get_ep_title_transcript(transcript_file, ws, s2tw_converter):
  title = os.path.splitext(os.path.basename(transcript_file))[0]
  episode_id = re.search(r'EP(\d+)', title).group(1)
  with open(transcript_file, 'r') as f:
    transcript = f.read().strip()
  #print(episode_id, title, transcript[:30])
  transcript = s2tw_converter.convert(transcript)
  tokenized_transcript = tokenize_transcript(transcript, ws)
  return episode_id, title, tokenized_transcript


def main():
  if len(argv) < 2:
    print(f'./transcript_to_db_json.py transcript1.txt [transcript2.txt ...]')
    return

  transcript_files = argv[1:]

  ws = get_ws_model('./ckiptagger/data')
  s2tw_converter = opencc.OpenCC('s2tw.json')
  output = []
  for transcript_file in transcript_files:
    if not transcript_file.endswith('.txt'):
      print(f'{transcript_file} is not a .txt')
      continue

    episode_id, title, tokenized_transcript = get_ep_title_transcript(transcript_file, ws, s2tw_converter)

    output.append({
      'episode_id': episode_id,
      'title': title,
      'transcript': tokenized_transcript
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

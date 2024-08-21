import os
from pathlib import Path
import opencc
import difflib

s2tw_converter = opencc.OpenCC('s2tw.json')
s2twp_converter = opencc.OpenCC('s2twp.json')

def show_tw_twp():
  with open('../transcripts/EP222 該把錢變成誰喜歡的樣子？.txt', 'r') as f:
    data = f.read()

  s2tw = s2tw_converter.convert(data)
  s2twp = s2twp_converter.convert(data)

  diff = difflib.unified_diff(s2tw.splitlines(), s2twp.splitlines())

  print('\n'.join(diff))

def main():
  for transcript_file in Path('../transcripts/').glob('EP*.txt'):
    print(transcript_file)
    with open(transcript_file, 'r') as f:
      data = f.read()

    tw_data = s2tw_converter.convert(data)
    #print(tw_data[-200:])

    output_file = str(transcript_file).replace('transcripts', 'tw_transcripts')
    if os.path.exists(output_file):
      continue

    with open(output_file, 'w') as f:
      f.write(tw_data)
    print(output_file, 'done')


main()

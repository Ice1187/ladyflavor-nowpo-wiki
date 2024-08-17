import opencc
import difflib

s2tw_converter = opencc.OpenCC('s2tw.json')
s2twp_converter = opencc.OpenCC('s2twp.json')

with open('../transcripts/EP222 該把錢變成誰喜歡的樣子？.txt', 'r') as f:
  data = f.read()

s2tw = s2tw_converter.convert(data)  # 漢字
s2twp = s2twp_converter.convert(data)  # 漢字

diff = difflib.unified_diff(s2tw.splitlines(), s2twp.splitlines())

print('\n'.join(diff))

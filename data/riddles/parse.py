with open('./data.txt') as f:
  lines = f.read().strip().split('\n')

categories = lines[0].strip().split('\t')
riddles = []

for line in lines[1:]:
  data = line.strip().split('\t')

  if len(data) % 2 != 0:
    print('[!] Broken:', data)
    data.append('')

  for cid, (ep, question) in enumerate(zip(data[0::2], data[1::2])):
    riddle = {
      'ep': ep,
      'question': question,
      'category': categories[cid]
    }
    riddles.append(riddle)

#riddles = sorted(riddles, key=lambda x: int(x['id'][2:]))

print('export const riddles = [')
for id_, riddle in enumerate(riddles):
  ep = riddle['ep']
  question = riddle['question']
  category = riddle['category']
  print(f'  {{ id: "{id_}", episode: "{ep}", question: "{question}", category: "{category}", answer: ""}},')
print(']')

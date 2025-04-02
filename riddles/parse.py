with open('./data.txt') as f:
  lines = f.read().strip().split('\n')

categories = lines[0].strip().split('\t')
riddles = []

for line in lines[1:]:
  data = line.strip().split('\t')

  if len(data) % 2 != 0:
    print('[!] Broken:', data)
    data.append('')

  for i, (ep, question) in enumerate(zip(data[0::2], data[1::2])):
    riddle = {
      'id': ep,
      'question': question,
      'category': categories[i]
    }
    riddles.append(riddle)

#riddles = sorted(riddles, key=lambda x: int(x['id'][2:]))

#print('export const riddles = [')
#for riddle in riddles:
#  id = riddle['id']
#  question = riddle['question']
#  category = riddle['category']
#  print(f'  {{ id: "{id}", question: "{question}", category: "{category}", answer: ""}}')
#print(']')

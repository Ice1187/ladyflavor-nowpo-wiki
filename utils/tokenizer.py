import os
import sys
import time

# Suppress as many warnings as possible
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "3"
from tensorflow.python.util import deprecation
deprecation._PRINT_DEPRECATION_WARNINGS = False
import tensorflow as tf
tf.compat.v1.logging.set_verbosity(tf.compat.v1.logging.ERROR)

from ckiptagger import data_utils, construct_dictionary, WS, POS, NER


def get_ws_model(data_dir):
  return WS(data_dir)

def tokenize_sentences(sentence_list, ws):
    word_sentence_list = ws(
      sentence_list,
      sentence_segmentation=True,
      segment_delimiter_set = {",", "。", ":", "?", "!", ";", ' '}
    )
    stripped_word_sentence_list = [[word for word in words if word.strip()] for words in word_sentence_list]
    return [' '.join(words) for words in stripped_word_sentence_list]
    #word_sen = [word for word_sentence in word_sentence_list for word in word_sentence if word.strip()]
    #return ' '.join(words)


def main():
    if len(sys.argv) != 3:
      print('./tokenize.py ./ckiptagger/data transcript.txt')
      return

    data_dir = sys.argv[1]
    transcript_file = sys.argv[2]

    # Download data
    if not os.path.exists(data_dir) and not os.path.exists(f'{data_dir}.zip'):
      print(f'[!] {data_dir} not exist')
      return

    # Load model without GPU
    #ws = WS(data_dir)
    #pos = POS(data_dir)
    #ner = NER(data_dir)
    ws = get_ws_model(data_dir)
    
    # Load model with GPU
    # ws = WS("./data", disable_cuda=False)
    # pos = POS("./data", disable_cuda=False)
    # ner = NER("./data", disable_cuda=False)
    
    # Create custom dictionary
    word_to_weight = {
        "土地公": 1,
        "土地婆": 1,
        "公有": 2,
        "": 1,
        "來亂的": "啦",
        "緯來體育台": 1,
    }
    dictionary = construct_dictionary(word_to_weight)
    #print(dictionary)
    
    # Run WS-POS-NER pipeline
    with open(transcript_file, 'r') as f:
      sentence_list = f.read().strip().split('\n')

    
    word_sentence_list = tokenize_sentences(sentence_list, ws)
    # word_sentence_list = ws(sentence_list, sentence_segmentation=True)
    # word_sentence_list = ws(sentence_list, recommend_dictionary=dictionary)
    # word_sentence_list = ws(sentence_list, coerce_dictionary=dictionary)
    #pos_sentence_list = pos(word_sentence_list)
    #entity_sentence_list = ner(word_sentence_list, pos_sentence_list)
    
    # Release model
    del ws
    #del pos
    #del ner
    
    # Show results
    #def print_word_pos_sentence(word_sentence, pos_sentence):
    #    assert len(word_sentence) == len(pos_sentence)
    #    for word, pos in zip(word_sentence, pos_sentence):
    #        print(f"{word}({pos})", end="\u3000")
    #    print()
    #    return
    #
    #for i, sentence in enumerate(sentence_list):
    #    print()
    #    print(f"'{sentence}'")
    #    print_word_pos_sentence(word_sentence_list[i],  pos_sentence_list[i])
    #    for entity in sorted(entity_sentence_list[i]):
    #        print(entity)
    for i, sentence in enumerate(sentence_list):
        print()
        print(f"'{sentence}'")
        for word in word_sentence_list[i]:
          print(word, end=',')


if __name__ == '__main__':
  main()

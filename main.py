import os
import requests
import xml.etree.ElementTree as ET

def get_episodes(rss_feed_url):
  response = requests.get(rss_feed_url)
  root = ET.fromstring(response.content)
  namespaces = {'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'}

  episodes = []
  for i, item in enumerate(root.findall('.//item')):
      title = item.find('title').text
      audio_url = item.find('enclosure').attrib['url']
      if not title:
        print(f'[*] missing title of episode {i}')
      if not audio_url:
        print(f'[*] missing audio_url of episode {i}')
      episodes.append({'title': title, 'audio_url': audio_url})

  return episodes


def download_episodes(episodes, audio_dir='audios'):
  os.makedirs(audio_dir, exist_ok=True)
  for episode in episodes:
    title, audio_url = episode['title'], episode['audio_url']

    audio_filename = f"{title}.mp3"
    audio_filepath = os.path.join(audio_dir, audio_filename)

    if os.path.exists(audio_filepath):
        print(f"'{audio_filename}' already exists. Skipping download.")
        continue

    print(f"Downloading '{title}' from {audio_url}...")
    response = requests.get(audio_url, stream=True)

    with open(audio_filepath, 'wb') as audio_file:
        for chunk in response.iter_content(chunk_size=1024):
            if chunk:
                audio_file.write(chunk)

    print(f"'{audio_filename}' downloaded successfully.")




def main():
  rss_feed_url = 'https://feeds.soundon.fm/podcasts/adf29720-e93b-4856-a09e-b73544147ec4.xml'
  episodes = get_episodes(rss_feed_url)
  #download_episodes(episodes)


main()

import json
from tokenizer import get_ws_model, tokenize_sentences
from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["podcast_analysis"]
collection = db["episodes"]

# Example list of episode data (list of dictionaries)
with open('episodes.json', 'r') as f:
    episode_data_list = json.load(f)

# Loop through the list and upsert each episode
for episode_data in episode_data_list:
    collection.update_one(
        {"episode_id": episode_data["episode_id"]},  # Query to match existing document
        {"$set": episode_data},  # Update with new data
        upsert=True  # Insert if it does not exist
    )

# Ensure the text index exists for full-text search
collection.create_index([("transcript", "text")])

# Example full-text search
query = "好味小姐"
query = tokenize_sentences([query], get_ws_model('./ckiptagger/data'))
results = collection.find({"$text": {"$search": query}})
for result in results:
    print(result['title'])


import json
from pymongo import MongoClient, UpdateOne

# MongoDB connection setup (modify as per your credentials)
client = MongoClient("mongodb://localhost:27017/")
db = client["podcast_db"]  # Database name
episodes_collection = db["episodes"]  # Collection for episodes
search_index_collection = db["search_index"]  # Collection for full-text search

# Load the list of episodes from the JSON file
def load_episodes_data(json_file):
    with open(json_file, 'r', encoding='utf-8') as file:
        return json.load(file)

# Upsert each episode in the list into the episodes collection
def upsert_episodes_data(episodes_list):
    for episode_data in episodes_list:
        # Upsert based on episode_number
        result = episodes_collection.update_one(
            {
                "episode_number": episode_data["episode_number"],
                "episode_part": episode_data['episode_part']
            },  # Query by episode_number
            {"$set": episode_data},  # Set the episode data
            upsert=True  # Insert if it does not exist
        )
        print(f"Episode {episode_data['episode_number']} upserted. {result.modified_count} document(s) modified.")
        upsert_search_index_data(episode_data)  # Upsert the search index for the episode

# Upsert search index data for each episode (one document per transcript segment)
def upsert_search_index_data(episode_data):
    bulk_ops = []
    episode = episodes_collection.find_one(
        {"episode_number": episode_data["episode_number"], "episode_part": episode_data['episode_part']},
        {"_id": 1, "episode_number": 1}
    )

    for transcript in episode_data["transcript"]:
        search_index_doc = {
            "episode_id": episode['_id'],
            "episode_number": episode['episode_number'],
            "timecode": transcript["timecode"],
            "text": transcript["text"],
            #"topics": transcript["topics"]
        }
        bulk_ops.append(UpdateOne(
            {"episode_id": episode['_id'], "timecode": transcript["timecode"]},  # Query by episode and timecode
            {"$set": search_index_doc},  # Set the document
            upsert=True  # Insert if it does not exist
        ))
    
    if bulk_ops:
        result = search_index_collection.bulk_write(bulk_ops)
        print(f"Search index for episode {episode_data['episode_number']} upserted: {result.modified_count} document(s) modified.")

def create_full_text_search_index():
    search_index_collection.create_index([("text", "text")])
    print("Full-text search index created on 'text' field.")


# Perform a demo query to check if data is correctly uploaded
def perform_demo_query(episode_number):
    episode = episodes_collection.find_one({"episode_number": episode_number})
    if episode:
        print(f"Episode {episode_number} found: {episode['title']}")
        #print("Topics:", episode["topics"])
        print("Sample Transcript:", episode["transcript"][0])
    else:
        print(f"Episode {episode_number} not found.")

# Main function to load data, upsert, and verify
def main():
    json_file = 'episodes.json'  # Path to your JSON file containing list of episodes
    episodes_data = load_episodes_data(json_file)

    print("Creating full-text search index...")
    create_full_text_search_index()  # Create the full-text index

    print("Upserting episodes data...")
    upsert_episodes_data(episodes_data)

    print("Performing demo query...")
    perform_demo_query(episodes_data[0]["episode_number"])  # Check the first episode as a sample

if __name__ == "__main__":
    main()


from app import mongo
import re
from bson import ObjectId

# FIXME: Function to fetch topics by episode ID
def get_topics_by_episode(episode_number):
  episode = mongo.db.episodes.find_one({"episode_number": episode_number}, {"topics": 1})
  if episode:
    return episode.get("topics", [])
  return []

# Function to fetch episode by episode number
def get_episode_by_number(episode_number):
    try:
        episode = mongo.db.episodes.find_one({"episode_number": episode_number})
        return episode
    except Exception as e:
        print(f"Error fetching episode: {e}")
        return None

def highlight_terms(text, query_terms):
    # Escape special characters in query terms
    escaped_terms = [re.escape(term) for term in query_terms]

    # Create a regex pattern to match all query terms (case-insensitive)
    pattern = re.compile(r'(' + '|'.join(escaped_terms) + r')', re.IGNORECASE)

    # Replace matched terms with <mark> tag for highlighting
    highlighted_text = pattern.sub(r'<span style="color: red; font-weight: bold;">\1</span>', text)

    return highlighted_text

# Function to perform full-text search on transcripts from the search_index collection
def search_transcripts(query, episode_number=None, episode_id=None):
    search_filter = {"$text": {"$search": query}}  # Default search filter

    # Add episode number or episode_id to the filter if provided
    if episode_number:
        search_filter["episode_number"] = episode_number
    elif episode_id:
        search_filter["episode_id"] = ObjectId(episode_id)

    # Perform text search on the search_index collection
    search_results = mongo.db.search_index.find(
        search_filter,  # Apply the filter with episode criteria
        {"score": {"$meta": "textScore"}, "episode_id": 1, "text": 1, "timecode": 1}  # Include relevant fields
    ).sort([("score", {"$meta": "textScore"})])  # Sort by textScore

    results_with_snippets = []
    for result in search_results:
        transcript_text = result.get("text", "")
        query_terms = query.split()

        # Find the first occurrence of any query term in the transcript
        snippet_start = min((transcript_text.find(term) for term in query_terms if transcript_text.find(term) != -1), default=0)

        # Extract 200 characters around the first found term
        start = max(0, snippet_start - 100)
        end = start + 200

        snippet = transcript_text[start:end] + "..." if len(transcript_text) > end else transcript_text[start:]
        highlighted_snippet = highlight_terms(snippet, query_terms)

        # Fetch episode details using episode_id
        episode = mongo.db.episodes.find_one({"_id": result["episode_id"]}, {"episode_number":1, "title": 1})

        # Append result with the snippet and episode title
        result_with_snippet = {
            "episode_number": episode.get("episode_number", -1),
            "timecode": result["timecode"],
            "snippet": highlighted_snippet,
            "episode_title": episode.get("title", "Unknown Title")
        }
        results_with_snippets.append(result_with_snippet)

    return results_with_snippets

#def search_transcripts(query):
#    # Perform text search on the search_index collection
#    search_results = mongo.db.search_index.find(
#        {"$text": {"$search": query}},  # Text search on the `text` field
#        {"score": {"$meta": "textScore"}, "episode_id": 1, "text": 1, "timecode": 1}  # Include the score, episode_id, text, and timecode
#    ).sort([("score", {"$meta": "textScore"})])  # Sort by textScore
#
#    # Process each result to extract relevant text snippet
#    results_with_snippets = []
#    for result in search_results:
#        transcript_text = result.get("text", "")
#        query_terms = query.split()
#
#        # Find the first occurrence of any query term in the transcript
#        snippet_start = min((transcript_text.find(term) for term in query_terms if transcript_text.find(term) != -1), default=0)
#
#        # Extract 200 characters around the first found term
#        start = max(0, snippet_start - 100)  # Start 100 chars before the found term
#        end = start + 200  # Extract 200 characters
#
#        snippet = transcript_text[start:end] + "..." if len(transcript_text) > end else transcript_text[start:]
#        highlighted_snippet = highlight_terms(snippet, query_terms)
#
#        # Fetch the corresponding episode details using episode_id
#        episode = mongo.db.episodes.find_one({"_id": result["episode_id"]}, {"title": 1, "episode_id": 1})
#
#        # Append result with the snippet and episode title
#        result_with_snippet = {
#            "episode_id": episode.get("episode_id", -1),
#            "timecode": result["timecode"],
#            "snippet": highlighted_snippet,
#            "episode_title": episode.get("title", "Unknown Title")
#        }
#        results_with_snippets.append(result_with_snippet)
#
#    return results_with_snippets

# Function to fetch trend data
def get_trend_data():
  # For example, fetching word clouds and most discussed topics (simplified)
  trend_data = mongo.db.trends.find_one()  # Assuming trend data is precomputed and stored in the DB
  return trend_data


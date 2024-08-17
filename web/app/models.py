from app import mongo
import re

# Function to fetch topics by episode ID
def get_topics_by_episode(episode_id):
  episode = mongo.db.episodes.find_one({"episode_id": episode_id}, {"topics": 1})
  if episode:
    return episode.get("topics", [])
  return []

# Function to fetch timecodes by episode ID
def get_timecodes_by_episode(episode_id):
  episode = mongo.db.episodes.find_one({"episode_id": episode_id}, {"timecodes": 1})
  if episode:
    return episode.get("timecodes", [])
  return []

def highlight_terms(text, query_terms):
    # Escape special characters in query terms
    escaped_terms = [re.escape(term) for term in query_terms]

    # Create a regex pattern to match all query terms (case-insensitive)
    pattern = re.compile(r'(' + '|'.join(escaped_terms) + r')', re.IGNORECASE)

    # Replace matched terms with <mark> tag for highlighting
    highlighted_text = pattern.sub(r'<span style="color: red; font-weight: bold;">\1</span>', text)

    return highlighted_text

# Function to perform full-text search on transcripts
def search_transcripts(query):
  search_results = mongo.db.episodes.find(
    {"$text": {"$search": query}},  # Text search
    {"score": {"$meta": "textScore"}}  # Include the score in the returned documents
  ).sort([("score", {"$meta": "textScore"})])  # Sort by textScore

  # Process each result to extract relevant text snippet
  results_with_snippets = []
  for result in search_results:
    transcript = result.get("transcript", "")

    # Find the first occurrence of any query term in the transcript
    query_terms = query.split()
    snippet_start = min((transcript.find(term) for term in query_terms if transcript.find(term) != -1), default=0)

    # Extract 200 characters around the first found term
    start = max(0, snippet_start - 100)  # Start 100 chars before the found term
    end = start + 200  # Extract 200 characters

    snippet = transcript[start:end] + "..." if len(transcript) > end else transcript[start:]
    highlighted_snippet = highlight_terms(snippet, query_terms)

    # Append result with the snippet
    result["snippet"] = highlighted_snippet
    results_with_snippets.append(result)

  return results_with_snippets


# Function to fetch trend data
def get_trend_data():
  # For example, fetching word clouds and most discussed topics (simplified)
  trend_data = mongo.db.trends.find_one()  # Assuming trend data is precomputed and stored in the DB
  return trend_data


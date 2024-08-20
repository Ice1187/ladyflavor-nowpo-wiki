from flask import render_template, request
from app import app, mongo, ws
from app.models import get_topics_by_episode, get_episode_by_id, search_transcripts, get_trend_data

# Home route to list all episodes
@app.route('/')
def episodes():
    # Fetch all episodes, only selecting necessary fields
    all_episodes = mongo.db.episodes.find({}, {"episode_id": 1, "title": 1, "topics": 1})
    return render_template('episodes.html', episodes=all_episodes)

# Route for displaying topics discussed in an episode
@app.route('/topics/<episode_id>')
def topics(episode_id):
    episode_topics = get_topics_by_episode(episode_id)
    return render_template('topics.html', topics=episode_topics, episode_id=episode_id)

# Route for displaying timecodes and tags for a specific episode
@app.route('/timecode/<int:episode_id>')
def timecode(episode_id):
    episode = get_episode_by_id(episode_id)
    if episode:
        timecodes = episode.get("transcript", [])
        return render_template('timecode.html', timecodes=timecodes, episode_title=episode.get('title'), episode_id=episode_id)
    else:
        return render_template('timecode.html', timecodes=[], episode_title="Unknown Episode", episode_id=episode_id)

# Route for full-text search
@app.route('/search', methods=['GET', 'POST'])
def search():
    search_results = []
    if request.method == 'POST':
        query = request.form.get('query')
        # Tokenize the query (if required by ws) and pass to the search function
        tokenized_query = ' '.join(ws([query])[0])
        search_results = list(search_transcripts(tokenized_query))
        with open('/tmp/aaa', 'w') as f:
          f.write(str(search_results))

        # Adjust search results to match the updated search.html template with timecode and sentence (snippet) side by side
        #for result in search_results:
        #    result['episode_title'] = result.get('episode_title', 'Unknown Title')
        #    result['timecode'] = result.get('timecode', '00:00:00')
        #    result['snippet'] = result.get('snippet', '')

    return render_template('search.html', results=search_results)

# Route for displaying trends and analysis
@app.route('/trend')
def trend():
    trend_data = get_trend_data()
    return render_template('trend.html', trend_data=trend_data)


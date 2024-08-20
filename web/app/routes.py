from flask import render_template, request
from app import app, mongo, ws
from app.models import get_topics_by_episode, get_episode_by_number, search_transcripts, get_trend_data

# Home route to list all episodes
@app.route('/')
def episodes():
    # Fetch all episodes, only selecting necessary fields
    all_episodes = mongo.db.episodes.find({}, {"episode_number": 1, "title": 1, "topics": 1})
    return render_template('episodes.html', episodes=all_episodes)

# Route for displaying topics discussed in an episode
@app.route('/topics/<episode_number>')
def topics(episode_number):
    episode_topics = get_topics_by_episode(episode_number)
    return render_template('topics.html', topics=episode_topics, episode_number=episode_number)

# Route for displaying timecodes and tags for a specific episode
@app.route('/timecode/<int:episode_number>')
def timecode(episode_number):
    episode = get_episode_by_number(episode_number)
    if episode:
        timecodes = episode.get("transcript", [])
        return render_template('timecode.html', timecodes=timecodes, episode_title=episode.get('title'), episode_number=episode_number)
    else:
        return render_template('timecode.html', timecodes=[], episode_title="Unknown Episode", episode_number=episode_number)

# Route for full-text search
@app.route('/search', methods=['GET', 'POST'])
def search():
    # Fetch all episodes for the dropdown
    all_episodes = list(mongo.db.episodes.find({}, {"_id": 1, "title": 1}))
    
    search_results = []
    if request.method == 'POST':
        query = request.form.get('query')
        episode_number = request.form.get('episode_number')
        episode_id = request.form.get('episode_id')

        tokenized_query = ' '.join(ws([query])[0])

        with open('/tmp/aaa', 'w') as f:
          f.write(f'num: {episode_number}\n id: {episode_id}\n')

        # Handle the episode number or ID filter
        if episode_number:
            search_results = list(search_transcripts(tokenized_query, episode_number=int(episode_number)))
        elif episode_id:
            search_results = list(search_transcripts(tokenized_query, episode_id=episode_id))
        else:
            # Perform the full-text search without any episode filtering
            search_results = list(search_transcripts(tokenized_query))

    return render_template('search.html', results=search_results, episodes=all_episodes)

# Route for displaying trends and analysis
@app.route('/trend')
def trend():
    trend_data = get_trend_data()
    return render_template('trend.html', trend_data=trend_data)


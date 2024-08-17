from flask import render_template, request
from app import app, mongo, ws
from app.models import get_topics_by_episode, get_timecodes_by_episode, search_transcripts, get_trend_data

# Home route to list all episodes
@app.route('/')
def episodes():
  all_episodes = mongo.db.episodes.find({}, {"episode_id": 1, "title": 1, "topics": 1})
  return render_template('episodes.html', episodes=all_episodes)

# Route for displaying topics discussed in an episode
@app.route('/topics/<episode_id>')
def topics(episode_id):
  episode_topics = get_topics_by_episode(episode_id)
  return render_template('topics.html', topics=episode_topics, episode_id=episode_id)

# Route for displaying timecodes and tags for a specific episode
@app.route('/timecode/<episode_id>')
def timecode(episode_id):
  timecodes = get_timecodes_by_episode(episode_id)
  return render_template('timecode.html', timecodes=timecodes, episode_id=episode_id)

# Route for full-text search
@app.route('/search', methods=['GET', 'POST'])
def search():
  search_results = []
  if request.method == 'POST':
    query = request.form.get('query')
    tokenized_query = ' '.join(ws([query])[0])
    search_results = list(search_transcripts(tokenized_query))
  return render_template('search.html', results=search_results)

# Route for displaying trends and analysis
@app.route('/trend')
def trend():
  trend_data = get_trend_data()
  return render_template('trend.html', trend_data=trend_data)


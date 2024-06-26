from flask import Flask, request, jsonify
from flask_cors import CORS
from g4f.client import Client

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/ask-ai', methods=['POST'])
def ask_ai():
    data = request.json
    prompt = data.get('prompt')

    if not prompt:
        return jsonify({'error': 'Prompt is required'}), 400

    client = Client()
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "user", "content": f"Replace the words - Mod1, Mod2, Mod3 - with mod names that fit the following description - {prompt}. Write to me only these 3 replaced words, separated by commas, without anything extra."}
        ],
    )
    pack = response.choices[0].message.content

    return jsonify({'response': pack})

@app.route('/test', methods=['GET'])
def test():
    return jsonify({'message': 'Test endpoint working!'})

if __name__ == '__main__':
    app.run(debug=True)

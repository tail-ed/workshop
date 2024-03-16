from flask import Flask
from flask import request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/hello", methods=["POST"])
def hello():
    data = request.get_json()
    print(data["name"])
    #  return json data with hello world text
    return {"name": data["name"]}

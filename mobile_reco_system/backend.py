from flask import Flask, render_template
from flask import request, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/chat", methods=["POST"])
def chat():

    user_message = request.json["message"]

    print(user_message)

    return jsonify({
        "reply": "AI response received"
    })

if __name__ == "__main__":
    app.run(debug=True)
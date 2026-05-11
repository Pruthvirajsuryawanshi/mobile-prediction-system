from flask import Flask, render_template, request, jsonify
import pandas as pd
from chatbot import chatbot_response

app = Flask(__name__)

@app.route('/')
def home():
    mobiles = [
        {
            "name": "iPhone 15 Pro",
            "price": "₹1,29,999",
            "image": "phone1.png"
        },
        {
            "name": "Samsung S24 Ultra",
            "price": "₹1,09,999",
            "image": "phone2.png"
        }
    ]

    accessories = [
        {
            "name": "Wireless Earbuds",
            "image": "earbuds.png"
        },
        {
            "name": "Smart Watch",
            "image": "watch.png"
        }
    ]

    return render_template(
        'index.html',
        mobiles=mobiles,
        accessories=accessories
    )

@app.route('/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_message = data.get('message', '')
    
    # Get recommendations from chatbot
    recommendations = chatbot_response(user_message)
    
    if not recommendations:
        reply = "I couldn't find any specific recommendations for that. Try asking about gaming, camera, or battery performance!"
    else:
        reply = "Based on your request, here are some top picks:<br><ul>"
        for rec in recommendations:
            reply += f"<li><b>{rec['brand']} {rec['model']}</b> - ₹{rec['price']} (Rating: {rec['rating']}⭐)</li>"
        reply += "</ul>"
    
    return jsonify({"reply": reply})

if __name__ == '__main__':
    app.run(debug=True)
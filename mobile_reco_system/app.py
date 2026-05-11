from flask import Flask, render_template

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

if __name__ == '__main__':
    app.run(debug=True)
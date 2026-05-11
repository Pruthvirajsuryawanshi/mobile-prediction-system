from recommendation import recommend_mobile

def chatbot_response(message):

    msg = message.lower()

    if "gaming" in msg:
        phones = recommend_mobile(30000, "gaming")

    elif "camera" in msg:
        phones = recommend_mobile(40000, "camera")

    elif "battery" in msg:
        phones = recommend_mobile(25000, "battery")

    else:
        phones = recommend_mobile(20000, "gaming")

    response = []

    for phone in phones:
        response.append({
            "brand": phone["Brand"],
            "model": phone["Model"],
            "price": phone["Price"],
            "rating": phone["Rating"]
        })

    return response
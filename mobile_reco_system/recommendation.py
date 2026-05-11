import pandas as pd

df = pd.read_csv("mobiles.csv")

def recommend_mobile(budget, purpose):

    filtered = df[df["Price"] <= budget]

    if purpose == "gaming":
        filtered = filtered[filtered["Gaming"] == "Yes"]

    elif purpose == "camera":
        filtered = filtered.sort_values(
            by="Camera",
            ascending=False
        )

    elif purpose == "battery":
        filtered = filtered.sort_values(
            by="Battery",
            ascending=False
        )

    return filtered.head(5).to_dict(
        orient="records"
    )
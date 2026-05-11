console.log("AI Mobile Recommendation System Loaded");

function openChat() {

    let chat = document.getElementById("chatWindow");

    if (chat.style.display === "block") {

        chat.style.display = "none";

    } else {

        chat.style.display = "block";
    }
}


async function sendMessage() {

    let input = document.getElementById("userInput");

    let message = input.value;

    let response = await fetch("/chat", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            message: message
        })
    });

    let data = await response.json();

    document.getElementById("chatbox").innerHTML += `
        <div class="user">${message}</div>
        <div class="bot">${data.reply}</div>
    `;
}
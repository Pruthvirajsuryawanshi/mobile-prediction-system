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
    let message = input.value.trim();
    if (!message) return;

    let chatbox = document.getElementById("chatbox");
    
    // Add user message
    chatbox.innerHTML += `<div class="user-msg"><strong>You:</strong> ${message}</div>`;
    input.value = "";

    try {
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

        // Add bot message
        chatbox.innerHTML += `<div class="bot-msg"><strong>AI:</strong> ${data.reply}</div>`;
        
        // Scroll to bottom
        chatbox.scrollTop = chatbox.scrollHeight;
    } catch (error) {
        console.error("Error:", error);
        chatbox.innerHTML += `<div class="error-msg">Error: Could not connect to AI.</div>`;
    }
}
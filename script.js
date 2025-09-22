const APIKEY = "eLIbdvWpV2XcSqhAIEYS5Bf7E47lLaRG"; // Substitua por sua chave API
const btn = document.querySelector(".btn-send");

btn.addEventListener("click", () => {
    sendMessage();
});

async function sendMessage() {
    let msg = document.querySelector(".input-message").value;
    const url = `https://api.giphy.com/v1/gifs/search?api_key=${APIKEY}&q=${msg}&limit=10`;
    const response = await fetch(url);
    const data = await response.json();
    displayMessage(data);
}

function displayMessage(data) {
    const messages = document.querySelector(".messages");
    messages.innerHTML = '';
    
    data.data.forEach(gif => {
        const img = document.createElement("img");
        img.src = gif.images.fixed_height.url;
        img.alt = gif.title;
        messages.appendChild(img);
    });
}

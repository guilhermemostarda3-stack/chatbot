// ATENÇÃO: Substitua a chave abaixo pela sua chave pessoal da Giphy.
const GIPHY_API_KEY = "eLIbdvWpV2XcSqhAIEYS5Bf7E47lLaRG";

// Pega os elementos HTML do seu chatbot
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages");

async function handleUserInput() {
    let searchTerm = userInput.value.trim();
    if (searchTerm === "") return;

    // Adiciona a mensagem do usuário
    const userMessage = document.createElement("div");
    userMessage.className = "message user";
    userMessage.innerHTML = `<p>${searchTerm}</p>`;
    messagesContainer.appendChild(userMessage);

    userInput.value = "";
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const botMessage = document.createElement("div");
    botMessage.className = "message bot";
    messagesContainer.appendChild(botMessage);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Lógica principal: decide se busca imagem ou responde com texto
    const isImageRequest = searchTerm.toLowerCase().includes("foto") || searchTerm.toLowerCase().includes("imagem");

    if (isImageRequest) {
        let imageSearchTerm = searchTerm.toLowerCase()
                                        .replace(/^(quero uma\s+)?(foto|imagem)\s+(de\s+)?/, "")
                                        .trim();
        
        if (imageSearchTerm) {
            await searchAndDisplayImage(imageSearchTerm, botMessage);
        } else {
            botMessage.innerHTML = `<p>Por favor, especifique o que você quer na imagem (ex: "foto de cachorro").</p>`;
        }
    } else {
        botMessage.innerHTML = `<p>Desculpe, eu só consigo buscar imagens se você pedir "foto..." ou "imagem...".</p>`;
    }
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

async function searchAndDisplayImage(searchTerm, botMessageElement) {
    try {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const url = `https://api.giphy.com/v1/gifs/random?api_key=${GIPHY_API_KEY}&tag=${encodedSearchTerm}&rating=g`;

        const response = await fetch(url);
        const data = await response.json();
        
        if (data.data && data.data.images) {
            const imageUrl = data.data.images.original.url;
            const imgElement = document.createElement("img");
            imgElement.src = imageUrl;
            imgElement.alt = `Imagem de ${searchTerm}`;
            imgElement.style.maxWidth = "100%";
            imgElement.style.height = "auto";
            imgElement.style.borderRadius = "8px";
            botMessageElement.innerHTML = '';
            botMessageElement.appendChild(imgElement);
        } else {
            botMessageElement.innerHTML = `<p>Desculpe, não encontrei nenhuma imagem para "${searchTerm}".</p>`;
        }
    } catch (error) {
        console.error("Erro ao buscar a imagem:", error);
        botMessageElement.innerHTML = `<p>Ocorreu um erro ao carregar a imagem. Tente novamente mais tarde.</p>`;
    }
}

// Adiciona os eventos
sendButton.addEventListener("click", handleUserInput);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleUserInput();
    }
});

// Importa as bibliotecas do Firebase que vamos usar
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// A sua configuração do Firebase. Você precisa substituir este objeto
// pelo que você copiou do seu Console do Firebase.
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID",
};

// Inicializa o Firebase e o banco de dados
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Acessa os elementos HTML do chat
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-btn");
const messagesContainer = document.getElementById("messages");

// Função para exibir as mensagens na tela
function displayMessage(messageText) {
  const messageElement = document.createElement("div");
  messageElement.className = "message user"; // Por enquanto, todas as mensagens são do usuário
  messageElement.innerHTML = `<p>${messageText}</p>`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escuta as mensagens em tempo real no Firestore e as exibe na tela
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, (querySnapshot) => {
  messagesContainer.innerHTML = ""; // Limpa as mensagens existentes
  querySnapshot.forEach((doc) => {
    displayMessage(doc.data().text);
  });
});

// Função principal para lidar com o envio de mensagens
async function handleChat() {
    let message = userInput.value.trim();
    if (message === "") return;

    // Salva a mensagem no banco de dados Firestore
    try {
        await addDoc(collection(db, "messages"), {
            text: message,
            timestamp: new Date().getTime()
        });
        userInput.value = ""; // Limpa a caixa de entrada
    } catch (e) {
        console.error("Erro ao salvar mensagem: ", e);
    }
}

// Evento para o botão de envio e a tecla Enter
sendButton.addEventListener("click", handleChat);
userInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleChat();
    }
});
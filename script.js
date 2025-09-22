// Importa as bibliotecas do Firebase que vamos usar
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, onSnapshot, query, orderBy } from "firebase/firestore";

// A sua configuração do Firebase.
const firebaseConfig = {
  apiKey: "AIzaSyB07UiQcdheXk9Ijc7F-VYZjZxPUlKnrJ4",
  authDomain: "chatbot-f6d84.firebaseapp.com",
  projectId: "chatbot-f6d84",
  storageBucket: "chatbot-f6d84.firebasestorage.app",
  messagingSenderId: "949042678506",
  appId: "1:949042678506:web:41613b5afd58de0b592593",
  measurementId: "G-KVLQYQCJ56"
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
  messageElement.className = "message user";
  messageElement.innerHTML = `<p>${messageText}</p>`;
  messagesContainer.appendChild(messageElement);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escuta as mensagens em tempo real no Firestore e as exibe na tela
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, (querySnapshot) => {
  messagesContainer.innerHTML = "";
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
        userInput.value = "";
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

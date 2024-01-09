'use strict';

const userNamePage = document.querySelector("#username-page");
const chatPage = document.querySelector("#chat-page");
const userNameForm = document.querySelector("#usernameForm");
const messageForm = document.querySelector("#messageForm");
const messageInput = document.querySelector("#message");
const messageArea = document.querySelector("#messageArea");
const connectingElements = document.querySelector(".connecting");

let stompClient = null;
let userName = null;

const colors = [
    '#2196F3', '#32c787', '#00BCD4', '#ff5652',
    '#ffc107', '#ff85af', '#FF9800', '#39bbb0'
]

function getAvatarColor(messageSender) {
    let hash = 0;
    for (let i = 0; i < messageSender.length; i++) {
        hash = 31 * hash + messageSender.charCodeAt(i);
    }
    const index = Math.abs(hash % colors.length);
    return colors[index];
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);

    const messageElement = document.createElement('li');

    if(message.type === 'JOIN') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' joined!';
    } else if (message.type === 'LEAVE') {
        messageElement.classList.add('event-message');
        message.content = message.sender + ' left!';
    } else {
        messageElement.classList.add('chat-message');

        const avatarElement = document.createElement('i');
        const avatarText = document.createTextNode(message.sender[0]);
        avatarElement.appendChild(avatarText);
        avatarElement.style['background-color'] = getAvatarColor(message.sender);

        messageElement.appendChild(avatarElement);

        const usernameElement = document.createElement('span');
        const  usernameText = document.createTextNode(message.sender);
        usernameElement.appendChild(usernameText);
        messageElement.appendChild(usernameElement);
    }

    const textElement = document.createElement('p');
    const  messageText = document.createTextNode(message.content);
    textElement.appendChild(messageText);

    messageElement.appendChild(textElement);

    messageArea.appendChild(messageElement);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function sendMessage(event) {
    event.preventDefault();
    const messageContent = messageInput.value.trim();
    if(messageContent) {
        const message = {sender: userName, content: messageContent, type: 'CHAT'};
        stompClient.send('/app/chat.sendMessage', {}, JSON.stringify(message));
        messageInput.content = '';
    }
}

function onConnect() {
    console.log(userName);
    stompClient.subscribe('/topic/public', onMessageReceived);
    stompClient.send('/app/chat.addUser', {}, JSON.stringify({sender: userName, type: 'JOIN'}));
    connectingElements.classList.add('hidden');
}

function onError() {
    connectingElements.textContent = 'Could connect to websocket server, please refresh this page and retry !';
    connectingElements.style.color = 'red';
}

function connect(event) {
    event.preventDefault();
    userName = document.querySelector("#name").value.trim();
    if(userName) {
        userNamePage.classList.add('hidden');
        chatPage.classList.remove('hidden');

        const socket = new SockJS('/ws');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, onConnect, onError);
    }
}

userNameForm.addEventListener('submit', connect, true);
messageForm.addEventListener('submit', sendMessage, true);
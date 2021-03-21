const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');

const socket = io();


// to fetch username from the from submission
const { username, room } = Qs.parse(location.search, {
    //for ignoring the prefix character
    ignoreQueryPrefix: true
});

socket.emit('username', username);

//console.log(username);

socket.on('message', message => {
    console.log(message);
    toDom(message);

    //for scrolling
    chatMessages.scrollTop = chatMessages.scrollHeight;
})


chatForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const msg = event.target.elements.msg.value;
    //console.log(msg);
    //emiting chat message to server
    socket.emit('chatMessage', msg);

    event.target.elements.msg.value = '';
    event.target.elements.msg.focus();


})

// Output message to DOM
function toDom(message) {
    const div = document.createElement('div');
    div.classList.add('message');
    div.innerHTML = `<p class="meta"> ${message.username}<span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;
    document.querySelector('.chat-messages').appendChild(div);
}

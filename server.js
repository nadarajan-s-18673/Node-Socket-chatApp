const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const socketio = require('socket.io');
const moment = require('moment');
var uname;

const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));



io.on('connection', socket => {
    //console.log("new one");

    //  const joininguser = joiningUser(socket.id, username);

    socket.on('username', (currentuname) => {
        uname = currentuname;
        //   console.log(uname);
        const joininguser = joiningUser(socket.id, uname);
        console.log(joininguser);


        socket.emit('message', format("Admin", 'Welcome to chaty'));

        //if a new user connects
        socket.broadcast.emit('message', format("Admin", `${joininguser.username} joined`));

    })
    ///intro message


    //if any user disconnects
    socket.on('disconnect', () => {
        const leavinguser = userLeave(socket.id);
        if (leavinguser) {
            io.emit('message', format("Admin", `${leavinguser.username} left`));
        }

    });
    //catching the message from client side
    socket.on('chatMessage', (msg) => {
        // console.log(msg);
        io.emit('message', format(uname, msg));
    })
});





//for formatting message
function format(username, text) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}





const totalUsers = [];

//for finding the name of the new user joining
function joiningUser(id, username) {

    const user = { id, username };
    totalUsers.push(user);
    return user;

}

// User leaves chat
function userLeave(id) {
    const index = totalUsers.findIndex(user => user.id === id);

    if (index !== -1) {
        return totalUsers.splice(index, 1)[0];
    }
}





const PORT = 3000 || process.env.PORT;

server.listen(PORT, () => console.log(`Server Started Successfully at ${PORT}`));
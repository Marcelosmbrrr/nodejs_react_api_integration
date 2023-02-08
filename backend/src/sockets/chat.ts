import moment from 'moment';
// Socket server instance
import { SocketIoServer } from "..";

// When the connection is initiated...
SocketIoServer.on('connection', (socket) => {

    socket.on("authenticate", (username) => {

        // Create socket server side attribute username
        socket.username = username;

        // Create response data and send with emission
        const response = {};
        socket.emit("successful-authentication", response);

    });

    socket.on('new-message', (message) => {

        // Message verification simulation

        // Construct the message
        const response = {
            verification: true,
            username: socket.username,
            time: moment().format("LT"),
            message: message
        }

        // Emit to client
        socket.emit("new-message-verified", response);
    });

});




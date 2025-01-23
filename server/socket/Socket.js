const jwt = require('jsonwebtoken');
let activeUsers = []
function initializeSocket(server) {
    const io = require("socket.io")(server, {
        cors: {
            origin: "*",
        },
    });
    io.use((socket, next) => {
        if (socket.handshake.query && socket.handshake.query.token) {
            jwt.verify(socket.handshake.query.token, process.env.JWT_SECRET, (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.decoded = decoded;
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        console.log("A user connected")
        socket.on("disconnect", () => {
            // remove user from active users
            activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
            console.log("User Disconnected", activeUsers);
            // send all active users to all users
            io.emit("get-users", activeUsers);
        });
        io.to(socket.id).emit("test", socket.id);
        socket.on("new-user-add", (newUserId) => {
            // if user is not added previously
            if (!activeUsers.some((user) => user.userId === newUserId)) {
                activeUsers.push({ userId: newUserId, socketId: socket.id });
                console.log("New User Connected", activeUsers);
            }
            // send all active users to new user
            io.emit("get-users", activeUsers);
        });
        socket.on("send-notification", (toUserId, type) => {
            const user = activeUsers.find((user) => user.userId === toUserId);
            console.log("Data: This is my data and it has been fired ")
            console.log(type)
            if (user) {
                if (type === "role update" || type === "ticket-added") {
                    io.to(user.socketId).emit("get-notification", type);
                }
            }
        });
        socket.on("get-active-users", () => {
            // send all active users to new user
            io.to(socket.id).emit("get-users", activeUsers);
        })
    });
    return io;
}
module.exports = initializeSocket;

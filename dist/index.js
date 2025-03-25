"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let clients = [];
wss.on("connection", (socket) => {
    socket.on("close", (s) => {
        clients = clients.filter((user) => {
            return user.socket !== socket;
        });
    });
    socket.on("message", (message) => {
        try {
            const data = JSON.parse(message.toString());
            console.log(data);
            if (data.type == "join") {
                const user = {
                    roomid: data.roomid,
                    name: data.name,
                    socket
                };
                socket.send("joined");
                clients.push(user);
            }
            if (data.type === "chat") {
                clients.forEach((user) => {
                    if (user.roomid === data.roomid && user.name !== data.name) {
                        user.socket.send(JSON.stringify({
                            name: data.name,
                            message: data.message
                        }));
                    }
                });
            }
        }
        catch (e) {
            socket.send("error" + e);
        }
    });
});

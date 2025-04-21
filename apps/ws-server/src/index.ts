import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "@repo/common-backend/config"

import { prisma } from "@repo/db/client"
const wss = new WebSocketServer({ port: 8080 });
type user = {
    socket: WebSocket,
    rooms: string[],
    userName: string,
    userId: string
}
const users: Map<string, user> = new Map()

function verifyRoom(roomToken: string): string | null {

    try {
        const decoded = jwt.verify(roomToken, JWT_SECRET)
        if (!decoded) {
            return null

        }
        if (typeof decoded == "string") {
            return null
        }
        const roomId = decoded.roomId
        if (!roomId) {
            return null
        }
        return roomId

    }
    catch (e) {
        return null
    }
}





wss.on("connection", (socket, request) => {

    socket.send(JSON.stringify({
        type: "connection",
        message: "connected to server"
    }))

    socket.on("close", () => {
        users.forEach((user) => {
            if (user.socket === socket) {
                users.delete(user.userId)
               
            }
        })
    })


    socket.on("message", async (message) => {
        const { type, userId, userName, roomToken } = JSON.parse(message.toString())
        const roomId = verifyRoom(roomToken)
        if (!roomId) {
            socket.send(JSON.stringify({
                type: "error",
                message: "invalid room token"
            }))
            return
        }
        if (type === "join") {
            const user = users.get(userId)
            if (user) {
                return
            }
            users.set(userId, {
                socket,
                userId,
                rooms: [roomId],
                userName
            })
            users.forEach((user) => {
                if (user.rooms.includes(roomId) && user.userId !== userId) {
                    user.socket.send(JSON.stringify({
                        type: "joined",
                        message: userName + " have joined the room",
                        sender: userName,
                        isSystem: true,

                        roomId,
                    }))
                }
            })
        }


        if (type === "message") {
            const { data } = JSON.parse(message.toString())
            const user = users.get(userId)

            if (!user) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "user not found"
                }))
                return
            }
            else {
                //      const message=await prisma.message.create({
                //             data:{
                //                 roomId:Number(roomId), 
                //   content :data,
                //   senderId :userId 
                //             }})

                    if(user.socket!== socket){
                        socket.send(JSON.stringify({
                            type: "error",
                            message: "this account is already present in the room`"
                        }))
                        return
                    }
                        

                users.forEach((user) => {
                    if (user.rooms.includes(roomId) ) {
                        user.socket.send(JSON.stringify({
                            type: "message",
                            message: data,
                            sender: userName,
                            roomId,
                            isSystem: false,
                        }))

                    }
                    return
                })
            }
        }
        if (type === "leave") {
            const user = users.get(userId)
            if (!user) {
                socket.send(JSON.stringify({
                    type: "error",
                    message: "user not found"
                }))
                return
            }
            else {
                users.delete(userId)
            }
        }

    }
    )



})








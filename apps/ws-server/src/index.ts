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

const  rooms =new Map<string,user[]>()

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
    console.log(users,"connected")
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
        rooms.forEach((user)=>{
            user.forEach((user)=>{
                if(user.socket===socket){
                    user.rooms.forEach((roomId)=>{
                        rooms.set(roomId,rooms.get(roomId)?.filter((x)=>x.userId!=user.userId) || [])
                    })
                }
            })
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
            let user = users.get(userId) as user

            if (user) {
                return
            }
            user={
                socket,
                userId,
                rooms: [roomId],
                userName
            }

         const newUser=   users.set(userId, user)
              rooms.set(roomId,[...rooms.get(roomId)||[] ,user])


            users.forEach((user) => {
                if (user.rooms.includes(roomId)) {
                    user.socket.send(JSON.stringify({
                        type: "joined",
                        message: userName + " have joined the room",
                        sender: userName,
                        isSystem: true,
                        participants: rooms.get(roomId)?.map((user)=>{
                            return user.userName
                        }),
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
                            participants: rooms.get(roomId)?.map((user)=>{
                                return user.userName
                            })
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
                console.log(users,"leave")
                users.delete(userId)
                users.forEach((user)=>{
                    if (user.rooms.includes(roomId)) {
                        user.socket.send(JSON.stringify({
                            type: "left",
                            message: userName + " have left the room",
                            sender: userName,
                            isSystem: true,
                            participants: rooms.get(roomId)?.map((user)=>{
                                return user.userName
                            }),
                            roomId,
                        }))
                    }
                })
              
                rooms.set(roomId,rooms.get(roomId)?.filter((user)=>user.userId!=userId) || [])
                
            }
        }

    }
    )



})








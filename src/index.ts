import { WebSocketServer } from "ws";

const wss =new WebSocketServer({port:8080});

wss.on("connection",(socket)=>{
    socket.on("message",(message)=>{
        console.log(message.toString())
        setInterval(()=>{
            socket.send("here is a random number: " +Math.random())
        },1000 ) 
    })
})
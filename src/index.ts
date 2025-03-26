import { WebSocketServer ,WebSocket} from "ws";


const wss =new WebSocketServer({port:8080});
type user={

    roomid:string,
    name:string,
    socket:WebSocket
}

 let clients:user[] =  []


wss.on("connection",(socket)=>{
    socket.on("close",(s)=>{
        clients=clients.filter((user)=>{
            return user.socket!==socket
        })
    })
    


    socket.on("message",(message)=>{
        try{
        const data=JSON.parse(message.toString())
        console.log(data)
        if(data.type=="join"){
            const user ={
                roomid:data.roomid,
                name:data.name,
                socket
            }
                socket.send("joined")
            clients.push(user)
        }

        if(data.type==="chat"){
     const user = clients.find((user)=>{
         return user.socket==socket
          })
      
          clients.forEach((client)=>{
            if(client.roomid==user?.roomid){
                client.socket.send(data.message)
            }
          })


        }

      
    }
    catch(e){
    socket.send("error"+e)
    }
    
    }

)
})
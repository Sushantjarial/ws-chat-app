


import express from "express";
import {JWT_SECRET} from "@repo/common-backend/config"
import {prisma} from "@repo/db/client"
import {createRoomSchema} from "@repo/common/types"
import jwt from "jsonwebtoken"
import cors from "cors"


const app = express();
app.use(express.json())
app.use(cors())

// app.post("/signup",async(req,res)=>{
    

//     const{success,error}=signupSchema.safeParse(req.body)

//     if(success){
//         try{
//             const existingUser=await prisma.user.findUnique({
//                 where:{
//                     userName:req.body.userName
//                 }
//             })
//             if(existingUser){
//                  res.status(400).json({
//                 error:"user already exists with this username"
//                 })
//             }

//             const user =await prisma.user.create({
//                 data:{
//                     userName:req.body.userName,
//                     password:req.body.password,
//                     name:req.body.name
                    
                    
//                 }
//             })
//             const token=jwt.sign(user.id,JWT_SECRET)
//             res.status(200).json({
//                 message:"user created successfully",
//                 user,
//                 token
//             })
//         }
//         catch(e){
//             res.status(500).json({message:"database is ofline",
//                 error:e
//             })
//         }
//     }
//     else{
//         res.status(400).json({
//             error:error.format(),
//             message:"zod error"
//         })
//     }
 

// })

// app.post("/signin",async (req, res) => {
//  const {userName,password}=req.body
//     if(!userName || !password){
//          res.status(400).json({
//             error:"username and password are required"
//         })
//     }
//     try{
//         const user =await prisma.user.findFirst({
//             where:{
//                 userName,
//                 password
//             }
//         })
//         if(!user){
//             res.status(400).json({
//                 error:" User not found"
//             })
//         }
//         else{
//         const token=jwt.sign(user.id,JWT_SECRET)
//         res.status(200).json({
//             message:"user logged in successfully",
//             user,token
//         })
//     }
//     }
//     catch(e){
//         res.status(500).json({
//             message:"database is offline",
//             error:e

//         })
//     }

// });
// app.get("/",(req,res)=>{
//     res.status(200).json({
//         message:"hello world"
//     })
// })

app.post("/createRoom",async(req,res)=>{
    const {success,error}=createRoomSchema.safeParse(req.body)
    if(success){
        const roomToken=jwt.sign({roomId :req.body.slug},JWT_SECRET)
        try{
            const room=await prisma.room.create({
                data:{
                    slug:req.body.slug,
                    adminId:req.body.adminId,
                    roomToken:roomToken
                    
                }
            })
            if(!room){
                res.status(400).json({
                    error:"room not created"
                })
            }
            else{
                
                res.status(200).json({
                    message:"room created successfully",
                    room

                })
            }
        }
        catch(e){
            res.status(500).json({
                message:"slug is already taken",
                error:e
            })
        }
    }
    else{
        res.status(400).json({
            error:error.format(),
            message:"zod error"
        })
    }
})

app.get("/chats/:roomId", async (req, res) => {
    try {
        const roomId = Number(req.params.roomId);
        console.log(req.params.roomId);
        const messages = await prisma.message.findMany({
            where: {
                roomId: roomId
            },
            orderBy: {
                id: "desc"
            },
            take: 1000
        });

        res.json({
            messages
        })
    } catch(e) {
        console.log(e);
        res.json({
            messages: []
        })
    }
    
})
app.get("/rooms/:slug",async(req,res)=>{
    const slug=req.params.slug
    try{
        const room=await prisma.room.findUnique({
            where:{
                slug:slug
            }
        })
        if(!room){
            res.status(400).json({
                error:"room not found"
            })
        }
        else{
           
            res.status(200).json({
                message:"room found",
                room
            })
        }
    }
    catch(e){
        res.status(500).json({
            message:"database is offline",
            error:e
        })
    }
})
app.get("/rooms",async(req,res)=>{
try{
    const userId=req.query.userId as string
    console.log(userId)
    const rooms=await prisma.room.findMany({
        select:{
            id:true,
            slug:true,
            adminId:true,
            roomToken:true,
            createdAt:true,
        },
        where:{
            adminId:userId
        }
    })
    console.log(rooms)
    res.status(200).json({
        rooms
    })
}
catch(e){
    res.status(500).json({
        message:"database is offline",
        error:e
    })
}
})


app.listen(8000);




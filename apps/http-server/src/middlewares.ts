import { Request, Response ,NextFunction} from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/common-backend/config";
import {prisma} from "@repo/db/client"

export  function   middleware(req :Request , res:Response , next:NextFunction):void{
    const token =req.headers["authorization"]?.split(" ")[1] || ""
    if(!token){
         res.status(401).json({message:"Unauthorized"})
    }
    const decoded =jwt.verify(token,JWT_SECRET)

    if(!decoded){
         res.status(401).json({message:"Unauthorized"})}
  
   else{ // @ts-ignore
    req.userId=decoded.userId
    next()

   }
}
import {z} from "zod"

export const signupSchema=z.object({
    userName:z.string().min(3).max(20),
    password:z.string().min(3),
    name:z.string().min(3).max(20)

})

export const siginSchema=z.object({
    userName:z.string().min(3).max(20),
    password:z.string().min(3)  
})

export const createRoomSchema=z.object({
    slug:z.string().min(3).max(20),
    adminId:z.string().min(3)
        
})



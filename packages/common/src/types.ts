import {z} from "zod"

export type signupSchema=z.infer<typeof signupSchema>
export const signupSchema=z.object({
    userName:z.string().min(3).max(20),
    password:z.string().min(3),
    name:z.string().min(3).max(20)

})

export type siginSchema=z.infer<typeof siginSchema>
export const siginSchema=z.object({
    userName:z.string().min(3).max(20),
    password:z.string().min(3)  
})

export type createRoomSchema=z.infer<typeof createRoomSchema>
export const createRoomSchema=z.object({
    slog:z.string().min(3).max(20),
    adminId:z.string().min(3)
        
})



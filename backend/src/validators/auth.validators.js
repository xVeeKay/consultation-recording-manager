import {z} from "zod"

export const registerSchema=z.object({
    body:z.object({
        name:z.string().min(3,"Must be greater than 3 characters"),
        email:z.email(),
        password:z.string().min(6,"Password should be greater than 5 characters")
    }),
})

export const loginSchema=z.object({
    body:z.object({
        email:z.email(),
        password:z.string().min(6,'Must be greater than 5 characters')
    })
})
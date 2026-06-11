import {z} from zod

export const createCustomerSchema=z.object({
    body:z.object({
        name:z.string().trim().min(3,"Name must be at least 3 characters"),
        phone:z.string().min(10,"Invalid phone number"),
        email:z.email().optional(),
        birthDate:z.string().optional()
    })
})
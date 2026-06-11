import validate from "../middlewares/validate.middleware.js";
import { loginSchema,registerSchema } from "../validators/auth.validators.js";
import { registerUser,loginUser,logoutUser } from "../controllers/auth.controller.js";
import { Router } from "express";
const router=Router()

router.post("/register",validate(registerSchema),registerUser)
router.post("/login",validate(loginSchema),loginUser)
router.post("/logout",loginUser)

export default router
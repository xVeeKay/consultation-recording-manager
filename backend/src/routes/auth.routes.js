import validate from "../middlewares/validate.middleware.js";
import { loginSchema,registerSchema } from "../validators/auth.validators.js";
import { registerUser,loginUser,logoutUser, getCurrentUser } from "../controllers/auth.controller.js";
import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
const router=Router()


router.post("/register",validate(registerSchema),registerUser)
router.post("/login",validate(loginSchema),loginUser)
router.post("/logout",loginUser)
router.get("/me",verifyJWT,getCurrentUser)

export default router
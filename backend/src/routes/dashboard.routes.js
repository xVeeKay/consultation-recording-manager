import { Router } from "express";
const router=Router()
import verifyJWT from "../middlewares/auth.middleware.js";
import { getDashboardStats } from "../controllers/dashboard.controller.js";


router.get("/",verifyJWT,getDashboardStats)

export default router
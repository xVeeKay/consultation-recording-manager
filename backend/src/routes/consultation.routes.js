import { Router } from "express";
const router=Router()
import verifyJWT from "../middlewares/auth.middleware.js";
import { createConsultationSchema } from "../validators/consultation.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { createConsultation, deleteConsultation, getConsultationById, getConsultations, uploadRecording } from "../controllers/consultation.controller.js";
import upload from "../middlewares/multer.middleware.js";

router.use(verifyJWT)
router.route("/").post(validate(createConsultationSchema),createConsultation).get(getConsultations)
router.route("/:id").get(getConsultationById).delete(deleteConsultation)
router.post("/:id/upload",upload.single("recording"),uploadRecording)


export default router
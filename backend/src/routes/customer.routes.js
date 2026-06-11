import { Router } from "express";
const router=Router()
import { createCustomer,getAllCustomers,getCustomerById,updateCustomer,deleteCustomer } from "../controllers/customer.controller.js";
import verifyJWT from "../middlewares/auth.middleware.js";
import validate from "../middlewares/validate.middleware.js";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validation.js";

router.use(verifyJWT)
router.route("/").post(validate(createCustomerSchema),createCustomer).get(getAllCustomers)
router.route("/:id").get(getCustomerById).patch(validate(updateCustomerSchema),updateCustomer).delete(deleteCustomer);



export default router
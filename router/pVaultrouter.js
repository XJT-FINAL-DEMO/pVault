import { Router } from "express";
import { getNearbyFacility } from "../controller/facilitiesController.js";
import { bookAppointment, getAppointments,preCheckIn } from "../controller/appointmentController.js";
import { isAuthenticated } from "../middleware/auth.js";



const pVaultRouter = Router();

pVaultRouter.get("/api/facility", isAuthenticated, getNearbyFacility)

pVaultRouter.post("/api/book/",isAuthenticated, bookAppointment)

pVaultRouter.post("/api/check-in/",isAuthenticated, preCheckIn)

pVaultRouter.get("/", isAuthenticated, getAppointments)





export default pVaultRouter;


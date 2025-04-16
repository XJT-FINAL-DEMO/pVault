import { Router } from "express";
import { addFacility, getNearbyFacility } from "../controller/facilitiesController.js";
import { bookAppointment, getAppointments,CheckIn } from "../controller/appointmentController.js";
import { isAuthenticated } from "../middleware/auth.js";



const pVaultRouter = Router();

pVaultRouter.get("/api/facility", isAuthenticated, getNearbyFacility)

pVaultRouter.post("/api/facility",isAuthenticated, addFacility)

pVaultRouter.post("/api/book/",isAuthenticated, bookAppointment)

pVaultRouter.post("/api/checkIn/",isAuthenticated, CheckIn)

pVaultRouter.get("/", isAuthenticated, getAppointments)





export default pVaultRouter;


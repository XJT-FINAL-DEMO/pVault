import { Router } from "express";
import { getNearbyFacility } from "../controller/facilitiesController.js";



const pVaultRouter = Router();

pVaultRouter.get("/api/facility", getNearbyFacility)





export default pVaultRouter;


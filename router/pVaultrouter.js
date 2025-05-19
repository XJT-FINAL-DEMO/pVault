import { Router } from "express";
import { addFacility, getAllFacilities, getfacilityByUser, getNearbyFacility, updateFacility } from "../controller/facilitiesController.js";
import { addPrescription, deletePrescription, getAllprescriptions, updatePrescription } from "../controller/prescriptController.js";
import { bookAppointment, getAppointments,CheckIn, reschedulAppointment, cancelAppointment } from "../controller/appointmentController.js";
import { Authorized, isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createBlog, deleteBlog, getAuthorBlogs, getBlog, getBlogs, updateBlog } from "../controller/blogsController.js";
import { blogsCoverPhotoUpload,prescriptionUpload } from "../middleware/upload.js";
import { addMedicine, deleteMedicine, getAllMedicines, updateMedicine } from "../controller/medsController.js";



const pVaultRouter = Router();

// FACILITY ROUTES
pVaultRouter.post("/facility",isAuthenticated,Authorized(["doctor","pharmacist","admin"]), addFacility)

pVaultRouter.get("/allfacilities", isAuthenticated, getAllFacilities)

pVaultRouter.get("/users/:userId/facilities/", isAuthenticated, getfacilityByUser )

pVaultRouter.patch("/facility/:id", isAuthenticated, Authorized(['doctor','pharmacist']),updateFacility)

pVaultRouter.get("/nearby-facility-search", isAuthenticated, getNearbyFacility)

//---------------------------------------------------------------------------------

// APPOINTMENTS ROUTES
pVaultRouter.post("/appointments",isAuthenticated, bookAppointment)

pVaultRouter.patch("/appointment/:id", isAuthenticated, isAuthorized(["patient","doctor", "admin"]), reschedulAppointment)

// pVaultRouter.patch("/confirmAppointment/:id",isAuthenticated,isAuthorized(["doctor", "admin"]), confirmAppointment)
pVaultRouter.get("/get-appointment", isAuthenticated, getAppointments)

pVaultRouter.post("/checkIn/",isAuthenticated, CheckIn)

pVaultRouter.delete("/cancelAppointment/:id", isAuthenticated, cancelAppointment)
// pVaultRouter.delete("/cancelAppointment/:id", isAuthenticated,Authorized(["doctor"]), cancelAppointment)


//---------------------------------------------------------------------------------
// MEDICINES
pVaultRouter.post("/medicine",isAuthenticated,Authorized(["pharmacist", "admin"]),addMedicine)

pVaultRouter.get("/medicine", isAuthenticated, getAllMedicines)

pVaultRouter.patch("/medicine/:id",isAuthenticated,Authorized(["pharmacist", "admin"]),updateMedicine)

pVaultRouter.delete("/medicine/:id", isAuthenticated,Authorized(["pharmacist","admin"]), deleteMedicine)

//---------------------------------------------------------------------------------
// PRESCRIPTIONS
pVaultRouter.post("/prescriptions",prescriptionUpload.array("prescriptions"), isAuthenticated,isAuthorized(['patient', 'doctor', 'admin']), addPrescription )

pVaultRouter.get("/prescriptions",isAuthenticated,isAuthorized(['patient','pharmacist', 'doctor','admin']),getAllprescriptions)

pVaultRouter.patch("/prescription/:id", isAuthenticated, updatePrescription)

pVaultRouter.delete("/prescription/:id", isAuthenticated,Authorized(["pharmacist",'doctor',"admin"]), deletePrescription)

//---------------------------------------------------------------------------------
//BLOGS ROUTES
pVaultRouter.post("/blogs", blogsCoverPhotoUpload, isAuthenticated, Authorized(["doctor", "pharmacist"]), createBlog)

pVaultRouter.get("/blogs", getBlogs)

pVaultRouter.get("/blog/:id", getBlog)

pVaultRouter.get("/blogs/author", isAuthenticated, Authorized(["doctor","pharmacist"]), getAuthorBlogs)

pVaultRouter.delete("/blog/:id", isAuthenticated, Authorized(["doctor","pharmacist"]), deleteBlog)

pVaultRouter.patch("/blog/:id", blogsCoverPhotoUpload, isAuthenticated, Authorized(["doctor", "pharmacist"]), updateBlog)





export default pVaultRouter;


import { Router } from "express";
import { addFacility, getAllFacilities, getfacilityByUser, getNearbyFacility, updateFacility } from "../controller/facilitiesController.js";
import { addPrescription, getAllprescriptions, updatePrescription } from "../controller/prescriptController.js";
import { bookAppointment, getAppointments,CheckIn, reschedulAppointment, confirmAppointmet, cancelAppointment } from "../controller/appointmentController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createBlog, deleteBlog, getAuthorBlogs, getBlog, getBlogs, updateBlog } from "../controller/blogsController.js";
import { blogsCoverPhotoUpload,prescriptionUpload } from "../middleware/upload.js";
import { addMedicine, deleteMedicine, getAllMedicines, updateMedicine } from "../controller/medsController.js";



const pVaultRouter = Router();

// FACILITY ROUTES
pVaultRouter.post("/facility",isAuthenticated,isAuthorized(["doctor","pharmacist","admin"]), addFacility)

pVaultRouter.get("/allfacilities", isAuthenticated, getAllFacilities)

pVaultRouter.get("/users/:userId/facilities/", isAuthenticated, getfacilityByUser )

pVaultRouter.patch("/facility/:id", isAuthenticated, isAuthorized(['doctor','admin']),updateFacility)

pVaultRouter.get("/nearby-facility-search", isAuthenticated, getNearbyFacility)

//---------------------------------------------------------------------------------

// APPOINTMENTS ROUTES
pVaultRouter.post("/appointments",isAuthenticated, bookAppointment)

pVaultRouter.patch("/appointment/:id", isAuthenticated, isAuthorized(["patient","doctor", "admin"]), reschedulAppointment)

pVaultRouter.patch("/confirmAppointment/:id",isAuthenticated,isAuthorized(["patient","doctor", "admin"]), confirmAppointmet)

pVaultRouter.post("/checkIn/",isAuthenticated, CheckIn)

pVaultRouter.get("/appointment/:id", isAuthenticated, getAppointments)

pVaultRouter.delete("/cancelAppointment/:id", isAuthenticated, isAuthorized(["patient", "doctor", "admin"]), cancelAppointment)


//---------------------------------------------------------------------------------
// MEDICINES
pVaultRouter.post("/medicine",isAuthenticated,isAuthorized(["pharmacist", "admin"]),addMedicine)

pVaultRouter.get("/medicine", isAuthenticated, getAllMedicines)

pVaultRouter.patch("/medicine/:id",isAuthenticated,isAuthorized(["pharmacist", "admin"]),updateMedicine)

pVaultRouter.delete("/medicine/:id", isAuthenticated,isAuthorized(["pharmacist","admin"], deleteMedicine))

//---------------------------------------------------------------------------------
// PRESCRIPTIONS
pVaultRouter.post("/prescriptions",prescriptionUpload.array("prescriptions"), isAuthenticated,isAuthorized(['patient', 'doctor', 'admin']), addPrescription)

pVaultRouter.get("/prescriptions", isAuthenticated,getAllprescriptions)

pVaultRouter.patch("/prescription/:id", isAuthenticated, updatePrescription)


//---------------------------------------------------------------------------------
//BLOGS ROUTES
pVaultRouter.post("/blogs", blogsCoverPhotoUpload, isAuthenticated, isAuthorized(["doctor", "nurse", "pharmacist", "admin"]), createBlog)

pVaultRouter.get("/blogs", getBlogs)

pVaultRouter.get("/blog/:id", getBlog)

pVaultRouter.get("/blogs/author", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), getAuthorBlogs)

pVaultRouter.delete("/blog/:id", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), deleteBlog)

pVaultRouter.patch("/blog/:id", blogsCoverPhotoUpload, isAuthenticated, isAuthorized(["doctor", "pharmacist", "admin"]), updateBlog)





export default pVaultRouter;


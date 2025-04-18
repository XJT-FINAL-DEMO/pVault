import { Router } from "express";
import { addFacility, getFacilities, getNearbyFacility } from "../controller/facilitiesController.js";
import { addPrescription, getAllprescriptions, updatePrescription } from "../controller/prescriptController.js";
import { bookAppointment, getAppointments,CheckIn } from "../controller/appointmentController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createBlog, deleteBlog, getAuthorBlogs, getBlog, getBlogs, updateBlog } from "../controller/blogsController.js";
import { blogsCoverPhotoUpload,prescriptionUpload } from "../middleware/upload.js";



const pVaultRouter = Router();

// FACILITY ROUTES
pVaultRouter.post("/api/facility",isAuthenticated,isAuthorized(["doctor","pharmacist","admin"]), addFacility)

pVaultRouter.get("/api/facilities", isAuthenticated,getFacilities)

pVaultRouter.patch("api/facility/:id", isAuthenticated, isAuthorized(['doctor','admin']))

pVaultRouter.get("/api/facility", isAuthenticated, getNearbyFacility)


// APPOINTMENTS ROUTES
pVaultRouter.post("/api/bookAppointment/",isAuthenticated, bookAppointment)

pVaultRouter.post("/api/checkIn/",isAuthenticated, CheckIn)

pVaultRouter.get("/api/appointment/:id", isAuthenticated, getAppointments)


// PRESCRIPTIONS
pVaultRouter.post("/",prescriptionUpload.array("prescriptions"), isAuthenticated,isAuthorized(['patient', 'doctor']), addPrescription)

pVaultRouter.get("/api/prescriptions", isAuthenticated,getAllprescriptions)

pVaultRouter.patch("/api/prescription/:id", isAuthenticated, updatePrescription)

//BLOGS ROUTES
pVaultRouter.post("/api/blogs", isAuthenticated, isAuthorized(["doctor", "nurse", "pharmacist", "admin"]),blogsCoverPhotoUpload, createBlog)

pVaultRouter.get("/api/blogs", getBlogs)

pVaultRouter.get("/api/blog/:id", getBlog)

pVaultRouter.get("/api/blogs/author", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), getAuthorBlogs)

pVaultRouter.delete("/api/blog/:id", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), deleteBlog)

pVaultRouter.patch("/api/blog/:id", blogsCoverPhotoUpload, isAuthenticated, isAuthorized(["doctor", "pharmacist", "admin"]), updateBlog)





export default pVaultRouter;


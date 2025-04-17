import { Router } from "express";
import { addFacility, getNearbyFacility } from "../controller/facilitiesController.js";
import { bookAppointment, getAppointments,CheckIn } from "../controller/appointmentController.js";
import { isAuthenticated, isAuthorized } from "../middleware/auth.js";
import { createBlog, deleteBlog, getAuthorBlogs, getBlog, getBlogs, updateBlog } from "../controller/blogsController.js";
import { blogsCoverPhotoUpload } from "../middleware/upload.js";



const pVaultRouter = Router();

pVaultRouter.get("/api/facility", isAuthenticated, getNearbyFacility)

pVaultRouter.post("/api/facility",isAuthenticated, addFacility)

pVaultRouter.post("/api/book/",isAuthenticated, bookAppointment)

pVaultRouter.post("/api/checkIn/",isAuthenticated, CheckIn)

pVaultRouter.get("/", isAuthenticated, getAppointments)



//BLOGS ROUTER
pVaultRouter.post("/api/blogs", isAuthenticated, isAuthorized(["doctor", "nurse", "pharmacist", "admin"]),blogsCoverPhotoUpload, createBlog)

pVaultRouter.get("/api/blogs", getBlogs)

pVaultRouter.get("/api/blog/:id", getBlog)

pVaultRouter.get("/api/blogs/author", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), getAuthorBlogs)

pVaultRouter.delete("/api/blog/:id", isAuthenticated, isAuthorized(["doctor","pharmacist", "admin"]), deleteBlog)

pVaultRouter.patch("/api/blog/:id", blogsCoverPhotoUpload, isAuthenticated, isAuthorized(["doctor", "pharmacist", "admin"]), updateBlog)





export default pVaultRouter;


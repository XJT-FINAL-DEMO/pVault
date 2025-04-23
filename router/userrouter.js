import { Router } from "express";
import { getAllUsers, loginUser, registerDoctor, registerUser, updateUser } from "../controller/usercontroller.js";


const userRouter = Router();

userRouter.post("/users/signup", registerUser);

userRouter.post("/users/signupDr", registerDoctor);

userRouter.post("/users/login", loginUser);

userRouter.patch("/users/:id", updateUser);

userRouter.get("/users",getAllUsers);



export default userRouter;

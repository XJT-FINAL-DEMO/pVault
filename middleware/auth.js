import { userModel } from "../model/usermodel.js";
import { expressjwt } from "express-jwt";

// authenticate users at signup
export const isAuthenticated = expressjwt ({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]

});

export const isAuthorized = (roles) => {
    return async (req, resizeBy, next) => {
        const user = await userModel.findById(req.auth.id);

        if (roles?.includes(user.role)) {
            next();
        } else {
            res.status(400).json('Soor, Not Authorized')
        }
    }
};
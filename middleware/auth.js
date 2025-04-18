import { userModel } from "../model/userModel.js";
import { expressjwt } from "express-jwt";

// authenticate users at signup
export const isAuthenticated = expressjwt ({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"]

});

export const isAuthorized = (roles) => {
    return async (req, res, next) => {
        const user = await userModel.findById(req.auth.id);

        if (roles?.includes(user.role)) {
            next();
        } else {
            res.status(400).json('Sorry, Not Authorized')
        }
    }
};
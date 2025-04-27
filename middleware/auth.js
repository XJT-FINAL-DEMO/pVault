import { doctorsModel } from "../model/doctorsModel.js";
import { userModel } from "../model/userModel.js";
import { expressjwt } from "express-jwt";

// authenticate users at signup
export const isAuthenticated = expressjwt({
    secret: process.env.JWT_SECRET,
    algorithms: ["HS256"],
    requestProperty: "auth"

});

export const isAuthorized = (roles=[]) => {
    return async (req, res, next) => {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({error: "Unauthorized:missing authentication infomation "});
        }
        const user = await userModel.findById(req.auth.id);
        if (!user) {
            return res.status(404).json({error:'Unauthorized, User not Found'})
        }
        if (roles?.includes(user.role)) {
            next();
        } else {
            res.status(400).json('Sorry, Not Authorized')
        }
    }
};


// AN AUTHORIZATION FOR THE DOCTORS MODEL
export const Authorized = (roles=[]) => {
    return async (req, res, next) => {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({error: "Unauthorized:missing authentication infomation "});
        }
        const user = await doctorsModel.findById(req.auth.id);
        if (!user) {
            return res.status(404).json({error:'Unauthorized, Doctor not Found'})
        }
        if (roles?.includes(user.role)) {
            next();
        } else {
            res.status(400).json('Sorry, Not Authorized')
        }
    }
};







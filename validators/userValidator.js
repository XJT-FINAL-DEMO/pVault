import Joi from 'joi';


// User registeration validator
export const registerUserValidator = Joi.object({
    //username:Joi.string().alpharnum().min(4).max(30).required(),
    firstName: Joi.string().regex(/^[A-Za-z]+$/).required(),
    lastName: Joi.string().regex(/^[A-Za-z]+$/).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().required(),
    confirmPassword: Joi.string().valid(Joi.ref('password')),
    role: Joi.string().valid('patient', 'labTech', 'nurse', 'pharmacist', 'doctor', 'admin').optional(),//default role is patient
    location: Joi.string().allow(null, '').optional(),
    // medicalRecords: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    appointments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
}).with("password", "confirmPassword");


// user login validators
export const loginUserValidator = Joi.object({
    email:Joi.string().email().required(),
    password:Joi.string().required(),
});

// user update validator
export const UpdateUserValidator = Joi.object({
    //username:Joi.string().alpharnum().min(4).max(30).required(),
    firstName: Joi.string().regex(/^[A-Za-z]+$/).required(),
    lastName: Joi.string().regex(/^[A-Za-z]+$/).required(),
    email: Joi.string().optional(),
    password: Joi.string().optional(),
    confirmPassword: Joi.string().valid(Joi.ref('password')),
    role: Joi.string().valid('patient', 'labTech','pharmacist', 'doctor', 'admin').optional(),//default role is patient
    location: Joi.string().allow(null, '').optional(),
    // medicalRecords: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
    appointments: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).optional(),
})
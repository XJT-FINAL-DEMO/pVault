import Joi from 'joi';

const doctorsValidator = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    specialization: Joi.string().required(),
    license: Joi.string().required(),
    facilities: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/)).min(1).required(), // Added validation for facilities array
    role: Joi.string().valid('pharmacist', 'doctor'),
    availability: Joi.array().items(
        Joi.object({
            day: Joi.array().items(Joi.string()),
            slots: Joi.array().items(Joi.string())
        })
    )
});

export default doctorsValidator;
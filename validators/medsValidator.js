import Joi from "joi";

export const medicineValidator = Joi.object({
    name: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    expiryDate: Joi.date().greater('now').required()
});
import Joi from "joi";

export const medsValidator = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    quantity: Joi.number().min(1).required(),
    manufacturer: Joi.string().required(),
    price:Joi.number().min(0).required(),
    expiryDate: Joi.date().greater('now').required()
});
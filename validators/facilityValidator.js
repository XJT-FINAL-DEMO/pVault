import Joi from 'joi';





export const facilityUpdatValidator = Joi.object({
    name: Joi.string().optional().label('Name'),
    type: Joi.string().valid('hospital', 'pharmacy').optional().label('Type'),
    location: Joi.object({
        type: Joi.string().default('Point').optional().label('Location Type'),
        coordinates: Joi.array().items(Joi.number().min(-180).max(180), Joi.number().min(-90).max(90)).length(2).optional().label('Coordinates'),
    }).optional().label('Location'),
    address: Joi.string().optional().label('Address'),
    phone: Joi.string()
        .optional()
        .pattern(/^\d{10}$/)
        .messages({ 'string.pattern.base': 'Invalid phone number!' })
        .label('Phone'),
    openingHours: Joi.array().items(
        Joi.object({
            day: Joi.string().required().label('Opening Day'),
            hours: Joi.string().required().label('Opening Hours'),
        }).optional()
    ).optional().label('Opening Hours'),
    is247: Joi.boolean().optional().label('Is 24/7'),
    services: Joi.array().items(Joi.string()).optional().label('Services'),
    pictures: Joi.array().items(Joi.string()).optional().label('Pictures'),
});

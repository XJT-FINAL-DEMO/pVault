import Joi, { date } from 'joi';

// medicalRecords Validator
export const medicalRecordsValidator = Joi.object({
    user_id:Joi.string().regex(/^[0-9a-fA-f]{24}$/).required(),
    facility_id:Joi.string().regex(/^[0-9a-fA-f]{24}$/).required(),
    date: Joi.date().required(),
    diagnosis:Joi.string().required(),
    treatment:Joi.string().allow(null,'').optional(),
    notes:Joi.string().allow(null,'').optional(),
});


// appointment validator

export const appointmentValidator = Joi.object({
    user_id:Joi.string().regex(/^[0-9a-fA-f]{24}$/).required(),
    doctor_id:Joi.string().regex(/^[0-9a-fA-f]{24}$/).required(),
    facility_id:Joi.string().regex(/^[0-9a-fA-f]{24}$/).required(),
    date:Joi.date().required(),
    time:Joi.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/),
    status:Joi.string().valid('booked','cancelled','completed').required(),
});
import Joi from "joi";

const statusEnum = ['draft', 'published']

export const blogValidator = Joi.object({
    title: Joi.string().required().trim(),
    content: Joi.string().required(),
    tags: Joi.string(),
    image: Joi.string().uri().required(),
    status: Joi.string().valid(...statusEnum).default('draft')
}).options({abortEarly: false});


export const updateBlogValidator = Joi.object({
    title: Joi.string().optional().trim(),
    content: Joi.string().optional(),
    excerpt: Joi.string(),
    image: Joi.string().uri().optional(),
    status: Joi.string().valid(...statusEnum).default('draft')
}).options({abortEarly: false});

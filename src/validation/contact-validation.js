import Joi from "joi";

const createContactValidation = Joi.object({
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email().max(200).required(),
    phone: Joi.string().max(20).required()
});

const updateContactValidation = Joi.object({
    id: Joi.number().positive().required(),
    first_name: Joi.string().max(100).required(),
    last_name: Joi.string().max(100).required(),
    email: Joi.string().email().max(200).required(),
    phone: Joi.string().max(20).required()
});



const contactValidation = Joi.number().positive();

export { createContactValidation, contactValidation, updateContactValidation }
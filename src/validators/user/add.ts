import Joi from "joi";

const catSchema = Joi.object({
    name: Joi.string().required(),
});

const industrySchema = Joi.object({
    name: Joi.string().required(),
});

export {
    catSchema,
    industrySchema
}

import messages from "@Custom_message/index";
import Joi from "joi";

const knowledge_baseSchema = Joi.object({
    type: Joi.string().required(),
    // uploadBy: Joi.string().required().valid('user', 'admin')
});

const delete_baseSchema = Joi.object({
    deleteAll: Joi.boolean().optional(),
    knowledge_baseIds: Joi.when("deleteAll", {
        is: false,
        then: Joi.array().min(1).required(),
        otherwise: Joi.array().optional()
    })
});

export {
    knowledge_baseSchema,
    delete_baseSchema
}
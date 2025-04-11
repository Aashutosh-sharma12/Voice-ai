import messages from "@Custom_message/index";
import Joi from "joi";

const promptListSchema = Joi.object({
    categoryId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "categoryId"),
        }),
    industriesId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "categoryId"),
        })
});
export {
    promptListSchema
}
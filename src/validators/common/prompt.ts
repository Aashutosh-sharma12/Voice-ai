import messages from "@Custom_message/index";
import Joi from "joi";

const addPromptSchema = Joi.object({
    title: Joi.string().required(),
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
        }),
    step1_draftStatus: Joi.boolean().required()
});

const editPromptSchema = Joi.object({
    promptId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "promptId"),
        }),
    title: Joi.string().required(),
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
            "string.min": messages.invalidMongoId.replace("{{key}}", "industriesId"),
        }),
    step1_draftStatus: Joi.boolean().required()
});

const add_editContext_scopeSchema = Joi.object({
    promptId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "promptId"),
        }),
    agent_openingStatement: Joi.string().required(),
    agent_introduction: Joi.string().required(),
    detailed_context: Joi.string().required(),
    agent_constraint_limitation: Joi.string().required(),
    agent_behaviour: Joi.string().required(),
    tools_style_requirementsId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "tools_style_requirementsId"),
        }),
    knowledge_baseId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "knowledge_baseId"),
        }),
    agent_closingStatement: Joi.string().required(),
    step2_draftStatus: Joi.boolean().required()
});
const add_editExecution_requirementSchema = Joi.object({
    promptId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "promptId"),
        }),
    task_details: Joi.array().min(1).required(),
    prompt_task_structure_details: Joi.array().min(1).required(),
    error_handling_protocal: Joi.string().required(),
    step3_draftStatus: Joi.boolean().required()
});

export {
    addPromptSchema,
    editPromptSchema,
    add_editContext_scopeSchema,
    add_editExecution_requirementSchema
}
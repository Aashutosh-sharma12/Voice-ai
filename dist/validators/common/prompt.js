"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.add_editExecution_requirementSchema = exports.add_editContext_scopeSchema = exports.editPromptSchema = exports.addPromptSchema = void 0;
const index_1 = __importDefault(require("../../Custom_message/index"));
const joi_1 = __importDefault(require("joi"));
const addPromptSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "categoryId"),
    }),
    industriesId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "categoryId"),
    }),
    step1_draftStatus: joi_1.default.boolean().required()
});
exports.addPromptSchema = addPromptSchema;
const editPromptSchema = joi_1.default.object({
    promptId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "promptId"),
    }),
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "categoryId"),
    }),
    industriesId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "industriesId"),
    }),
    step1_draftStatus: joi_1.default.boolean().required()
});
exports.editPromptSchema = editPromptSchema;
const add_editContext_scopeSchema = joi_1.default.object({
    promptId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "promptId"),
    }),
    agent_openingStatement: joi_1.default.string().required(),
    agent_introduction: joi_1.default.string().required(),
    detailed_context: joi_1.default.string().required(),
    agent_constraint_limitation: joi_1.default.string().required(),
    agent_behaviour: joi_1.default.string().required(),
    tools_style_requirementsId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "tools_style_requirementsId"),
    }),
    knowledge_baseId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "knowledge_baseId"),
    }),
    agent_closingStatement: joi_1.default.string().required(),
    step2_draftStatus: joi_1.default.boolean().required()
});
exports.add_editContext_scopeSchema = add_editContext_scopeSchema;
const add_editExecution_requirementSchema = joi_1.default.object({
    promptId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "promptId"),
    }),
    task_details: joi_1.default.array().min(1).required(),
    prompt_task_structure_details: joi_1.default.array().min(1).required(),
    error_handling_protocal: joi_1.default.string().required(),
    step3_draftStatus: joi_1.default.boolean().required()
});
exports.add_editExecution_requirementSchema = add_editExecution_requirementSchema;

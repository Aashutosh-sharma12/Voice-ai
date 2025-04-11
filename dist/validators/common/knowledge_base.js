"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.delete_baseSchema = exports.knowledge_baseSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const knowledge_baseSchema = joi_1.default.object({
    type: joi_1.default.string().required(),
    // uploadBy: Joi.string().required().valid('user', 'admin')
});
exports.knowledge_baseSchema = knowledge_baseSchema;
const delete_baseSchema = joi_1.default.object({
    deleteAll: joi_1.default.boolean().optional(),
    knowledge_baseIds: joi_1.default.when("deleteAll", {
        is: false,
        then: joi_1.default.array().min(1).required(),
        otherwise: joi_1.default.array().optional()
    })
});
exports.delete_baseSchema = delete_baseSchema;

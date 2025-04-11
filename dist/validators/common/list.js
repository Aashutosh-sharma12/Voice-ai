"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.promptListSchema = void 0;
const index_1 = __importDefault(require("../../Custom_message/index"));
const joi_1 = __importDefault(require("joi"));
const promptListSchema = joi_1.default.object({
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
    })
});
exports.promptListSchema = promptListSchema;

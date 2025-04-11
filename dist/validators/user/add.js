"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.industrySchema = exports.catSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const catSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
exports.catSchema = catSchema;
const industrySchema = joi_1.default.object({
    name: joi_1.default.string().required(),
});
exports.industrySchema = industrySchema;

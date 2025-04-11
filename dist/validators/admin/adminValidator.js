"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminLogin = exports.adminSignup = exports.editCatValidator = exports.IndValidator = exports.CatValidator = void 0;
const index_1 = __importDefault(require("../../Custom_message/index"));
const joi_1 = __importDefault(require("joi"));
const customJoi = joi_1.default.extend((joi) => ({
    type: "phoneNumber",
    base: joi.string(),
    messages: {
        "phoneNumber.base": "Phone Number should contain only digits",
    },
    rules: {
        digitsOnly: {
            validate(value, helpers) {
                if (value !== "" && !/^[0-9]+$/.test(value)) {
                    return helpers.error("phoneNumber.base");
                }
                return value;
            },
        },
    },
}));
const IndValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    isActive: joi_1.default.boolean().required()
});
exports.IndValidator = IndValidator;
const CatValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    isActive: joi_1.default.boolean().required()
});
exports.CatValidator = CatValidator;
const editCatValidator = joi_1.default.object({
    name: joi_1.default.string().required(),
    isActive: joi_1.default.boolean().required(),
    id: joi_1.default.string().min(24).required()
        .messages({
        'string.min': index_1.default.invalidMongoId.replace('{{key}}', 'id')
    }),
});
exports.editCatValidator = editCatValidator;
const adminSignup = joi_1.default.object({
    username: joi_1.default.string().required().min(3),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    contact_number: customJoi
        .phoneNumber()
        .min(3)
        .max(20)
        .required()
        .digitsOnly()
        .messages({
        "string.empty": "Phone Number cannot be an empty field",
        "string.min": "Phone Number should have a minimum length of {#limit}",
        "string.max": "Phone Number should have a maximum length of {#limit}",
        "any.required": "Phone Number is a required field",
        "phoneNumber.base": "Phone Number should contain only digits",
    }),
});
exports.adminSignup = adminSignup;
const adminLogin = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    password: joi_1.default.string().required(),
});
exports.adminLogin = adminLogin;

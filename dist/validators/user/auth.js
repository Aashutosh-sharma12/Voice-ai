"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyLinkSchema = exports.changePasswordSchema = exports.socialLogin = exports.forgotPasswordSchema = exports.verifyOtpSchema = exports.userInfoSchema = exports.loginSchema = exports.authSchema = void 0;
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
const authSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    countryCode: joi_1.default.string().required(),
    phoneNumber: customJoi
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
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    confirmationLink: joi_1.default.string().optional().allow('', null)
});
exports.authSchema = authSchema;
const loginSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    password: joi_1.default.string().required()
});
exports.loginSchema = loginSchema;
const userInfoSchema = joi_1.default.object({
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    forgotPasswordLink: joi_1.default.string().required()
});
exports.userInfoSchema = userInfoSchema;
const verifyOtpSchema = joi_1.default.object({
    otp: joi_1.default.string().required()
});
exports.verifyOtpSchema = verifyOtpSchema;
const forgotPasswordSchema = joi_1.default.object({
    password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    confirmPassword: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    })
});
exports.forgotPasswordSchema = forgotPasswordSchema;
const changePasswordSchema = joi_1.default.object({
    old_password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    new_password: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
    confirmPassword: joi_1.default.string()
        .required()
        .pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"))
        .messages({
        "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    })
});
exports.changePasswordSchema = changePasswordSchema;
const socialLogin = joi_1.default.object({
    socialId: joi_1.default.string().required(),
    email: joi_1.default.string().email({ minDomainSegments: 2 }).required(),
    countryCode: joi_1.default.string().optional(),
    phoneNumber: customJoi
        .phoneNumber()
        .min(3)
        .max(20)
        .optional()
        .digitsOnly()
        .messages({
        "string.empty": "Phone Number cannot be an empty field",
        "string.min": "Phone Number should have a minimum length of {#limit}",
        "string.max": "Phone Number should have a maximum length of {#limit}",
        "any.required": "Phone Number is a required field",
        "phoneNumber.base": "Phone Number should contain only digits",
    }).allow('')
});
exports.socialLogin = socialLogin;
const verifyLinkSchema = joi_1.default.object({
    token: joi_1.default.string().required()
});
exports.verifyLinkSchema = verifyLinkSchema;

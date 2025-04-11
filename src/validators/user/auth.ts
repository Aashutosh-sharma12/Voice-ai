import messages from '@Custom_message/index';
import Joi from 'joi';
const customJoi = Joi.extend((joi) => ({
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
const authSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  countryCode: Joi.string().required(),
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
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirmationLink: Joi.string().optional().allow('', null)
});

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required()
});

const userInfoSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  forgotPasswordLink: Joi.string().required()
});

const verifyOtpSchema = Joi.object({
  otp: Joi.string().required()
});

const forgotPasswordSchema = Joi.object({
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirmPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    })
});

const changePasswordSchema = Joi.object({
  old_password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  new_password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    }),
  confirmPassword: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#.\\-:_/])[A-Za-z\\d@$!%*?&#.\\-:_/]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
    })
});

const socialLogin = Joi.object({
  socialId: Joi.string().required(),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  countryCode: Joi.string().optional(),
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

const verifyLinkSchema = Joi.object({
  token: Joi.string().required()
});

export {
  authSchema,
  loginSchema,
  userInfoSchema,
  verifyOtpSchema,
  forgotPasswordSchema,
  socialLogin,
  changePasswordSchema,
  verifyLinkSchema
}
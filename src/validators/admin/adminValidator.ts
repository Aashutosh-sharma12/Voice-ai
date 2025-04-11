import messages from "@Custom_message/index";
import Joi from "joi";

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

const IndValidator = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().required()
})

const CatValidator = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().required()
})

const editCatValidator = Joi.object({
  name: Joi.string().required(),
  isActive: Joi.boolean().required(),
  id: Joi.string().min(24).required()
    .messages({
      'string.min': messages.invalidMongoId.replace('{{key}}', 'id')
    }),
})

const adminSignup = Joi.object({
  username: Joi.string().required().min(3),
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string()
    .required()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#_])[A-Za-z\\d@$!%*?&#_]{8,}$"
      )
    )
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
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

const adminLogin = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2 }).required(),
  password: Joi.string().required(),
});


export {
  CatValidator,
  IndValidator,
  editCatValidator,
  adminSignup,
  adminLogin
}
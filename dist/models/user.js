"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    uniqueId: { type: String },
    social_login_details: {
        socialId: { type: String, default: '' }, // Google Login Id
        email: { type: String, default: '' }
    },
    social_loginStatus: { type: Boolean, default: false },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    email: { type: String, required: true },
    countryCode: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String, default: '' },
    password: { type: String, default: '' },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const userModel = (0, mongoose_1.model)('users', userSchema);
exports.default = userModel;

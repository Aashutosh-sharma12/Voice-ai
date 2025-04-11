"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact_number: { type: String, required: true },
    token: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const adminauthModal = (0, mongoose_1.model)('admin', adminSchema);
exports.default = adminauthModal;

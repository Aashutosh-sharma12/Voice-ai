"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const linkSchema = new mongoose_1.Schema({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const linkModel = (0, mongoose_1.model)('link', linkSchema);
exports.default = linkModel;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const knowledge_baseSchema = new mongoose_1.Schema({
    userId: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    file_content: { type: String, required: true },
    uploadBy: { type: String, default: 'user' },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const knowledge_baseModel = (0, mongoose_1.model)('knowledge_bases', knowledge_baseSchema);
exports.default = knowledge_baseModel;

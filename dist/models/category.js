"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.industryModel = exports.categoryModel = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    userId: { type: String, default: '' },
    addBy: { type: String, default: 'admin' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
const categoryModel = (0, mongoose_1.model)('categories', schema);
exports.categoryModel = categoryModel;
const industriesSchema = new mongoose_1.Schema({
    userId: { type: String, default: '' },
    addBy: { type: String, default: 'admin' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
const industryModel = (0, mongoose_1.model)('industries', industriesSchema);
exports.industryModel = industryModel;

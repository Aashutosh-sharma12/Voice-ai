"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.prompt_task_structureModel = exports.prompt_taskModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const prompt_taskSchema = new mongoose_1.Schema({
    promptId: { type: mongoose_1.default.Types.ObjectId, ref: 'prompts', required: true },
    userId: { type: String },
    task_description: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const prompt_taskModel = (0, mongoose_1.model)('prompt_task', prompt_taskSchema);
exports.prompt_taskModel = prompt_taskModel;
const prompt_task_structureSchema = new mongoose_1.Schema({
    promptId: { type: mongoose_1.default.Types.ObjectId, ref: 'prompts', required: true },
    userId: { type: String },
    prompt_task_structure: { type: String },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const prompt_task_structureModel = (0, mongoose_1.model)('prompt_task_structure', prompt_task_structureSchema);
exports.prompt_task_structureModel = prompt_task_structureModel;

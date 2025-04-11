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
const mongoose_1 = __importStar(require("mongoose"));
const promptSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    addBy: { type: String, default: 'user' }, // user, admin
    title: { type: String, required: true },
    categoryId: { type: mongoose_1.default.Types.ObjectId, required: true },
    industriesId: { type: mongoose_1.default.Types.ObjectId, required: true },
    step1_status: { type: Boolean, default: false },
    step1_draftStatus: { type: Boolean, default: false },
    agent_openingStatement: { type: String },
    agent_introduction: { type: String },
    detailed_context: { type: String },
    agent_constraint_limitation: { type: String },
    agent_behaviour: { type: String },
    tools_style_requirementsId: { type: mongoose_1.default.Types.ObjectId },
    knowledge_baseId: { type: mongoose_1.default.Types.ObjectId },
    agent_closingStatement: { type: String },
    step2_status: { type: Boolean, default: false }, // Context & Scope
    step2_draftStatus: { type: Boolean, default: false },
    error_handling_protocal: { type: String },
    step3_status: { type: Boolean, default: false },
    step3_draftStatus: { type: Boolean, default: false }, // Execution Requirements
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
promptSchema.index({ isDelete: 1, isActive: 1 });
promptSchema.index({ categoryId: -1 });
promptSchema.index({ industriesId: -1 });
const promptModel = (0, mongoose_1.model)('prompts', promptSchema);
exports.default = promptModel;

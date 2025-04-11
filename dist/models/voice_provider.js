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
exports.voice_providerVoice_model = exports.voice_providerModel_model = exports.voice_providerModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const voice_providerSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
const voice_providerModel = (0, mongoose_1.model)('voice_providers', voice_providerSchema);
exports.voice_providerModel = voice_providerModel;
const schema = new mongoose_1.Schema({
    providerId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'voice_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
const voice_providerModel_model = (0, mongoose_1.model)('voice_providerModels', schema);
exports.voice_providerModel_model = voice_providerModel_model;
const voice_providerVoiceSchema = new mongoose_1.Schema({
    providerId: { type: mongoose_1.default.Types.ObjectId, required: true, ref: 'voice_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});
const voice_providerVoice_model = (0, mongoose_1.model)('voice_providerVoices', voice_providerVoiceSchema);
exports.voice_providerVoice_model = voice_providerVoice_model;

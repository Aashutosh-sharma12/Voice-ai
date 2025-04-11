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
const agentSchema = new mongoose_1.Schema({
    // #### Basic Info  ##### 
    userId: { type: String, required: true },
    addBy: { type: String, default: 'user' }, // user, admin
    title: { type: String, required: true },
    categoryId: { type: mongoose_1.default.Types.ObjectId, required: true },
    industriesId: { type: mongoose_1.default.Types.ObjectId, required: true },
    step1_status: { type: Boolean, default: false },
    step1_draftStatus: { type: Boolean, default: false },
    // #### AI Configration  ####
    ai_providerId: { type: String },
    ai_modelId: { type: String },
    ai_token: { type: Number },
    promptId: { type: String },
    temperature: { type: Number },
    detectEmotion: { type: Boolean, default: false },
    step2_status: { type: Boolean, default: false },
    step2_draftStatus: { type: Boolean, default: false },
    // #### Transcription ####
    transcription_providerId: { type: String },
    transcription_modelId: { type: String },
    transcription_language: { type: String },
    step3_status: { type: Boolean, default: false },
    step3_draftStatus: { type: Boolean, default: false },
    // #### Voice ####
    voice_providerId: { type: String },
    voiceId: { type: String },
    voice_modelId: { type: String },
    voice_additionalConfiguration: {
        background_sound: { type: String, default: '' },
        min_characters: { type: String, default: '' },
        punctuation_boundaries: { type: String, default: '' },
        stability: { type: Number, default: 0 },
        clarity_similarity: { type: Number, default: 0 },
        style_exaggeration: { type: Number, default: 0 },
        streaming_latency: { type: Number, default: 0 }
    },
    step4_status: { type: Boolean, default: false },
    step4_draftStatus: { type: Boolean, default: false },
    // #### Functions ####
    isEnabled_endCallFunction: { type: Boolean, default: false },
    dial_keypad: { type: Boolean, default: false },
    countryCode: { type: String },
    phoneNumber: { type: String },
    end_callPhrase: { type: String },
    step5_status: { type: Boolean, default: false },
    step5_draftStatus: { type: Boolean, default: false },
    // ############### Advanced ####
    // #### Privacy  ####
    isHIPAA_Compliance: { type: Boolean, default: false }, // When this is enabled, no logs, recordings, or transcriptions will be stored.
    isAudio_Recording: { type: Boolean, default: false }, // Record the conversation with the assistant.
    isVideo_Recording: { type: Boolean, default: false }, // Enable or disable video recording during a web call. This will record the video of your user.
    // #### Start Speaking Plan ####
    wait_seconds: { type: Number, default: 0 },
    punctuation_seconds: { type: Number, default: 0 },
    no_punctuation_seconds: { type: Number, default: 0 },
    smart_endPoint: { type: Boolean, default: false },
    step6_status: { type: Boolean, default: false },
    step6_draftStatus: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const agentModel = (0, mongoose_1.model)('agents', agentSchema);
exports.default = agentModel;

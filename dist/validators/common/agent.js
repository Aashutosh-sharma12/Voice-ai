"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.advance_configurationSchema = exports.function_configurationSchema = exports.voice_configurationSchema = exports.transcription_configurationSchema = exports.ai_configurationSchema = exports.editBasicInfoSchema = exports.addBasicInfoSchema = void 0;
const index_1 = __importDefault(require("../../Custom_message/index"));
const joi_1 = __importDefault(require("joi"));
const addBasicInfoSchema = joi_1.default.object({
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "categoryId"),
    }),
    industriesId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "industriesId"),
    }),
    step1_draftStatus: joi_1.default.boolean().required()
});
exports.addBasicInfoSchema = addBasicInfoSchema;
const editBasicInfoSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    title: joi_1.default.string().required(),
    categoryId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "categoryId"),
    }),
    industriesId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "industriesId"),
    }),
    step1_draftStatus: joi_1.default.boolean().required()
});
exports.editBasicInfoSchema = editBasicInfoSchema;
const ai_configurationSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    ai_providerId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "ai_providerId"),
    }),
    ai_modelId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "ai_modelId"),
    }),
    ai_token: joi_1.default.number().required(),
    promptId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "promptId"),
    }),
    temperature: joi_1.default.number().required(),
    detectEmotion: joi_1.default.boolean().required(),
    step2_draftStatus: joi_1.default.boolean().required()
});
exports.ai_configurationSchema = ai_configurationSchema;
const transcription_configurationSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    transcription_providerId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "transcription_providerId"),
    }),
    transcription_modelId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "transcription_modelId"),
    }),
    transcription_language: joi_1.default.string().required(),
    step3_draftStatus: joi_1.default.boolean().required()
});
exports.transcription_configurationSchema = transcription_configurationSchema;
const voice_configurationSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    voice_providerId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "voice_providerId"),
    }),
    voiceId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "voiceId"),
    }),
    voice_modelId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "voice_modelId"),
    }),
    background_sound: joi_1.default.string().required(),
    min_characters: joi_1.default.string().required(),
    punctuation_boundaries: joi_1.default.string().required(),
    stability: joi_1.default.number().required(),
    clarity_similarity: joi_1.default.number().required(),
    style_exaggeration: joi_1.default.number().required(),
    streaming_latency: joi_1.default.number().required(),
    step4_draftStatus: joi_1.default.boolean().required()
});
exports.voice_configurationSchema = voice_configurationSchema;
const function_configurationSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    isEnabled_endCallFunction: joi_1.default.boolean().required(),
    dial_keypad: joi_1.default.boolean().required(),
    countryCode: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string().required(),
    end_callPhrase: joi_1.default.string().required(),
    step5_draftStatus: joi_1.default.boolean().required()
});
exports.function_configurationSchema = function_configurationSchema;
const advance_configurationSchema = joi_1.default.object({
    agentId: joi_1.default.string()
        .min(24)
        .required()
        .messages({
        "string.min": index_1.default.invalidMongoId.replace("{{key}}", "agentId"),
    }),
    isHIPAA_Compliance: joi_1.default.boolean().required(), // When this is enabled, no logs, recordings, or transcriptions will be stored.
    isAudio_Recording: joi_1.default.boolean().required(), // Record the conversation with the assistant.
    isVideo_Recording: joi_1.default.boolean().required(), // Enable or disable video recording during a web call. This will record the video of your user.
    wait_seconds: joi_1.default.number().required(),
    punctuation_seconds: joi_1.default.number().required(),
    no_punctuation_seconds: joi_1.default.number().required(),
    smart_endPoint: joi_1.default.boolean().required(),
    step6_draftStatus: joi_1.default.boolean().required()
});
exports.advance_configurationSchema = advance_configurationSchema;

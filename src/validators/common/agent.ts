import messages from "@Custom_message/index";
import Joi from "joi";

const addBasicInfoSchema = Joi.object({
    title: Joi.string().required(),
    categoryId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "categoryId"),
        }),
    industriesId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "industriesId"),
        }),
    step1_draftStatus: Joi.boolean().required()
});

const editBasicInfoSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    title: Joi.string().required(),
    categoryId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "categoryId"),
        }),
    industriesId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "industriesId"),
        }),
    step1_draftStatus: Joi.boolean().required()
});

const ai_configurationSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    ai_providerId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "ai_providerId"),
        }),
    ai_modelId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "ai_modelId"),
        }),
    ai_token: Joi.number().required(),
    promptId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "promptId"),
        }),
    temperature: Joi.number().required(),
    detectEmotion: Joi.boolean().required(),
    step2_draftStatus: Joi.boolean().required()
});

const transcription_configurationSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    transcription_providerId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "transcription_providerId"),
        }),
    transcription_modelId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "transcription_modelId"),
        }),
    transcription_language: Joi.string().required(),
    step3_draftStatus: Joi.boolean().required()
});

const voice_configurationSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    voice_providerId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "voice_providerId"),
        }),
    voiceId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "voiceId"),
        }),
    voice_modelId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "voice_modelId"),
        }),

    background_sound: Joi.string().required(),
    min_characters: Joi.string().required(),
    punctuation_boundaries: Joi.string().required(),
    stability: Joi.number().required(),
    clarity_similarity: Joi.number().required(),
    style_exaggeration: Joi.number().required(),
    streaming_latency: Joi.number().required(),
    step4_draftStatus: Joi.boolean().required()
});

const function_configurationSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    isEnabled_endCallFunction: Joi.boolean().required(),
    dial_keypad: Joi.boolean().required(),
    countryCode: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    end_callPhrase: Joi.string().required(),
    step5_draftStatus: Joi.boolean().required()
});

const advance_configurationSchema = Joi.object({
    agentId: Joi.string()
        .min(24)
        .required()
        .messages({
            "string.min": messages.invalidMongoId.replace("{{key}}", "agentId"),
        }),
    isHIPAA_Compliance: Joi.boolean().required(),    // When this is enabled, no logs, recordings, or transcriptions will be stored.
    isAudio_Recording: Joi.boolean().required(),     // Record the conversation with the assistant.
    isVideo_Recording: Joi.boolean().required(),     // Enable or disable video recording during a web call. This will record the video of your user.
    wait_seconds: Joi.number().required(),
    punctuation_seconds: Joi.number().required(),
    no_punctuation_seconds: Joi.number().required(),
    smart_endPoint: Joi.boolean().required(),
    step6_draftStatus: Joi.boolean().required()
});

export {
    addBasicInfoSchema,
    editBasicInfoSchema,
    ai_configurationSchema,
    transcription_configurationSchema,
    voice_configurationSchema,
    function_configurationSchema,
    advance_configurationSchema
}
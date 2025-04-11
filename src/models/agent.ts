import { number } from "joi";
import mongoose, { model, Schema } from "mongoose"

interface agent {
    // #### Basic Info  ##### 
    userId: string;
    addBy: string;
    title: string;
    categoryId: any;
    industriesId: any;
    step1_status: boolean;
    step1_draftStatus: boolean;
    // #### AI Configration  ####
    ai_providerId: any;
    ai_modelId: any;
    ai_token: number;
    promptId: any;
    temperature: number;
    detectEmotion: boolean;
    step2_status: boolean;
    step2_draftStatus: boolean;
    // #### Transcription ####
    transcription_providerId: any;
    transcription_modelId: any;
    transcription_language: string;
    step3_status: boolean;
    step3_draftStatus: boolean;
    // #### Voice ####
    voice_providerId: any;
    voiceId: any;
    voice_modelId: any;
    voice_additionalConfiguration: any
    step4_status: boolean;
    step4_draftStatus: boolean;
    // #### Functions ####
    isEnabled_endCallFunction: boolean;
    dial_keypad: boolean;
    countryCode: string;
    phoneNumber: string;
    end_callPhrase: string;
    step5_status: boolean;
    step5_draftStatus: boolean;
    // ############### Advanced ####
    // #### Privacy  ####
    isHIPAA_Compliance: boolean;    // When this is enabled, no logs, recordings, or transcriptions will be stored.
    isAudio_Recording: boolean;     // Record the conversation with the assistant.
    isVideo_Recording: boolean;     // Enable or disable video recording during a web call. This will record the video of your user.
    // #### Start Speaking Plan ####
    wait_seconds: number;
    punctuation_seconds: number;
    no_punctuation_seconds: number;
    smart_endPoint: boolean;
    step6_status: boolean;
    step6_draftStatus: boolean;
    isDelete: boolean;
    isActive: boolean
}

const agentSchema = new Schema<agent>({
    // #### Basic Info  ##### 
    userId: { type: String, required: true },
    addBy: { type: String, default: 'user' },   // user, admin
    title: { type: String, required: true },
    categoryId: { type: mongoose.Types.ObjectId, required: true },
    industriesId: { type: mongoose.Types.ObjectId, required: true },
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
    isHIPAA_Compliance: { type: Boolean, default: false },    // When this is enabled, no logs, recordings, or transcriptions will be stored.
    isAudio_Recording: { type: Boolean, default: false },     // Record the conversation with the assistant.
    isVideo_Recording: { type: Boolean, default: false },     // Enable or disable video recording during a web call. This will record the video of your user.
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
const agentModel = model<agent>('agents', agentSchema);
export default agentModel;
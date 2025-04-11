import mongoose, { model, Schema } from "mongoose";

/***********  Voice Provider Schema       ******** */
interface voice_provider {
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const voice_providerSchema = new Schema<voice_provider>({
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const voice_providerModel = model<voice_provider>('voice_providers', voice_providerSchema);



/***********  Voice Provider Model Schema       ******** */
interface voice_providerModel {
    providerId: any;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const schema = new Schema<voice_providerModel>({
    providerId: { type: mongoose.Types.ObjectId, required: true, ref: 'voice_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const voice_providerModel_model = model<voice_providerModel>('voice_providerModels', schema);



/***********  Voice Provider Voice Schema       ******** */
interface voice_providerVoice {
    providerId: any;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const voice_providerVoiceSchema = new Schema<voice_providerVoice>({
    providerId: { type: mongoose.Types.ObjectId, required: true, ref: 'voice_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });

const voice_providerVoice_model = model<voice_providerVoice>('voice_providerVoices', voice_providerVoiceSchema);

export {
    voice_providerModel,
    voice_providerModel_model,
    voice_providerVoice_model
}
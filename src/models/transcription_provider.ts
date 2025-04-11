import mongoose, { model, Schema } from "mongoose";

/***********  Transcription Provider Schema       ******** */
interface transcription_provider {
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const transcription_providerSchema = new Schema<transcription_provider>({
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });

const transcription_providerModel = model<transcription_provider>('transcription_providers', transcription_providerSchema);



/***********  Transcription Provider Model Schema       ******** */
interface transcription_providerModel {
    providerId: any;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const schema = new Schema<transcription_providerModel>({
    providerId: { type: mongoose.Types.ObjectId, required: true, ref: 'transcription_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const transcription_providerModel_model = model<transcription_providerModel>('transcription_providerModels', schema);

export {
    transcription_providerModel,
    transcription_providerModel_model
}
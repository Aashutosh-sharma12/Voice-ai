import mongoose, { model, Schema } from "mongoose";

/***********  AI Provider Schema       ******** */
interface ai_provider {
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const ai_providerSchema = new Schema<ai_provider>({
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const ai_providerModel = model<ai_provider>('ai_providers', ai_providerSchema);


/***********  AI Provider Model Schema       ******** */
interface ai_providerModel {
    providerId: any;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const schema = new Schema<ai_providerModel>({
    providerId: { type: mongoose.Types.ObjectId, required: true, ref: 'ai_providers' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const ai_providerModel_model = model<ai_providerModel>('ai_providerModels', schema);

export {
    ai_providerModel,
    ai_providerModel_model
}
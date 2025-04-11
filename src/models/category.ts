import mongoose, { model, Schema } from "mongoose";

interface category {
    userId: string,
    addBy: string;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const schema = new Schema<category>({
    userId: { type: String, default: '' },
    addBy: { type: String, default: 'admin' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const categoryModel = model<category>('categories', schema);

interface industry {
    userId: string,
    addBy: string;
    name: string;
    lower_name: string;
    isDelete: boolean;
    isActive: boolean;
}

const industriesSchema = new Schema<industry>({
    userId: { type: String, default: '' },
    addBy: { type: String, default: 'admin' },
    name: { type: String, required: true },
    lower_name: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
},
    {
        timestamps: true
    });
const industryModel = model<industry>('industries', industriesSchema);
export {
    categoryModel,
    industryModel
}
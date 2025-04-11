import { model, Schema } from "mongoose"

interface link {
    token: string;
    userId: string;
    isUsed: boolean;
    isDelete: boolean;
    isActive: boolean
}

const linkSchema = new Schema<link>({
    token: { type: String, required: true },
    userId: { type: String, required: true },
    isUsed: { type: Boolean, default: false },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const linkModel = model<link>('link', linkSchema);
export default linkModel;
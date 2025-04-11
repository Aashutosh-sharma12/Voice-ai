import mongoose, { model, Schema } from "mongoose"

interface knowledge_base {
    userId: string;
    fileUrl: string;
    file_content: string;
    uploadBy: string;
    isDelete: boolean;
    isActive: boolean
}

const knowledge_baseSchema = new Schema<knowledge_base>({
    userId: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    file_content: { type: String, required: true },
    uploadBy: { type: String, default: 'user' },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const knowledge_baseModel = model<knowledge_base>('knowledge_bases', knowledge_baseSchema);
export default knowledge_baseModel;
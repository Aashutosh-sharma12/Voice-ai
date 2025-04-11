import { model, Schema } from "mongoose"

interface admin {
    username: String;
    email: string;
    contact_number: String;
    password: string;
    token: String;
    isDelete: boolean;
    isActive: boolean
}

const adminSchema = new Schema<admin>({
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    contact_number: { type: String, required: true },
    token: { type: String, default: "" },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const adminauthModal = model<admin>('admin', adminSchema);
export default adminauthModal;
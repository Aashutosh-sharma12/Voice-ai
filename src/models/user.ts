import { model, Schema } from "mongoose"

interface user {
    uniqueId: string;
    name: string;
    image: string;
    social_login_details: object;
    social_loginStatus: boolean;
    email: string;
    countryCode: string;
    phoneNumber: string;
    isEmailVerified: boolean;
    otp: string;
    password: string;
    isDelete: boolean;
    isActive: boolean
}

const userSchema = new Schema<user>({
    uniqueId: { type: String },
    social_login_details: {
        socialId: { type: String, default: '' }, // Google Login Id
        email: { type: String, default: '' }
    },
    social_loginStatus: { type: Boolean, default: false },
    name: { type: String, default: '' },
    image: { type: String, default: '' },
    email: { type: String, required: true },
    countryCode: { type: String, required: false },
    phoneNumber: { type: String, required: false },
    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String, default: '' },
    password: { type: String, default: '' },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const userModel = model<user>('users', userSchema);
export default userModel;
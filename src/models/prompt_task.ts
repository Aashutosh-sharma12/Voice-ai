import mongoose, { model, Schema } from "mongoose"

interface prompt_task {
    promptId: any;
    userId: string;
    task_description: string;
    isDelete: boolean;
    isActive: boolean
}

const prompt_taskSchema = new Schema<prompt_task>({
    promptId: { type: mongoose.Types.ObjectId, ref: 'prompts', required: true },
    userId: { type: String },
    task_description: { type: String, required: true },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const prompt_taskModel = model<prompt_task>('prompt_task', prompt_taskSchema);

interface prompt_task_structure {
    promptId: any;
    userId: string;
    prompt_task_structure: string;
    isDelete: boolean;
    isActive: boolean
}

const prompt_task_structureSchema = new Schema<prompt_task_structure>({
    promptId: { type: mongoose.Types.ObjectId, ref: 'prompts', required: true },
    userId: { type: String },
    prompt_task_structure: { type: String },
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
const prompt_task_structureModel = model<prompt_task_structure>('prompt_task_structure', prompt_task_structureSchema);
export {
    prompt_taskModel,
    prompt_task_structureModel
};
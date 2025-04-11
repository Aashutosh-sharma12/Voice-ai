import mongoose, { model, Schema } from "mongoose"

interface prompt {
    userId: string;
    addBy: string;
    title: string;
    categoryId: any;
    industriesId: any;
    step1_status: boolean;  // Setup & Identification
    step1_draftStatus: boolean;
    agent_openingStatement: string;
    agent_introduction: string;
    detailed_context: string;
    agent_constraint_limitation: string;
    agent_behaviour: string;
    tools_style_requirementsId: any;
    knowledge_baseId: any;
    agent_closingStatement: string;
    step2_status: boolean;     // Context & Scope
    step2_draftStatus: boolean;
    error_handling_protocal: string;
    step3_status: boolean;     // Execution Requirements
    step3_draftStatus: boolean;
    isDelete: boolean;
    isActive: boolean
}

const promptSchema = new Schema<prompt>({
    userId: { type: String, required: true },
    addBy: { type: String, default: 'user' },   // user, admin
    title: { type: String, required: true },
    categoryId: { type: mongoose.Types.ObjectId, required: true },
    industriesId: { type: mongoose.Types.ObjectId, required: true },
    step1_status: { type: Boolean, default: false },
    step1_draftStatus: { type: Boolean, default: false },
    agent_openingStatement: { type: String },
    agent_introduction: { type: String },
    detailed_context: { type: String },
    agent_constraint_limitation: { type: String },
    agent_behaviour: { type: String },
    tools_style_requirementsId: { type: mongoose.Types.ObjectId },
    knowledge_baseId: { type: mongoose.Types.ObjectId },
    agent_closingStatement: { type: String },
    step2_status: { type: Boolean, default: false },      // Context & Scope
    step2_draftStatus: { type: Boolean, default: false },
    error_handling_protocal: { type: String },
    step3_status: { type: Boolean, default: false },
    step3_draftStatus: { type: Boolean, default: false },      // Execution Requirements
    isDelete: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true,
    versionKey: false
});
promptSchema.index({ isDelete: 1, isActive: 1 });
promptSchema.index({ categoryId: -1 });
promptSchema.index({ industriesId: -1 })
const promptModel = model<prompt>('prompts', promptSchema);
export default promptModel;
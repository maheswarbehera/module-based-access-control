import mongoose from "mongoose";

const permissionSchema = new mongoose.Schema({
    // name: { type: String, required: true, unique: true },
    // allowedModules: [{ type: String }],
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module" },
    read: { type: Boolean, default: false },
    write: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

export const Permission = mongoose.model("Permission", permissionSchema);

const moduleSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, 
});

export const Module = mongoose.model("Module", moduleSchema);

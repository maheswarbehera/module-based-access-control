import mongoose from "mongoose";

// Define the Module schema
const moduleSchema = new mongoose.Schema({
    name: { type: String, enum: ["catalog", "category", "product", "order"], required: true, unique: true }
});

export const Module = mongoose.model("Module", moduleSchema);

// Define the Permission schema
const permissionSchema = new mongoose.Schema({
    module: { type: mongoose.Schema.Types.ObjectId, ref: "Module", required: true },
    read: { type: Boolean, default: false },
    write: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false }
}, { timestamps: true });

export const Permission = mongoose.model("Permission", permissionSchema);

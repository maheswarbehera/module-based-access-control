import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: { type: String, default: "" }, // Optional description field
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission", default: [] }], 
}, { timestamps: true } );

export const Role = mongoose.model("Role", roleSchema);

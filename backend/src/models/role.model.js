import mongoose from "mongoose";

const roleSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  // allowedModules: [{ type: String }]
});

export const Role = mongoose.model("Role", roleSchema);

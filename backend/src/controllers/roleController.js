import path from "path";
import { Role } from "../models/role.model.js"; 

export const updateRole = async (req, res) => {
    try {
        const { roleId, assignPermission , module} = req.body;
        
        // Find the role by ID
        const role = await Role.findById(roleId).populate({path: "permissions", populate: {path: "module"}});
        
        if (!role) {
            return res.status(404).json({ status: false, message: "Role not found" });
        } 
        // Update the allowedModules for each permission in the Permission collection
        const updatedPermissions = await Promise.all(role.permissions.map(async (perm) => {
            // Update the allowedModules in Permission
            // console.log(perm.module._id.toString() === module._id)

            // module.forEach(mod => {
            //     if (perm.module._id.toString() === mod._id) { 
            //         perm.read = assignPermission.read !== undefined ? assignPermission.read : perm.read;
            //         perm.write = assignPermission.write !== undefined ? assignPermission.write : perm.write;
            //         perm.update = assignPermission.update !== undefined ? assignPermission.update : perm.update;
            //         perm.delete = assignPermission.delete !== undefined ? assignPermission.delete : perm.delete;
            //     }
            // })
            // console.log(perm.module._id, assignPermission.module._id)
           
            // console.log(perm.module._id.toString() === assignPermission.module._id)


            assignPermission.forEach(permission => {
                if (perm.module._id.toString() === permission.module._id.toString()) {
                    perm.read = permission.read !== undefined ? permission.read : perm.read;
                    perm.write = permission.write !== undefined ? permission.write : perm.write;
                    perm.update = permission.update !== undefined ? permission.update : perm.update;
                    perm.delete = permission.delete !== undefined ? permission.delete : perm.delete;
                } 
            });
            
            // Save the updated permission
            return perm.save(); // This updates the permission in the Permission collection
        }));

        // After updating permissions, save the role (although role's permissions should not need saving again if they're already referenced)
        role.permissions = updatedPermissions; // Optional: this is just to keep the reference fresh in case the permissions are changed
        await role.save();

        res.status(200).json({
            status: true,
            message: "Role updated successfully",
            role
        });
    } catch (error) {
        console.error(error); // For debugging
        res.status(500).json({ status: false, message: "Error updating role" });
    }
};

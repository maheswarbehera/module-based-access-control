import path from "path";
import { Role } from "../models/role.model.js"; 
import { Module, Permission } from "../models/permission.model.js";

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

export const createRoleWithPermissions = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    // Step 1: Find or create Modules dynamically (if modules do not exist)
    const moduleIds = await Promise.all(
      permissions.map(async (perm) => {
        const module = await Module.findOne({ name: perm.module });
        
        if (!module) {
          // If module doesn't exist, create a new one
          const newModule = new Module({ name: perm.module });
          await newModule.save();
          return newModule._id;
        }

        return module._id;
      })
    );

    // Step 2: Create and save permissions using the found module IDs
    const permissionIds = await Promise.all(
      permissions.map(async (perm, index) => {
        const permission = new Permission({
          module: moduleIds[index],
          read: perm.read,
          write: perm.write,
          update: perm.update,
          delete: perm.delete,
        });

        const savedPermission = await permission.save();
        return savedPermission._id;
      })
    );

    // Step 3: Create the role and assign the permissions
    const role = new Role({
      name,
      permissions: permissionIds,  // Assign permission IDs
    });

    await role.save();

    res.status(201).json({ role, message: "Role created successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getByRoleID = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id).populate({path:"permissions", populate: {path: "module"}});
        if (!role) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }
        res.status(200).json({ status: true, role });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching role" });
    }
}

export const list = async (req, res) => {
    try {
        const roles = await Role.find().populate({path:"permissions", populate: {path: "module"}});
        res.status(200).json({ status: true, roles , message: "Roles fetched successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching roles" });
    }
}

export const getModules = async (req, res) => {
    try {
        const modules = await Module.find();
        res.status(200).json({ status: true, modules , message: "Modules fetched successfully" });
    } catch (error) {
        res.status(500).json({ status: false, message: "Error fetching modules" });
    }
}
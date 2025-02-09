import { Module, Permission } from "../models/permission.model.js";

export const getPermissions = async (req, res) => {
    try {
        const permissions = await Permission.find().populate("module"); // Fetch all permissions with module info
        res.status(200).json(permissions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching permissions", error: error.message });
    }
};

export const getModulesWithPermissions = async (req, res) => {
    try {
      const modules = await Module.find();  // Fetch all modules
      const permissions = await Permission.find();  // Fetch all permissions 
      // Map permissions to modules
      const modulesWithPermissions = modules.map(module => {
        // Find permissions for the current module
        const modulePermissions = permissions.filter(permission => permission.module.name === module.name);
  
        // Map each permission, ensuring default values are set to false
        const permissionWithDefaults = modulePermissions.map(permission => ({
          read: permission.read !== undefined ? permission.read : false,
          write: permission.write !== undefined ? permission.write : false,
          update: permission.update !== undefined ? permission.update : false,
          delete: permission.delete !== undefined ? permission.delete : false
        }));
  
        // If no permissions exist for this module, set all permissions to false
        if (permissionWithDefaults.length === 0) {
          permissionWithDefaults.push({
            read: false,
            write: false,
            update: false,
            delete: false
          });
        }
  
        return {
          module: module.name,
          permissions: permissionWithDefaults
        };
      });
    
      return res.status(200).json({ modulesWithPermissions });
    } catch (error) {
      console.error('Error fetching modules and permissions:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  };
  
  
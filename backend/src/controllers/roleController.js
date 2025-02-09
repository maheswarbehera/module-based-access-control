import { Role } from "../models/role.model.js";
import { Module, Permission } from "../models/permission.model.js";

export const updateRole = async (req, res) => {
  try {
    const { roleId, assignPermission, module } = req.body;

    // Find the role by ID
    const role = await Role.findById(roleId).populate({
      path: "permissions",
      populate: {
        path: "module",
      },
    });

    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Role not found",
      });
    }
    // Update the allowedModules for each permission in the Permission collection
    const updatedPermissions = await Promise.all(
      role.permissions.map(async (perm) => {
        assignPermission.forEach((permission) => {
          if (perm.module._id.toString() === permission.module._id.toString()) {
            perm.read =
              permission.read !== undefined ? permission.read : perm.read;
            perm.write =
              permission.write !== undefined ? permission.write : perm.write;
            perm.update =
              permission.update !== undefined ? permission.update : perm.update;
            perm.delete =
              permission.delete !== undefined ? permission.delete : perm.delete;
          }
        });

        // Save the updated permission
        return perm.save(); // This updates the permission in the Permission collection
      })
    );

    // After updating permissions, save the role (although role's permissions should not need saving again if they're already referenced)
    role.permissions = updatedPermissions; // Optional: this is just to keep the reference fresh in case the permissions are changed
    await role.save();

    res.status(200).json({
      status: true,
      message: "Role updated successfully",
      role,
    });
  } catch (error) {
    console.error(error); // For debugging
    res.status(500).json({
      status: false,
      message: "Error updating role",
    });
  }
};

export const createRoleWithPermissions = async (req, res) => {
  try {
    const { name, permissions } = req.body;

    if (
      !name ||
      !permissions ||
      !Array.isArray(permissions) ||
      permissions.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid role data. Name and permissions are required.",
      });
    }

    // Step 1: Ensure all Modules exist (create if not found)
    const modulePromises = permissions.map(async (perm) => {
      const module = await Module.findOneAndUpdate(
        {
          name: perm.module,
        },
        {
          name: perm.module,
        },
        {
          upsert: true,
          new: true,
        }
      );
      return module._id;
    });

    const moduleIds = await Promise.all(modulePromises);

    // Step 2: Create Permissions in bulk
    const permissionDocs = permissions.map((perm, index) => ({
      module: moduleIds[index],
      read: perm.read || false,
      write: perm.write || false,
      update: perm.update || false,
      delete: perm.delete || false,
    }));

    const savedPermissions = await Permission.insertMany(permissionDocs);
    const permissionIds = savedPermissions.map((p) => p._id);

    // Step 3: Create the Role
    const role = new Role({
      name,
      permissions: permissionIds,
    });
    await role.save();
    const populateRole = await role.populate({path: "permissions", populate: {path: "module"}}) 
    res.status(201).json({
      role: populateRole,
      message: "Role created successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

export const getByRoleID = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id).populate({
      path: "permissions",
      populate: {
        path: "module",
      },
    });
    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Role not found",
      });
    }
    res.status(200).json({
      status: true,
      role,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching role",
    });
  }
};

export const list = async (req, res) => {
  try {
    const roles = await Role.find().populate({
      path: "permissions",
      populate: {
        path: "module",
      },
    });
    res.status(200).json({
      status: true,
      roles,
      message: "Roles fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching roles",
    });
  }
};

export const getRoleName = async (req, res) => {
  try {
    const role = await Role.findOne({
      name: req.params.name,
    }).populate({
      path: "permissions",
      populate: {
        path: "module",
      },
    });
    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Role not found",
      });
    }
    res.status(200).json({
      status: true,
      role,
      message: "Role fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching role",
    });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.status(200).json({
      status: true,
      modules,
      message: "Modules fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching modules",
    });
  }
};

export const getModuleName = async (req, res) => {
  try {
    const moduleName = req.params.name;

    const moduleData = await Module.aggregate([
      {
        $match: {
          name: moduleName,
        }, // Step 1: Find the specific module
      },
      {
        $lookup: {
          from: "permissions",
          localField: "_id",
          foreignField: "module",
          as: "permissions",
        },
      },
      {
        $unwind: {
          path: "$permissions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "roles",
          localField: "permissions._id",
          foreignField: "permissions",
          as: "roles",
        },
      },
      {
        $unwind: {
          path: "$roles",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $group: {
          _id: "$_id",
          name: {
            $first: "$name",
          },
          permissions: {
            $push: {
              _id: "$permissions._id",
              role: "$roles.name",
              read: "$permissions.read",
              write: "$permissions.write",
              update: "$permissions.update",
              delete: "$permissions.delete",
            },
          },
        },
      },
    ]);

    // Check if module exists
    if (moduleData.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Module not found",
      });
    }

    res.status(200).json({
      status: true,
      module: moduleData,
      message: "Module fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error fetching module",
      error: error.message,
    });
  }
};


export const deleteRole = async (req, res) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) {
      return res.status(404).json({
        status: false,
        message: "Role not found for delete",
      });
    }
    res.status(200).json({
      status: true,
      message: "Role deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: "Error deleting role",
    });
  }
}
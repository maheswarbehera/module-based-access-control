import { Permission } from "../models/permission.model.js";
import { User } from "../models/user.model.js";
import jwt from "jsonwebtoken";

export const authenticateUser = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ status: false, message: "Authorization header required" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    try {
        const decoded = jwt.verify(token, "hbnsxghvas4vasgdd");
        req.user = decoded; 
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid Token" });
    }
};

export const checkModuleAccess = (moduleName, actions) => {
    return async (req, res, next) => {
        try {   
            const user = await User.findById(req.user.id).populate({
                path: "role",
                populate: { path: "permissions" , populate: {path: "module"} }
            }); 

                // // Check if the user has access to any of the specified modules
                // const hasAccess = user.role.permissions.some(perm => 
                //     perm.module && moduleName.includes(perm.module.name)
                // );

           // Find the permissions for the requested module
           const userPermission = user.role.permissions.find(perm => perm.module && perm.module.name === moduleName); 

            if (!userPermission) {
                return res.status(403).json({ status: false, message: "Access denied: No permissions for this module" });
            }
               // Check if user has all required permissions
               const requiredActions = Array.isArray(actions) ? actions : [actions];
               const hasPermissions = requiredActions.filter(action => !userPermission[action]);

               if (hasPermissions.length > 0) {
                return res.status(403).json({
                    status: false,
                    message: `Access denied: can't ${hasPermissions.join(", ")} permission(s) for module ${moduleName}`
                });
            }
            next();
        } catch (error) {
            res.status(500).json({ status: false, message: "Error verifying permissions" });
        }
    };
};
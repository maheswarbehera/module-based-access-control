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

export const checkModuleAccess = (module) => {
    return async (req, res, next) => {
        try {   
            const user = await User.findById(req.user.id).populate({
                path: "role",
                populate: { path: "permissions" , populate: {path: "module"} }
            }); 

            if (!user || !user.role.permissions.some(perm => perm.module.name.includes(module))) {
                return res.status(403).json({ status: false, message: "Access denied" });
            }
            next();
        } catch (error) {
            res.status(500).json({ status: false, message: "Error verifying permissions" });
        }
    };
};
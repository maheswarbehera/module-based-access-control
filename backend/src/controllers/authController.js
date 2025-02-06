import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
// import { populate } from "dotenv";

export const register = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await  
        User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newRole = await Role.findOne({ name: role });
        if (!newRole) {
            return res.status(404).json({ status: false, message: "Role not found" });
        }
        const user = new User({ username, email, password: hashedPassword, role });
        await user.save();
        res.status(201).json({ status: true, message: "User created successfully", user });
    } catch (error) {
        res.status(500).json({ status: false, message: "Registration error" });
    }
}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate({ path: "role", populate: { path: "permissions", populate: {path: "module"} } });
        // console.log(user)
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ status: false, message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id, name: user.username, role: user.role }, "hbnsxghvas4vasgdd");
        res.status(200).json({ token, user });
    } catch (error) {
        res.status(500).json({ status: false, message: "Login error" });
    }
};

export const currentUser = async (req, res) => {
   return res.status(200).json({ user: req.user });

}

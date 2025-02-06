import express from "express";
import cors from "cors";
import { currentUser, login, register } from "./controllers/authController.js";
import { getModules,createRoleWithPermissions, getByRoleID, updateRole, list } from "./controllers/roleController.js";
import { authenticateUser, checkModuleAccess } from "./middleware/checkModuleAccess.js";
import connectDb from "./db/index.js";
import { categoryController } from "./controllers/categoryController.js";

const app = express();
app.use(express.json());
app.use(cors())
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
connectDb().then(async () => {
  app.listen(5000, () => {
    console.log("Server is running on port 3000");
  });
});


app.post("/api/v1/auth/login", login);
app.get("/api/v1/auth",authenticateUser, currentUser);
app.post("/api/v1/auth/signup", register);

app.get("/api/v1/modules",authenticateUser, getModules);
app.post("/api/v1/roles",authenticateUser, createRoleWithPermissions);
app.get("/api/v1/roles",authenticateUser, list);
app.get("/api/v1/roles/:id",authenticateUser, getByRoleID);
app.put("/api/v1/roles/update",authenticateUser, checkModuleAccess("catalog"), updateRole);
app.post("/api/v1/categories",authenticateUser, checkModuleAccess("category"), categoryController.createCategory);
app.get("/api/v1/categories",authenticateUser, checkModuleAccess("category"), categoryController.getCategories);
app.get("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.getCategory);
app.put("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.updateCategory);
app.delete("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.deleteCategory);

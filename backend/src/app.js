import express from "express";
import cors from "cors";
import { currentUser, login, register } from "./controllers/authController.js";
import { getModules,createRoleWithPermissions, getByRoleID, updateRole, list, getRoleName, getModuleName, deleteRole } from "./controllers/roleController.js";
import { authenticateUser, checkModuleAccess } from "./middleware/checkModuleAccess.js";
import connectDb from "./db/index.js";
import { categoryController } from "./controllers/categoryController.js";
import { getModulesWithPermissions, getPermissions } from "./controllers/permission.controller.js";

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

// app.post("/api/v1/auth/signup", register);
// app.post("/api/v1/auth/login", login);
// app.get("/api/v1/auth",authenticateUser, currentUser);

// app.get("/api/v1/modules",authenticateUser, getModules);
// app.get("/api/v1/modules/:name",authenticateUser, getModuleName);

// app.get("/api/v1/permissions",authenticateUser,   getPermissions);
// app.get("/api/v1/permissions",authenticateUser,   getModulesWithPermissions);
// app.post("/api/v1/roles",authenticateUser, createRoleWithPermissions);
// app.get("/api/v1/roles",authenticateUser, list);
// app.get("/api/v1/roles/:name",authenticateUser, getRoleName);
// app.get("/api/v1/roles/:id",authenticateUser, getByRoleID);
// app.put("/api/v1/roles/update",authenticateUser, checkModuleAccess("catalog"), updateRole);

// app.post("/api/v1/categories",authenticateUser, checkModuleAccess("category","write"), categoryController.createCategory);
// app.get("/api/v1/categories",authenticateUser, checkModuleAccess(modules.map( module => module.name),), categoryController.getCategories);
// app.get("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.getCategory);
// app.put("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.updateCategory);
// app.delete("/api/v1/categories/:id",authenticateUser, checkModuleAccess("category"), categoryController.deleteCategory);

app.get("/api/v1/auth",authenticateUser, currentUser);
app.get("/api/v1/modules",authenticateUser, getModules);
app.get("/api/v1/modules/:name",authenticateUser, getModuleName);

const routes = [
  { method: "post", path: "/signup", handler: register },
  { method: "post", path: "/login", handler: login }, 
];
routes.forEach(({ method, path, handler }) => {
  app[method](`/api/v1/auth${path}`, handler);
  console.log(`Route registered: [${method}] /api/v1/auth${path}`);
});

//Authentication middleware
const RoleRoutes = [
  { method: "post", path: "", action: "write", handler: createRoleWithPermissions },
  { method: "get", path: "/list", action: "read", handler: list },
  { method: "put", path: "/update", action: "update", handler: updateRole },
  { method: "get", path: "/permission", action: "read", handler: getModulesWithPermissions },
  
  { method: "get", path: "/:name", action: "read", handler: getRoleName },
  { method: "get", path: "/id/:id", action: "read", handler: getByRoleID },
  { method: "delete", path: "/id/:id", action: "delete", handler: deleteRole },

];

RoleRoutes.forEach(({ method, path, action, handler }) => {
  app[method](`/api/v1/roles${path}`, authenticateUser, handler);
  console.log(`Route registered: [${method}] /api/v1/roles${path}`);
});

// Authentication middleware with checkModuleAccess
const modulesWithRoutes = {

  category: [
      { method: "post", path: "", action: "write", handler: categoryController.createCategory },
      { method: "get", path: "", action: "read", handler: categoryController.getCategories },
      { method: "get", path: "/:id", action: "read", handler: categoryController.getCategory },
      { method: "put", path: "/:id", action: "update", handler: categoryController.updateCategory },
      { method: "delete", path: "/:id", action: "delete", handler: categoryController.deleteCategory },
  ], 
};

Object.entries(modulesWithRoutes).forEach(([moduleName, routes]) => {
  routes.forEach(({ method, path, action, handler }) => {
    app[method](
        `/api/v1/${moduleName}${path}`,  // Dynamic module name in URL
        authenticateUser,
        checkModuleAccess(moduleName, action),  // ✅ Dynamic module name
        handler
    ); 
    console.log(`Route registered: [${method}] /api/v1/${moduleName}${path}`);
  });
}); 



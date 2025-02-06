import express from "express";
import cors from "cors";
import { currentUser, login, register } from "./controllers/authController.js";
import { updateRole } from "./controllers/roleController.js";
import { authenticateUser, checkModuleAccess } from "./middleware/checkModuleAccess.js";
import connectDb from "./db/index.js";

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
app.put("/api/v1/roles/update",authenticateUser, checkModuleAccess("catalog"), updateRole);
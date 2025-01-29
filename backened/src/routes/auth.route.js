import express from "express";
 import {signup,login,logout,updateProfile,checkAuth } from "../controllers/auth.controller.js";
import { middleware } from "../middleware/auth.middleware.route.js";
 const router = express.Router();
 router.post("/signup", signup);
 router.post("/login", login);
 router.post("/logout", logout);

 router.put("/update-profile",middleware,updateProfile);
 router.get("/check",middleware,checkAuth)
export default router;

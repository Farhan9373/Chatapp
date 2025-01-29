import express from 'express'
import { middleware } from '../middleware/auth.middleware.route.js';
import { getMessages, getUsersForSidebar,sendMessage } from '../controllers/message.controller.js';

 const router=express.Router();

 router.get("/users",middleware,getUsersForSidebar);
 router.get("/:id",middleware,getMessages)

 router.post("/send/:id",middleware,sendMessage)

 export default router

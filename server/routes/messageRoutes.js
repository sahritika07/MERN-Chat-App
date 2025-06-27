import express from "express";

const messageRouter = express.Router()


import { getMessages,getUsersForSidebar, markMessageAsSeen, sendMessage } from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRoute = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.put("mark/:id", protectRoute, markMessageAsSeen)
messageRouter.post("/send/:id", protectRoute, sendMessage)


export default messageRouter;

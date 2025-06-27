import express from "express";

const messageRouter = express.Router()


import { getMessages,getUsersForSidebar, markMessageAsSeen } from "../controllers/messageController";
import { protectRoute } from "../middleware/auth";

const messageRoute = express.Router();

messageRouter.get("/users", protectRoute, getUsersForSidebar)
messageRouter.get("/:id", protectRoute, getMessages)
messageRouter.get("mark/:id", protectRoute, markMessageAsSeen)

export default messageRouter;

import express, { Router, Request, Response } from "express";
import Conversation from "../models/conversation";

const router: Router = express.Router();

router.post("/api/group/create", async (req: Request, res: Response) => {
  const groupConfig = req.body;
  const newConversation = new Conversation({
    groupConfig,
  });
});
// Get requester's group chat or dm
router.get();

//Update requester's group chat
router.put();

//Delete requester's group chat
router.delete();

export default router;

import express, { Router, Request, Response } from "express";
import Room from "../models/rooms";

const router: Router = express.Router();

// Get requester's group chat or dm
router.get("/api/getRooms", async (req: Request, res: Response) => {
  try {
    const allRooms = await Room.find();
    res.status(200).send(allRooms);
  } catch (err) {
    throw err;
  }
});

//Update requester's group chat
//router.put();

//Delete requester's group chat
//router.delete();

export default router;

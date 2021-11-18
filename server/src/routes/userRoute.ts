import express, { Router, Request, Response } from "express";

const router: Router = express.Router();

router.get("/api/getUser", (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: "Not Authorized" });
    }
    return res.status(200).json(req.user);
  } catch (err) {
    throw err;
  }
});

export default router;

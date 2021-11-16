import express, { Response, Request } from "express";
import passport from "../middleware/passport";

const router = express.Router();

router.get(
  "/api/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/sessions/oauth/google",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000",
    session: true,
  }),
  (req: Request, res: Response) => {
    res.redirect("http://localhost:3000/home");
  }
);
router.get("/api/getUser", (req: Request, res: Response) => {
  try {
    res.status(200).json(req.user);
  } catch (err) {
    throw err;
  }
});
router.get("/api/oauth/logout", (req: Request, res: Response) => {
  req.logout();
  req.session.destroy((error: Error) => {
    if (error) {
      throw error;
    }
    res.redirect("http://localhost:3000");
  });
});

export default router;

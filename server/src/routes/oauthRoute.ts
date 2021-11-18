import express, { Router, Response, Request } from "express";
import passport from "../middleware/passport";

const router: Router = express.Router();

router.get(
  "/api/oauth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/api/sessions/oauth/google",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:3000/start",
    session: true,
  }),
  (req: Request, res: Response) => {
    return res.redirect("http://localhost:3000");
  }
);
router.get("/api/isAuth", (req: Request, res: Response) => {
  try {
    return res.status(200).send(req.isAuthenticated());
  } catch (err) {
    console.log(err);
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

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
    failureRedirect: process.env.CORSORIGIN as string,
    session: true,
  }),
  (req: Request, res: Response) => {
    return res.redirect(process.env.CORSORIGIN as string);
  }
);
router.get("/api/isAuth", (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      //return res.status(400).send(null);
      return res.send(null);
    }
    return res.status(200).json(req.user);
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
    res.redirect(process.env.CORSORIGIN as string);
  });
});

export default router;

import dotenv from "dotenv";
import express, { Express } from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "./middleware/passport";
import cors from "cors";
import oauth from "./routes/oauthRoute";
import socket from "socket.io";
import { createServer } from "http";
import { Server } from "socket.io";

dotenv.config();
const PORT: number = Number(process.env.PORT as string) || 8080;
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",
  },
});
//connect to mongoDB
mongoose.connect(`${process.env.MONGODB_URL}`, () => {
  console.log("Connected to DB");
});

// initialize middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 1000 * 60 * 60 * 24, //24 hours
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(oauth);

//Server ports
httpServer.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`);
});

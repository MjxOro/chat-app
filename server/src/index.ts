import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import session from "express-session";
import mongoose from "mongoose";
import passport from "./middleware/passport";
import cors from "cors";
import oauthRoute from "./routes/oauthRoute";
import roomRoutes from "./routes/roomRoutes";
import userRoute from "./routes/userRoute";
import { createServer } from "http";
import { Server } from "socket.io";
import socket from "./socket";
import morgan from "morgan";
import path from "path";

const MongoDBStore = require("connect-mongodb-session")(session);
dotenv.config();
const PORT: number = Number(process.env.PORT as string) || 8080;
const app: Express = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORSORIGIN as string,
  },
});
//connect to mongoDB
mongoose.connect(`${process.env.MONGODB_URL}`, () => {
  console.log("Connected to DB");
});
const store = new MongoDBStore({
  uri: process.env.MONGODB_URL as string,
});

// initialize middleware
app.use(express.json());
app.use(
  morgan((process.env.NODE_ENV as string) === "production" ? "combined" : "dev")
);

app.use(cors({ origin: process.env.CORSORIGIN as string, credentials: true }));
app.set("trust proxy", 1);
const isSecure = () => {
  if (process.env.NODE_ENV === "production") {
    return true;
  } else {
    return false;
  }
};
console.log(isSecure());
app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET as string,
    resave: true,
    store: store,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      //sameSite: "none",
      secure: isSecure(),
      maxAge: 1000 * 60 * 60 * 6, //6 hour
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(oauthRoute);
app.use(userRoute);
app.use(roomRoutes);

//Hadnle React Routing
if ((process.env.NODE_ENV as string) === "production") {
  // Handle React routing, return all requests to React app
  app.use(express.static(path.join(__dirname, "..", "..", "client", "build")));
  app.get("*", (_: Request, res: Response) => {
    res.sendFile(
      path.resolve(__dirname, "..", "..", "client", "build", "index.html")
    );
  });
}

//Server ports
httpServer.listen(PORT, async () => {
  console.log(`listening on port: ${PORT}`);
  socket({ io });
});

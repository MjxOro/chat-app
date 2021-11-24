import passport from "passport";
import User, { IUserModel } from "../models/users";
import dotenv from "dotenv";
dotenv.config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;

//Serialize and De-serialize
passport.serializeUser((user: { _id?: any }, cb: any) => {
  return cb(null, user._id);
});
passport.deserializeUser((id: string, cb: any) => {
  User.findById(id, (error: Error, data: IUserModel) => {
    if (error) {
      console.log("HERE");
      return cb(error, null);
    }
    return cb(null, data);
  });
});

//Oauth Strategies

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID as string,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  callbackURL: process.env.GOOGLE_REDIRECT as string,
};

interface IGoogleUser {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

passport.use(
  new GoogleStrategy(
    googleConfig,
    (
      accessToken: string,
      refreshToken: string,
      { _json }: { _json: IGoogleUser },
      cb: any
    ) => {
      //Upsert users to DB
      User.findOne(
        { email: _json.email },
        async (err: Error, data: IGoogleUser) => {
          if (err) {
            cb(err);
          }
          if (!data) {
            const newUser = new User({
              googleId: _json.sub,
              username: _json.given_name,
              email: _json.email,
              picture: _json.picture,
            });
            await newUser.save();
            return cb(null, newUser);
          }
          return cb(null, data);
        }
      );
    }
  )
);

export default passport;

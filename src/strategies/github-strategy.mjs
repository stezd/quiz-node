import passport from "passport";
import { Strategy } from "passport-github2";
import "@dotenvx/dotenvx/config";
import "../mongoose/schemas/github-user.mjs";
import { GithubUser } from "../mongoose/schemas/github-user.mjs";
import { User } from "../mongoose/schemas/user.mjs";

passport.serializeUser((user, done) => {
    console.log(`Inside serialize user`);
    console.log(user);
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    console.log(`Inside deserializer`);
    console.log(`Deserializing user ID: ${id}`);
    try {
        const findUser = await User.findById(id);
        if (!findUser) throw new Error("User not found");
        done(null, findUser);
    } catch (err) {
        done(err, null);
    }
});

export default passport.use(
    new Strategy(
        {
            clientID: process.env.CLIENT_ID_GITHUB,
            clientSecret: process.env.CLIENT_SECRET_GITHUB,
            callbackURL: "http://localhost:3000/api/auth/github/redirect",
            scope: ["user:email", "read:user"],
        },
        async (accessToken, refreshToken, profile, done) => {
            let findUser;
            try {
                findUser = await GithubUser.findOne({ githubId: profile.id });
            } catch (e) {
                return done(e, null);
            }

            try {
                if (!findUser) {
                    const email =
                        profile.emails && profile.emails[0]
                            ? profile.emails[0].value
                            : null;

                    if (!email) {
                        return done(
                            new Error(
                                "Email is required but not provided by GitHub"
                            ),
                            null
                        );
                    }
                    const newUser = new GithubUser({
                        username: profile.username,
                        githubId: profile.id,
                        email: email,
                    });
                    const newSavedUser = await newUser.save();
                    return done(null, newSavedUser);
                }
                return done(null, findUser);
            } catch (e) {
                console.log(e);
                return done(e, null);
            }
        }
    )
);

// noinspection JSUnusedGlobalSymbols

import passport from "passport";
import { Strategy } from "passport-local";
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

passport.use(
    new Strategy(async (username, password, done) => {
        console.log(`username: ${username}`);
        console.log(`password: ${password}`);
        try {
            const findUser = await User.findOne({ username });
            if (!findUser) throw new Error("User not found");
            if (findUser.password !== password)
                throw new Error("Bad Credentials");
            done(null, findUser);
        } catch (err) {
            done(err, null);
        }
    })
);

export default passport;

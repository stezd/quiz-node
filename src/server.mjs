import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import routes from "./routes/index.mjs";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
//import "./strategies/local-strategy.mjs";
import MongoStore from "connect-mongo";
import "@dotenvx/dotenvx/config";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

//middlewares
mongoose
    .connect(`mongodb://localhost:27017/express`)
    .then(() => console.log("Connected to mongoDB localhost"))
    .catch(err => console.log(`Error while connecting mongoDB: ${err}`));
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(cookieParser("helloworld"));
app.use(json());
app.use(
    session({
        secret: "i love scaramouche",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60 * 24 * 7,
        },
        store: MongoStore.create({
            client: mongoose.connection.getClient(),
        }),
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(routes);

app.listen(port, () =>
    console.log(`Listening on port ${port}\nhttp://localhost:${port}`)
);

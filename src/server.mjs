import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";
import cookieParser from "cookie-parser";
import routes from "./routes/index.mjs";
import session from "express-session";
import { mockUsers } from "./utils/constants.mjs";

const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

//middlewares
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
    })
);
app.use(routes);

app.listen(port, () =>
    console.log(`Listening on port ${port}\nhttp://localhost:${port}`)
);

app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
    req.session.visited = true;
    res.cookie("hello", "world", { maxAge: 30000, signed: true });
    res.status(201).send("Selamat datang di API!");
});

app.post("/api/auth", (req, res) => {
    const {
        body: { username, password },
    } = req;
    const findUser = mockUsers.find(user => user.username === username);
    if (!findUser || findUser.password !== password)
        return res.status(401).send({ msg: "Bad Credentials" });

    req.session.user = findUser;
    return res.status(200).send(findUser);
});

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
    });
    return req.session.user
        ? res.status(200).send(req.session.user)
        : res.status(401).send({ msg: "Not Authenticated" });
});

app.post("/api/cart", (req, res) => {
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

app.get("/api/cart", (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart ?? []);
});

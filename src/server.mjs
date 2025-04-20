import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";
import usersRouter from "./routes/user.mjs";
import productsRouter from "./routes/products.mjs";

const app = express();
const port = process.env.PORT || 3000;

//middlewares
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(json());
const loggingMiddleware = (req, res, next) => {
    console.log(`${req.method} - ${req.url}`);
    next();
};
app.use(loggingMiddleware);
app.use(usersRouter);
app.use(productsRouter);

app.listen(port, () =>
    console.log(`Listening on port ${port}\nhttp://localhost:${port}`)
);

app.get("/", (req, res) => {
    res.status(201).send("Selamat datang di API!");
});

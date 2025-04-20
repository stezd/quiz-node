import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";

import routes from "./routes/index.mjs";
const app = express();
const port = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.resolve(path.dirname(__filename), "..");

//middlewares
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(json());

app.use(routes);

app.listen(port, () =>
    console.log(`Listening on port ${port}\nhttp://localhost:${port}`)
);

app.get("/", (req, res) => {
    res.status(201).send("Selamat datang di API!");
});

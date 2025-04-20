import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";
import { validationResult, matchedData, checkSchema } from "express-validator";
import {
    createUserValidationSchema,
    queryUserValidationSchema,
} from "./utils/validationSchemas.mjs";

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

const resolveIndexByUserId = (req, res, next) => {
    const {
        params: { id },
    } = req;
    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);
    req.findUserIndex = findUserIndex;
    next();
};

let mockUsers = [
    { id: 1, username: "jondo", displayName: "John Doe" },
    { id: 2, username: "janes", displayName: "Jane Smith" },
    { id: 3, username: "aljon", displayName: "Alice Johnson" },
    { id: 4, username: "bobby3", displayName: "Bob Brown" },
    { id: 5, username: "charl", displayName: "Charlie Davis" },
];

let mockProducts = [
    { id: 1, name: "chicken breast", price: 5.99 },
    { id: 2, name: "salmon fillet", price: 12.99 },
    { id: 3, name: "ground beef", price: 8.49 },
    { id: 4, name: "pork chops", price: 6.99 },
    { id: 5, name: "tofu", price: 3.49 },
];

app.listen(port, () =>
    console.log(`Listening on port ${port}\nhttp://localhost:${port}`)
);

app.get("/", (req, res) => {
    res.status(201).send("Selamat datang di API!");
});

app.get("/api/users", checkSchema(queryUserValidationSchema), (req, res) => {
    const result = validationResult(req);
    console.log(result);
    if (Object.keys(req.query).length === 0) return res.send(mockUsers);
    else if (!result.isEmpty())
        return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);
    console.log(data);

    const queryResult = mockUsers.filter(user =>
        user[data.filter]?.includes(data.value)
    );

    res.send(queryResult);
});

app.post("/api/users", checkSchema(createUserValidationSchema), (req, res) => {
    const result = validationResult(req);
    console.log(result);

    if (!result.isEmpty())
        return res.status(400).send({ errors: result.array() });

    const data = matchedData(req);

    console.log(data);
    const newUser = {
        id: parseInt(mockUsers[mockUsers.length - 1].id + 1),
        ...data,
    };
    // noinspection JSCheckFunctionSignatures
    mockUsers.push(newUser);
    res.status(201).send(newUser);
});

app.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(mockUsers[findUserIndex]);
});

app.get("/api/products", (req, res) => {
    res.send(mockProducts);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

app.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

app.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

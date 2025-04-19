import express, { json } from "express";
import favicon from "serve-favicon";
import * as path from "node:path";
import { fileURLToPath } from "url";

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

app.get("/api/users", (req, res) => {
    console.log(req.query);
    const {
        query: { filter, value },
    } = req;

    // assuming filter is gonna be username or displayName
    if (filter && value)
        return res.send(mockUsers.filter(user => user[filter].includes(value)));

    // edge case
    res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
    const { body } = req;
    const newUser = {
        id: parseInt(mockUsers[mockUsers.length - 1].id + 1),
        ...body,
    };
    // noinspection JSCheckFunctionSignatures
    mockUsers.push(newUser);
    res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
    console.log(req.params);
    const parsedId = parseInt(req.params.id);
    console.log(parsedId);

    if (isNaN(parsedId))
        return res.status(400).send({ msg: "Bad Request. Invalid Id." });

    const findUser = mockUsers.find(user => user.id === parsedId);
    if (!findUser) return res.sendStatus(404);
    return res.send(findUser);
});

app.get("/api/products", (req, res) => {
    res.send(mockProducts);
});

app.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(204);
});

app.patch("/api/users/:id", (req, res) => {
    const {
        body,
        params: { id },
    } = req;

    const parsedId = parseInt(id);
    if (isNaN(parsedId)) return res.sendStatus(400);
    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);
    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

app.delete("/api/users/:id", (req, res) => {
    const {
        params: { id },
    } = req;

    const parsedId = parseInt(id);

    if (isNaN(parsedId)) return res.sendStatus(400);

    const findUserIndex = mockUsers.findIndex(user => user.id === parsedId);

    if (findUserIndex === -1) return res.sendStatus(404);

    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});
// PUT
// PATCH
// DELETE

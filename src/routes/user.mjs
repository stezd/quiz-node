import { Router } from "express";
import { checkSchema, matchedData, validationResult } from "express-validator";
import {
    createUserValidationSchema,
    queryUserValidationSchema,
} from "../utils/validationSchemas.mjs";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middlewares.mjs";
import { User } from "../mongoose/schemas/user.mjs";
import { hashPassword } from "../utils/helpers.mjs";

const router = Router();

router.get("/api/users", checkSchema(queryUserValidationSchema), (req, res) => {
    console.log(req.session.id);
    req.sessionStore.get(req.session.id, (err, sessionData) => {
        if (err) {
            console.log(err);
            throw err;
        }
        console.log(sessionData);
    });
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

router.post(
    "/api/users",
    checkSchema(createUserValidationSchema),
    async (req, res) => {
        const result = validationResult(req);
        if (!result.isEmpty()) return res.status(400).send(result.array());

        const data = matchedData(req);
        console.log(data);
        data.password = hashPassword(data.password);
        console.log(data);

        const newUser = new User(data);
        try {
            const savedUser = await newUser.save();
            return res.status(201).send(savedUser);
        } catch (err) {
            console.log(err);
            return res.sendStatus(400);
        }
    }
);

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    const findUser = mockUsers[findUserIndex];
    if (!findUser) return res.sendStatus(404);
    return res.send(mockUsers[findUserIndex]);
});

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
    return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { body, findUserIndex } = req;
    mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
    return res.sendStatus(200);
});

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
    const { findUserIndex } = req;
    mockUsers.splice(findUserIndex, 1);
    return res.sendStatus(200);
});

export default router;

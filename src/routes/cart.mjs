import { Router } from "express";

const router = Router();

router.post("/api/cart", (req, res) => {
    const { body: item } = req;
    const { cart } = req.session;
    if (cart) {
        cart.push(item);
    } else {
        req.session.cart = [item];
    }
    return res.status(201).send(item);
});

router.get("/api/cart", (req, res) => {
    if (!req.session.user) return res.sendStatus(401);
    return res.send(req.session.cart ?? []);
});

export default router;

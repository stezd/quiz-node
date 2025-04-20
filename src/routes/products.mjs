import { mockProducts } from "../utils/constants.mjs";
import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
    console.log(req.headers.cookie);
    console.log(req.cookies);
    console.log(req.signedCookies);
    if (req.signedCookies.hello && req.signedCookies.hello === "world")
        return res.send(mockProducts);

    return res.status(401).send({ msg: "Sorry. You need the correct cookie" });
});

export default router;

import { mockProducts } from "../utils/constants.mjs";
import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {
    res.send(mockProducts);
});

export default router;

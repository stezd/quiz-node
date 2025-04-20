import { Router } from "express";
import userRouter from "./user.mjs";
import productsRouter from "./products.mjs";
import cartRouter from "./cart.mjs";
import authRouter from "./auth.mjs";
const router = Router();

router.use(userRouter);
router.use(productsRouter);
router.use(cartRouter);
router.use(authRouter);

export default router;

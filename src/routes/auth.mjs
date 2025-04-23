import { Router } from "express";
import passport from "passport";
import "../strategies/github-strategy.mjs";

const router = Router();

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
    res.sendStatus(200);
});

router.get("/api/auth/status", (req, res) => {
    console.log(`Inside /auth/status endpoint`);
    console.log(req.user);
    console.log(req.session);

    return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post("/api/auth/logout", (req, res) => {
    if (!req.user) return res.sendStatus(401);

    req.logout(err => {
        if (err) return res.sendStatus(400);
        res.send(200);
    });
});

router.get("/api/auth/github", passport.authenticate("github"));
router.get(
    "/api/auth/github/redirect",
    passport.authenticate("github"),
    (req, res) => {
        res.sendStatus(200);
    }
);
export default router;

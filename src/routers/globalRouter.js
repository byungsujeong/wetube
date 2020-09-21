import express from "express";
import passport from "passport";
import routes from "../routes";
import { home, search } from "../controllers/videoController";
import { getJoin, postJoin, getLogin, postLogin, logout, githubLogin, githubLoginCallback, postGithubLogin, getMe, facebookLogin, postFacebookLogin } from "../controllers/userController";
import { onlyPrivate, onlyPublic } from "../middlewares";

const globalRouter = express.Router();

globalRouter.get(routes.join, onlyPublic, getJoin);
globalRouter.post(routes.join, postJoin, postLogin);

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.login, getLogin);
globalRouter.post(routes.login, postLogin);
globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin);

globalRouter.get(
    routes.githubCallback,
    passport.authenticate("github", { failureRedirect: "/login" }),
    postGithubLogin
);

globalRouter.get(routes.facebook, facebookLogin);

globalRouter.get(
    routes.facebookCallback,
    passport.authenticate("facebook", { failureRedirect: "/login" }),
    postFacebookLogin
);

globalRouter.get(routes.me, getMe);

export default globalRouter;
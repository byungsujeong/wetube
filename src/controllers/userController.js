import routes from "../routes";
import User from "../models/User";
import passport from "passport";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle : "Join" });
};

export const postJoin = async (req, res, next) => {
    const{
        body: {name, email, password, password2}
    } = req;
    if (password !== password2){
        req.flash("error", "Passwords don't mach");
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    } else {
        try {
            const user = await User({
                name,
                email
            });
            await User.register(user, password);
            next();
        } catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
};

export const getLogin = (req, res) => res.render("login", { pageTitle : "Log In" });

export const postLogin = passport.authenticate('local', {
    failureRedirect: routes.login,
    successRedirect: routes.home,
    successFlash: "Welcome",
    failureFlash: "Can't log in. Check email and/or password"
});

export const githubLogin = passport.authenticate('github', {
    successFlash: "Welcome",
    failureFlash: "Can't log in at this time"
});

export const githubLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const {
        _json: { id, avatar_url, name, email }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            //user.avatarUrl = avatar_url;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl: avatar_url
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
};

export const facebookLogin = passport.authenticate('facebook', {
    successFlash: "Welcome",
    failureFlash: "Can't log in at this time"
});

export const facebookLoginCallback = async (accessToken, refreshToken, profile, cb) => {
    const {
        _json: { id, name, email }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.facebookId = id;
            //user.avatarUrl = `https://graph.facbook.com/${id}/picture?type=large`;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            facebookId: id,
            avatarUrl: `https://graph.facbook.com/${id}/picture?type=large`
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};

export const postFacebookLogin = (req, res) => {
    res.redirect(routes.home);
};

export const logout = (req, res) => {
    req.flash("info", "Logged out, See you later");
    req.logout();
    res.redirect(routes.home);
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("videos");
        res.render("userDetail", { pageTitle: "User Detail", user });
      } catch (error) {
        res.redirect(routes.home);
      }
};

//export const users = (req, res) => res.render("users");
export const userDetail = async (req, res) => {
    const { params: { id } } = req;
    try {
        const user = await User.findById(id).populate("videos");
        res.render("userDetail", { pageTitle : "User Detail", user });
    } catch (error) {
        req.flash("error", "User not found");
        res.redirect(routes.home);
    }
};

export const getEditProfile = (req, res) => res.render("editProfile", { pageTitle : "Edit Profile" });

export const postEditProfile = async (req, res) => {
    const {
        body: { name, email },
        file
    } = req;
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {
            name,
            email,
            //avatarUrl: file ? file.path : req.user.avatarUrl
            avatarUrl: file ? file.location : req.user.avatarUrl
        });
        req.flash("success", "Profile updated");
        res.redirect(routes.me);
    } catch (error) {
        req.flash("error", "Can't update profile");
        res.redirect(routes.editProfile);
    }
};

export const getChangePassword = (req, res) => res.render("changePassword", { pageTitle : "Change Password" });
export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    try {
        if (newPassword !== newPassword1) {
            req.flash("error", "Password don't match");
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        req.flash("error", "Can't change password");
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};
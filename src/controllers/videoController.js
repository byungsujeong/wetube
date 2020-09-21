import routes from "../routes";
import Videos from "../models/Video";
import Comments from "../models/Comment";
import User from "../models/User";

export const home = async (req, res) => {
    try {
        const videos = await Videos.find({}).sort({ _id: -1 });
        res.render("home", { pageTitle : "Home", videos });
    } catch (error) {
        console.log(error);
        res.render("home", { pageTitle : "Home", videos: [] });
    }
};

export const search = async (req, res) => {
    const {
        query : { term: searchingBy }
    } = req;
    let videos = [];
    try {
        videos = await Videos.find({
            title: { $regex: searchingBy, $options: "i" }
        });
    } catch (error) {
        console.log(error);
    }
    res.render("search", { pageTitle : "Search", searchingBy, videos });
};

//export const videos = (req, res) => res.render("videos");
export const getUpload = (req, res) => res.render("upload", { pageTitle : "Upload" });
export const postUpload = async (req, res) => {
    const {
        body: { title, description },
        //file : { path }
        file : { location }
    } = req;
    const newVideo =  await Videos.create({
        fileUrl: location,
        title,
        description,
        creator: req.user.id
    });
    req.user.videos.push(newVideo.id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params : { id }
    } = req;
    try {
        const video = await Videos.findById(id).populate("creator").populate("comments");
        res.render("videoDetail", { pageTitle : video.title, video });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};
export const getEditVideo = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Videos.findById(id);
        if (video.creator != req.user.id) {
            throw Error();
        } else {
            res.render("editVideo", { pageTitle : `Edit ${video.title}`, video });
        }
    } catch (error) {
        res.redirect(routes.home);
    }
};
export const postEditVideo = async (req, res) => {
    const {
        params: { id },
        body: { title, description }
    } = req;
    try {
        await Videos.findOneAndUpdate({ _id: id }, { title, description });
        res.redirect(routes.videoDetail(id));
    } catch (error) {
        res.redirect(routes.home);
    }
};
export const deleteVideo = async (req, res) => {
    const {
        params: {id}
    } = req;
    try {
        const video = await Videos.findById(id);
        if (video.creator != req.user.id) {
            throw Error();
        } else {
            await Videos.findByIdAndRemove({ _id: id });
        }
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};

export const postRegisterView = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const video = await Videos.findById(id);
        video.views += 1;
        video.save();
        res.status(200);
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

export const postAddComment = async (req, res) => {
    const {
        params: { id },
        body: { comment },
        user
    } = req;
    try {
        const video = await Videos.findById(id);
        const user = await User.findById(req.user.id);
        const newComment = await Comments.create({
            text: comment,
            creator: user.id
        });
        video.comments.push(newComment.id);
        video.save();
        user.comments.push(newComment.id);
        user.save();
        res.status(200);
        res.send(newComment.id);
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};

export const deleteComment = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const comment = await Comments.findById(id);
        if (comment.creator != req.user.id) {
            throw Error();
        } else {
            await Comments.findByIdAndRemove({ _id: id });
            res.status(200);
        }
    } catch (error) {
        res.status(400);
    } finally {
        res.end();
    }
};
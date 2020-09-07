import routes from "../routes";
import Videos from "../models/Video";

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
        file : { path }
    } = req;
    const newVideo =  await Videos.create({
        fileUrl: path,
        title,
        description
    });
    // To Do: Upload and save video
    res.redirect(routes.videoDetail(newVideo.id));
};

export const videoDetail = async (req, res) => {
    const {
        params : { id }
    } = req;
    try {
        const video = await Videos.findById(id);
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
        res.render("editVideo", { pageTitle : `Edit ${video.title}`, video });
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
        await Videos.findByIdAndRemove({ _id: id });
    } catch (error) {
        console.log(error);
    }
    res.redirect(routes.home);
};
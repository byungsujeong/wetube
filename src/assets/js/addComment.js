import axios from "axios";
import routes from "../../routes";
const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
let deleteCommentBtns = document.getElementsByClassName("jsDeleteComment");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) + 1;
};

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const addComment = (comment, commentId) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
    const a = document.createElement("a");
    span.innerHTML = comment;
    a.className = "jsDeleteComment";
    a.href = routes.deleteComment(commentId);
    a.innerHTML = ' <i class="far fa-trash-alt"></i>';
    li.appendChild(span);
    li.appendChild(a);
    commentList.prepend(li);
    increaseNumber();
    deleteCommentBtns = document.getElementsByClassName("jsDeleteComment");
    for (let index = 0; index < deleteCommentBtns.length; index++) {
        deleteCommentBtns[index].addEventListener("click", handleDelete);
    }
};

const sendComment = async (comment) => {
    const videoId = window.location.href.split("/videos/")[1];
    const response = await axios({
        url: `/api/${videoId}/comment`,
        method: "POST",
        data: {
            comment
        }
    });
    if (response.status === 200) {
        addComment(comment, response.data);
    }
};

const handleSubmit = (event) => {
    event.preventDefault();
    const commentInput = addCommentForm.querySelector("input");
    const comment = commentInput.value;
    sendComment(comment);
    commentInput.value = "";
};

const deleteCommentList = (deleteUrl) => {
    
    decreaseNumber();
};

const sendDeleteComment = async (deleteUrl) => {
    const deleteResponse = await axios({
        url: `/api${deleteUrl}`,
        method: "GET",
    });
    if (deleteResponse.status === 200) {
        deleteCommentList(deleteUrl);
    }
};

const handleDelete = (event) => {
    event.preventDefault();
    const deleteUrl = event.path[1].href.split("api")[1];
    sendDeleteComment(deleteUrl);
    event.path[2].remove();
};

function init() {
    addCommentForm.addEventListener("submit", handleSubmit);
    for (let index = 0; index < deleteCommentBtns.length; index++) {
        deleteCommentBtns[index].addEventListener("click", handleDelete);
    }
};

if (addCommentForm) {
    init();
};
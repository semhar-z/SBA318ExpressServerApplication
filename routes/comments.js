const express = require("express");
const router = express.Router();
// const comments = require("../data/comments"); // e
const error = require("../utilities/error.js");


let commentsData = [];

// GET /comments 
router.get("/", (req, res) => {
    
    const { userId, postId } = req.query;
    let userComments = commentsData;

    if (userId) {
        userComments = userComments.filter(comment => comment.userId == userId);
    }
    if (postId) {
        userComments = userComments.filter(comment => comment.postId == postId);
    }

    res.json(userComments);
});

// POST /comments
router.post("/", (req, res, next) => {
    const { userId, postId, body } = req.body;

    if (userId && postId && body) {
        const newComment = {
            id: commentsData.length > 0 ? commentsData[commentsData.length - 1].id + 1 : 1,
            userId: userId,
            postId: postId,
            body: body
        };

        commentsData.push(newComment);
        res.status(201).json(newComment);
    } else {
        next(error(400, "Insufficient Data"));
    }
});

// GET /comments/:id 
router.get("/:id", (req, res, next) => {
    const comment = commentsData.find(c => c.id == req.params.id);
    if (comment) {
        res.json(comment);
    } else {
        next();
    }
});

// PATCH /comments/:id 
router.patch("/:id", (req, res, next) => {
    const comment = commentsData.find(c => c.id == req.params.id);
    if (comment) {
        comment.body = req.body.body || comment.body; // Update body if provided
        res.json(comment);
    } else {
        next();
    }
});

// DELETE /comments/:id 
router.delete("/:id", (req, res, next) => {
    const commentIndex = commentsData.findIndex(c => c.id == req.params.id);
    if (commentIndex > -1) {
        const deletedComment = commentsData.splice(commentIndex, 1);
        res.json(deletedComment);
    } else {
        next();
    }
});

// GET /posts/:id/comments 
router.get("/posts/:id/comments", (req, res) => {
    const postComments = commentsData.filter(comment => comment.postId == req.params.id);
    res.json(postComments);
});

// GET /users/:id/comments 
router.get("/users/:id/comments", (req, res) => {
    const userComments = commentsData.filter(comment => comment.userId == req.params.id);
    res.json(userComments);
});

// GET /posts/:id/comments?userId=<VALUE> 
router.get("/posts/:id/comments", (req, res) => {
    const { userId } = req.query;
    let postComments = commentsData.filter(comment => comment.postId == req.params.id);
    if (userId) {
        postComments = postComments.filter(comment => comment.userId == userId);
    }
    res.json(postComments);
});

// GET /users/:id/comments?postId=<VALUE> 
router.get("/users/:id/comments", (req, res) => {
    const { postId } = req.query;
    let userComments = commentsData.filter(comment => comment.userId == req.params.id);
    if (postId) {
        userComments = userComments.filter(comment => comment.postId == postId);
    }
    res.json(userComments);
});

module.exports = router;

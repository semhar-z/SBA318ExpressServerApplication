const express = require("express");
const router = express.Router();
const comments = require("../data/comments.js"); 
const error = require("../utilities/error.js");

// GET /comments   by userId or by postId
router.get("/", (req, res) => {
    
    const { userId, postId } = req.query;
    let userComments = comments;

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
            id: comments.length > 0 ? comments[comments.length - 1].id + 1 : 1,
            userId: userId,
            postId: postId,
            body: body
        };

        comments.push(newComment);
        res.redirect('/'); // Redirect back to the main page
        // res.status(201).json(newComment);
    } else {
        next(error(400, "Insufficient Data"));
    }
});

// GET /comments/:id 
router.get("/:id", (req, res, next) => {
    const comment = comments.find(c => c.id == req.params.id);
    if (comment) {
        return res.status(200).json(comment);
    } else {
        next();
    }
});

// PATCH /comments/:id 
router.patch("/:id", (req, res, next) => {
    const comment = comments.find(c => c.id == req.params.id);
    if (comment) {
        comment.body = req.body.body || comment.body; // Update body if provided
        res.json(comment);
    } else {
        next();
    }
});

// DELETE comment by ID
router.delete('/:id', (req, res, next) => {
    const commentId = parseInt(req.params.id, 10);
    const index = comments.findIndex(comment => comment.id === commentId);

    if (index !== -1) {
        comments.splice(index, 1);
        return res.redirect('/'); // back to the index page
        console.log(`Deleting comment with ID: ${commentId}`);

        return res.status(204).send(); 
    }

    
    res.status(404).json({ error: "Comment not found" });
});


module.exports = router;

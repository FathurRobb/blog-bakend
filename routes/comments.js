const express = require('express');
const Posts = require('../schemas/post');
const Comments = require('../schemas/comment');
const router = express.Router();

router.post('/comments/:_postId', async (req, res) => {
    const {_postId} = req.params;
    const {user, password, content} = req.body;
    
    const posts = await Posts.find({postId: _postId});
    if (posts.length) {
        if (content !== "") {
            await Comments.create({
                _postId,
                user,
                password,
                content
            });
            return res.json({
                message: "Comment created successfully."
            });
        } else {
            res.json({
                message: "Please enter the comment content"
            });
        }
    } else {
        res.status(404).json({
            errorMessage: "Post Not Found"
        });
    }
});

router.get('/comments/:_postId', async (req, res) => {
    const {_postId} = req.params;
    const {userSearch, contentSearch} = req.query;
    
    const comments = await Comments.find({_postId: _postId}, {"commentId": 1, "user": 1, "content": 1, "createdAt": 1, "_id": 0}).sort({"createdAt": -1});
    if (comments.length) {
        if (userSearch) {
            const searchUser = comments.filter((s) => s.user.toLowerCase().includes(userSearch.toLowerCase()));
            return res.json({
                data: searchUser,
            });
        } else if (contentSearch) {
            const searchContent = comments.filter((s) => s.content.toLowerCase().includes(contentSearch.toLowerCase()));
            return res.json({
                data: searchContent,
            });
        } else if(!userSearch || !contentSearch) {
            res.json({
                data: comments
            });
        }
    } else {
        res.status(404).json({
            errorMessage: "Post Not Found"
        });
    }
});

router.put('/comments/:_commentId', async (req, res) => {
    const {_commentId} = req.params;
    const {password, content} = req.body;

    const comments = await Comments.findOne({commentId: _commentId});
    if(comments) {
        if (comments.password === password) {
            if (content !== "") {
                await Comments.updateOne(
                    {commentId: _commentId},
                    {$set: {content}}
                );
                res.json({
                    message: "Comment has been edited."
                });
            } else {
                res.json({
                    message: "Please enter the comment content"
                });
            }
        } else {
            res.status(400).json({
                errorMessage: "Password doesn't match"
            });
        }
    } else {
        res.json({
            errorMessage: "Comment Not Found"
        });
    }
});

router.delete('/comments/:_commentId', async (req, res) => {
    const {_commentId} = req.params;
    const {password} = req.body;
    const comments = await Comments.find({commentId: _commentId});

    if(comments.length) {
        if (comments[0].password === password) {
            await Comments.deleteOne(
                {commentId: _commentId}
            );
            res.json({
                message: "Comment has been deleted."
            })
        } else {
            res.status(400).json({
                errorMessage: "Password doesn't match"
            });
        }
    } else {
        res.json({
            errorMessage: "Comment Not Found"
        });
    }
});

module.exports = router;
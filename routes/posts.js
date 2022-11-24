const express = require('express');
const Posts = require('../schemas/post');
const router = express.Router();

router.post('/posts', async (req, res) => {
    const {title, user, password, content} = req.body;
    await Posts.create({
        title,
        user,
        password,
        content
    });
    return res.json({
        message: "You created a post.",
    });
});

router.get('/posts', async (req, res) => {
    const posts = await Posts.find({}, {"postId": 1, "user": 1, "title": 1, "content":1, "createdAt": 1, "_id": 0}).sort({"createdAt": -1});
    const {titleSearch, userSearch, contentSearch, createdAtSearch} = req.query;
    if (titleSearch) {
        const searchTitle = posts.filter((s) => s.title.toLowerCase().includes(titleSearch.toLowerCase()));
        return res.json({
            data: searchTitle,
        });
    } else if (userSearch) {
        const searchUser = posts.filter((s) => s.user.toLowerCase().includes(userSearch.toLowerCase()));
        return res.json({
            data: searchUser,
        });
    } else if (contentSearch) {
        const searchContent = posts.filter((s) => s.content.toLowerCase().includes(contentSearch.toLowerCase()));
        return res.json({
            data: searchContent,
        });
    } else if (createdAtSearch) {
        const searchCreatedAt = posts.filter((s) => s.createdAt.toString().toLowerCase().includes(createdAtSearch.toLowerCase()));
        return res.json({
            data: searchCreatedAt,
        });
    } else if (!titleSearch || !userSearch || !contentSearch || !createdAtSearch) {
        return res.json({
            data: posts,
        });
    }
    // const {search} = req.query;
    // if (search) {
    //     const searchTitle = posts.filter((s) => s.title.toLowerCase().includes(search.toLowerCase()));
    //     const searchUser = posts.filter((s) => s.user.toLowerCase().includes(search.toLowerCase()));
    //     const searchContent = posts.filter((s) => s.content.toLowerCase().includes(search.toLowerCase()));
    //     const searchCreatedAt = posts.filter((s) => s.createdAt.toString().toLowerCase().includes(search.toLowerCase()));
    //     if (searchTitle.length > 0) {
    //         return res.json({
    //             data: searchTitle,
    //         });
    //     } else if (searchUser.length > 0) {
    //         return res.json({
    //             data: searchUser,
    //         });
    //     } else if (searchContent.length > 0) {
    //         return res.json({
    //             data: searchContent,
    //         });
    //     } else if (searchCreatedAt.length > 0) {
    //         return res.json({
    //             data: searchCreatedAt,
    //         });
    //     } else {
    //         return res.json({
    //             message: "Post Not Found",
    //         });
    //     }
    // }
    // if (!search) {
    //     return res.json({
    //         data: posts,
    //     });
    // }
});

router.get('/posts/:_postId', async (req, res) => {
    const {_postId} = req.params;
    const posts = await Posts.find({postId: _postId}, {"postId": 1, "user": 1, "title": 1, "content": 1, "createdAt": 1, "_id": 0});

    if (posts.length) {
        res.json({
            data: posts
        });
    } else {
        res.json({
            message: "Post not found."
        });
    }
});

router.put('/posts/:_postId', async (req, res) => {
    const {_postId} = req.params;
    const {password, title, content} = req.body;

    const posts = await Posts.findOne({postId: _postId});
    if(posts) {
        if (posts.password === password) {
            await Posts.updateOne(
                {postId: _postId},
                {$set: {title,content}}
            );
            res.json({
                message: "Post has been edited."
            })
        } else {
            res.status(400).json({
                errorMessage: "Password doesn't match"
            });
        }
    } else {
        res.json({
            errorMessage: "Post Not Found"
        });
    }
});

router.delete('/posts/:_postId', async (req, res) => {
    const {_postId} = req.params;
    const {password} = req.body;
    const posts = await Posts.find({postId: _postId});

    if(posts.length) {
        if (posts[0].password === password) {
            await Posts.deleteOne(
                {postId: _postId}
            );
            res.json({
                message: "Post has been deleted."
            })
        } else {
            res.status(400).json({
                errorMessage: "Password doesn't match"
            });
        }
    } else {
        res.json({
            errorMessage: "Post Not Found"
        });
    }
})

module.exports = router;
const upload =
require("../config/multerConfig");

const express = require("express");

const Post = require("../models/Post");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
"/create",
authMiddleware,
upload.fields([
    { name:"image", maxCount:1 },
    { name:"audio", maxCount:1 }
]),
async (req,res)=>{

try{

const post = new Post({

user:req.user,

content:req.body.content,

image:
req.files?.image
? req.files.image[0].filename
: "",

audio:
req.files?.audio
? req.files.audio[0].filename
: ""

});

await post.save();

res.status(201).json(post);

}catch(error){

res.status(500).json({
message:error.message
});

}

});

router.get("/all", async (req, res) => {

  try {

    const posts = await Post.find()
      .populate("user", "name email profilePic")
      .sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// Like Post

router.put("/like/:id", authMiddleware, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.likes.includes(req.user)) {
      return res.status(400).json({
        message: "Already liked"
      });
    }

    post.likes.push(req.user);

    await post.save();

    res.json(post);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// Delete Post

router.delete("/delete/:id", authMiddleware, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    if (post.user.toString() !== req.user) {
      return res.status(401).json({
        message: "Not Authorized"
      });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({
      message: "Post Deleted Successfully"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

const Comment = require("../models/Comment");

router.post("/comment/:id", authMiddleware, async (req, res) => {

  try {

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found"
      });
    }

    const comment = new Comment({
      post: req.params.id,
      user: req.user,
      text: req.body.text
    });

    await comment.save();

    res.status(201).json(comment);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.delete(
"/comment/:id",
authMiddleware,
async(req,res)=>{

try{

const comment =
await Comment.findById(req.params.id);

if(!comment){
return res.status(404).json({
message:"Comment not found"
});
}

if(comment.user.toString() !== req.user){
return res.status(401).json({
message:"Not Authorized"
});
}

await Comment.findByIdAndDelete(
req.params.id
);

res.json({
message:"Comment Deleted"
});

}catch(error){

res.status(500).json({
message:error.message
});

}

});

router.get("/comments/:id", async (req, res) => {

  try {

    const comments = await Comment.find({
      post: req.params.id
    }).populate("user", "name");

    res.json(comments);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

router.put("/unlike/:id", authMiddleware, async (req, res) => {

    try {

        const post = await Post.findById(req.params.id);

        post.likes = post.likes.filter(
            id => id.toString() !== req.user
        );

        await post.save();

        res.json({
            message: "Post Unliked"
        });

    } catch(error){

        res.status(500).json({
            message:error.message
        });
    }
});

router.get("/user/:id", async (req, res) => {

  try {

    const posts = await Post.find({
      user: req.params.id
    }).sort({ createdAt: -1 });

    res.json(posts);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;
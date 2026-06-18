const express = require("express");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/search", async (req, res) => {

    try {

        const users = await User.find({
            name: {
                $regex: req.query.name,
                $options: "i"
            }
        }).select("-password");

        res.json(users);

    } catch(error) {

        res.status(500).json({
            message: error.message
        });
    }
});

router.get("/profile/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id)
        .select("-password");

        res.json(user);

    } catch(error){

        res.status(500).json({
            message:error.message
        });
    }
});

// Follow User

router.put("/follow/:id", authMiddleware, async (req, res) => {

  try {

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    if (!userToFollow) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    if (!userToFollow.followers.includes(req.user)) {

      userToFollow.followers.push(req.user);
      currentUser.following.push(req.params.id);

      await userToFollow.save();
      await currentUser.save();
    }

    res.json({
      message: "User Followed"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

// Unfollow User

router.put("/unfollow/:id", authMiddleware, async (req, res) => {

  try {

    const userToUnfollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user);

    userToUnfollow.followers =
      userToUnfollow.followers.filter(
        id => id.toString() !== req.user
      );

    currentUser.following =
      currentUser.following.filter(
        id => id.toString() !== req.params.id
      );

    await userToUnfollow.save();
    await currentUser.save();

    res.json({
      message: "User Unfollowed"
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;
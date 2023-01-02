var generateUploadURL = require("./s3.js");
const path = require("path");
require("dotenv").config();

// Express app file
// (1) import express
// backend ==> require
const express = require("express");

// (2) import and enable cors
// (cross-origin resource sharing)
const cors = require("cors");

// (3) create an instanece of our express app
const webapp = express();

// (4) enable cors
webapp.use(cors());

// (5) configure express to parse bodies
webapp.use(express.urlencoded({ extended: true }));

// (5.2) Some weird config required to parse json?!
const bodyParser = require("body-parser");
webapp.use(bodyParser.json());

webapp.use(express.static(path.join(__dirname, "../new_view/build")));

// (6) import the db interactions module
const dbLib = require("./dbOperations");

// (7.1) implement json web token
const jwt = require("jsonwebtoken");
const secret = "o1ur_Pro2jECT%*_ke3Y456+prOject@%JJK";

// (7.2) implement authorization
const auth = require("./auth");

// (7.3) additional authenticate user method
const reAuth = async (req, res) => {
  if (!(await auth.authenticateUser(req.headers.authorization, secret))) {
    console.log("authentication failed!");
    res.status(401).json({ error: "failed authentication" });
    return false;
  }
  return true;
};

// root endpoint / route
// webapp.get("/", (req, resp) => {
//   resp.json({ message: "welcome to our backend!!!" });
// });

// implement the POST /login endpoint
webapp.post("/api/login", async (req, res) => {
  // check that the username was sent
  if (req.body.userName === "undefined") {
    res.status(401).json({ message: "Missing username" });
    res.end();
    return;
  }

  // check that the password was sent
  if (req.body.password === "undefined") {
    res.status(401).json({ message: "Missing password" });
    res.end();
    return;
  }

  let userObj;

  // fetch the user from backend...
  try {
    const result = await dbLib.getUserByName(req.body.userName);
    // check that the user exists
    if (result === null) {
      res.status(404).json({ message: "User not found!" });
      res.end();
      return;
    }
    // check we have the right password
    if (result.password !== req.body.password) {
      // return a boolean to tell whether we are locked out
      const lockedOut = await dbLib.addFailedLogin(req.body.userName);
      // console.log(lockedOut);
      // If so, return a different error message
      if (lockedOut) {
        res
          .status(403)
          .json({ message: "3 failed login attempts - Account locked" });
      } else {
        res.status(403).json({ message: "Incorrect password" });
      }
      res.end();
      return;
    }
    // Check that we do not more than 3 failed logins?
    const invalidLogins = await dbLib.checkNumFailedLogin(
      req.body.userName,
      Date.now()
    );
    // console.log(invalidLogins);
    if (invalidLogins >= 3) {
      res
        .status(403)
        .json({ message: "3 failed login attempts - Account locked" });
      res.end();
      return;
    }

    // if all hurdles cleared, return the user
    userObj = result;
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    res.end();
    return;
  }

  // sign the token and send it to the frontend along with userId, userName
  try {
    const userId = userObj._id.toString();
    const jwtoken = jwt.sign({ userId: userId }, secret, {
      expiresIn: "300s",
    });
    res.status(201).json({
      token: jwtoken,
      userId: userId,
      userName: req.body.userName,
      profile: userObj.profile,
    });
  } catch (err) {
    res.status(401).json({ message: "there was an error" });
  }
});

//************************User endpoints************************//

// implement the POST /User/ endpoint
webapp.post("/api/User", async (req, res) => {
  // parse the body of the request
  if (!req.body.userName || !req.body.password || !req.body.email) {
    res.status(404).json({ message: "missing username, password, or email" });
    return;
  }
  try {
    // create a new user
    const newUser = {
      userName: req.body.userName,
      password: req.body.password,
      email: req.body.email,
      posts: [],
      followers: [],
      followings: [],
      profile:
        "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
      bio: "Welcome to PhotoCamp! This is a personal bio - You can include your introduction, interests, ideas or anything else here! There is a limit of 150 characters. Have fun with PhotoCamp! ",
    };
    const result = await dbLib.addUser(newUser);
    res.status(201).json({ userId: result, ...newUser });
  } catch (err) {
    if (err.message === "duplicated user") {
      res.status(403).json({ message: err.message });
    } else {
      res.status(409).json({ message: err.message });
    }
  }
});

// Added auth
// get User info
webapp.get("/api/user/:userId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.userId) {
    res.status(400).json({ message: "missig userId when query a user" });
  }
  try {
    const result = await dbLib.getUserById(req.params.userId);
    res.status(201).json({ commentor: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
// get User info
webapp.get("/api/alluser", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getAllUsers();
    res.status(201).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*************************Post endpoints*************************//
// Added auth
webapp.post("/api/post", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.body.postContent || !req.body.creatorName) {
    res.status(400).json({ message: "missig postContent or creatorName" });
  }
  try {
    // create a new post
    const newPost = {
      creatorName: req.body.creatorName,
      postContent: req.body.postContent,
      caption: req.body.caption ? req.body.caption : "", // if the user doesn't type any caption, put empty string
      hiddenFrom: req.body.hiddenFrom,
      postTime: req.body.postTime,
      likedByUsers: req.body.likedByUsers,
      taggedUsers: req.body.taggedUsers,
    };
    const result = await dbLib.createNewPost(newPost);
    res.status(201).json({ postId: result, ...newPost });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.put("/api/post/:postId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId) {
    res.status(400).json({
      message: "missing postId to update a comment",
    });
  }
  try {
    const postId = req.params.postId;
    const updatedPost = req.body;
    const result = await dbLib.editPost(postId, updatedPost);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.delete("/api/post/:postId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId) {
    res.status(400).json({
      message: "missing postId to update a comment",
    });
  }
  try {
    const postId = req.params.postId;
    const result = await dbLib.deletePost(postId);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
// Get a list of posts that matches a tag
webapp.get("/api/postByMatchingTags/:username", async (req, res) => {
  // if (!(await reAuth(req, res))) {
  //   return;
  // }
  if (!req.params.username) {
    res.status(400).json({
      message: "missing username to fetch posts with matching tags",
    });
  }
  try {
    const username = req.params.username;
    const result = await dbLib.getPostByMatchingTags(username);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.get("/api/activityFeed/:userName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.userName || !req.query.endTime || !req.query.limit) {
    res.status(400).json({
      message:
        "missing userName or endTime or limit per page for activityFeeds query",
    });
    return;
  }
  try {
    const result = await dbLib.getActivityFeedsByUserNameWithPagination(
      req.params.userName,
      parseInt(req.query.endTime),
      parseInt(req.query.limit)
    );

    res.status(200).json({ posts: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

webapp.get("/api/activityFeed/update/:userName", async (req, res) => {
  if (!req.params.userName || !req.query.topPostTime) {
    res.status(400).json({
      message: "missing userName or topPostTime for check new activityFeed",
    });
    return;
  }
  try {
    const result = await dbLib.checkNewPostByUserName(
      req.params.userName,
      parseInt(req.query.topPostTime)
    );

    res.status(200).json({ result: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*************************Comment endpoints*************************//

// Added auth
webapp.get("/api/post/:postId/comments", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId) {
    res.status(400).json({
      message: "missing postId for getting comments for a post query",
    });
  }
  try {
    const result = await dbLib.getCommentsByPostId(req.params.postId);
    res.status(200).json({ comments: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.post("/api/post/:postId/comments", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId) {
    res.status(400).json({
      message: "missing postId for creating a comment",
    });
  }
  if (!req.body.commentorId || !req.body.commentText || !req.body.createdAt) {
    res.status(400).json({
      message:
        "missing commentorId or commentText or createdAt for creating a comment",
    });
  }
  try {
    // create a new post
    const newComment = {
      commentorId: req.body.commentorId,
      commentText: req.body.commentText,
      createdAt: parseInt(req.body.createdAt),
    };
    const result = await dbLib.addNewComment(req.params.postId, newComment);
    res.status(201).json({ commentId: result, ...newComment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.put("/api/post/comments/:commentId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.commentId) {
    res.status(400).json({
      message: "missing commentId to update a comment",
    });
  }
  if (!req.body.commentorId || !req.body.commentText || !req.body.createdAt) {
    res.status(400).json({
      message:
        "missing commentorId or commentText or createdAt for updating a comment",
    });
  }
  try {
    const updatedComment = {
      commentorId: req.body.commentorId,
      commentText: req.body.commentText,
      createdAt: parseInt(req.body.createdAt),
    };
    const result = await dbLib.updateComment(
      req.params.commentId,
      updatedComment
    );
    if (result.modifiedCount === 0) {
      res.status(404).json({ error: "comment not in the system" });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.delete("/api/post/:postId/comments/:commentId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId || !req.params.commentId) {
    res.status(400).json({
      message: "missing postId or commentId to delete a comment",
    });
  }
  try {
    const result = await dbLib.deleteComment(
      req.params.postId,
      req.params.commentId
    );
    if (result.deletedCount === 0) {
      res.status(404).json({ error: "comment or post not in the system" });
      return;
    }
    // send the response with the appropriate status code
    res.status(200).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*******************************Likes endpoints******************************//

// Added auth
webapp.put("/api/post/:postId/like/:likerId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId || !req.params.likerId) {
    res.status(400).json({
      message: "missing postId or likerId to like a post",
    });
  }
  try {
    const result = await dbLib.addLikeByPostId(
      req.params.postId,
      req.params.likerId
    );
    if (result.modifiedCount == 0) {
      res.status(404).json({ error: "post not in the system" });
      return;
    }
    res.status(201).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Added auth
webapp.put("/api/post/:postId/unlike/:likerId", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.postId || !req.params.likerId) {
    res.status(400).json({
      message: "missing postId or likerId to unlike a post",
    });
  }
  try {
    const result = await dbLib.unLikeByPostId(
      req.params.postId,
      req.params.likerId
    );
    if (result.modifiedCount == 0) {
      res.status(404).json({ error: "post not in the system" });
      return;
    }
    res.status(201).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//*******************************Visibility endpoints******************************//

webapp.put("/api/post/:postId/hide/:userName", async (req, res) => {
  if (!req.params.postId || !req.params.userName) {
    res.status(400).json({
      message: "missig postId or userName to hide a post",
    });
  }
  try {
    const result = await dbLib.hidePostByPostId(
      req.params.postId,
      req.params.userName
    );
    if (result.modifiedCount == 0) {
      res.status(404).json({ error: "post not in the system" });
      return;
    }
    res.status(201).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

webapp.put("/api/post/:postId/unhide/:userName", async (req, res) => {
  if (!req.params.postId || !req.params.userName) {
    res.status(400).json({
      message: "missig postId or userName to unhide a post",
    });
  }
  try {
    const result = await dbLib.unhidePostByPostId(
      req.params.postId,
      req.params.userName
    );
    if (result.modifiedCount == 0) {
      res.status(404).json({ error: "post not in the system" });
      return;
    }
    res.status(201).json({ message: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//************************************************/

// -------------- JACKIE --------------- //

//*******************************Friend suggestion endpoints******************************//

// get suggested friends
// added Auth
webapp.get("/api/friendsuggestion", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getAllUsers();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Error getting friend suggestion" });
  }
});

// get all users
webapp.get("/api/user", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getAllUsers();
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Error getting friend suggestion" });
  }
});

// get user by name
// added Auth
webapp.get("/api/user/name/:userName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getUserByName(req.params.userName);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Error getting user by user name" });
  }
});

// update user's profile
// Added auth
webapp.put("/api/profile/:userName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.body.newProfileURL) {
    res.status(404).json({ message: "missing newProfileURL" });
    return;
  }
  try {
    const result = await dbLib.updateUserProfile(
      req.params.userName,
      req.body.newProfileURL
    );
    res.status(201).json({ data: result });
    // console.log(res);
  } catch (err) {
    res.status(500).json({ message: "Error updating user's profile" });
  }
});

// get posts by id
// Added auth
webapp.get("/api/post/:id", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getPostsById(req.params.id);
    res.status(200).json({ data: result });
  } catch (err) {
    res.status(500).json({ message: "Error getting post by id" });
  }
});

// get following by name
// ADDED auth
webapp.get("/api/following/:userName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getUserByName(req.params.userName);
    const result2 = result.followings;
    res.status(200).json({ data: result2 });
  } catch (err) {
    res.status(500).json({ message: "Error getting following by userName" });
  }
});

// get follower by name
// ADDED auth
webapp.get("/api/follower/:userName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  try {
    const result = await dbLib.getUserByName(req.params.userName);
    const result2 = result.followers;
    res.status(200).json({ data: result2 });
  } catch (err) {
    res.status(500).json({ message: "Error getting followers by userName" });
  }
});

// follow a user
webapp.put("/api/follow/:userName/:followingName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.userName) {
    res.status(404).json({ message: "missing userName" });
    return;
  }
  if (!req.params.followingName) {
    res.status(404).json({ message: "missing followingName" });
    return;
  }
  try {
    const result = await dbLib.addToFollowing(
      req.params.userName,
      req.params.followingName
    );
    const result2 = await dbLib.addToFollower(
      req.params.followingName,
      req.params.userName
    );
    res.status(200).json({ data: [result, result2] });
  } catch (err) {
    res.status(500).json({ message: "Error follow " });
  }
});

// unfollow a user
webapp.put("/api/unfollow/:userName/:followingName", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  if (!req.params.userName) {
    res.status(404).json({ message: "missing userName" });
    return;
  }
  if (!req.params.followingName) {
    res.status(404).json({ message: "missing followingName" });
    return;
  }
  try {
    const result = await dbLib.deleteFromFollowing(
      req.params.userName,
      req.params.followingName
    );
    const result2 = await dbLib.deleteFromFollower(
      req.params.followingName,
      req.params.userName
    );
    res.status(200).json({ data: [result, result2] });
  } catch (err) {
    res.status(500).json({ message: "Error getting followers by userName" });
  }
});

// S3 upload
// Added auth
webapp.get("/api/s3Url", async (req, res) => {
  if (!(await reAuth(req, res))) {
    return;
  }
  const url = await generateUploadURL();
  // console.log("genereate", url);
  res.status(200).json({ url });
});

// root endpoint / route
webapp.get("*", (req, resp) => {
  resp.sendFile(path.join(__dirname, "../new_view/build/index.html"));
});

// export the express server for use by index.js
module.exports = webapp;

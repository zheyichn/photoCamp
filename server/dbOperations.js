// import the mongodb driver
const { MongoClient } = require("mongodb");

// import ObjectID
const { ObjectId } = require("mongodb");

const dotenv = require("dotenv");
dotenv.config({ path: "../.env" });

// the mongodb server URL
// const { dbName, password } = require("./config.json");
const dbName = process.env.dbName;
const password = process.env.password;
const dbURL = `mongodb+srv://Zheyichen:${password}@cluster0.j7vsg.mongodb.net/${dbName}?retryWrites=true&w=majority`;

/**
 * MongoDB database connection
 * It will be exported so we can close the connection
 * after running our tests
 */
let MongoConnection;

// connection to the db
const connect = async () => {
  // always use try/catch to handle any exception
  try {
    MongoConnection = await MongoClient.connect(dbURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }); // we return the entire connection, not just the DB
    // check that we are connected to the db
    // console.log(`connected to db: ${MongoConnection.db().databaseName}`);
    return MongoConnection;
  } catch (err) {
    console.log(err.message);
  }
};

/**
 *
 * @returns the database attached to this MongoDB connection
 */
const getDB = async () => {
  // test if there is an active connection
  if (!MongoConnection) {
    await connect();
  }
  return MongoConnection.db();
};

/**
 *
 * Close the mongodb connection
 */
const closeMongoDBConnection = async () => {
  await MongoConnection.close();
};

//********************** USERS ************************//
// CREATE a new user
const addUser = async (newUser) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").insertOne(newUser);
    const newUserId = result.insertedId.toString();
    return newUserId;
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("duplicated user");
    } else {
      throw new Error("unknown error");
    }
  }
};

// GET a user by userName
const getUserByName = async (userName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").findOne({ userName: userName });
    return result;
  } catch (err) {
    console.log(`error: ${err.message}`);
  }
};

// GET a user by userId (returning only the user profile and username)
const getUserById = async (userId) => {
  try {
    const db = await getDB();
    const user = await db.collection("User").findOne({ _id: ObjectId(userId) });
    // we're only interested in user profile and userName
    const commentorProfile = {
      commentorProfile: user.profile,
      commentorName: user.userName,
    };
    return commentorProfile;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

// GET a user profile by username (returning the userProfile)
const getUserProfileByName = async (userName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").findOne({ userName: userName });
    return result.profile;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

// Update user profile
const updateUserProfile = async (userName, newProfileURL) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").updateOne(
      { userName: userName },
      {
        $set: {
          profile: newProfileURL,
        },
      }
    );
    // print the result
    return result;
  } catch (err) {
    throw new Error("Update user profile failed");
  }
};

// GET all users (used for follower suggestion for HW4)
const getAllUsers = async () => {
  try {
    const db = await getDB();
    const result = await db.collection("User").find({}).toArray();
    return result;
  } catch (err) {
    throw new Error("Get all users failed");
  }
};

// helper method to check the recent number of failed login attempts
const checkNumFailedLogin = async(userName, currTime) => {
  try {
    const db = await getDB();
    const logOutMinutes = 2; // <-- number of minutes we want our logout policy to look back for
    const baseTime = currTime - logOutMinutes * 60000;
    const failedAttempts = await db.collection("User").find(
      { userName: userName },
      { projection:
        {_id: 0, count: {
          $size: { $filter: {
                input: "$failedLogin",
                as: "attempt",
                cond: { $gte: ["$$attempt", baseTime]}
              }}
          }}
      }
    ).toArray();
    const recentCount =  failedAttempts[0].count;
    return recentCount;
  } catch (err) {
    // mongodb query failed because there is no failedLogin field
    return 0;
  }
}

// add a failed login attempt
const addFailedLogin = async(userName) => {
  try {
    const db = await getDB();
    // count the number of invalid log-ins
    const currTime = Date.now();
    const recentCount = await checkNumFailedLogin(userName, currTime);

    // if we have previously been locked out 3 times, no need to add anything
    if (recentCount === 3) {
      return true; // locked out
    }

    // otherwise, proceed to add
    const result = await db.collection("User").updateOne(
      { userName: userName },
      {
        $push: {
          failedLogin: currTime
        },
      }
    );

    // if previously locked out twice, we now lock out the user
    if ((recentCount === 2) && (result.matchedCount === 1)) {
      return true;
    }

    // otherwise, return false -- we are not yet locked out
    return false;
  } catch (err) {
    console.log(err);
    throw new Error("");
  }
}

//********************** FOLLOWERS / FOLLOWING ************************//
// add a userName to current user's following list
const addToFollowing = async (userName, followingName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").updateOne(
      { userName: userName },
      {
        $push: {
          followings: followingName,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error("Add to following failed");
  }
};

// add a userName to current user's follower list
const addToFollower = async (userName, followerName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").updateOne(
      { userName: userName },
      {
        $push: {
          followers: followerName,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error("Add to followers failed");
  }
};

// delete a userName from current user's following list
const deleteFromFollowing = async (userName, followingName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").update(
      { userName: userName },
      {
        $pull: {
          followings: followingName,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error("Delete following by name failed");
  }
};

// delete a userName from current user's follower list
const deleteFromFollower = async (userName, followerName) => {
  try {
    const db = await getDB();
    const result = await db.collection("User").update(
      { userName: userName },
      {
        $pull: {
          followers: followerName,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error("Delete followers by name failed");
  }
};

// -------------- JACKIE --------------- //
//********************** POSTS ************************//
// get a post by post id
const getPostsById = async (postId) => {
  try {
    const db = await getDB();
    const result = await db
      .collection("Post")
      .find({ _id: ObjectId(postId) })
      .toArray();
    return result;
  } catch (err) {
    throw new Error("Get all users failed");
  }
};
// ******* POST CREATE/ upload ***************************************** //
// create new post method amended to filter the tagged user list to a list of valid user names
const createNewPost = async (newPost) => {
  try {
    const db = await getDB();
    // get the list of all users, tagged users, filter the list of valid users then replace the array
    const allUsers = await db
      .collection("User")
      .find({}, { projection: { _id: 0, userName: 1 } })
      .toArray();
    const allUsersArr = allUsers.map((user) => user.userName);
    const taggedUsers = newPost.taggedUsers;
    const validUsers = taggedUsers.filter((user) => allUsersArr.includes(user));
    newPost.taggedUsers = validUsers;
    // proceed to insert the post
    const result = await db.collection("Post").insertOne(newPost);
    await db
      .collection("User")
      .updateOne(
        { userName: newPost.creatorName },
        { $push: { posts: result.insertedId } }
      );
    return result.insertedId; // return the newPost id
  } catch (err) {
    throw new Error("DB insertion of new post failed");
  }
};

const getAllPosts = async () => {
  try {
    // get the db
    const db = await getDB();
    const result = await db.collection("Post").find({}).toArray();
    return result;
  } catch (err) {
    throw new Error("DB get all posts failed");
  }
};

// (Additional 2 methods by Justin)
// Change a post's information
const editPost = async (postId, editedPost) => {
  try {
    const db = await getDB();
    const result = await db.collection("Post").updateOne(
      { _id: ObjectId(postId) },
      {
        $set: {
          caption: editedPost.caption,
          postContent: editedPost.postContent,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

// delete post
const deletePost = async (postId) => {
  try {
    const db = await getDB();
    const userInfo = await db
      .collection("Post")
      .findOne(
        { _id: ObjectId(postId) },
        { projection: { _id: 0, creatorName: 1, comments: 1 } }
      );

    // 1. get all the comments and delete
    const comments = userInfo.comments;
    if (comments) {
      for (const i of comments) {
        const currComment = await db
          .collection("Comment")
          .deleteOne({ _id: i });
      }
    }

    // 2. get the creatorName and delete it from the list of post the creator made
    const creatorName = userInfo.creatorName;
    const deletedFromUser = await db
      .collection("User")
      .updateOne(
        { userName: creatorName },
        { $pull: { posts: ObjectId(postId.toString()) } }
      );

    // 3. delete the post itself
    const deletedPost = await db
      .collection("Post")
      .deleteOne({ _id: ObjectId(postId) });

    return deletedPost;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

// get post by matching tags
const getPostByMatchingTags = async (username) => {
  try {
    const db = await getDB();
    const postArr = await db
      .collection("Post")
      .find({ taggedUsers: username }, {})
      .toArray();
    // console.log(postArr);
    return postArr;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const getActivityFeedsByUserNameWithPagination = async (
  userName,
  endTime,
  limitPerCall
) => {
  try {
    const db = await getDB();
    const user = await getUserByName(userName);
    // loggedin user's posts
    let postIds = user["posts"];
    const followings = user["followings"];
    // get posts of all the followings
    for (var i = 0; i < followings.length; i++) {
      let following = followings[i];
      let followingUser = await getUserByName(following);
      if (followingUser["posts"].length !== 0) {
        postIds = postIds.concat(followingUser["posts"]);
      }
    }
    // all the postsIds that's leggal visible to the user
    postsObjIds = postIds.map((id) => ObjectId(id));
    const posts = await db
      .collection("Post")
      .find({
        _id: { $in: postsObjIds },
        postTime: { $lt: endTime },
      })
      .limit(limitPerCall)
      .sort({ postTime: -1 })
      .toArray();
    // filter out posts that are hidden from the user
    let visiblePosts = [];
    for (var i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.hiddenFrom && post.hiddenFrom.includes(userName)) {
        continue;
      } else {
        let creatorProfile = await getUserProfileByName(post.creatorName);
        post.creatorProfile = creatorProfile;
        visiblePosts.push(post);
      }
    }
    return visiblePosts;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const checkNewPostByUserName = async (userName, topPostTime) => {
  try {
    const db = await getDB();
    const user = await getUserByName(userName);
    // loggedin user's posts
    let postIds = user["posts"];
    const followings = user["followings"];
    // get posts of all the followings
    for (var i = 0; i < followings.length; i++) {
      let following = followings[i];
      let followingUser = await getUserByName(following);
      if (followingUser["posts"].length !== 0) {
        postIds = postIds.concat(followingUser["posts"]);
      }
    }
    // all the postsIds that's leggal visible to the user
    postsObjIds = postIds.map((id) => ObjectId(id));
    const posts = await db
      .collection("Post")
      .find({
        _id: { $in: postsObjIds },
      })
      .sort({ postTime: -1 })
      .toArray();
    // filter out posts that are hidden from the user
    let visiblePosts = [];
    for (var i = 0; i < posts.length; i++) {
      let post = posts[i];
      if (post.hiddenFrom && post.hiddenFrom.includes(userName)) {
        continue;
      } else {
        let creatorProfile = await getUserProfileByName(post.creatorName);
        post.creatorProfile = creatorProfile;
        visiblePosts.push(post);
      }
    }
    // check if the latest post in visisble posts array has a later timestamp that that of the
    // top post on homepage
    if (visiblePosts.length !== 0 && visiblePosts[0].postTime > topPostTime) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    throw new Error(`${err}`);
  }
};
//****************Like/Unlike a post */
const addLikeByPostId = async (postId, likerId) => {
  try {
    const db = await getDB();
    const res = await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $push: { likedByUsers: likerId } }
      );
    return res;
  } catch (e) {
    throw new Error(`${err}`);
  }
};

const unLikeByPostId = async (postId, likerId) => {
  try {
    const db = await getDB();
    const res = await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $pull: { likedByUsers: likerId } }
      );
    return res;
  } catch (e) {
    throw new Error(`${err}`);
  }
};
//***************hide a post from a user *************************//
const hidePostByPostId = async (postId, userName) => {
  try {
    const db = await getDB();
    const res = await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $push: { hiddenFrom: userName } }
      );
    return res;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const unhidePostByPostId = async (postId, userName) => {
  try {
    const db = await getDB();
    const res = await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $pull: { hiddenFrom: userName } }
      );
    return res;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

//****************Comments *************************//
const getCommentsByPostId = async (postId) => {
  try {
    const db = await getDB();
    const post = await db
      .collection("Post")
      .find({ _id: ObjectId(postId) })
      .toArray();
    const commentsIds = post[0].comments;

    // if a post has no commments return an empty array without jumping to map function
    if (!commentsIds) {
      return [];
    }

    const commentsObjIds = commentsIds.map((id) => ObjectId(id));
    const comments = await db
      .collection("Comment")
      .find({ _id: { $in: commentsObjIds } })
      .sort({ createdAt: 1 })
      .toArray();
    return comments;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const addNewComment = async (postId, newComment) => {
  try {
    const db = await getDB();
    const result = await db.collection("Comment").insertOne(newComment);
    await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $push: { comments: result.insertedId } }
      );
    return result.insertedId;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const updateComment = async (commentId, newComment) => {
  try {
    const db = await getDB();
    const result = await db.collection("Comment").updateOne(
      { _id: ObjectId(commentId) },
      {
        $set: {
          commentorId: newComment.commentorId,
          commentText: newComment.commentText,
          createdAt: newComment.createdAt,
        },
      }
    );
    return result;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

const deleteComment = async (postId, commentId) => {
  try {
    const db = await getDB();
    const result = await db
      .collection("Comment")
      .deleteOne({ _id: ObjectId(commentId) });
    // remove a comment from a post's comments list
    const res = await db
      .collection("Post")
      .updateOne(
        { _id: ObjectId(postId) },
        { $pull: { comments: ObjectId(commentId.toString()) } }
      );
    return result;
  } catch (err) {
    throw new Error(`${err}`);
  }
};

//*****************************************//

//****************Activity Feed *************************//

//*****************************************//
// test objects
// const testUser = {
//     userName: 'john123',
//     email: 'john123@gmail.com',
//     password: 'john12345'
// };

// // main function to test our code
// const main = async() => {
//     const conn = await connect();
//     getUserByName('john12345');
// }

// // execute main
// main();

// module exports
module.exports = {
  closeMongoDBConnection,
  getDB,
  connect,
  addUser,
  getUserByName,
  createNewPost,
  getAllPosts,
  editPost,
  deletePost,
  getPostByMatchingTags,
  getActivityFeedsByUserNameWithPagination,
  getCommentsByPostId,
  addNewComment,
  deleteComment,
  getUserById,
  getUserProfileByName,
  updateComment,
  getAllUsers,
  checkNumFailedLogin,
  addFailedLogin,
  getPostsById,
  addToFollowing,
  deleteFromFollowing,
  addToFollower,
  deleteFromFollower,
  updateUserProfile,
  addLikeByPostId,
  unLikeByPostId,
  hidePostByPostId,
  unhidePostByPostId,
  checkNewPostByUserName,
};

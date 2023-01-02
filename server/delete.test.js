const request = require("supertest");
const { closeMongoDBConnection, connect } = require("./dbOperations");
const webapp = require("./server");
const { ObjectId } = require("mongodb");
const { post } = require("./server");
let mongo;

const newUser = {
  userName: "johndoe",
  password: "johndoe123",
  email: "johndoe123@gmail.com",
  posts: [],
  followers: [],
  followings: [],
  profile:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  bio: "Welcome to PhotoCamp! This is a personal bio - You can include your introduction, interests, ideas or anything else here! There is a limit of 150 characters. Have fun with PhotoCamp! ",
};

const loginUser = {
  userName: "johndoe",
  password: "johndoe123",
};

const newPost = {
  creatorName: "johndoe",
  postContent:
    "https://images.unsplash.com/photo-1669908923467-f50d53f884b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60",
  caption: "this is a test post for BE testing",
  hiddenFrom: [],
  postTime: 1669508572000,
  taggedUsers: [],
  comments: [],
  likedByUsers: [],
};

const newComment = {
  commentText: "new comment in unit test post",
  createdAt: 1669668815715,
};

// 1. Delete a comment for a post
describe("DELETE /post/:postId/comments/:commentId endpoint integration test", () => {
  let db;
  let response;
  let postId;
  let commentId;
  let userId;
  let commentRes;
  let deleteCommentRes;
  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    newComment["commentorId"] = userId;
    commentRes = await request(webapp)
      .post(`/api/post/${postId}/comments`)
      .set("Authorization", loginResponse["_body"].token)
      .send(newComment);
    commentId = JSON.parse(commentRes.text).commentId;
    deleteCommentRes = await request(webapp)
      .delete(`/api/post/${postId}/comments/${commentId}`)
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the comment
    try {
      const result = await db
        .collection("Comment")
        .deleteOne({ "_id": ObjectId(commentId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the post
    try {
      const result = await db
        .collection("Post")
        .deleteOne({ "_id": ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      const result = await db
        .collection("User")
        .deleteOne({ userName: "johndoe" });
    } catch (err) {
      console.log("error", err.message);
    }
  };
  /**
   * After running the tests, we need to remove any test data from the DB
   * We need to close the mongodb connection
   */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
  });

  /**
   * Status code and response type
   */
  test("the status code is 200 and response type", () => {
    expect(deleteCommentRes.status).toBe(200); // status code
    expect(deleteCommentRes.type).toBe("application/json");
  });

  test("The deleted comment is no longer in the database", async () => {
    const deletedComment = await db
      .collection("Comment")
      .findOne({ "_id": ObjectId(commentId) });
    expect(deletedComment).toBe(null);
  });
});

// 2. Delete post

// 1. Delete a comment for a post
describe("DELETE /post/:postId endpoint integration test", () => {
  let db;
  let loginResponse;
  let response;
  let postId;
  let userId;
  let deletedPostRes;
  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // create user and login
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create new post
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post (in case it's not deleted)
    try {
      const result = await db
        .collection("Post")
        .deleteOne({ "_id": ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      const result = await db
        .collection("User")
        .deleteOne({ userName: "johndoe" });
    } catch (err) {
      console.log("error", err.message);
    }
  };
  /**
   * After running the tests, we need to remove any test data from the DB
   * We need to close the mongodb connection
   */
  afterAll(async () => {
    // we need to clear the DB
    try {
      await clearDatabase();
      await mongo.close(); // the test  file connection
      await closeMongoDBConnection(); // the express connection
    } catch (err) {
      return err;
    }
  });

  /**
   * Status code and response type
   */
  test("the status code is 200 and response type after creation", () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe("application/json");
  });

  test("delete the post and check it's no longer in database", async () => {
    deletedPostRes = await request(webapp)
      .delete(`/api/post/${postId}`)
      .set("Authorization", loginResponse["_body"].token);
    expect(deletedPostRes.status).toBe(200);
    expect(deletedPostRes.type).toBe("application/json");
    const deletedPost = await db
      .collection("Post")
      .findOne({ "_id": ObjectId(postId) });
    expect(deletedPost).toBe(null);
  });
});
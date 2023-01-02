const request = require("supertest");
const { ObjectId } = require("mongodb");
const { closeMongoDBConnection, connect } = require("./dbOperations");
const webapp = require("./server");

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

const newUser2 = {
  userName: "johndoe2",
  password: "johndoe2",
  email: "johndoe2@gmail.com",
  posts: [],
  followers: [],
  followings: [],
  profile:
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  bio: "Welcome to PhotoCamp! This is a personal bio - You can include your introduction, interests, ideas or anything else here! There is a limit of 150 characters. Have fun with PhotoCamp! ",
};

const loginUser2 = {
  userName: "johndoe2",
  password: "johndoe2",
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

const newComment2 = {
  commentText: "updated comment in unit test post",
  createdAt: 1669668815716,
};

const amendedPost = {
  creatorName: "johndoe",
  postContent:
    "https://images.unsplash.com/photo-1669908923467-f50d53f884b9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw1fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=900&q=60",
  caption: "this is the amended test post for BE testing",
  hiddenFrom: [],
  postTime: 1669508572000,
  taggedUsers: [],
  comments: [],
  likedByUsers: [],
};

//= ===================jackie====================
// 4. FOLLOWER / FOLLOWING
describe("Follow endpoints integration test", () => {
  let db;

  /**
   * Before running our test, we create a new user
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // create two test users
    await request(webapp).post("/api/User").send(newUser);
    await request(webapp).post("/api/User").send(newUser2);
    //login as user1 and let user1 follow user2
    // userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    await request(webapp)
      .put("/api/follow/johndoe/johndoe2")
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
      await db.collection("User").deleteOne({ userName: "johndoe2" });
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
    return null;
  });

  /**
   * Status code and response type
   */

  test("Follow successfully", async () => {
    const insertedUser = await db
      .collection("User")
      .findOne({ userName: "johndoe" });
    expect(insertedUser.followings).toEqual(["johndoe2"]);
  });
});

describe("Unfollow endpoints integration test", () => {
  let db;

  /**
   * Before running our test, we create a new user
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    // create two test users
    await request(webapp).post("/api/User").send(newUser);
    await request(webapp).post("/api/User").send(newUser2);
    // action: let johndoe  follow johndoe2, let johndoe2 follow johndoe
    // and then let johndoe2 undolloe johndoe
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    await request(webapp)
      .put("/api/follow/johndoe/johndoe2")
      .set("Authorization", loginResponse["_body"].token);

    const loginResponse2 = await request(webapp)
      .post("/api/login")
      .send(loginUser2);

    await request(webapp)
      .put("/api/follow/johndoe2/johndoe")
      .set("Authorization", loginResponse2["_body"].token);

    await request(webapp)
      .put("/api/unfollow/johndoe2/johndoe")
      .set("Authorization", loginResponse2["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    try {
      const result = await db
        .collection("User")
        .deleteOne({ userName: "johndoe" });
      const result2 = await db
        .collection("User")
        .deleteOne({ userName: "johndoe2" });
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
    return null;
  });

  /**
   * Status code and response type
   */

  test("unFollow successfully", async () => {
    const insertedUser = await db
      .collection("User")
      .findOne({ userName: "johndoe" });
    expect(insertedUser.followings).toEqual(["johndoe2"]);
    const insertedUser2 = await db
      .collection("User")
      .findOne({ userName: "johndoe2" });
    expect(insertedUser2.followings).toEqual([]);
  });
});

//= ===================jackie====================

//= ===================klaus=====================
describe("PUT /post/comments/:commentId endpoint integration test", () => {
  let db;
  let response;
  let postId;
  let commentId;
  let userId;
  let commentRes;
  let updatedCommentRes;
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
    // response = await request(webapp).post("/post").send(newPost);
    postId = JSON.parse(response.text).postId;
    newComment.commentorId = userId;
    newComment2.commentorId = userId;
    commentRes = await request(webapp)
      .post(`/api/post/${postId}/comments`)
      .set("Authorization", loginResponse["_body"].token)
      .send(newComment);
    commentId = JSON.parse(commentRes.text).commentId;
    updatedCommentRes = await request(webapp)
      .put(`/api/post/comments/${commentId}`)
      .set("Authorization", loginResponse["_body"].token)
      .send(newComment2);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the comment
    try {
      await db.collection("Comment").deleteOne({ _id: ObjectId(commentId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code is 200 and response type", () => {
    expect(updatedCommentRes.status).toBe(200); // status code
    expect(updatedCommentRes.type).toBe("application/json");
  });

  test("The updated comment is in the database", async () => {
    const updatedComment = await db
      .collection("Comment")
      .findOne({ _id: ObjectId(commentId) });
    expect(updatedComment.commentText).toEqual(
      "updated comment in unit test post"
    );
  });
});

/*************************** hide a post *******************/
describe("PUT /post/:postId/hide/:userName endpoint integration test", () => {
  // hide post with postId (in path) frmo user with the userName in path
  let db;
  let response;
  let postId;
  let hidePostRes;

  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create a new post for testing
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    hidePostRes = await request(webapp)
      .put(`/api/post/${postId}/hide/${loginUser.userName}`)
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code is 201 and response type", () => {
    expect(hidePostRes.status).toBe(201); // status code
    expect(hidePostRes.type).toBe("application/json");
    expect(JSON.parse(hidePostRes.text).message.modifiedCount).toEqual(1);
  });

  test("The user who hides the post is in the hiddenFrom list", async () => {
    const updatedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(updatedPost.hiddenFrom).toMatchObject([loginUser.userName]);
  });
});

/*************************** unhide a post *******************/
describe("PUT /post/:postId/unhide/:userName endpoint integration test", () => {
  // hide post with postId (in path) frmo user with the userName in path
  let db;
  let response;
  let postId;
  let unhidePostRes;

  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create a new post for testing
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    await request(webapp)
      .put(`/api/post/${postId}/hide/${loginUser.userName}`)
      .set("Authorization", loginResponse["_body"].token);
    unhidePostRes = await request(webapp)
      .put(`/api/post/${postId}/unhide/${loginUser.userName}`)
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code for unhide put request is 201 and response type", () => {
    expect(unhidePostRes.status).toBe(201); // status code
    expect(unhidePostRes.type).toBe("application/json");
    expect(JSON.parse(unhidePostRes.text).message.modifiedCount).toEqual(1);
  });

  test("The user who unhides the post is no longer in the hiddenFrom list", async () => {
    const updatedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(updatedPost.hiddenFrom).toMatchObject([]);
  });
});

/*************************** like a post *******************/
describe("PUT /post/:postId/like/:likerId endpoint integration test", () => {
  // hide post with postId (in path) frmo user with the userName in path
  let db;
  let response;
  let postId;

  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create a new post for testing
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    likePostRes = await request(webapp)
      .put(`/api/post/${postId}/like/${userId}`)
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code is 201 and response type", () => {
    expect(likePostRes.status).toBe(201); // status code
    expect(likePostRes.type).toBe("application/json");
    expect(JSON.parse(likePostRes.text).message.modifiedCount).toEqual(1);
  });

  test("The user who hides the post is in the hiddenFrom list", async () => {
    const updatedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(updatedPost.likedByUsers).toMatchObject([userId]);
  });
});

/*************************** unlike a post *******************/
describe("PUT /post/:postId/unlike/:likerId endpoint integration test", () => {
  // hide post with postId (in path) frmo user with the userName in path
  let db;
  let response;
  let postId;

  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create a new post for testing
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    await request(webapp)
      .put(`/api/post/${postId}/like/${userId}`)
      .set("Authorization", loginResponse["_body"].token);
    unlikePostRes = await request(webapp)
      .put(`/api/post/${postId}/unlike/${userId}`)
      .set("Authorization", loginResponse["_body"].token);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code is 201 and response type", () => {
    expect(unlikePostRes.status).toBe(201); // status code
    expect(unlikePostRes.type).toBe("application/json");
    expect(JSON.parse(unlikePostRes.text).message.modifiedCount).toEqual(1);
  });

  test("The user who hides the post is in the hiddenFrom list", async () => {
    const updatedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(updatedPost.likedByUsers).toMatchObject([]);
  });
});
//= ===================klaus=====================

//= ===================justin=====================

/*************************** edit a post *******************/
describe("PUT /post/:postId endpoint integration test", () => {
  let db;
  let response;
  let postId;
  let updatedPostRes;

  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    // create a post
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    // amend our post
    postId = JSON.parse(response.text).postId;
    updatedPostRes = await request(webapp).put(`/api/post/${postId}`)
        .set("Authorization", loginResponse["_body"].token)
        .send(amendedPost);
  });

  // function used in afterAll()
  const clearDatabase = async () => {
    // delete the post
    try {
      await db.collection("Post").deleteOne({ _id: ObjectId(postId) });
    } catch (err) {
      console.log("error", err.message);
    }
    // delete the user
    try {
      await db.collection("User").deleteOne({ userName: "johndoe" });
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
    return null;
  });

  /**
   * Status code and response type
   */
  test("the status code is 200 and response type", () => {
    expect(updatedPostRes.status).toBe(200); // status code
    expect(updatedPostRes.type).toBe("application/json");
  });

  test("The updated post is in the database", async () => {
    const updatedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(updatedPost.caption).toEqual(
      "this is the amended test post for BE testing"
    );
  });
});
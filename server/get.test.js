const request = require("supertest");
const { ObjectId } = require("mongodb");
const { closeMongoDBConnection, connect } = require("./dbOperations");
const webapp = require("./server");

let mongo;

// Reusable test users, comments, etc.
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

const loginUser = { userName: "johndoe", password: "johndoe123" };

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

// TEST GET ENDPOINTs

// 1. USERS
describe("GET user endpoints integration test", () => {
  let db;
  let testUserId;
  let loginResponse;
  /**
   * Before running our test, we create a new user
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const response = await request(webapp).post("/api/User").send(newUser);
    loginResponse = await request(webapp).post("/api/login").send(loginUser);
    testUserId = JSON.parse(response.text).userId;
  });

  // function used in afterAll()
  const clearDatabase = async () => {
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

  // test get all users endpoint
  test ("Get all users", async() => {
    const resp = await request(webapp).get("/api/alluser")
      .set("Authorization", loginResponse["_body"].token);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe("application/json");
    const userArr = JSON.parse(resp.text);
    expect(userArr.data.length).toBeGreaterThan(0);

    // so we made an endpoint twice lol but sure
    const resp2 = await request(webapp).get("/api/user")
      .set("Authorization", loginResponse["_body"].token);
    expect(resp2.status).toEqual(200);
    expect(resp2.type).toBe("application/json");
    const userArr2 = JSON.parse(resp.text);
    expect(userArr2.data.length).toBeGreaterThan(0);
  });

  // test get user by id endpoint
  test("Get a user by id endpoint status code and data", async () => {
    const resp = await request(webapp)
      .get(`/api/user/${testUserId}`)
      .set("Authorization", loginResponse["_body"].token);
    expect(resp.status).toEqual(201);
    expect(resp.type).toBe("application/json");
    const userArr = JSON.parse(resp.text);
    // make sure commentor profile and name is in
    const expectedObj = {
      commentor: {
        commentorProfile:
          "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
        commentorName: "johndoe",
      },
    };
    expect(userArr).toMatchObject(expectedObj);
  });

  // test get user by name endpoint
  test("Get a user by name endpoint status code and data", async () => {
    const resp = await request(webapp)
      .get("/api/user/name/johndoe")
      .set("Authorization", loginResponse["_body"].token);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe("application/json");
    const userArr = JSON.parse(resp.text);
    expect(userArr.data).toMatchObject({ _id: testUserId, ...newUser });
  });

  // 3. FOLLOWING/FOLLOWER (get followings/get follwers)
  test("Get a user's following endpoint status code and data", async () => {
    const resp = await request(webapp)
      .get("/api/following/johndoe")
      .set("Authorization", loginResponse["_body"].token);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe("application/json");
    const userArr = JSON.parse(resp.text);
    expect(userArr.data).toMatchObject([]);
  });

  test("Get a user's follower endpoint status code and data", async () => {
    const resp = await request(webapp)
      .get("/api/follower/johndoe")
      .set("Authorization", loginResponse["_body"].token);
    expect(resp.status).toEqual(200);
    expect(resp.type).toBe("application/json");
    const userArr = JSON.parse(resp.text);
    expect(userArr.data).toMatchObject([]);
  });

});

// 2. POSTS
describe("get /post/:id endpoints integration test", () => {
  let db;
  let userId;
  let loginResponse;
  let postResponse;
  let postId;
  let getPostResponse;

  /**
   * Before running our test, we create a new post
   */
   beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    loginResponse = await request(webapp).post("/api/login").send(loginUser);
    postResponse = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(postResponse.text).postId;
    getPostResponse = await request(webapp)
      .get(`/api/post/${postId}`)
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
      await clearDatabase(postId);
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
    expect(getPostResponse.status).toBe(200);
    expect(getPostResponse.type).toBe("application/json");
  });

  test("post obtained contains right info", () => {
    const postInfo = JSON.parse(getPostResponse.text);
    expect(postInfo.data[0]._id).toBe(postId);
  });

})

// 4. COMMENTS
describe("get /post/:postId/comments endpoints integration test", () => {
  let db;
  let response;
  let postId;
  let commentId;
  let userId;
  let commentRes;
  let loginResponse;
  let allCommentsRes;
  let allCommentsArr;
  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    loginResponse = await request(webapp).post("/api/login").send(loginUser);
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    newComment.commentorId = userId;
    commentRes = await request(webapp)
      .post(`/api/post/${postId}/comments`)
      .set("Authorization", loginResponse["_body"].token)
      .send(newComment);
    commentId = JSON.parse(commentRes.text).commentId;
    allCommentsRes = await request(webapp)
      .get(`/api/post/${postId}/comments`)
      .set("Authorization", loginResponse["_body"].token);
    allCommentsArr = JSON.parse(allCommentsRes.text).comments;
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
      await clearDatabase(postId);
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
    expect(commentRes.status).toBe(201); // status code
    expect(commentRes.type).toBe("application/json");
  });

  test("The new comment is in the database", async () => {
    const insertedComment = await db
      .collection("Comment")
      .findOne({ _id: ObjectId(commentId) });
    expect(insertedComment.commentText).toEqual(
      "new comment in unit test post"
    );
  });

  test("The new comment get be retrived", async () => {
    const insertedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(insertedPost.comments.length).toEqual(1);
  });

  test("Getting all comments under a post", async() => {
    expect(allCommentsArr).toHaveLength(1);
  });
});

// 5. FRIEND SUGGESTIONS -> will implement in next hw when having backend logic

// 6. ACTIVITY FEED

describe("GET /activityFeed/:userName endpoint integration test", () => {
  let db;
  let response;
  let postId;
  let activityRes;
  let postTime;
  let postsReturned;
  let missingQueryParamsRes;
  let loginResponse;
  /**
   * Before running our test, we create a new user, and post, the get the user's activity feeds
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await request(webapp).post("/api/User").send(newUser);
    loginResponse = await request(webapp).post("/api/login").send(loginUser);
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
    postTime = JSON.parse(response.text).postTime;
    activityRes = await request(webapp)
      .get("/api/activityFeed/johndoe")
      .set("Authorization", loginResponse["_body"].token)
      .query({ endTime: postTime + 1, limit: 10 });
    postsReturned = JSON.parse(activityRes.text).posts;
    missingQueryParamsRes = await request(webapp)
      .get("/api/activityFeed/johndoe")
      .set("Authorization", loginResponse["_body"].token)
      .query({ endTime: postTime + 1 });
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
      await clearDatabase(postId);
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
    expect(activityRes.status).toBe(200); // status code
    expect(activityRes.type).toBe("application/json");
  });

  test("The new comment is in the database", async () => {
    expect(postsReturned[0].caption).toEqual(
      "this is a test post for BE testing"
    );
  });

  /**
   * Invalid request should return 400 to indicate missing query params
   */
  test("the status code is 400 and response type", () => {
    expect(missingQueryParamsRes.status).toBe(400); // status code
  });
});

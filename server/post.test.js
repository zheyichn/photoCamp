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

const loginUser = {
  userName: "johndoe",
  password: "johndoe123",
};

// TEST POST ENDPOINTs

// 1. USERS
describe("POST /User endpoints integration test", () => {
  let db;
  let response;
  /**
   * Before running our test, we create a new user
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    response = await request(webapp).post("/api/User").send(newUser);
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

  /**
   * Status code and response type
   */
  test("the status code is 201 and response type", () => {
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe("application/json");
  });

  test("The new user is in the database", async () => {
    const insertedUser = await db
      .collection("User")
      .findOne({ userName: "johndoe" });
    expect(insertedUser.email).toEqual("johndoe123@gmail.com");
  });
});

// 2. LOGIN
describe("POST /login endpoint integration test", () => {
  let db;

  /**
   * Before running our test, we create a new user
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await request(webapp).post("/api/User").send(newUser);
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

  // const loginUser = {
  //   userName: "johndoe",
  //   password: "johndoe123",
  // };

  const wrongPasswordUser = {
    userName: "johndoe",
    password: "hahahaha",
  };

  const nonexistentUser = {
    userName: "sjkdfhoadnboianfbna",
    password: "dfgjanofbnoafnbvoiasdnva",
  };

  /**
   * Status code and response type
   */
  test("the status code is 201 and response type", async () => {
    const resp = await request(webapp).post("/api/login").send(loginUser);
    expect(resp.status).toBe(201); // status code
    expect(resp.type).toBe("application/json");
  });

  /**
   * Check for incorrect password
   */
  test("the status code is 403 and response type", async () => {
    const resp = await request(webapp).post("/api/login").send(wrongPasswordUser);
    expect(resp.status).toBe(403); // status code
    expect(resp.type).toBe("application/json");
  });

  /**
   * Check for non-existent user
   */
  test("the status code is 404 and response type", async () => {
    const resp = await request(webapp).post("/api/login").send(nonexistentUser);
    expect(resp.status).toBe(404); // status code
    expect(resp.type).toBe("application/json");
  });
});

// 3. POSTS

describe("POST /post endpoints integration test", () => {
  let db;
  let response;
  let postId;
  /**
   * Before running our test, we create a new post
   */
  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    await request(webapp).post("/api/User").send(newUser);
    // log in to get authorization (jwt-token)
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
    response = await request(webapp)
      .post("/api/post")
      .set("Authorization", loginResponse["_body"].token)
      .send(newPost);
    postId = JSON.parse(response.text).postId;
  });

  // function used in afterAll()
  const clearDatabase = async () => {
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
    expect(response.status).toBe(201); // status code
    expect(response.type).toBe("application/json");
  });

  test("The new post is in the database", async () => {
    const insertedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(insertedPost.caption).toEqual("this is a test post for BE testing");
  });

  test("The new post is added to the user object", async () => {
    const insertedUser = await db
      .collection("User")
      .findOne({ userName: "johndoe" });
    expect(insertedUser.posts.length).toEqual(1);
  });
});

// 4. COMMENTS

describe("POST /post/:postId/comments endpoints integration test", () => {
  let db;
  let response;
  let postId;
  let commentId;
  let userId;
  let commentRes;
  /**
   * Before running our test, we create a new post
   */

  beforeAll(async () => {
    mongo = await connect();
    db = mongo.db();
    const res = await request(webapp).post("/api/User").send(newUser);
    userId = JSON.parse(res.text).userId;
    // log in to get authorization (jwt-token)
    const loginResponse = await request(webapp).post("/api/login").send(loginUser);
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
    return null;
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

  test("The new comment is added to the post object", async () => {
    const insertedPost = await db
      .collection("Post")
      .findOne({ _id: ObjectId(postId) });
    expect(insertedPost.comments.length).toEqual(1);
  });
});

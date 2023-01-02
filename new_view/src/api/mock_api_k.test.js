const lib = require("./mock_api_k.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

describe("the api returned correct data for get comments", () => {
  // seed data for all get requests. You can specify an endpoint to mock
  const mockAxios = new MockAdapter(axios);
  const commentsArray = {
    comments: [
      { commentId: 1, commentText: "test comment one" },
      { commentId: 2, commentText: "test comment two" },
      { commentId: 3, commentText: "test comment three" },
    ],
  };
  const commentReturend = {
    commentId: 1,
    commentText: "random context",
    commentorId: 6,
  };
  const updatedCommment = {
    commentId: 1,
    commentText: "updated context",
    commentorId: 6,
  };
  mockAxios.onGet().reply(200, commentsArray);
  mockAxios.onPost().reply(201, commentReturend);
  mockAxios.onPut().reply(200, updatedCommment);

  test("comments array are of length 3", async () =>
    await lib
      .getCommentsByPostId(1)
      .then((data) => expect(data.length).toEqual(3)));

  test("comments objects match", async () =>
    await lib.getCommentsByPostId(1).then((data) => {
      expect(data[0]).toMatchObject(commentsArray.comments[0]);
      expect(data[1]).toMatchObject(commentsArray.comments[1]);
      expect(data[2]).toMatchObject(commentsArray.comments[2]);
    }));

  test("comment post request success", async () =>
    await lib
      .addNewComment(1, commentReturend)
      .then((data) => expect(data.commentText).toEqual("random context")));

  test("comment object match", async () =>
    await lib.addNewComment(1, commentReturend).then((data) => {
      expect(data).toMatchObject(commentReturend);
    }));

  test("comment put request success", async () =>
    await lib
      .updateComment(1, 2, commentReturend)
      .then((data) => expect(data).toEqual(200)));

  test("like a post put request", async () => {
    const updatedPostByLike = {
      commentId: 1,
      commentText: "random context",
      commentorId: 6,
      likedByUsers: [6, 7, 8],
    };
    mockAxios.resetHistory();
    mockAxios.onPut().reply(200, updatedPostByLike);
    await lib.updateLike(1, updatedPostByLike).then((data) => {
      expect(data).toMatchObject(updatedPostByLike);
    });
  });

  test("delete a comment request success", async () => {
    mockAxios.resetHistory();
    mockAxios.onDelete().reply(200);
    await lib.deleteComment(1, 2).then((data) => {
      expect(data).toEqual(200);
    });
  });
});

const lib = require("./mock_api_following_post_follower.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

describe("test get posts", () => {
  const mockAxios = new MockAdapter(axios);

  const postsArray = [
    {
      creatorId: 74,
      creatorUsername: "Corbin",
      postContent: "http://loremflickr.com/640/480/nightlife",
      caption: "test1",
      visibility: false,
      postTime: 1667956947,
      likedByUsers: [],
      taggedUsers: [],
      creatorProfile: "http://loremflickr.com/640/480/abstract",
      postId: "1",
    },
    {
      creatorId: 20,
      creatorUsername: "Gustave",
      postContent: "http://loremflickr.com/640/480/business",
      caption: "test2",
      visibility: false,
      postTime: 1667956887,
      likedByUsers: [],
      taggedUsers: [],
      creatorProfile: "http://loremflickr.com/640/480/nightlife",
      postId: "2",
      Comments: [],
    },
    {
      creatorId: 67,
      creatorUsername: "Alana",
      postContent: "http://loremflickr.com/640/480/fashion",
      caption: "test3",
      visibility: false,
      postTime: 1667956827,
      likedByUsers: [],
      taggedUsers: [],
      creatorProfile: "http://loremflickr.com/640/480/business",
      postId: "3",
    },
  ];

  mockAxios.onGet().reply(200, postsArray);

  test("follower array match", async () =>
    lib.getPostsAPI().then((data) => {
      expect(data[0]).toMatchObject(postsArray[0]);
      expect(data[1]).toMatchObject(postsArray[1]);
      expect(data[2]).toMatchObject(postsArray[2]);
    }));
});

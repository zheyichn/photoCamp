const lib = require("./mock_api_following_post_follower.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

describe("test get follower", () => {
  const mockAxios = new MockAdapter(axios);

  const followerArray = {
    userName: "KariHahn",
    profile: "http://loremflickr.com/640/480/city",
    followers: ["user1", "user2"],
    followings: ["user3", "user4"],
  };

  mockAxios.onGet().reply(200, followerArray);

  test("follower array match", async () =>
    lib.getFollowerAPI("KariHahn").then((data) => {
      expect(data.data).toMatchObject(followerArray);
    }));
});

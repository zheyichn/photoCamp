const lib = require("./mock_api_following_post_follower.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

describe("test get following", () => {
  const mockAxios = new MockAdapter(axios);
  const followingArray = [
    {
      userID: 1,
      profilePhoto: "http://loremflickr.com/640/480/transport",
      userName: "Stewart Wyman",
      isFollow: false,
      id: "1",
    },
    {
      userID: 2,
      profilePhoto: "http://loremflickr.com/640/480/transport",
      userName: "Brian Schoen",
      isFollow: true,
      id: "2",
    },
    {
      userID: 3,
      profilePhoto: "http://loremflickr.com/640/480/nightlife",
      userName: "Matt Raynor",
      isFollow: false,
      id: "3",
    },
  ];

  const friendReturned = {
    userID: 9,
    profilePhoto: "http://loremflickr.com/640/480/nightlife",
    userName: "Jackie He",
    isFollow: false,
    id: "92",
  };

  mockAxios.onGet().reply(200, followingArray);
  mockAxios.onPost().reply(201, friendReturned);

  test("following array match", async () =>
    lib.getFollowingAPI().then((data) => {
      expect(data.data[0]).toMatchObject(followingArray[0]);
      expect(data.data[1]).toMatchObject(followingArray[1]);
      expect(data.data[2]).toMatchObject(followingArray[2]);
    }));

  test("follow post request success", async () =>
    lib
      .followUserAPI(friendReturned)
      .then((data) => expect(data).toEqual(null)));
});

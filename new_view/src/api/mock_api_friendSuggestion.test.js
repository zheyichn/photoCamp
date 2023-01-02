const lib = require("./mock_api_following_post_follower.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

describe("test friend suggestion", () => {
  const mockAxios = new MockAdapter(axios);

  const friendArray = [
    {
      userID: 53,
      userName: "Kari Hahn",
      profilePhoto: "http://loremflickr.com/640/480/city",
      isFollow: true,
      id: "12",
    },
    {
      userID: 38,
      userName: "Misty Corkery",
      profilePhoto: "http://loremflickr.com/640/480/business",
      isFollow: true,
      id: "13",
    },
    {
      userID: 26,
      userName: "Elizabeth Fadel IV",
      profilePhoto: "http://loremflickr.com/640/480/technics",
      isFollow: false,
      id: "14",
    },
  ];

  mockAxios.onGet().reply(200, friendArray);

  // firend suggestion filters the friends we are not following now
  // so only returns friends with isFollow === flase, which is the third element in array
  test("friend suggestion array match", async () =>
    lib.getFriendSuggestionAPI().then((data) => {
      expect(data.data).toMatchObject(friendArray);
    }));
});

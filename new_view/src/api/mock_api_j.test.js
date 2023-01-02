const lib = require("./mock_api_j.js");
const axios = require("axios");
const MockAdapter = require("axios-mock-adapter");

const mockAxios = new MockAdapter(axios);

describe("user endpoints", () => {
    const testNewUser = {
      userName: "userName557",
      password: "password557",
      email: "557@cis.upenn.edu",
    };
    const testResp = {
      userId: "557",
      userName: "userName557",
      password: "password557",
      email: "557@cis.upenn.edu",
    };
    
    // const mockAxios = new MockAdapter(axios);
    mockAxios.onPost().reply(201, testResp);
    mockAxios.onGet().reply(200, testResp);
    
    test("getUser", async() => {
      const data = await lib.getUser(557);
      expect(data.userId).toBe("557");
      });
  
    test("createUser", async() => {
      const data = await lib.createUser(testNewUser);
      expect(data.userId).toBe("557");
    });
});

describe("post edit endpoint", () => {

    // post object should be same as post response
    const postObj = {
        creatorId: 557,
        creatorUsername: "Justin Ng",
        postContent: "http://loremflickr.com/640/480/fashion",
        caption: "amended caption",
        visibility: false,
        postTime: 1667929690,
        likedByUsers: [
         1
        ],
        taggedUsers: [],
        creatorProfile: "http://loremflickr.com/640/480/sports",
        postId: "557",
        Comments: []
    }

    const postResp = {
        creatorId: 557,
        creatorUsername: "Justin Ng",
        postContent: "http://loremflickr.com/640/480/fashion",
        caption: "amended caption",
        visibility: false,
        postTime: 1667929690,
        likedByUsers: [
         1
        ],
        taggedUsers: [],
        creatorProfile: "http://loremflickr.com/640/480/sports",
        postId: "557",
        Comments: []
    }

    mockAxios.onPut().reply(200, postResp);
    mockAxios.onDelete().reply(200, postResp);

    test('putPostEdit', async() => {
        const data = await lib.putPostEdit(postObj);
        expect(data.postId).toBe("557");
    });

    test('deletePost', async() => {
      const data = await lib.deletePost("557");
      expect(data.postId).toBe("557");
    })

});

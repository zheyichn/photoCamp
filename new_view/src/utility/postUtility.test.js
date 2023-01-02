describe("test functions related to post", () => {
  it("test likesFilter", () => {
    let likedByList1 = [1, 2, 3, 21, 90];
    let likedByList2 = [37, 56];
    const { likesFilter } = require("./likesFilter");
    // can remove current user from likedByUsers list
    const res1 = likesFilter(true, likedByList1, 1);
    const res2 = likesFilter(false, likedByList2, 3);
    expect(res1).toEqual([2, 3, 21, 90]);
    expect(res2).toEqual([37, 56, 3]);
  });
});

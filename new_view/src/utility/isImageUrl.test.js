import "@testing-library/jest-dom";

describe("isImageUrl test if an url contains a img file or video file", () => {
  it("test isImgUrl", async () => {
    const { isImgUrl } = require("./isImageUrl");
    const urls = [
      "https://upload.wikimedia.org/wikipedia/commons/a/a3/June_odd-eyed-cat.jpg",
      "https://cis557jjk.s3.amazonaws.com/bd78f32abab4c896ef828553f874675a",
    ];

    await Promise.all(urls.map((url) => isImgUrl(url))).then((res) => {
      expect(res).toEqual([true, false]);
    });
  });
});

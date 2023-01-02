import "@testing-library/jest-dom";
// import useUserScroll from "./useUserScroll";
import renderer from "react-test-renderer";
import axios from "axios";
jest.mock("axios");

const fakeReponse = [
  { postId: 1, postContent: "test post one" },
  { postId: 2, postContent: "test post two" },
  { postId: 3, commentText: "test post three" },
];

test("useScroll functions correctly", async () => {
  axios.get.mockResolvedValue({ data: fakeReponse });
  const tree = renderer.create(<useUserScroll></useUserScroll>).toJSON();
  expect(tree).toMatchSnapshot();
});

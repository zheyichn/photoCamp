import { render, screen, cleanup, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityFeed from "./ActivityFeed";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import { Context } from "../../App";

// const axios = require("axios");
// const MockAdapter = require("axios-mock-adapter");
// const mockAxios = new MockAdapter(axios);
// const commentsArray = [
//   { commentId: 1, commentText: "test comment one" },
//   { commentId: 2, commentText: "test comment two" },
//   { commentId: 3, commentText: "test comment three" },
// ];
// mockAxios.onGet().reply(200, commentsArray);
const fakePost = {
  creatorId: 10,
  creatorUsername: "Irwin",
  postContent:
    "https://user-images.githubusercontent.com/93358071/191072941-5fc4a59a-49d0-4b18-80f9-573e38984fa8.jpeg",
  caption:
    "Cum consectetur et. At quia sed non accusantium saepe qui cum. Sed est asperiores qui.",
  visibility: false,
  postTime: 1665776721,
  likedByUsers: [1],
  taggedUsers: [],
  creatorProfile: "http://loremflickr.com/640/480/technics",
  postId: "1",
};

const fakeLoggedInUser = {
  userName: "admin klaus",
  profile:
    "https://user-images.githubusercontent.com/93358071/191072941-5fc4a59a-49d0-4b18-80f9-573e38984fa8.jpeg",
  userId: 1,
};

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("ActivityFeed Component", () => {
  // Test1: sub components exixt
  test("ActivityFeed has postContent and button", () => {
    render(<ActivityFeed post={fakePost} />);
    const cardMedia = screen.getByTestId("test-img");
    expect(cardMedia).toBeInTheDocument();
  });

  // Test2: caption text content reads correctly
  test("caption content displays correctly", () => {
    render(<ActivityFeed post={fakePost} />);
    const caption = screen.getByTestId("caption");
    expect(caption).toHaveTextContent(
      "Cum consectetur et. At quia sed non accusantium saepe qui cum. Sed est asperiores qui."
    );
  });

  test("card media is shown on the screen on loading", () => {
    const { queryByAltText, queryByTestId } = render(
      <ActivityFeed post={fakePost} />
    );
    expect(queryByAltText("Post Picture")).toBeNull();
    expect(queryByTestId("comment-section")).toBeNull();
  });

  // test("card media is not shown on the screen on loading", () => {
  //   const { queryByTestId } = render(<ActivityFeed post={fakePost} />);
  //   const writeButton = screen.getByTestId("write-test");
  //   expect(queryByTestId("comment-section")).toBeNull();
  //   expect(queryByTestId("form-test")).toBeNull();
  //   expect(writeButton).toBeInTheDocument();
  //   userEvent.click(writeButton);
  //   expect(queryByTestId("comment-section")).toBeInTheDocument();
  // });

  test("comment form renders correctly", () => {
    const { queryByTestId, queryByRole } = render(
      <Context.Provider value={{ fakeLoggedInUser }}>
        <ActivityFeed post={fakePost} />
      </Context.Provider>
    );
    const writeButton = screen.getByTestId("write-test");
    expect(queryByTestId("form-test")).toBeNull();
    expect(writeButton).toBeInTheDocument();
    const childInput = queryByRole("textbox");
    expect(childInput).toBeNull();
    // userEvent.click(writeButton);
    // const commentSection = queryByTestId("comment-section");
    // const childButton = within(commentSection).getByRole("button");
    // const textInput = within(commentSection).getByRole("textbox");
    // expect(childButton).toBeInTheDocument();
    // expect(textInput).toBeInTheDocument();
  });

  // Test3: match snapshots
  it("ActivityFeed renders correctly", () => {
    const tree = renderer
      .create(<ActivityFeed post={fakePost}></ActivityFeed>)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

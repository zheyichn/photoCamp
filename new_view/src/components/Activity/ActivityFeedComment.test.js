import { render, screen, within } from "@testing-library/react";
import "@testing-library/jest-dom";
import ActivityFeed from "./ActivityFeed";
import userEvent from "@testing-library/user-event";
import { Context } from "../../App";
import { act } from "react-dom/test-utils";
import axios from "axios";
jest.mock("axios");
const fakeCommentsArray = {
  comments: [
    { _id: 1, commentText: "test comment one", createdAt: 123456 },
    { _id: 2, commentText: "test comment two", createdAt: 1234567 },
    { _id: 3, commentText: "test comment three", createdAt: 12345678 },
  ],
};

const fakeCommentor = {
  commentor: {
    commentorName: "test commentor",
    commentorProfile: "default commentor profile",
  },
};
const fakeLoggedInUser = {
  userName: "admin klaus",
  profile:
    "https://user-images.githubusercontent.com/93358071/191072941-5fc4a59a-49d0-4b18-80f9-573e38984fa8.jpeg",
  userId: 1,
};

const fakePost = {
  creatorId: 10,
  creatorUsername: "Irwin",
  postContent: "http://loremflickr.com/640/480/people",
  caption:
    "Cum consectetur et. At quia sed non accusantium saepe qui cum. Sed est asperiores qui.",
  visibility: false,
  postTime: 1665776721,
  likedByUsers: [1],
  taggedUsers: [],
  creatorProfile: "http://loremflickr.com/640/480/technics",
  _id: "1",
};

test("comment form renders correctly", async () => {
  axios.get.mockResolvedValueOnce({ data: fakeCommentsArray });
  axios.get.mockResolvedValueOnce({ data: fakeCommentor });
  axios.get.mockResolvedValueOnce({ data: fakeCommentor });
  axios.get.mockResolvedValueOnce({ data: fakeCommentor });
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
  await act(async () => userEvent.click(writeButton));
  const commentSection = queryByTestId("comment-section");
  const textInput = within(commentSection).getByRole("textbox");
  expect(textInput).toBeInTheDocument();
});

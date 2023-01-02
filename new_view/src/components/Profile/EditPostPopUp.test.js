import { cleanup , render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import EditPostPopUp from "./EditPostPopUp";
import userEvent from "@testing-library/user-event";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("EditPostPopUp", () => {

    const currPost = {
        creatorId: 74,
        creatorUsername: "Corbin",
        postContent: "http://loremflickr.com/640/480/nightlife",
        caption: "Sunt magni ut expedita voluptas impedit. Beatae maxime soluta qui nisi ipsa enim molestias eligendi et.",
        visibility: false,
        postTime: 1667956947,
        likedByUsers: [],
        taggedUsers: [],
        creatorProfile: "http://loremflickr.com/640/480/abstract",
        postId: "1"
    }

    test("click button", () => {
        render(<EditPostPopUp open={true} onClose={jest.fn()} currPost={currPost} setCurrPost={jest.fn()}/>);
        const btn = screen.getByTestId("save-btn");
        userEvent.click(btn);
        expect(btn).toBeInTheDocument();
    })

    it("Page renders correctly", () => {
        const tree = renderer.create(<EditPostPopUp open={false} currPost = {currPost} />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
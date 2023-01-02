import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CommentForm from "./CommentForm";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";

describe("CommentForm Component", () => {
  const handleClick = jest.fn();
  // Test1 comment display
  test("When user enters a comment it is displayed", async () => {
    render(<CommentForm handlePostClick={handleClick} />);
    // create a reference to the textfield
    const element = screen.getByRole("textbox");
    // type some comments into the textbox
    await userEvent.type(element, "this is a comment");
    // assertion: verify that the text is in the textbox
    expect(element).toHaveValue("this is a comment");
  });

    // Test2: match snapshots
    it("CommentForm renders correctly", () => {
      const tree = renderer
        .create(<CommentForm handlePostClick={handleClick} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});

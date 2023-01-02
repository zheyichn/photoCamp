import React from "react";
import { render, screen } from "@testing-library/react";
import Comment from "./Comment";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";

describe("Comment component renders correctly", () => {
  // Test1 comment display
  const testCommentorName = "Thomas";
  const testCommentText =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec ultrices luctus tortor, in ultrices velit elementum sit amet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
  const testCommentorProfile =
    "https://www.freepik.com/free-photo/portrait-cheerful-caucasian-man_2753777.htm#query=portrait&position=2&from_view=keyword";
  const createdAt = 1667787227;
  test("commentor name displayed correctly", () => {
    render(
      <Comment
        commentorName={testCommentorName}
        commentText={testCommentText}
        commentorProfile={testCommentorProfile}
        createdAt={createdAt}
      />
    );
    const commentorName = screen.getByTestId("test-name");
    expect(commentorName).toHaveTextContent("Thomas");
  });

  it("Comment renders correctly", () => {
    const tree = renderer
      .create(
        <Comment
          commentorName={testCommentorName}
          commentText={testCommentText}
          commentorProfile={testCommentorProfile}
          createdAt={createdAt}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

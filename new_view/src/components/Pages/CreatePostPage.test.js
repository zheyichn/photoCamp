import { cleanup , render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import CreatePostPage from "./CreatePostPage";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("CreatePostPage", () => {

  it("Page renders correctly", () => {
    const tree = renderer.create(<CreatePostPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
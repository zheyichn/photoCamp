import { cleanup, render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import Profile from "./Profile";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Profile", () => {
  it("Page renders correctly", () => {
    const tree = renderer.create(<Profile />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  //Test2:
  test("profile name displayed", () => {
    render(<Profile />);
    const ele = screen.getByText("posts");
    expect(ele).toBeInTheDocument();
    expect(ele).toHaveTextContent("posts");
  });
});

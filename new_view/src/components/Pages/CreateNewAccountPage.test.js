/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import CreateNewAccountPage from "./CreateNewAccountPage";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Create New Account Page", () => {
  // Test1: match snapshots
  it("Page renders correctly", () => {
    const tree = renderer.create(<CreateNewAccountPage />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  // Test2: check create new account textboxes
  it("Create New Account textboxes handle input correctly", async () => {
    render(<CreateNewAccountPage />);
    const element = screen.getAllByRole("textbox");
    await userEvent.type(element[0], "this is a email");
    await userEvent.type(element[1], "this is a username");
    await userEvent.type(element[2], "this is a password");

    // assertion: verify that the text is in the textbox
    expect(element[0]).toHaveValue("this is a email");
    expect(element[1]).toHaveValue("this is a username");
    expect(element[2]).toHaveValue("this is a password");
  });

  // Test3: Check if alert is fired when button is clicked
  // it("Check if alert is thrown when button is clicked", async() => {
  //   render(<CreateNewAccountPage />);
  //   await userEvent.click(screen.getByRole('button'));
  // })
});

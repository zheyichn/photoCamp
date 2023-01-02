import { cleanup , render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import PopUpTextField from "./PopUpTextField";
import userEvent from "@testing-library/user-event";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("PopUpTextField", () => {

  test("check textfield can be changed", () => {
    render(<PopUpTextField />);
    const element = screen.getByRole("textbox");
    userEvent.type(element, "hello");
    expect(element).toHaveValue("hello");
  })

  it("Page renders correctly", () => {
    const tree = renderer.create(<PopUpTextField />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CustomInput from "./CustomInput";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

describe("CustomInput component renders correctly", () => {
  test("buttons displayed correctly", () => {
    render(<CustomInput />);
    const confirmButton = screen.getByTestId("confirm-btn");
    const cancelButton = screen.getByTestId("cancel-btn");
    expect(confirmButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });

  it("customInput match snapshots", () => {
    const tree = renderer.create(<CustomInput />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

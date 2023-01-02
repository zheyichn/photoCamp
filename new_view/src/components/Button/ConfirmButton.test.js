import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ConfirmButton from "./ConfirmButton";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

describe("ConfirmButton component renders correctly", () => {
  test("confirm button displayed correctly", () => {
    render(<ConfirmButton />);
    const confirmButton = screen.getByTestId("confirm-btn");
    expect(confirmButton).toBeInTheDocument();
  });

  test("confirm button works appropriately", () => {
    const mockCancelFunction = jest.fn();
    render(<ConfirmButton onClick={mockCancelFunction} />);
    const confirmButton = screen.getByTestId("confirm-btn");
    userEvent.click(confirmButton);
    expect(mockCancelFunction).toHaveBeenCalled();
  });

  it("cancel button match snapshots", () => {
    const tree = renderer.create(<ConfirmButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

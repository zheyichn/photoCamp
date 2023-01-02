import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CancelButton from "./CancelButton";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

describe("CancelButton component renders correctly", () => {
  test("cancel button displayed correctly", () => {
    render(<CancelButton />);
    const cancelButton = screen.getByTestId("cancel-btn");
    expect(cancelButton).toBeInTheDocument();
  });

  test("cancel button works appropriately", () => {
    const mockCancelFunction = jest.fn();
    render(<CancelButton onClick={mockCancelFunction} />);
    const cancelButton = screen.getByTestId("cancel-btn");
    userEvent.click(cancelButton);
    expect(mockCancelFunction).toHaveBeenCalled();
  });

  it("cancel button match snapshots", () => {
    const tree = renderer.create(<CancelButton />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EditableComment from "./EditableComment";
import renderer from "react-test-renderer";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

afterEach(() => {
  cleanup();
});

describe("EditableComment component renders correctly", () => {
  test("buttons displayed correctly", () => {
    render(<EditableComment />);
    const editButton = screen.getByTestId("edit-btn");
    const deleteButton = screen.getByTestId("delete-btn");
    expect(editButton).toBeInTheDocument();
    expect(deleteButton).toBeInTheDocument();
  });

  test("commentorName displays appropriately", () => {
    const fakeCommentorName = "Daniel";
    render(<EditableComment commentorName={fakeCommentorName} />);
    const userName = screen.getByTestId("test-name");
    expect(userName).toHaveTextContent("Daniel");
  });

  test("cinput section not shown by default", () => {
    const { queryByTestId } = render(<EditableComment />);
    expect(queryByTestId("input-test")).toBeNull();
  });

  it("editableComment match snapshots", () => {
    const tree = renderer.create(<EditableComment />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

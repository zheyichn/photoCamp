import React from "react";
import { render, screen } from "@testing-library/react";
import Header from "./Header";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";

describe("Header Component", () => {
  // Test1 header title display
  test("Header renders correctly", async () => {
    render(<Header />)
    const element = screen.getByText(/PhotoCamp/i);
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent("PhotoCamp");
  });

// Test2: match snapshots
    it("CommentForm renders correctly", () => {
    const tree = renderer
    .create(<Header/>)
    .toJSON();
    expect(tree).toMatchSnapshot();
}); 
});
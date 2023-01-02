import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import LandingVideo from "./LandingVideo";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("Landing Video", () => {
  
    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <LandingVideo />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});
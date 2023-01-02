import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import LandingPage from "./LandingPage";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("Landing Page", () => {
  
    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <LandingPage />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});
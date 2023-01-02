import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import ForgotPasswordPage from "./ForgotPasswordPage";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("Forgot Password Page", () => {
  
    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <ForgotPasswordPage />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
});
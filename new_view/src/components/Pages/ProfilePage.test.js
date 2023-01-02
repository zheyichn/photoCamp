import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import ProfilePage from "./ProfilePage";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("ProfilePage", () => {

    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <ProfilePage />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

});
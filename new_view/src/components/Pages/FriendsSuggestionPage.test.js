import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import FriendsSuggestionPage from "./FriendsSuggestionPage";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("FriendsSuggestionPage", () => {

    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <FriendsSuggestionPage />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

});
import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import LandingFunctions from "./LandingFunctions";

// afterEach function runs after each test suite is executed
afterEach(() => {
    cleanup();
});

describe("Landing Functions", () => {
  
    // Test1: match snapshots
    it("Page renders correctly", () => {
      const tree = renderer
        .create(
          <LandingFunctions />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    // Test2: check log in text fields
    it("Log in textboxes handle input correctly", async() => {
      render(<LandingFunctions />);
      const element = screen.getAllByRole("textbox");
      await userEvent.type(element[0], "this is a username");
      await userEvent.type(element[1], "this is a password");

      // assertion: verify that the text is in the textbox
      expect(element[0]).toHaveValue("this is a username");
      expect(element[1]).toHaveValue("this is a password");
    })

});
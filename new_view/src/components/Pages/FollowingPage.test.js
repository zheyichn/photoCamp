import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import FollowingPage from "./FollowingPage";
import renderer from "react-test-renderer";

afterEach(() => {
  cleanup();
});

describe("test following page", () => {
  it("Create following page body renders correctly", async () => {
    const tree = renderer.create(<FollowingPage />).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});

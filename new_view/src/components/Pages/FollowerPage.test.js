import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import FollowerPage from "./FollowerPage";
import renderer from "react-test-renderer";

afterEach(() => {
  cleanup();
});

describe("test follower page", () => {
  it("Create follower page body renders correctly", async () => {
    const tree = renderer.create(<FollowerPage />).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});

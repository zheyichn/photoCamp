import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import CreatePostWindow from "./CreatePostWindow";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Write Post Window Component", () => {
  const fakeHandleVideoFileChange = jest.fn();
  const fakeHandlePictureFileChange = jest.fn();
  // test1: button and caption check
  test("share button trigger API post call", () => {
    render(
      <CreatePostWindow
        handleVideoFileChange={fakeHandleVideoFileChange}
        handlePictureFileChange={fakeHandlePictureFileChange}
      />
    );
    const windowHeader = screen.getByTestId("create-header");
    expect(windowHeader).toBeInTheDocument();
  });

  //   test2: match snapshots
  it("createPostWindow renders correctly", () => {
    const tree = renderer
      .create(
        <CreatePostWindow
          handleVideoFileChange={fakeHandleVideoFileChange}
          handlePictureFileChange={fakeHandlePictureFileChange}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import WriteNewPostWindow from "./WriteNewPostWindow";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Write Post Window Component", () => {
  const fakePostFunction = jest.fn();
  const fakeCaptionChangeFunction = jest.fn();
  const initialCpation = "initial caption";
  const fakeSource =
    "https://images.unsplash.com/photo-1665766915691-1d032989ac8e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1015&q=80";
  // test1: button and caption check
  // test("share button trigger API post call", () => {
  //   render(
  //     <WriteNewPostWindow
  //       handleSubmit={fakePostFunction}
  //       handleCaptionChange={fakeCaptionChangeFunction}
  //       isVideo={false}
  //       srouce={fakeSource}
  //       caption="initial caption"
  //     />
  //   );
  //   const button = screen.getByTestId("share-btn");
  //   fireEvent.click(button);
  //   expect(fakePostFunction).toHaveBeenCalled();
  //   // passed in caption being correctly displayed
  //   expect(screen.getByDisplayValue("initial caption")).toBeInTheDocument();
  // });

  // test2: match snapshots
  // TODO ASK IN OH
  it("writeNewPostWindow renders correctly", () => {
    const tree = renderer
      .create(
        <WriteNewPostWindow
          handleSubmit={fakePostFunction}
          handleCaptionChange={fakeCaptionChangeFunction}
          isVideo={false}
          srouce={fakeSource}
          caption={initialCpation}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

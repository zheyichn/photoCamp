/**
 * @jest-environment jsdom
 */
import "@testing-library/jest-dom/extend-expect";
import { render, cleanup, screen } from "@testing-library/react";
// import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import VideoInput from "./VideoInput";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("VideoInput Component", () => {
  const testVideoSource =
    "https://pixabay.com/videos/grass-dew-field-fog-morning-66810/";

  //Test1
  test("show video link when video selected", () => {
    render(<VideoInput source={testVideoSource} />);
    const footerDiv = screen.getByTestId("video-footer");
    expect(footerDiv).toBeInTheDocument();
    expect(footerDiv).toHaveTextContent(testVideoSource);
  });

  // Test2: match snapshots
  it("VideoInput renders correctly", () => {
    const tree = renderer
      .create(<VideoInput source={testVideoSource} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});

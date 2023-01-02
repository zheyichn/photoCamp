import { cleanup , render, screen} from "@testing-library/react";
import "@testing-library/jest-dom";
import renderer from "react-test-renderer";
import Gallery from "./Gallery";

// afterEach function runs after each test suite is executed
afterEach(() => {
  cleanup();
});

describe("Gallery", () => {
  // Test1: match snapshots
  it("Page renders correctly", () => {
    const tree = renderer.create(<Gallery />).toJSON();
    expect(tree).toMatchSnapshot();
  });
  //Test2: 
  test("image list is displayed", () => {
    render(<Gallery  />);
    const element = screen.getByTestId("img-list");
    expect(element).toBeInTheDocument();

  })
});

import { render, screen, cleanup, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Homepage from "./HomePage";
import renderer from "react-test-renderer";
import userEvent from "@testing-library/user-event";
import Home from "@mui/icons-material/Home";

describe("Homepage Component should render correctly", () => {
  test("main view inside homepage", () => {
    render(<Homepage></Homepage>);
    const mainDiv = screen.getByTestId("main-view");
    expect(mainDiv).toBeInTheDocument();
  });

  it("Homepage matches snapshot", () => {
    const tree = renderer.create(<Homepage />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});

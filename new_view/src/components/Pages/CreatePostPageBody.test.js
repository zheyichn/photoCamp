import {render, screen, cleanup} from "@testing-library/react";
import "@testing-library/jest-dom";
import CreatePostPageBody from "./CreatePostPageBody";
import renderer from "react-test-renderer";

afterEach(() => {
    cleanup();
});

describe("CreatePostPageBody Component", () => { // Test1: match snapshots
    it("Create post page body renders correctly", async () => {
        const tree = renderer.create (<CreatePostPageBody source={false}/>).toJSON();
        await expect(tree).toMatchSnapshot();
    });
});

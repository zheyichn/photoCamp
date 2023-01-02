import { render, screen, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom";
import FriendList from "./FriendList";
import renderer from "react-test-renderer";

afterEach(() => {
  cleanup();
});

const friends = [
  {
    userID: 11,
    userName: "Julian Bartell DVM",
    profilePhoto: "http://loremflickr.com/640/480/business",
    isFollow: true,
    id: "1",
  },
  {
    userID: 56,
    userName: "Felix Christiansen",
    profilePhoto: "http://loremflickr.com/640/480/business",
    isFollow: true,
    id: "2",
  },
  {
    userID: 94,
    userName: "Edna Yost",
    profilePhoto: "http://loremflickr.com/640/480/transport",
    isFollow: false,
    id: "3",
  },
  {
    userID: 52,
    userName: "Faith Willms",
    profilePhoto: "http://loremflickr.com/640/480/technics",
    isFollow: false,
    id: "4",
  },
  {
    userID: 16,
    userName: "Rodolfo Lubowitz",
    profilePhoto: "http://loremflickr.com/640/480/business",
    isFollow: false,
    id: "5",
  },
  {
    userID: 39,
    userName: "Ida Lind Jr.",
    profilePhoto: "http://loremflickr.com/640/480/technics",
    isFollow: true,
    id: "6",
  },
];

describe("test friendlist page", () => {
  it("Create friendlist page body renders correctly", async () => {
    const tree = renderer.create(<FriendList friends={friends} />).toJSON();
    await expect(tree).toMatchSnapshot();
  });
});

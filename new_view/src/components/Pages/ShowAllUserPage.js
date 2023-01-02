import React, { useState, useEffect } from "react";
import FriendList from "../Follow/FriendList";
import Header from "../Activity/Header";
import { getAllUsersAPI } from "../../api/mock_api_following_post_follower";

export default function ShowAllUserPage() {
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    const res = await getAllUsersAPI();
    const res2 = res.map((obj) => ({ ...obj, isFollow: false }));
    setAllUsers(res2);
  };

  return (
    <div>
      <Header />
      <h1
        style={{
          display: "flex",
          justifyContent: "center",
          fontSize: "1.5em",
        }}
      >
        New Users To Follow
      </h1>
      <FriendList friends={allUsers} />;
    </div>
  );
}

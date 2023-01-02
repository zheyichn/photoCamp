import React, { useState, useEffect } from "react";
import FriendList from "../Follow/FriendList";
import Header from "../Activity/Header";
import { getFriendSuggestionAPI } from "../../api/mock_api_following_post_follower";

export default function FriendSuggestion() {
  const [FriendSuggestion, setFriendSuggestion] = useState([]);

  useEffect(() => {
    getFriendSuggestion();
  }, []);

  const getFriendSuggestion = async () => {
    const FriendSuggestionResponse = await getFriendSuggestionAPI();
    const res2 = FriendSuggestionResponse.map((obj) => ({
      ...obj,
      isFollow: false,
    }));
    setFriendSuggestion(res2);
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
        Suggested Friends
      </h1>
      <FriendList friends={FriendSuggestion} />;
    </div>
  );
}

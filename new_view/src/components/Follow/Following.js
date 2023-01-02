import React, { useEffect, useState } from "react";
import FriendList from "./FriendList";
import {
  getFollowingAPI,
  getUserAPI,
} from "../../api/mock_api_following_post_follower";

export default function Following() {
  const [followingContent, setFollowing] = useState([]);

  useEffect(() => {
    getFollowing();
  }, []);

  // get one user
  const getOneUser = async (userName) => {
    const user = await getUserAPI(userName);
    return user.data;
  };

  const getFollowing = async () => {
    const followingResponse = await getFollowingAPI(sessionStorage.userName);
    const following = await Promise.all(
      followingResponse.data.data.map(getOneUser)
    );
    const following2 = following.map((obj) => ({ ...obj, isFollow: true }));
    setFollowing(following2);
  };

  return <FriendList friends={followingContent} />;
}

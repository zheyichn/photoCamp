import React, { useState, useEffect } from "react";
import FriendList from "./FriendList";
import {
  getFollowerAPI,
  getFollowingAPI,
  getUserAPI,
} from "../../api/mock_api_following_post_follower";

export default function Follower() {
  const [followerContent, setFollower] = useState([]);

  useEffect(() => {
    const getFollower = async () => {
      const followerResponse = await getFollowerAPI(sessionStorage.userName);
      const following = await Promise.all(
        followerResponse.data.data.map(getOneUser)
      );

      const following2 = await Promise.all(
        following.map(async (obj) => ({
          ...obj,
          isFollow: await checkIfFollow(obj.userName).then((value) => {
            return value;
          }),
        }))
      );
      setFollower(following2);
    };
    getFollower();
  }, []);

  // get one user
  const getOneUser = async (userName) => {
    const user = await getUserAPI(userName);
    return user.data;
  };

  // check if one user is followed by current user
  const checkIfFollow = async (userName) => {
    const currentFollow = await getFollowingAPI(sessionStorage.userName);
    // console.log(currentFollow.data.data.includes(userName));
    return currentFollow.data.data.includes(userName);
  };

  return <FriendList friends={followerContent} />;
}

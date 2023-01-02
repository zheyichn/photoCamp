import React, { useState, useEffect } from "react";
import "../../styles/frendlistStyle.css";
import {
  followUserAPI,
  unfollowUserAPI,
} from "../../api/mock_api_following_post_follower";

export default function FriendList(props) {
  const [friendlist, setFriends] = useState([]);

  useEffect(() => {
    setFriends(props.friends);
  });

  function toggleFollowUnfollow(id) {
    const newfriendlist = [...friendlist];
    const friend = newfriendlist.find((friend) => friend._id === id);

    // update in API;
    if (friend.isFollow === false) {
      followUserAPI(sessionStorage.userName, friend.userName);
    } else {
      unfollowUserAPI(sessionStorage.userName, friend.userName);
    }

    friend.isFollow = !friend.isFollow;
    setFriends(newfriendlist);
  }

  function handleFollow(event) {
    toggleFollowUnfollow(event.target.value);
  }

  function createFriendBlock(imageUrl, name, id, isFollow) {
    return (
      <div className="friend-list-item" key={id}>
        <img className="item-photo" src={imageUrl} />
        <div className="item-info">
          <div className="item-name">{name}</div>
        </div>
        <button
          className="follow-following-btn"
          onClick={handleFollow}
          value={id}
        >
          {isFollow ? "Following" : "Follow"}
        </button>
      </div>
    );
  }

  function getFriendsBlocks(friendlist) {
    let friendsBlocks = [];
    for (let i = 0; i < friendlist.length; i++) {
      friendsBlocks.push(
        createFriendBlock(
          friendlist[i].profile,
          friendlist[i].userName,
          friendlist[i]._id,
          friendlist[i].isFollow
        )
      );
    }
    return friendsBlocks;
  }

  return (
    <div className="friend-list">
      <div>{getFriendsBlocks(friendlist)}</div>
    </div>
  );
}

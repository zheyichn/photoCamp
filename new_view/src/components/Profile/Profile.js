import React, { useState, useEffect, useRef } from "react";
import { s3Operation } from "../../utility/s3Operation";
import {
  getUserAPI,
  updateUserProfile,
} from "../../api/mock_api_following_post_follower";

export default function Profile() {
  const [followersNum, setfollowersNum] = useState(0);
  const [followingNum, setfollowingNum] = useState(0);
  const [postsNum, setpostsNum] = useState(0);
  const [userInfo, setuserInfo] = useState({});

  const [avatar, setAvatar] = useState([
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  ]);

  const handleFollowerClick = () => (window.location.pathname = "/follower");
  const handleFollowingClick = () => (window.location.pathname = "/following");

  const hiddenFileInput = useRef(null);
  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  async function handleChange(event) {
    const imgUrl = await s3Operation(event.target.files[0]);
    setAvatar(imgUrl);
    await updateUserProfile(sessionStorage.userName, imgUrl);
    sessionStorage.setItem("userProfile", imgUrl);
  }

  const getFollowing = async () => {
    const userResponse = await getUserAPI(sessionStorage.userName);
    const newFollowingNum = userResponse.data.followings.length;
    setfollowingNum(newFollowingNum);
  };

  const getFollower = async () => {
    const userResponse = await getUserAPI(sessionStorage.userName);
    const newFollowersNum = userResponse.data.followers.length;
    setfollowersNum(newFollowersNum);
  };

  const getPosts = async () => {
    const userResponse = await getUserAPI(sessionStorage.userName);
    const newPostsNum = userResponse.data.posts.length;
    setpostsNum(newPostsNum);
  };

  const getUserInfo = async () => {
    const userResponse = await getUserAPI(sessionStorage.userName);
    setuserInfo(userResponse.data);
    setAvatar(userResponse.data.profile);
  };

  useEffect(() => {
    getUserInfo();
    getFollowing();
    getFollower();
    getPosts();
  }, []);

  return (
    <div className="profile-header">
      <div className="container">
        <div className="profile">
          <div className="profile-photo">
            <img src={avatar} alt="" />
          </div>

          <div className="profile-user-settings">
            <h1 className="profile-user-name">{userInfo.userName}</h1>

            <button className="edit-profile-btn" onClick={handleClick}>
              Change Photo
            </button>

            <input
              type="file"
              id="input-btn"
              ref={hiddenFileInput}
              onChange={handleChange}
              hidden
            />
          </div>

          <div className="profile-stats">
            <ul>
              <li>
                <span className="profile-info-follow">{postsNum}</span> posts
              </li>
              <li>
                <button
                  className="btn profile-info-follow"
                  onClick={handleFollowerClick}
                >
                  {followersNum + " followers"}
                </button>{" "}
              </li>
              <li>
                <button
                  className="btn profile-info-follow"
                  onClick={handleFollowingClick}
                >
                  {followingNum + " following"}
                </button>
              </li>
            </ul>
          </div>

          <div className="profile-bio">
            <div>
              <p className="bio">{userInfo.bio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

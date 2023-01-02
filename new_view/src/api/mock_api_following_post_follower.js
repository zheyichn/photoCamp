import axios from "axios";
import { setHeaders, reAuthenticate } from "./session_management.js";

const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "";

// UPDATED
// reAuth added
const getFollowingAPI = async (userName) => {
  const url = `${domain}/api/following/${userName}`;
  try {
    setHeaders();
    const response = await axios.get(url);
    return response;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth added
const getFollowerAPI = async (userName) => {
  const url = `${domain}/api/follower/${userName}`;
  try {
    setHeaders();
    const response = await axios.get(url);
    return response;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth needed
const getTagsAPI = async (userName) => {
  const url = `${domain}/api/postByMatchingTags/${userName}`;
  try {
    setHeaders();
    const response = await axios.get(url);
    const result = response.data;
    // filter the posts that have tagged userName = current userName
    return result;
  } catch (error) {
    reAuthenticate(error.response.status);
    return {};
  }
};

// get all users that the current user is not following
const getAllUsersAPI = async () => {
  const currName = sessionStorage.userName;
  const url1 = `${domain}/api/friendsuggestion/`;
  const url2 = `${domain}/api/user/name/${currName}`;
  try {
    setHeaders();
    const response = await axios.get(url1);
    const response2 = await axios.get(url2);
    const allUsers = response.data.data.filter(
      (el) => el.userName !== sessionStorage.userName
    );
    const currUserFollowing = response2.data.data.followings;

    const allUsers2 = allUsers.filter(
      (el) => !currUserFollowing.includes(el.userName)
    );

    return allUsers2;
  } catch (error) {
    reAuthenticate(error.response.status);
    return error;
  }
};

// UPDATED
// reAuth added
const getFriendSuggestionAPI = async () => {
  const currName = sessionStorage.userName;
  const url1 = `${domain}/api/friendsuggestion/`;
  const url2 = `${domain}/api/user/name/${currName}`;
  try {
    setHeaders();
    const response = await axios.get(url1);
    const response2 = await axios.get(url2);
    const allUsers = response.data.data.filter(
      (el) => el.userName !== sessionStorage.userName
    );

    const checkIntersection = (arr1, arr2) => {
      if (
        arr1 === undefined ||
        arr1.length === 0 ||
        arr2 === undefined ||
        arr2.length === 0
      ) {
        return false;
      }
      var common = arr1.filter((element) => arr2.includes(element));
      if (common && common.length >= 3) {
        return true;
      }
      return false;
    };

    const currUserFollowing = response2.data.data.followings;
    const commonFriends = allUsers.filter((el) => {
      return checkIntersection(el.followings, currUserFollowing);
    });

    const commonFriendsNotCurrentlyFollowing = commonFriends.filter(
      (el) => !currUserFollowing.includes(el.userName)
    );
    return commonFriendsNotCurrentlyFollowing;
  } catch (error) {
    reAuthenticate(error.response.status);
    return error;
  }
};

// UPDATED
// reAuth added
const getUserAPI = async (userName) => {
  const url = `${domain}/api/user/name/${userName}`;
  try {
    setHeaders();
    const response = await axios.get(url);
    const result = response.data;
    return result;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth added
const getPostByIdAPI = async (postId) => {
  const url = `${domain}/api/post/${postId}`;
  try {
    setHeaders();
    const response = await axios.get(url);
    const result = response.data;
    return result;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth added
const followUserAPI = async (userName, followingName) => {
  const url = `${domain}/api/follow/${userName}/${followingName}`;
  try {
    setHeaders();
    const response = await axios.put(url);
    const result = response.data;
    return result;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth added
const unfollowUserAPI = async (userName, followingName) => {
  const url = `${domain}/api/unfollow/${userName}/${followingName}`;
  try {
    setHeaders();
    const response = await axios.put(url);
    const result = response.data;
    return result;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

// UPDATED
// reAuth added
const updateUserProfile = async (userName, newProfileURL) => {
  const url = `${domain}/api/profile/${userName}`;
  try {
    setHeaders();
    const response = await axios.put(url, { newProfileURL: newProfileURL });
    return response;
  } catch (error) {
    reAuthenticate(error.response.status);
    return null;
  }
};

export {
  getFollowingAPI,
  getFollowerAPI,
  followUserAPI,
  unfollowUserAPI,
  getFriendSuggestionAPI,
  getTagsAPI,
  getUserAPI,
  getPostByIdAPI,
  updateUserProfile,
  getAllUsersAPI,
};

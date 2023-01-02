import axios from "axios";
import { setHeaders, reAuthenticate } from "./session_management.js";
// import env from "react-dotenv";

const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "";

//**********************Create new Post *********************************//
export const createNewPost = async (postObject) => {
  const url = `${domain}/api/post`;
  try {
    setHeaders();
    await axios.post(url, postObject);
  } catch (err) {
    reAuthenticate(err.response.status);
    throw new Error(`${err.message}`);
  }
};
//**********************Get valid activity feeds for a specific user */
export const getActivityFeedsByUserNameWithPagination = async (
  userName,
  endTime,
  limit
) => {
  const url = `${domain}/api/activityFeed/${userName}`;
  try {
    setHeaders();
    const res = await axios.get(url, {
      params: { endTime: endTime, limit: limit },
    });
    return res.data.posts; // array of activityFeedObjects
  } catch (err) {
    reAuthenticate(err.response.status);
    throw new Error(`${err.message}`);
  }
};
// **********************check if there's new post that needs to be displayed for the user */
export const hasNewPosts = async (userName, topPostTime) => {
  const url = `${domain}/api/activityFeed/update/${userName}`;
  try {
    const res = await axios.get(url, {
      params: { topPostTime: topPostTime },
    });
    return res.data.result; // a boolean value suggesting if window reload is needed to display the new posts
  } catch (err) {
    reAuthenticate(err.response.status);
    throw new Error(`${err.message}`);
  }
};

//*********************  Commenting A Post **************************************/
// make a put request to a comment object
export async function updateComment(commentId, newComment) {
  const url = `${domain}/api/post/comments/${commentId}`;
  try {
    setHeaders();
    const response = await axios.put(url, newComment);
    return response.status;
  } catch (e) {
    reAuthenticate(e.response.status);
    throw e;
  }
}

// make a delete request to delete a comment object
export async function deleteComment(postId, commentId) {
  try {
    setHeaders();
    const deletionUrl = `${domain}/api/post/${postId}/comments/${commentId}`;
    const res = await axios.delete(deletionUrl);
    return res.status;
  } catch (err) {
    reAuthenticate(err.response.status);
    throw err;
  }
}

// make a get request to get all comments of a post, given postId
export async function getCommentsByPostId(postId) {
  try {
    setHeaders();
    const url = `${domain}/api/post/${postId}/comments`;
    const res = await axios.get(url);
    return res.data.comments;
  } catch (e) {
    reAuthenticate(e.response.status);
    throw e;
  }
}

export async function getCommentorById(userId) {
  try {
    setHeaders();
    const url = `${domain}/api/user/${userId}`;
    const res = await axios.get(url);
    return res.data.commentor;
  } catch (e) {
    reAuthenticate(e.response.status);
    throw e;
  }
}

// make a post request to add a comment to a post
export async function addNewComment(postId, newComment) {
  const url = `${domain}/api/post/${postId}/comments`;
  try {
    setHeaders();
    const res = await axios.post(url, newComment);
    return res.data.commentId;
  } catch (e) {
    reAuthenticate(e.response.status);
    throw e;
  }
}

//*********************  Like/Unlike A Post **************************************//
// make a put request to a post to update its likedByUsers' status
export async function addLike(postId, likerId) {
  const url = `${domain}/api/post/${postId}/like/${likerId}`;
  try {
    setHeaders();
    const res = await axios.put(url);
    const data = res.data;
    return data;
  } catch (e) {
    reAuthenticate(e.response.status);
    return e;
  }
}

export async function unLike(postId, likerId) {
  const url = `${domain}/api/post/${postId}/unlike/${likerId}`;
  try {
    setHeaders();
    const res = await axios.put(url);
    const data = res.data;
    return data;
  } catch (e) {
    reAuthenticate(e.response.status);
    return e;
  }
}

export async function hidePost(postId, userName) {
  const url = `${domain}/api/post/${postId}/hide/${userName}`;
  try {
    const res = await axios.put(url);
    const data = res.data;
    return data;
  } catch (e) {
    return e;
  }
}

export async function unhidePost(postId, userName) {
  const url = `${domain}/api/post/${postId}/unhide/${userName}`;
  try {
    const res = await axios.put(url);
    const data = res.data;
    return data;
  } catch (e) {
    return e;
  }
}

import axios from "axios";
import { setHeaders, reAuthenticate } from "./session_management.js";
// import env from "react-dotenv";
// const host = config.server_host;
const domain =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "http://localhost:8080"
    : "";

// Sends a POST request to the actual user endpoint
const createUser = async (userObject) => {
  const url = `${domain}/api/User`;
  try {
    const response = await axios.post(url, userObject);
    const data = response.data;
    return data;
  } catch (e) {
    const msg = e.response.data.message;
    if (msg === "duplicated user") {
      throw new Error(msg);
    } else {
      throw new Error(msg);
    }
  }
};

// Sends a POST request to the login endpoint
const login = async (userName, password) => {
  try {
    const url = `${domain}/api/login`;
    const response = await axios.post(
      url,
      `userName=${userName}&password=${password}`
    );
    sessionStorage.setItem("app-token", response.data.token);
    sessionStorage.setItem("userId", response.data.userId);
    sessionStorage.setItem("userName", userName);
    sessionStorage.setItem("userProfile", response.data.profile);
    return response;
  } catch (err) {
    return err.response;
  }
};

// sends a PUT request to update a particular post
const putPostEdit = async (editedPost) => {
  const postId = editedPost._id;
  const url = `${domain}/api/post/${postId}`;
  try {
    setHeaders();
    const response = await axios.put(url, editedPost);
    const data = response.data;
    return data;
  } catch (e) {
    reAuthenticate(e.response.status);
    console.log(e);
  }
};

// sends a DELETE request to delete a particular post
const deletePost = async (postId) => {
  const url = `${domain}/api/post/${postId}`;
  try {
    setHeaders();
    const response = await axios.delete(url, postId);
    const data = response.data;
    return data;
  } catch (e) {
    reAuthenticate(e.response.status);
    console.log(e);
  }
};

export { createUser, putPostEdit, deletePost, login };

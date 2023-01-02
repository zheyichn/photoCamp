import React, { useState } from "react";
import CreatePostPageBody from "./CreatePostPageBody";
import Header from "../Activity/Header";
import { createNewPost } from "../../api/mock_api_k";
import { s3Operation } from "../../utility/s3Operation";

export default function CreatePostPage() {
  const [source, setSource] = useState();
  const [selectedFile, setSelectedFile] = useState();
  const [caption, setCaption] = useState();
  const [taggedUser, setTaggedUser] = useState([]);
  const [error, setError] = useState(false);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVideoFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSource({ url: url, isVideo: true });
  };

  const handlePictureFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setSource({ url: url, isVideo: false });
  };

  const handleCaptionChange = (e) => {
    const newVal = e.target.value;
    setCaption(newVal);
  };

  const handleTagChange = (e) => {
    const tagList = e.target.value.trim(); // eliminate leading space
    var arr = tagList.split(/\s+/);
    setTaggedUser(arr);
    console.log('handleTagChange working properly:');
    console.log(arr);
  };

  const handleSubmit = async () => {
    const currentTime = new Date();
    const dateInSeconds = Date.parse(currentTime);
    // send the file to s3 and retrive a url to store in DB
    const mediaUrl = await s3Operation(selectedFile);
    // const mediaUrl = "https://cis557jjk.s3.amazonaws.com/d12a910489b53c980b057d7c1e184ffc"
    const testPost = {
      creatorName: sessionStorage.getItem("userName"),
      postContent: mediaUrl,
      caption: caption,
      hiddenFrom: [], // initially this post is not hidden by any follower of the creator
      postTime: dateInSeconds,
      likedByUsers: [], // a new post initially has zero likes, so send an empty array
      taggedUsers: taggedUser ? taggedUser : [],
      comments: [],
    };

    try {
      // we call endpoint here directly because we are using state mutator
      // in the try/catch block, therefore cannot move the endpoint call to the api folder
      // since passing mutator to function as argument is bad practice and doesn't work in this case
      setLoading(true);
      await createNewPost(testPost);
      setLoading(false);
      setSuccess(true);
      setTimeout(() => (window.location.pathname = "/homepage"), 4000);
    } catch (error) {
      console.log(error);
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      <Header />
      <CreatePostPageBody
        source={source}
        error={error}
        success={success}
        caption={caption}
        handleSubmit={handleSubmit}
        handleCaptionChange={handleCaptionChange}
        handleTagChange={handleTagChange}
        loading={loading}
        handleVideoFileChange={handleVideoFileChange}
        handlePictureFileChange={handlePictureFileChange}
      />
    </div>
  );
}

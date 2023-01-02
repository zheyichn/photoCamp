import { useState, useEffect, useCallback } from "react";
import ImageList from "@mui/material/ImageList";
import { CardMedia } from "@mui/material";
import ImageListItem from "@mui/material/ImageListItem";
import {
  getTagsAPI,
  getUserAPI,
  getPostByIdAPI,
} from "../../api/mock_api_following_post_follower";
import EditPostPopUp from "./EditPostPopUp";
import { Box, Tab, Tabs } from "@mui/material";
import { isImgUrl } from "../../utility/isImageUrl";

export default function Gallery() {
  const [posts, setPosts] = useState([]);
  const [tagPosts, setTagPosts] = useState([]);
  const [, setWhichPost] = useState([]);
  // states to determine whether edit post pop-up is open and what is the current post being edited
  const [editOpen, setEditOpen] = useState(false);
  const [currPost, setCurrPost] = useState("");
  const [tabIndex, setTabIndex] = useState(0);

  const judgeIfImage = async (url) => {
    const res = await isImgUrl(url);
    return res;
  };

  const handleTabChange = (event, newTabIndex) => {
    setTabIndex(newTabIndex);
    if (tabIndex === 0) {
      setWhichPost(tagPosts);
    } else {
      setWhichPost(posts);
    }
  };

  // handle the opening of edit post pop up
  const handleClickOpen = (post) => {
    setEditOpen(true);
    setCurrPost(post);
  };

  // handle the closing of edit post pop up
  const handleClickClose = () => {
    setEditOpen(false);
    setCurrPost("");
  };

  // get one post
  const getOnePost = useCallback(async (postId) => {
    let post = await getPostByIdAPI(postId);
    post = post.data[0];
    const isImage = await judgeIfImage(post.postContent);
    post["isImage"] = isImage;
    return post;
  }, []);

  // get all the posts associated with this user from api
  const getPostContent = useCallback(async () => {
    const userResponse = await getUserAPI(sessionStorage.userName);
    const postIds = userResponse.data.posts;
    const postsContent = await Promise.all(postIds.map(getOnePost));
    setPosts(postsContent);
  }, [getOnePost]);


  const judgeImageHelper = useCallback(async(post) => {
    const isImage = await judgeIfImage(post.postContent);
    post["isImage"] = isImage;
    return post;
  }, []);
  
  // get tab content associated with the current user
  // and judge whether each post is an image
  const getTagContent = useCallback(async () => {
    const tagResponse = await getTagsAPI(sessionStorage.userName);
    const taggedPosts = tagResponse.data;
    const judgedTaggedPosts = await Promise.all(taggedPosts.map(judgeImageHelper));
    setTagPosts(judgedTaggedPosts);
  }, [judgeImageHelper]);



  // call getPostContent()
  // this should be called initially, AND whenever the pop up opens / closes
  // allow a timeout of 100ms - sometimes we perform a POST request to back end and we are fetching the data again
  useEffect(() => {
    getPostContent();
    getTagContent();
  }, [getPostContent, getTagContent]);

  useEffect(() => {
    setTimeout(() => getPostContent(), 100);
    setTimeout(() => getTagContent(), 100);
    // setTimeout(() => getTagContent(), 100);
  }, [editOpen, getPostContent, getTagContent]);

  return (
    <main>
      <Box>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Posts" />
          <Tab label="Tagged" />
        </Tabs>
      </Box>

      <div className="container">
        {tabIndex ? (
          <div className="gallery">
            <ImageList
              data-testid="img-list"
              sx={{ width: 1000, height: 1000 }}
              cols={3}
              rowHeight={333}
            >
              {tagPosts.map((item) => (
                <ImageListItem key={item._id}>
                  {/* Note: use this when implenting backend for tagging!*/}
                  {item.isImage ? (
                    <CardMedia
                      data-testid="test-img"
                      component="img"
                      height="300px"
                      src={item.postContent}
                      alt="Post Picture"
                      sx={{
                        filter: item.hiddenFrom.includes(
                          sessionStorage.getItem("userName")
                        )
                          ? "blur(3px)"
                          : null,
                      }}
                    ></CardMedia>
                  ) : (
                    <CardMedia
                      data-testid="test-img"
                      component="video"
                      height="300px"
                      src={item.postContent}
                      autoPlay
                      controls
                      muted
                      alt="Post Video"
                      sx={{
                        filter: item.hiddenFrom.includes(
                          sessionStorage.getItem("userName")
                        )
                          ? "blur(3px)"
                          : null,
                      }}
                    ></CardMedia>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          </div>
        ) : (
          <div className="gallery">
            <ImageList
              data-testid="img-list"
              sx={{ width: 1000, height: 1000 }}
              cols={3}
              rowHeight={333}
            >
              {posts.map((item) => (
                <ImageListItem key={item._id}>
                  {item.isImage ? (
                    <CardMedia
                      data-testid="test-img"
                      component="img"
                      height="300px"
                      src={item.postContent}
                      alt="Post Picture"
                      onClick={() => handleClickOpen(item)}
                      sx={{
                        filter: item.hiddenFrom.includes(
                          sessionStorage.getItem("userName")
                        )
                          ? "blur(3px)"
                          : null,
                      }}
                    ></CardMedia>
                  ) : (
                    <CardMedia
                      data-testid="test-img"
                      component="video"
                      height="300px"
                      src={item.postContent}
                      autoPlay
                      controls
                      muted
                      onClick={() => handleClickOpen(item)}
                      alt="Post Video"
                      sx={{
                        filter: item.hiddenFrom.includes(
                          sessionStorage.getItem("userName")
                        )
                          ? "blur(3px)"
                          : null,
                      }}
                    ></CardMedia>
                  )}
                </ImageListItem>
              ))}
            </ImageList>
          </div>
      )}

        <EditPostPopUp
          open={editOpen}
          onClose={handleClickClose}
          currPost={currPost}
        />
      </div>
    </main>
  );
}

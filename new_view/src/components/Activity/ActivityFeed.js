/* eslint-disable no-unused-vars */
import React, { useState, useRef, useEffect } from "react";
import {
  Alert,
  Avatar,
  Button,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  Grid,
} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";
import CommentForm from "./CommentForm";
import Comment from "./Comment";
import EditableComment from "./EditableComment";
import UserDialog from "./UserDialog";
import { isImgUrl } from "../../utility/isImageUrl";
import {
  addLike,
  addNewComment,
  getCommentorById,
  getCommentsByPostId,
  hidePost,
  unLike,
} from "../../api/mock_api_k";
import LinearProgress from "@mui/material/LinearProgress";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import {
  getUserAPI,
} from "../../api/mock_api_following_post_follower";

export default function ActivityFeed(props) {
  const post = props.post;
  const {
    _id,
    creatorName,
    postContent,
    caption,
    creatorProfile,
    // these props are left for future feature implementations
    // visibility,
    // postTime,
    taggedUsers,
    likedByUsers = [],
  } = post;

  // const user = useContext(Context);
  // const userId = sessionStorage.getItem("userId");
  const [expanded, setExpanded] = useState(false);
  const [commentsList, setCommentsList] = useState([]);
  const [error, setError] = useState("");
  const newComment = useRef("");
  const likedByCurrentUser = likedByUsers.includes(
    sessionStorage.getItem("userId")
  ); // for UI testing, since testing file cannot use useContext, by default pass a loggedin userId as 1
  const [liked, setLiked] = useState(likedByCurrentUser);
  const [isPosting, setIsPosting] = useState(false);
  const [isImage, setIsImage] = useState(true);
  const [isHidden, setIsHidden] = useState(false);
  // for user dialog
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogUser, setDialogUser] = useState("");
  const [dialogUserInfo, setDialogUserInfo] = useState({});

  // handle the opening of user dialog
  const handleDialogOpen = async(user) => {
    setDialogOpen(true);
    setDialogUser(user);
    const results = await getUserAPI(user);
    setDialogUserInfo(results.data);
  };

  // handle the closing of user dialog
  const handleDialogClose = () => {
    setDialogOpen(false);
    setDialogUser("");
  };

  const judgeIfImage = async (url) => {
    const res = await isImgUrl(url);
    setIsImage(res);
  };

  useEffect(() => {
    judgeIfImage(postContent);
  }, [postContent]);

  const fetchComments = async (postId) => {
    let comments;
    try {
      //  this is a array of comments object that are already sorted by time in descending order
      comments = await getCommentsByPostId(postId);
      // as a comment object doesn't has userProfile and userName information, we need to get userById
      for (let i = 0; i < comments.length; i++) {
        const commentorId = comments[i].commentorId;
        const commentor = await getCommentorById(commentorId);
        comments[i]["commentorName"] = commentor.commentorName;
        comments[i]["commentorProfile"] = commentor.commentorProfile;
      }
      setCommentsList(comments);
    } catch (e) {
      console.error(comments);
      console.error(e);
    }
  };

  const handleWriteCommentClick = async () => {
    await fetchComments(_id);
    setExpanded(!expanded);
  };

  const handleLikeClick = async () => {
    if (!liked) {
      // if this post is not liked by the current user, addlike
      addLike(_id, sessionStorage.getItem("userId"));
    } else {
      // if already been liked by the user, unlike the post
      unLike(_id, sessionStorage.getItem("userId"));
    }
    setLiked(!liked);
  };

  const handleHidePostClick = async () => {
    try {
      await hidePost(_id, sessionStorage.getItem("userName"));
      setIsHidden(true);
    } catch (e) {
      console.error(e);
    }
  };

  const likeIconColor = liked ? "red" : "grey";

  if (isHidden) {
    return null;
  }

  return (
    <Grid m={2}>
      <Card>
        <CardHeader
          avatar={<Avatar src={creatorProfile}></Avatar>}
          title={creatorName}
        ></CardHeader>

        {isImage ? (
          <CardMedia
            data-testid="test-img"
            component="img"
            height="300px"
            src={postContent}
            alt="Post Picture"
          ></CardMedia>
        ) : (
          <CardMedia
            data-testid="test-img"
            component="video"
            height="300px"
            src={postContent}
            autoPlay
            controls
            muted
            alt="Post Video"
          ></CardMedia>
        )}
        <CardContent data-testid="caption">{caption}</CardContent>
        <CardContent>
          <b>Tagged users:</b>
          {taggedUsers ? taggedUsers.map((user) => {
            return(
              <Button
                key={ _id + user }
                sx={{ textTransform: 'none' }}
                onClick={() => handleDialogOpen(user)}
              >
                { user + " "}
              </Button>
            )
          }) : null}
        </CardContent>
        <CardActions disableSpacing>
          <IconButton aria-label="like" onClick={handleLikeClick}>
            <FavoriteIcon style={{ color: likeIconColor }} />
          </IconButton>
          <IconButton
            className="openComment"
            aria-label="comment"
            data-testid="write-test"
            onClick={handleWriteCommentClick}
          >
            <ChatBubbleOutlineRoundedIcon />
          </IconButton>
          <IconButton
            aria-label="hide"
            data-testid="hide-test"
            onClick={handleHidePostClick}
          >
            <VisibilityOffIcon />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent data-testid="comment-section">
            {commentsList.map((data) => {
              if (data.commentorId === sessionStorage.getItem("userId")) {
                return (
                  <div key={data._id}>
                    <EditableComment
                      createdAt={data.createdAt}
                      commentorName={data.commentorName}
                      commentText={data.commentText}
                      commentorProfile={data.commentorProfile}
                      postId={post._id}
                      commentId={data._id}
                      commentorId={data.commentorId}
                      reFetchComments={fetchComments}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={data._id}>
                    <Comment
                      createdAt={data.createdAt}
                      commentorName={data.commentorName}
                      commentText={data.commentText}
                      commentorProfile={data.commentorProfile}
                    />
                  </div>
                );
              }
            })}
            <CommentForm
              data-testid="form-test"
              newComment={newComment}
              handlePostClick={async () => {
                if (newComment.current.value === "") {
                  setError("comments cannot be empty, try again!");
                } else {
                  const createdAt = Date.now();
                  // this ensures at FE, the userProfile who commments
                  // is always logged in users, not users randomly generated from
                  // mock.api. commentorProfile isn't an attribute in Comment's schema
                  // so I created myLocalComment purly for FE consistency
                  const myLocalComment = {
                    commentorName: sessionStorage.getItem("userName"),
                    commentorProfile: sessionStorage.getItem("userProfile"), // commentorProfile and name should be later on got from cookies
                    commentText: newComment.current.value,
                    commentorId: sessionStorage.getItem("userId"),
                    createdAt: createdAt,
                  };
                  const myComment = {
                    commentText: newComment.current.value,
                    commentorId: sessionStorage.getItem("userId"),
                    createdAt: createdAt,
                  };
                  try {
                    // only show the comment at the FE when the comment has been added to BE successfully
                    setIsPosting(true);
                    const newCommentId = await addNewComment(_id, myComment);
                    setIsPosting(false);
                    myLocalComment._id = newCommentId;
                    setCommentsList((prevComments) => {
                      return [...prevComments, myLocalComment];
                    });
                    setError("");
                    newComment.current.value = "";
                  } catch (e) {
                    console.log(e);
                    setIsPosting(false);
                    setError(`Please try again later. Encountered: ${e}`);
                  }
                }
              }}
            />
            {isPosting ? <LinearProgress /> : null}
            {error ? (
              <Grid mt={2}>
                <Alert severity="warning">{error}</Alert>
              </Grid>
            ) : null}
          </CardContent>
        </Collapse>
      </Card>
      <UserDialog
        dialogUser={dialogUser}
        dialogOpen={dialogOpen}
        handleDialogClose={handleDialogClose}
        dialogUserInfo={dialogUserInfo}
      />
    </Grid>
  );
}

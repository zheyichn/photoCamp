import CardMedia from '@mui/material/CardMedia';
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import PopUpTextField from "./PopUpTextField";
import { useEffect, useRef, useState } from "react";
import { putPostEdit, deletePost } from "../../api/mock_api_j";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { unhidePost } from "../../api/mock_api_k";

export default function EditPostPopUp(props) {
  const { open, onClose, currPost } = props;
  const [isHidden, setIsHidden] = useState(
    currPost.hiddenFrom
      ? currPost.hiddenFrom.includes(sessionStorage.getItem("userName"))
      : false
  );

  useEffect(() => {
    setIsHidden(
      currPost.hiddenFrom
        ? currPost.hiddenFrom.includes(sessionStorage.getItem("userName"))
        : false
    );
  }, [currPost]);

  // 1. Initialize a Ref variable that stores the key information
  const postInfo = useRef({ imageSrc: "", postCaption: "" });

  // 2. Initialize a function that logs the ref variable on save
  // to be changed to api requests later
  // 3. Pass down to pop up text field
  const onSave = () => {
    let amendedPost = currPost; // does NOT create deep copy but changed the var name for readability
    amendedPost.caption = postInfo.current.postCaption;
    // amendedPost.postContent = postInfo.current.imageSrc;
    putPostEdit(amendedPost);
    onClose();
  };

  const onDelete = () => {
    console.log(currPost._id);
    deletePost(currPost._id);
    onClose();
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const onUnHide = async () => {
    try {
      await unhidePost(currPost._id, sessionStorage.getItem("userName"));
      setIsHidden(false);
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (err) {
      console.err(err);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Grid container justifyContent="center" alignItems="center">
        <Grid item>
          <DialogTitle style={{ padding: 16, textAlign: "center" }}>
            Edit My Post
          </DialogTitle>
        </Grid>
        {isHidden ? (
          <Grid item>
            <VisibilityIcon mt={2} onClick={onUnHide}></VisibilityIcon>
          </Grid>
        ) : null}
      </Grid>
      { currPost.isImage? 
      <img
        srcSet={`${currPost.postContent}?w=500&h=500&fit=crop&auto=format&dpr=2`}
        alt={currPost.title}
        loading="lazy"
      /> 
      : 
      <CardMedia
        component="video"
        image={`${currPost.postContent}`}
        controls
        alt="video"
        autoPlay
        muted
        loop
      /> }
      <Grid container flex-direction="row" padding={1}>
        <Grid item xs={3}>
          <Typography style={{ padding: 16 }}>Post caption:</Typography>
        </Grid>
        <Grid item xs={9}>
          <PopUpTextField
            field="postCaption"
            defaultValue={currPost.caption}
            postInfo={postInfo}
          />
        </Grid>
        <Grid item xs={4}>
          <Button
            data-testid="save-btn"
            onClick={onSave}
            style={{ padding: 16 }}
          >
            Save Changes
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button onClick={onClose} style={{ padding: 16 }}>
            Cancel Changes
          </Button>
        </Grid>
        <Grid item xs={4}>
          <Button
            variant="outlined"
            color="error"
            onClick={onDelete}
            style={{ padding: 16 }}
          >
            Delete Post
          </Button>
        </Grid>
      </Grid>
    </Dialog>
  );
}

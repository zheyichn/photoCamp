import React from "react";
import { Button, TextField, Box, Grid } from "@mui/material";
import { followButtonStyle } from "../../styles/buttonStyles";

export default function CommentForm(props) {
  return (
    <Grid mt={2}>
      <form>
        <TextField
          className="commentField"
          label="Write your comment here"
          rows={1}
          variant="standard"
          defaultValue=""
          fullWidth
          inputRef={props.newComment}
        />
        <Box display="flex" justifyContent="flex-end" mt={2}>
          <Button
            className="postCommentBtn"
            variant="contained"
            onClick={props.handlePostClick}
            sx={followButtonStyle}
          >
            Post
          </Button>
        </Box>
      </form>
    </Grid>
  );
}

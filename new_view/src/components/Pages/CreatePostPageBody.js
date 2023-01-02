import React from "react";
import { Grid, Alert, LinearProgress, Typography } from "@mui/material";
import CreatePostWindow from "../Post/CreatePostWindow";
import WriteNewPostWindow from "../Post/WriteNewPostWindow";
import { lightGridStyle } from "../../styles/gridStyles";

export default function CreatePostPageBody(props) {
  const {
    source,
    error,
    loading,
    success,
    caption,
    handleCaptionChange,
    handleTagChange,
    handlePictureFileChange,
    handleSubmit,
    handleVideoFileChange,
  } = props;

  return (
    <Grid container flexDirection="column" sx={lightGridStyle} height="100vh">
      <Grid item width="40%" alignSelf="center" alignItems="center" mt={5}>
        {source ? (
          <WriteNewPostWindow
            isVideo={source.isVideo}
            source={source.url}
            handleCaptionChange={handleCaptionChange}
            handleTagChange={handleTagChange}
            caption={caption}
            handleSubmit={handleSubmit}
          />
        ) : (
          <CreatePostWindow
            data-testid="test-choose-file-window"
            handleVideoFileChange={handleVideoFileChange}
            handlePictureFileChange={handlePictureFileChange}
          />
        )}
        {loading && (
          <>
            <Typography mt={2} sx={{ textAlign: "center" }}>
              Posting...
            </Typography>
            {/* TODO: MAKE PROGRESS BAR COLOR THE SAME AS THEME BLUE */}
            <LinearProgress color="inherit" />
          </>
        )}
        {success && (
          <Alert severity="success">
            Post shared successfully! Redirecting to homepage...
          </Alert>
        )}
        {error && (
          <Alert severity="error">
            Post sharing failed. Please try again later.
          </Alert>
        )}
      </Grid>
    </Grid>
  );
}

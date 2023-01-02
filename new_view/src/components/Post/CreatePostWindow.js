import React from "react";
import { Grid, Typography, CardMedia, Alert } from "@mui/material";
import PhotoSizeSelectActualOutlinedIcon from "@mui/icons-material/PhotoSizeSelectActualOutlined";
import SwitchVideoOutlinedIcon from "@mui/icons-material/SwitchVideoOutlined";

export default function CreatePostWindow(props) {
  const { handleVideoFileChange, handlePictureFileChange } = props;

  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="center"
      backgroundColor="#FFFF"
      sx={{ border: 1, borderColor: "#D9D9D9" }}
    >
      <Grid
        item
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          backgroundColor: "#FFFF",
          minHeight: "50px",
          borderBottom: 1,
          borderColor: "#D9D9D9",
          textAlign: "center",
        }}
      >
        <Typography
          data-testid="create-header"
          mt={1}
          sx={{ fontFamily: "Lato", fontSize: 18 }}
        >
          Create a new post
        </Typography>
      </Grid>
      <Alert severity="info">
        Select a video or picture from your computer below
      </Alert>
      <Grid
        item
        container
        minHeight="300px"
        flexDirection="row"
        pt={5}
        justifyContent="center"
        alignItems="center"
      >
        <Grid xs={12} item container flexDirection="row">
          <Grid
            item
            container
            flexDirection="column"
            ml={4}
            xs={5.5}
            justifyContent="center"
          >
            <Grid item>
              <SwitchVideoOutlinedIcon sx={{ fontSize: 100 }} />
            </Grid>
            <Grid item>
              <input
                className="VideoInput_input"
                type="file"
                label="Choose a video"
                onChange={handleVideoFileChange}
                accept=".mov,.mp4"
              />
            </Grid>
          </Grid>
          <Grid item xs={4} mr={2} mt={2.5}>
            <CardMedia
              component="video"
              image="https://upload.wikimedia.org/wikipedia/commons/f/ff/360_SKIING_MAY_2019.webm"
              title="Test Video"
              autoPlay
              muted
              loop
            />
          </Grid>
        </Grid>
        <Grid xs={12} item container flexDirection="row">
          <Grid
            item
            container
            mt={2}
            mb={5}
            ml={4}
            flexDirection="column"
            xs={5.5}
            justifyContent="center"
          >
            <Grid item>
              <PhotoSizeSelectActualOutlinedIcon sx={{ fontSize: 85 }} />
            </Grid>
            <Grid item>
              <input
                className="Picture_input"
                type="file"
                onChange={handlePictureFileChange}
                accept=".jpg,.jpeg,.png"
              />
            </Grid>
          </Grid>
          <Grid item xs={4} mr={2} mt={4}>
            <CardMedia
              component="img"
              image="https://images.unsplash.com/photo-1439405326854-014607f694d7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
              title="Test Picture"
              alt="Sea View"
              height="70%"
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

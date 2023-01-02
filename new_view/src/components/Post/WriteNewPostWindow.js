import React from "react";
import { Grid, Typography, Input, Button, Box } from "@mui/material";
import VideoInput from "./VideoInput";
import { borderGridStyle } from "../../styles/gridStyles";
import { followButtonStyle } from "../../styles/buttonStyles";

export default function WriteNewPostWindow(props) {
  const { isVideo, source } = props;

  return (
    <Grid
      container
      width="100%"
      justifyContent="center"
      sx={borderGridStyle}
      flexDirection="column"
    >
      <Grid
        item
        sx={{ backgroundColor: "#FFFF" }}
        minHeight="70px"
        width="100%"
      >
        <Typography
          align="center"
          sx={{ fontFamily: "Lato", fontSize: 18 }}
          mt={2}
        >
          Create new post
        </Typography>
      </Grid>
      <Grid item container minHeight="350px">
        {isVideo ? (
          <Grid alignSelf="center" width="100%">
            <VideoInput source={source} />
          </Grid>
        ) : (
          <Grid
            width="100%"
            item
            sx={{
              backgroundImage: `url("${source}")`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
            }}
          ></Grid>
        )}
      </Grid>
      <Grid item width="100%">
        <form>
          <Input
            rows={3}
            placeholder="Input usernames to tag people in photo (separated by space)"
            onChange={props.handleTagChange}
            fullWidth
          >
            sx={{ borderTop: 1, borderBottom: 1, borderColor: "#D9D9D9" }}
          </Input>
        </form>
      </Grid>
      <Grid item width="100%">
        <form>
          <Input
            rows={3}
            placeholder="Write a caption"
            onChange={props.handleCaptionChange}
            fullWidth
            disableUnderline={true}
          >
            sx={{ borderTop: 1, borderBottom: 1, borderColor: "#D9D9D9" }}
          </Input>
        </form>
      </Grid>
      <Box display="flex" justifyContent="flex-end" m={2}>
        <Button
          data-testid="share-btn"
          onClick={props.handleSubmit}
          variant="contained"
          sx={followButtonStyle}
        >
          <Typography sx={{ fontFamily: "Lato" }}>Share</Typography>
        </Button>
      </Box>
    </Grid>
  );
}

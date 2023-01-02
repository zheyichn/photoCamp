import React from "react";
import { Avatar, Grid, Typography } from "@mui/material";

export default function Comment(props) {
  const { commentText, commentorName, commentorProfile, createdAt } = props;
  const formattedTime = new Date(createdAt).toLocaleDateString("en-US");
  return (
    <Grid
      container
      flexDirection="row"
      justifyContent="flex-start"
      alignItems="center"
      mb={2}
    >
      <Grid container item justifyContent="flex-start">
        <Grid item>
          <Avatar src={commentorProfile} alt={commentorName} />
        </Grid>
        <Grid item pl={1} pt={1}>
          <Typography data-testid="test-name" variant="subtitle1">
            {commentorName ? commentorName : "userName"}
          </Typography>
        </Grid>
        <Grid item pl={1} pt={1.5}>
          <Typography sx={{ fontSize: "14px" }}>{formattedTime}</Typography>
        </Grid>
      </Grid>

      <Grid item ml={1} mt={1}>
        <Typography>{commentText}</Typography>
      </Grid>
    </Grid>
  );
}

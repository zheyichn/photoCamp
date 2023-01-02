import React from "react";
import Box from '@mui/material/Box';
import CardMedia from '@mui/material/CardMedia';
import { Typography } from "@mui/material";
import { backgroundBoxStyles, videoHeaderStyles } from "../../styles/landingStyle";

export default function LandingVideo() {
  return (
    <Box sx={ backgroundBoxStyles } >
        <Box component="span" sx={ videoHeaderStyles } >
            <Typography>
                PhotoCamp Best Video 2022
            </Typography>
        </Box>
        <CardMedia
            component="video"
            height="250"
            width="500"
            image="https://upload.wikimedia.org/wikipedia/commons/f/ff/360_SKIING_MAY_2019.webm"
            title="Test Video"
            autoPlay
            muted
            loop
        />
    </Box>
  );
}
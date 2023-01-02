import React, { useState, useRef, useCallback, useEffect } from "react";
import ActivityFeed from "../Activity/ActivityFeed";
import { Grid } from "@mui/material";
import useUserScroll from "../../utility/useUserScroll";
import CircularProgress from "@mui/material/CircularProgress";
import { lightGridStyle } from "../../styles/gridStyles";
import Header from "../Activity/Header";
import { hasNewPosts } from "../../api/mock_api_k";

export default function Homepage() {
  const [timeStamp, setTimeStamp] = useState(Date.parse(new Date()));
  const observer = useRef();
  const { posts, hasMore, loading } = useUserScroll(timeStamp);
  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setTimeStamp(posts[posts.length - 1].postTime);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, posts]
  );

  useEffect(() => {
    async function checkIfNewPosts(topPostTime) {
      const judgement = await hasNewPosts(
        sessionStorage.getItem("userName"),
        topPostTime
      );
      if (judgement === true) {
        window.location.reload();
      }
    }
    const intervalId = setInterval(() => {
      if (posts.length !== 0) {
        checkIfNewPosts(posts[0].postTime);
      }
    }, 5000);
    return () => {
      clearInterval(intervalId);
    };
  });

  return (
    <div>
      <Header />
      <Grid container flexDirection="column" sx={lightGridStyle}>
        <Grid item width="45%" mt={3} alignSelf="center">
          <main data-testid="main-view">
            {posts.map((post, index) => {
              // for the last post in one fetch, use ref
              if (posts.length === index + 1) {
                return (
                  <div ref={lastPostElementRef} key={post._id}>
                    <ActivityFeed post={post} />
                  </div>
                );
              } else {
                return (
                  <div key={post._id}>
                    <ActivityFeed post={post} key={post._id} />
                  </div>
                );
              }
            })}
            {loading ? <CircularProgress /> : null}
          </main>
        </Grid>
      </Grid>
    </div>
  );
}

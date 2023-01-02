import { useEffect, useState } from "react";
import { getActivityFeedsByUserNameWithPagination } from "../api/mock_api_k";

export default function useUserScroll(timeStamp) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [posts, setPosts] = useState([]);
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    getActivityFeedsByUserNameWithPagination(
      sessionStorage.getItem("userName"),
      timeStamp,
      10
    )
      .then((res) => {
        setPosts((prevPosts) => {
          return [...prevPosts, ...res];
        });
        setHasMore(res.length > 0);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
      });
  }, [timeStamp]);

  return { loading, error, posts, hasMore };
}
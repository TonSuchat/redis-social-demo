import React, { useState, useEffect } from "react";
import useFetch from "use-http";
import PostList from "../PostList";
import { PostItemType } from "../PostItem";

const Index = () => {
  const { get, response } = useFetch();
  const [posts, setPosts] = useState<PostItemType[]>([]);

  useEffect(() => {
    const getTimelinePosts = async () => {
      const timelinePosts = await get("/timeline");
      if (response.ok) {
        setPosts(timelinePosts);
      }
    };
    getTimelinePosts();
    // eslint-disable-next-line
  }, []);

  return (
    <PostList posts={posts} />
  );
};

export default Index;

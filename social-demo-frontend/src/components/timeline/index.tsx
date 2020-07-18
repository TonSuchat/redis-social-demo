import React, { useState, useEffect } from "react";
import PostList from "../PostList";
import { PostItemType } from "../PostItem";

const Index = () => {
  const [posts, setPosts] = useState<PostItemType[]>([]);

  useEffect(() => {
    const getTimelinePosts = async () => {
      const res = await fetch("/timeline", { method: "GET" });
      const timelinePosts = await res.json();
      setPosts(timelinePosts);
    };
    getTimelinePosts();
    // eslint-disable-next-line
  }, []);

  return (
    <PostList posts={posts} />
  );
};

export default Index;

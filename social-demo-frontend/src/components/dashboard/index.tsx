import React, { useEffect, useState } from "react";

import BodySection from "./BodySection";
import PostList from "../PostList";
import { PostItemType } from "../PostItem";

const Index: React.FC = () => {
  const [posts, setPosts] = useState<PostItemType[]>([]);
  const [followsCount, setFollowsCount] = useState<
    { followers: number; followings: number }
  >({ followers: 0, followings: 0 });

  useEffect(() => {
    const getPosts = async () => {
      const res = await fetch("/post", { method: "GET" });
      const json = await res.json();
      setPosts(json);
    };
    const getFollowsCount = async () => {
      const res = await fetch("/followCount", { method: "GET" });
      const json = await res.json();
      setFollowsCount(json);
    };
    getPosts();
    getFollowsCount();
  }, []);

  const onAddPost = async (data: Record<string, any>) => {
    const res = await fetch(
      "/post",
      {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      },
    );
    if (res.ok) {
      const newPost: PostItemType = await res.json();
      setPosts([{ ...newPost }, ...posts]);
    }
  };

  return (
    <div className="container">
      <BodySection onAddPost={onAddPost} followersCount={followsCount} />
      <PostList posts={posts} />
    </div>
  );
};

export default Index;

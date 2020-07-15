import React, { useEffect, useState } from "react";
import useFetch from "use-http";

import BodySection from "./BodySection";
import PostList from "../PostList";
import { PostItemType } from "../PostItem";

const Index: React.FC = () => {
  const [posts, setPosts] = useState<PostItemType[]>([]);
  const { get, post, response } = useFetch();

  useEffect(() => {
    // get posts
    const getPosts = async () => {
      const resPosts = await get("/post");
      if (response.ok) {
        setPosts(resPosts);
      }
    };
    getPosts();
    // eslint-disable-next-line
  }, []);

  const onAddPost = async (data: Record<string, any>) => {
    const newPost: PostItemType = await post("/post", data);
    if (response.ok) {
      setPosts([{ ...newPost }, ...posts]);
    }
  };

  return (
    <div className="container">
      <BodySection onAddPost={onAddPost} />
      <PostList posts={posts} />
    </div>
  );
};

export default Index;

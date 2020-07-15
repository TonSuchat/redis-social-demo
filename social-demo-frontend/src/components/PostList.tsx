import React from "react";
import PostItem, { PostItemType } from "./PostItem";

type PostListType = {
  posts: PostItemType[];
};

const PostList: React.FC<PostListType> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="hero">
        <div className="hero-body">
          <div className="container">
            <h1 className="title">Not found posts</h1>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {posts.map((post) => <PostItem key={post.postId} {...post} />)}
    </>
  );
};

export default PostList;

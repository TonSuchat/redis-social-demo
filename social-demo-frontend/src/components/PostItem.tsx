import React from "react";
import { Link } from "react-router-dom";

export type PostItemType = {
  userId: number;
  postId: number;
  username: string;
  content: string;
  postedDateTime: string;
};

const PostItem: React.FC<PostItemType> = (
  { userId, username, content, postedDateTime },
) => {
  return (
    <>
      <div className="tile is-parent is-vertical">
        <article className="tile is-child notification is-light">
          <p className="title">
            <Link to={`/profile/${userId}`}>{username}</Link>
          </p>
          <p className="subtitle">{content}</p>
          <span>{postedDateTime}</span>
        </article>
      </div>
    </>
  );
};

export default PostItem;

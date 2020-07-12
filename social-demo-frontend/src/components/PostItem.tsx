import React from "react";

type PostItemType = {
  username: string;
  content: string;
  postedDateTime: string;
};

const PostItem: React.FC<PostItemType> = (
  { username, content, postedDateTime },
) => {
  return (
    <>
      <div className="tile is-parent is-vertical">
        <article className="tile is-child notification is-light">
          <p className="title">{username}</p>
          <p className="subtitle">{content}</p>
          <span>{postedDateTime}</span>
        </article>
      </div>
    </>
  );
};

export default PostItem;

import React from "react";

import { PostItemType } from "../PostItem";
import PostList from "../PostList";

type ProfileType = {
  username: string;
  posts: PostItemType[];
  isShowButton: boolean;
  isFollowing?: boolean;
  onFollowClick?: () => void;
};

const Profile: React.FC<ProfileType> = (
  { username, posts, isShowButton, isFollowing, onFollowClick },
) => {
  return (
    <div className="container">
      <div className="box">
        <div className="media">
          <div className="media-content">
            <div className="content">
              <p><strong>{username}</strong></p>
              {isShowButton && <input
                type="button"
                className="button is-primary"
                onClick={onFollowClick}
                value={isFollowing
                  ? "Stop follow this user"
                  : "Follow this user"}
              />}
            </div>
          </div>
        </div>
      </div>
      <PostList posts={posts} />
    </div>
  );
};

export default Profile;

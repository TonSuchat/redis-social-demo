import React from "react";
import AddPost from "./AddPost";
import FollowerOrFollowing from "../FollowerOrFollowing";

type BodySectionType = {
  onAddPost: (data: Record<string, any>) => void;
  followersCount: { followers: number; followings: number };
};

const BodySection: React.FC<BodySectionType> = (
  { onAddPost, followersCount },
) => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-two-thirds">
          <AddPost onAddPost={onAddPost} />
        </div>
        <div className="column">
          <FollowerOrFollowing
            type="follower"
            total={followersCount.followers}
          />
          <FollowerOrFollowing
            type="following"
            total={followersCount.followings}
          />
        </div>
      </div>
    </div>
  );
};

export default BodySection;

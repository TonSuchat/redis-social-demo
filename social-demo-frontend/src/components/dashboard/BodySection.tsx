import React from "react";
import AddPost from "./AddPost";
import FollowerOrFollowing from "../FollowerOrFollowing";

type BodySectionType = {
  onAddPost: (data: Record<string, any>) => void;
};

const BodySection: React.FC<BodySectionType> = ({ onAddPost }) => {
  return (
    <div className="container">
      <div className="columns">
        <div className="column is-two-thirds">
          <AddPost onAddPost={onAddPost} />
        </div>
        <div className="column">
          <FollowerOrFollowing type="follower" />
          <FollowerOrFollowing type="following" />
        </div>
      </div>
    </div>
  );
};

export default BodySection;

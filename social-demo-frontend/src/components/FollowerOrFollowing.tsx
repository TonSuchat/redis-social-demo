import React from "react";

type FollowerOrFollowingType = {
  total?: number;
  type: "follower" | "following";
};

const FollowerOrFollowing: React.FC<FollowerOrFollowingType> = (
  { total = 0, type },
) => {
  return (
    <div>
      {total}&nbsp;
      {type === "follower" ? "followers" : "followings"}
    </div>
  );
};

export default FollowerOrFollowing;

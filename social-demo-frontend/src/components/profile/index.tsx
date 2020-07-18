import React, { useState, useEffect } from "react";

import Profile from "./Profile";
import { getUserData } from "../../auth";
import { PostItemType } from "../PostItem";

const Index: React.FC = (props: any) => {
  const { params: {id: userId} } = props.match;
  const [data, setData] = useState<{
    loading: boolean;
    isFollowing?: boolean;
    username?: string;
    posts?: PostItemType[];
  }>({ loading: true });

  useEffect(() => {
    const getProfile = async () => {
      const res = await fetch(`profile/${userId}`, { method: "GET" });
      const json = await res.json();
      setData({ loading: false, ...json });
    };
    getProfile();
  }, [userId]);

  const isShowButton = () => {
    if (
      getUserData()?.userId === null || getUserData()?.userId === userId
    ) {
      return false;
    }
    return true;
  };

  const onFollowOrUnFollowClick = async () => {
    if (data?.isFollowing) {
      // unfollow
      const response = await fetch(`/unfollow/${userId}`, { method: "DELETE" });
      if (response.ok) {
        window.location.reload();
      }
    } else {
      // follow
      const response = await fetch(
        `/follow`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({ followUserId: userId }),
        },
      );
      if (response.ok) {
        window.location.reload();
      }
    }
  };

  if (data.loading) {
    return <div>Loading....</div>;
  }

  return (
    <Profile
      username={data.username ? data.username : ""}
      posts={data.posts ? data.posts : []}
      isShowButton={isShowButton()}
      isFollowing={data.isFollowing}
      onFollowClick={onFollowOrUnFollowClick}
    />
  );
};

export default Index;

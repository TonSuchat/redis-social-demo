import React from "react";

import Profile from "./Profile";
import { getUserData } from "../../auth";
import { useFetch } from "../../helpers";

const Index: React.FC = (props: any) => {
  const { params: {id: userId} } = props.match;

  const [data, loading, error] = useFetch(
    `/profile/${userId}`,
    { method: "GET" },
  );

  const isShowButton = () => {
    if (
      getUserData()?.userId === null || getUserData()?.userId === userId
    ) {
      return false;
    }
    return true;
  };

  const onFollowOrUnFollowClick = async () => {
    if (data.isFollowing) {
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

  if (loading) {
    return <div>Loading....</div>;
  }

  if (error) {
    return <div>{error.message}</div>;
  }

  return (
    <Profile
      username={data.username}
      posts={data.posts}
      isShowButton={isShowButton()}
      isFollowing={data.isFollowing}
      onFollowClick={onFollowOrUnFollowClick}
    />
  );
};

export default Index;

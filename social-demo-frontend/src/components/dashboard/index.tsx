import React from "react";
import useFetch from "use-http";

import { logout } from "../../auth";
import TopBar from "../TopBar";
import BodySection from "./BodySection";

const Index: React.FC = (props: any) => {
  const { get, post, response } = useFetch();

  const onLogout = async () => {
    await get("/logout");
    if (response.ok) {
      logout();
      props.history.push("/login");
    }
  };

  const onAddPost = async (data: Record<string, any>) => {
    await post("/post", data);
  };

  return (
    <div className="container">
      <TopBar onLogout={onLogout} />
      <BodySection onAddPost={onAddPost} />
    </div>
  );
};

export default Index;

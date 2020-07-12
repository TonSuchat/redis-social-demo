import React, { useState } from "react";
import Register from "./Register";

const Index: React.FC = () => {
  const [error, setError] = useState("");

  const onRegister = async (data: Record<string, any>) => {
    try {
      fetch("/register", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      setError(error.message);
    }
  };

  return <Register onRegister={onRegister} error={error} />;
};

export default Index;

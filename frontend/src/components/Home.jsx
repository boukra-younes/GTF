import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
function Home() {
  const { user } = useContext(UserContext);
  const handleclick = () => {
    console.log(user);
  };
  return (
    <div>
      <button onClick={handleclick}>Loginqsdqdqsd</button>
    </div>
  );
}

export default Home;

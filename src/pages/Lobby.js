import React from "react";
import CodeLinks from "../components/CodeLinks";

function Lobby() {
  return (
    <div className="lobby">
      <h1 className="title">Choose code block:</h1>
      <CodeLinks />
    </div>
  );
}

export default Lobby;

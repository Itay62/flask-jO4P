import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Lobby from "./pages/Lobby";
import CodeBlock from "./pages/CodeBlock";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route index element={<Lobby />} />
        <Route path="codeblock/:id" element={<CodeBlock />} />
      </Routes>
    </>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HighlightedText from "../components/HighlightedText";
import io from "socket.io-client";

const socket = io({ autoConnect: false });

function CodeBlock() {
  const { id } = useParams();
  const [codeblock, setCode] = useState([]);
  const [userEntryCount, setUserEntryCount] = useState(0);

  useEffect(() => {
    axios
      .get(`/codeblock/${id}`)
      .then((response) => {
        setCode(response.data);
        const entryCount = Number(sessionStorage.getItem("entryCount")) || 1;
        setUserEntryCount(entryCount);
        if (entryCount === 1) {
          sessionStorage.setItem("entryCount", "2");
        }
        console.log(entryCount);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    socket.connect();
    socket.on("code_updated", (data) => {
      setCode(data);
    });
    return () => {
      socket.off("code_updated");
    };
  }, [codeblock]);

  const isEditingEnabled = userEntryCount > 1;

  const handleCodeChange = (newCode) => {
    console.log("handleCodeChange");
    socket.connect();
    socket.emit("code_change", {
      id: codeblock.id,
      title: codeblock.title,
      code: newCode,
      code_solution: codeblock.code_solution,
    });
  };

  const isCodeEqSolution = () => {
    return codeblock.code === codeblock.code_solution;
  };

  return (
    <div className="codeblock">
      <meta charset="UTF-8"></meta>
      <h2 className="codeblock-title">{codeblock.title}:</h2>
      <HighlightedText
        text={codeblock.code}
        editable={isEditingEnabled}
        onCodeChange={handleCodeChange}
      ></HighlightedText>
      {isCodeEqSolution() && <p>&#128512;</p>}
    </div>
  );
}

export default CodeBlock;

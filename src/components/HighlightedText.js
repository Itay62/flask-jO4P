import React, { useEffect, useRef } from "react";
import "highlight.js/styles/base16/railscasts.css";
import hljs from "highlight.js";

const HighlightedText = ({ text, editable, onCodeChange }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightAll(codeRef.current);
      if (editable) {
        codeRef.current.contentEditable = "true";
        codeRef.current.classList.add("editable");
      } else {
        codeRef.current.contentEditable = "false";
        codeRef.current.classList.remove("editable");
      }
    }
  }, [text, editable]);

  const handleCodeChange = () => {
    if (onCodeChange) {
      const newCode = codeRef.current.innerText;
      onCodeChange(newCode);
    }
  };

  return (
    <pre>
      <code
        ref={codeRef}
        className="language-javascript"
        onInput={handleCodeChange}
      >
        {text}
      </code>
    </pre>
  );
};

export default HighlightedText;

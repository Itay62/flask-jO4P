import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";

function CodeLinks() {
  const [codeLinks, setCodeLinks] = useState([]);

  useEffect(() => {
    axios
      .get("/codelinks")
      .then((response) => {
        setCodeLinks(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <div className="codelinks">
      <ul className="codelink-list">
        {codeLinks.map((codeLink) => (
          <li key={codeLink.id}>
            <NavLink to={`/codeblock/${codeLink.id}`} className="code-link">
              {codeLink.title}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CodeLinks;

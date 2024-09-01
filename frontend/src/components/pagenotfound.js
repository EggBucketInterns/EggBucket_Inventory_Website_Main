import React from "react";
import "../index.css";
import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div class="error-container">
      <div>
        <h1> 404 </h1>
        <p>
          Oops! The page you're
          looking for is not here.
        </p>
        <Link to={"/"}>
          Go Back to Home
        </Link>
      </div>

    </div>

  );
};

export default PageNotFound;

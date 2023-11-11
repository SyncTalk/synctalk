import React from "react";
import ReactLoading from "react-loading";
import "./LoadingPage.css";

const Loading = () => {
  return (
    <div className="loading">
      <img className="infographic" src="" alt="cat" />
      <div className="title">
        <p>Generating</p>
        <ReactLoading type="bubbles" color="#1D3557" />
      </div>
    </div>
  );
};

export default Loading;

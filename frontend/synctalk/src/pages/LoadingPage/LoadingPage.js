import React, { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import "./LoadingPage.css";

const Loading = () => {
  const [url, setUrl] = useState("");

  function fetchImage() {
    fetch("https://api.thecatapi.com/v1/images/search")
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Request failed.");
      })
      .then((jsonResponse) => {
        setUrl(jsonResponse[0].url);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchImage(); // Call it once immediately
    const intervalId = setInterval(fetchImage, 3000); // Then set up the interval
    return () => clearInterval(intervalId); // Clear interval on unmount
  }, []);

  return (
    <div className="loading">
      <img className="infographic" src={url} alt="cat" />
      <div className="title">
        <p>Generating</p>
        <ReactLoading type="bubbles" color="#1D3557" />
      </div>
    </div>
  );
};

export default Loading;

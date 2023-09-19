import React, { useState } from "react";
import ReactLoading from "react-loading";
import "./css/Loading.css";

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

  fetchImage();

  setInterval(() => {
    fetchImage();
  }, 5000);

  return (
    <div className="Loading">
      <img className="Infographic" src={url} alt="cat" />
      <div className="Title">
        <p>Generating</p>
        <ReactLoading type="bubbles" color="#1D3557" height={10} width={200} />
      </div>
    </div>
  );
};

export default Loading;

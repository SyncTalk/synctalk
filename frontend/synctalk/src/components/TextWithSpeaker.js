import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";
//  import axios from "axios";

const TextWithSpeaker = ({ text, startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  //const [translation, setTranslation] = useState("");

  const handleAudioClick = () => {
    const audio = document.getElementById("audio");
    setIsClicked(true);
    audio.currentTime = startTime;
    setCurrentTime(startTime);

    if (!isPlaying) {
      audio.play();
      setIsPlaying(true);
    }
  };

  /*
  async function getTranslation(word) {
    const { v4: uuidv4 } = require("uuid");
    const apiKey = "6e712e735c384f7a99f0055f2ce90fce";
    const location = "australiaeast"; // e.g., 'eastus' or 'westus'
    const endpoint = "https://api.cognitive.microsofttranslator.com";

    try {
      const response = await axios({
        baseURL: endpoint,
        url: "/translate",
        method: "post",
        headers: {
          "Ocp-Apim-Subscription-Key": apiKey,
          // location required if you're using a multi-service or regional (not global) resource.
          "Ocp-Apim-Subscription-Region": location,
          "Content-type": "application/json",
          "X-ClientTraceId": uuidv4().toString(),
        },
        params: {
          "api-version": "3.0",
          from: "fr",
          to: "en",
        },
        data: [
          {
            text: word,
          },
        ],
        responseType: "json",
      });
      setTranslation(response.data[0].translations[0].text);
    } catch (error) {
      console.error(error);
    }
  }
  */

  useEffect(() => {
    const audio = document.getElementById("audio");
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);

      if (currentTime >= startTime && currentTime < endTime) {
        setIsCurrent(true);
      } else {
        setIsCurrent(false);
      }

      if (isClicked && audio.currentTime >= endTime) {
        audio.pause();
        setIsPlaying(false);
        setIsClicked(false);
      }
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [currentTime, isClicked, startTime, endTime]);

  useEffect(() => {
    if (currentTime >= startTime && currentTime < endTime) {
      setIsCurrent(true);
    } else {
      setIsCurrent(false);
    }
  }, [currentTime, startTime, endTime]);

  const handleWordClick = (event) => {
    const word = event.target.textContent;

    const popup = document.createElement("div");
    popup.textContent = word;
    popup.style.position = "absolute";
    popup.style.top = `${event.clientY}px`;
    popup.style.left = `${event.clientX}px`;

    const closeIcon = document.createElement("span");
    closeIcon.textContent = "X";
    closeIcon.style.position = "absolute";
    closeIcon.style.top = "0";
    closeIcon.style.right = "0";
    closeIcon.style.cursor = "pointer";

    popup.appendChild(closeIcon);

    document.body.appendChild(popup);

    closeIcon.addEventListener("click", () => {
      document.body.removeChild(popup);
    });
  };

  return (
    <div className="text-with-speaker">
      <span className={`text ${isCurrent ? "playing" : ""}`}>
        {text.split(" ").map((word, index) => (
          <span key={index} id="word" onClick={handleWordClick}>
            {word}{" "}
          </span>
        ))}
      </span>
      <button className="speaker-button" onClick={handleAudioClick}>
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
    </div>
  );
};

const wordElements = document.querySelectorAll("#word");
wordElements.forEach((wordElement) => {
  wordElement.addEventListener("click", handleWordClick);
});

TextWithSpeaker.propTypes = {
  text: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default TextWithSpeaker;

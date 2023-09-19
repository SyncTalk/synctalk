import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const TextWithSpeaker = ({ text, startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);
  const [selectedWord, setSelectedWord] = useState(null);

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

  async function getTranslation(word) {
    const axios = require("axios").default;
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
          to: "en",
        },
        data: [
          {
            text: word,
          },
        ],
        responseType: "json",
      });
      const data = await response.json();
      console.log(JSON.stringify(response.data, null, 4));
      return data[0].translations[0].text;
    } catch (error) {
      console.error("Error translating text:", error);
    }
  }

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

  const handleWordClick = async (word) => {
    // Call an API to get the translation of the word
    const translation = await getTranslation(word);

    // Set the selected word and its translation in the state
    setSelectedWord({ word, translation });
  };

  return (
    <div className="TextWithSpeaker">
      <span className={`Text ${isCurrent ? "Playing" : ""}`}>
        {text.split(" ").map((word, index) => (
          <span
            key={index}
            onClick={() => handleWordClick(word)}
            title={selectedWord?.word === word ? selectedWord.translation : ""}
          >
            {word}{" "}
          </span>
        ))}
      </span>
      <button className="SpeakerButton" onClick={handleAudioClick}>
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
    </div>
  );
};

export default TextWithSpeaker;

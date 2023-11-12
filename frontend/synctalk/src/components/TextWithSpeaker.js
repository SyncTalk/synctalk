import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
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
    const translation = "await getTranslation(word)";

    // Set the selected word and its translation in the state
    setSelectedWord({ word, translation });
  };

  return (
    <div className="text-with-speaker">
      <span className={`text ${isCurrent ? "playing" : ""}`}>
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
      <button className="speaker-button" onClick={handleAudioClick}>
        <FontAwesomeIcon icon={faVolumeUp} />
      </button>
    </div>
  );
};

TextWithSpeaker.propTypes = {
  text: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default TextWithSpeaker;

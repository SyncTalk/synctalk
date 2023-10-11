import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const TextWithSpeaker = ({ ref, id, text, translation, startTime, endTime }) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isCurrent, setIsCurrent] = useState(false);

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

  const handleWordClick = async (event) => {
    const word = event.target.textContent;

    const response = await fetch(
      `https://api.cognitive.microsofttranslator.com/detect?api-version=3.0`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "6e712e735c384f7a99f0055f2ce90fce",
          "Ocp-Apim-Subscription-Region": "australiaeast",
        },
        body: JSON.stringify([{ Text: word }]),
      }
    );

    const data = await response.json();

    const sourceLanguage = data[0].language;

    const translationResponse = await fetch(
      `https://api.cognitive.microsofttranslator.com/translate?api-version=3.0&from=${sourceLanguage}&to=en`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Ocp-Apim-Subscription-Key": "6e712e735c384f7a99f0055f2ce90fce",
          "Ocp-Apim-Subscription-Region": "australiaeast",
        },
        body: JSON.stringify([{ Text: word }]),
      }
    );

    const translationData = await translationResponse.json();

    const translation = translationData[0].translations[0].text;

    const popup = document.createElement("div");
    popup.innerHTML = ` <strong>Translation:</strong> ${translation}`;
    popup.style.position = "absolute";
    popup.style.top = `${event.clientY - 40}px`;
    popup.style.left = `${event.clientX - 15}px`;
    popup.style.backgroundColor = "#FFF6CA";
    popup.style.padding = "5px";
    popup.style.borderRadius = "5px";
    popup.style.zIndex = "1000";

    document.body.appendChild(popup);

    const handleDocumentClick = (event) => {
      if (!popup.contains(event.target)) {
        setTimeout(() => {
          document.body.removeChild(popup);
        }, 10);
        document.removeEventListener("click", handleDocumentClick);
      }
    };

    document.addEventListener("click", handleDocumentClick);
  };

  const wordElements = document.querySelectorAll("#word");
  wordElements.forEach((wordElement) => {
    wordElement.addEventListener("dblclick", handleWordClick);
  });

  return (
    <div className={`text-with-speaker ${isCurrent ? "playing" : ""}`} ref={ref}>
      <span className={`text ${isCurrent ? "playing" : ""}`}>
        {text.split(" ").map((word) => (
          <span key={id} id="word" onClick={handleWordClick}>
            {word}{" "}
          </span>
        ))}
        <span className="translation-linebreak"><br/></span>
        <span className="translation">{translation}</span>
        <button className="speaker-button" onClick={handleAudioClick}>
          <FontAwesomeIcon icon={faVolumeUp} />
        </button>
      </span>
      <span><br/><br/></span>
    </div>
  );
};

TextWithSpeaker.propTypes = {
  ref: PropTypes.object.isRequired,
  id: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  translation: PropTypes.string.isRequired,
  startTime: PropTypes.number.isRequired,
  endTime: PropTypes.number.isRequired,
};

export default TextWithSpeaker;

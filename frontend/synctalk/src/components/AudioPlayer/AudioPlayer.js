import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faBackward,
  faForward,
} from "@fortawesome/free-solid-svg-icons";
import ProgressBar from "../ProgressBar";
import SpeedControl from "../SpeedControl";
import VolumeControl from "../VolumeControl.js";
import "./AudioPlayer.css";

const AudioPlayer = ({ audioObjectURL }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = document.getElementById("audio");
    audio.load();
    setCurrentTime(audio.currentTime);
    audio.addEventListener("loadedmetadata", () => {
      setDuration(audio.duration);
    });
    audio.addEventListener("play", () => {
      setIsPlaying(true);
    });
    audio.addEventListener("pause", () => {
      setIsPlaying(false);
    });
  }, []);

  const handlePlayPause = () => {
    const audio = document.getElementById("audio");
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // TO DO: handle next sentence
  const handleBack = () => {
    const audio = document.getElementById("audio");
    audio.currentTime -= 10;
  };

  const handleNext = () => {
    const audio = document.getElementById("audio");
    audio.currentTime += 10;
  };

  const handleTimeUpdate = () => {
    const audio = document.getElementById("audio");
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration);
  };

  return (
    <div className="audio-player">
      <audio
        id="audio"
        src={audioObjectURL}
        type="audio/mpeg"
        onTimeUpdate={handleTimeUpdate}
      />
      <div className="controls">
        <SpeedControl />
        <div className="playback">
          <div className="playback-control">
            <button onClick={handleBack}>
              <FontAwesomeIcon icon={faBackward} />
            </button>
            <button onClick={handlePlayPause}>
              {isPlaying ? (
                <FontAwesomeIcon icon={faPause} />
              ) : (
                <FontAwesomeIcon icon={faPlay} />
              )}
            </button>
            <button onClick={handleNext}>
              <FontAwesomeIcon icon={faForward} />
            </button>
          </div>
          <ProgressBar currentTime={currentTime} duration={duration} />
        </div>
        <VolumeControl />
      </div>
    </div>
  );
};

AudioPlayer.propTypes = {
  audioObjectURL: PropTypes.string.isRequired, // Specify the type and make it required
};

export default AudioPlayer;

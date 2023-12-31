import React from "react";
import PropTypes from "prop-types";

const ProgressBar = ({ currentTime, duration }) => {
  if (isNaN(duration) || duration <= 0) {
    return <div>Loading...</div>; // or any other fallback
  }

  const handleSeek = (event) => {
    const audio = document.getElementById("audio");
    const seekTime =
      (event.nativeEvent.offsetX / event.target.offsetWidth) * audio.duration;
    audio.currentTime = seekTime;
  };

  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  return (
    <div className="progress-bar">
      <span>{formatTime(currentTime)}</span>
      <progress
        className="progress"
        value={currentTime}
        max={duration}
        onClick={handleSeek}
      />
      <span>{formatTime(duration)}</span>
    </div>
  );
};

ProgressBar.propTypes = {
  currentTime: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
};

export default ProgressBar;

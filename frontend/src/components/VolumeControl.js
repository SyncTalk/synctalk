import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeUp } from "@fortawesome/free-solid-svg-icons";

const VolumeControl = () => {
  const [volume, setVolume] = useState(1);

  const handleVolumeChange = (event) => {
    const audio = document.getElementById("audio");
    const volume = event.target.value;
    audio.volume = volume;
    setVolume(volume);
  };

  return (
    <div className="VolumeControl">
      <label htmlFor="volume">
        <FontAwesomeIcon icon={faVolumeUp} />
      </label>
      <input
        type="range"
        id="volume"
        name="volume"
        min="0"
        max="1"
        step="0.1"
        value={volume}
        onChange={handleVolumeChange}
      />
    </div>
  );
};

export default VolumeControl;

import React, { useState } from 'react';

const SpeedControl = () => {
    const [speed, setSpeed] = useState(1);

    const handleSpeedChange = (event) => {
        const audio = document.getElementById('audio');
        const speed = event.target.value;
        audio.playbackRate = speed;
        setSpeed(speed);
    };

    return (
        <div className="SpeedControl">
            <label htmlFor="speed">Speed:</label>
            <select id="speed" name="speed" value={speed} onChange={handleSpeedChange}>
                <option value="0.5">0.5x</option>
                <option value="0.75">0.75x</option>
                <option value="1">1x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
                <option value="2">2x</option>
            </select>
        </div>
    );
};

export default SpeedControl;
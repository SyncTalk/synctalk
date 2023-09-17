import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTachometerAlt } from '@fortawesome/free-solid-svg-icons';

const SpeedControl = () => {
    const [speed, setSpeed] = useState(1);

    const handleSpeedChange = (event) => {
        const audio = document.getElementById('audio');
        const speed = event.target.value;
        audio.playbackRate = speed;
        setSpeed(Number(speed));
    };

    return (
        <div className="SpeedControl">
            <label htmlFor="speed">
                <FontAwesomeIcon icon={faTachometerAlt} />
            </label>
            <input type="range" id="speed" name="speed" min="0.25" max="2.00" step="0.25" value={speed} onChange={handleSpeedChange} />
            <span>{speed.toFixed(2)}x</span>
        </div>
    );
};

export default SpeedControl;
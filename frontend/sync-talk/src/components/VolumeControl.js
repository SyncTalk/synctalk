import React, { useState } from 'react';

const VolumeControl = () => {
    const [volume, setVolume] = useState(1);

    const handleVolumeChange = (event) => {
        const audio = document.getElementById('audio');
        const volume = event.target.value;
        audio.volume = volume;
        setVolume(volume);
    };

    return (
        <div className="VolumeControl">
            <label htmlFor="volume">Volume:</label>
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
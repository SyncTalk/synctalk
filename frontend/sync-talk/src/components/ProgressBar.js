import React from 'react';
import { ProgressBar } from 'react-bootstrap';

const AudioProgressBar = ({ currentTime, duration, onSeek }) => {
    const handleSeek = (event) => {
        const seekTime = (event.nativeEvent.offsetX / event.target.offsetWidth) * duration;
        onSeek(seekTime);
    };

    return (
        <ProgressBar now={(currentTime / duration) * 100} onClick={handleSeek} />
    );
};

export default AudioProgressBar;
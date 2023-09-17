import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const TextWithSpeaker = ({ text, time }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTextClick = () => {
        const audio = document.getElementById('audio');
        audio.currentTime = time;
        setCurrentTime(time);
        audio.play();
    };

    useEffect(() => {
        const audio = document.getElementById('audio');
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        audio.addEventListener('timeupdate', handleTimeUpdate);
        setIsPlaying(!audio.paused);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, []);

    const isCurrent = currentTime >= time && currentTime < time + 10;

    return (
        <div className="TextWithSpeaker">
            <span className={`Text ${isPlaying && isCurrent ? 'Playing' : ''}`}>{text}</span>
            <button className="SpeakerButton" onClick={handleTextClick}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </button>
        </div>
    );
};

export default TextWithSpeaker;
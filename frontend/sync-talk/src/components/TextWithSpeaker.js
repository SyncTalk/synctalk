import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const TextWithSpeaker = ({ text, startTime, endTime }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);

    const handleTextClick = () => {
        const audio = document.getElementById('audio');
        if (isPlaying && audio.currentTime >= startTime && audio.currentTime < endTime) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.currentTime = startTime;
            setCurrentTime(startTime);
            audio.play();
            setIsPlaying(true);
        }
    };

    useEffect(() => {
        const audio = document.getElementById('audio');
        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };
        audio.addEventListener('timeupdate', handleTimeUpdate);
        setIsPlaying(!audio.paused);
        const handleEnded = () => {
            setIsPlaying(false);
        };
        audio.addEventListener('ended', handleEnded);
        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const isCurrent = currentTime >= startTime && currentTime < endTime;

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
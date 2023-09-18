import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons';

const TextWithSpeaker = ({ text, startTime, endTime }) => {
    const [currentTime, setCurrentTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [isCurrent, setIsCurrent] = useState(false);

    const handleAudioClick = () => {
        const audio = document.getElementById('audio');
        setIsClicked(true);
        audio.currentTime = startTime;
        setCurrentTime(startTime);
        audio.play();
        setIsPlaying(true);
    };

    useEffect(() => {
        const audio = document.getElementById('audio');
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

        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
        };
    }, [currentTime, isClicked, startTime, endTime]);

    return (
        <div className="TextWithSpeaker">
            <span className={`Text ${isPlaying && isCurrent ? 'Playing' : ''}`}>{text}</span>
            <button className="SpeakerButton" onClick={handleAudioClick}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </button>
        </div>
    );
};

export default TextWithSpeaker;
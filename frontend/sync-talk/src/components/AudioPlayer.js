import React, { useState, useEffect } from 'react';
import ProgressBar from './ProgressBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import VolumeControl from './VolumeControl.js';
import SpeedControl from './SpeedControl';
import './AudioPlayer.css';


export const TextWithSpeaker = ({ text }) => {
    const [currentTime, setCurrentTime] = useState(0);

    const handleTextClick = (event) => {
        const audio = document.getElementById('audio');
        const text = event.target;
        const rect = text.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const width = rect.right - rect.left;
        const percent = x / width;
        const newTime = percent * audio.duration;
        audio.currentTime = newTime;
        setCurrentTime(newTime);
    };

    return (
        <div className="TextWithSpeaker">
            <span className="Text">{text}</span>
            <button className="SpeakerButton" onClick={handleTextClick}>
                <FontAwesomeIcon icon={faVolumeUp} />
            </button>
        </div>
    );
};

export const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        const audio = document.getElementById('audio');
        audio.load();
        setCurrentTime(audio.currentTime);
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });
      }, []);

    const handlePlayPause = () => {
        const audio = document.getElementById('audio');
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    // TO DO: handle next sentence
    const handleBack = () => {
        const audio = document.getElementById('audio');
        audio.currentTime -= 10;
    };

    const handleNext = () => {
        const audio = document.getElementById('audio');
        audio.currentTime += 10;
    };

    const handleTimeUpdate = () => {
        const audio = document.getElementById('audio');
        setCurrentTime(audio.currentTime);
        setDuration(audio.duration);
    };

    return (
        <div className="AudioPlayer">
            <audio
                id="audio"
                src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                type="audio/mpeg"
                onTimeUpdate={handleTimeUpdate}
            />
            <div className="Controls">
                <SpeedControl />
                <div className="Playback">
                    <div className='PlaybackControl'>
                        <button onClick={handleBack}>
                            <FontAwesomeIcon icon={faBackward} />
                        </button>
                        <button onClick={handlePlayPause}>
                            {isPlaying ? <FontAwesomeIcon icon={faPause} /> : <FontAwesomeIcon icon={faPlay} />}
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
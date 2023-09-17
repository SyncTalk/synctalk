import React, { useState } from 'react';
import { ProgressBar } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faPause, faBackward, faForward } from '@fortawesome/free-solid-svg-icons';
import VolumeControl from './VolumeControl.js';
import SpeedControl from './SpeedControl';
import './AudioPlayer.css';

const AudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const handlePlayPause = () => {
        const audio = document.getElementById('audio');
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

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

    const handleSeek = (event) => {
        const audio = document.getElementById('audio');
        const seekTime = (event.nativeEvent.offsetX / event.target.offsetWidth) * audio.duration;
        audio.currentTime = seekTime;
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
                <VolumeControl />
            </div>
            <ProgressBar now={(currentTime / duration) * 100} onClick={handleSeek} />
        </div>
    );
};

export default AudioPlayer;
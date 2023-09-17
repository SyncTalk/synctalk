import React, { useState } from 'react';
import VolumeControl from './VolumeControl';
import SpeedControl from './SpeedControl';
import ProgressBar from './ProgressBar';
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
            <div className="controls">
                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                <VolumeControl />
                <SpeedControl />
                <ProgressBar now={(currentTime / duration) * 100} onClick={handleSeek} />
            </div>
        </div>
    );
};

export default AudioPlayer;
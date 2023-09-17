import React, { useState } from 'react';
import {AudioPlayer, TextWithSpeaker} from '../components/AudioPlayer';
import Text from '../components/Text';
import './css/Result.css';

const Result = () => {
    const [currentTime, setCurrentTime] = useState(0);
    const [text, setText] = useState([
        { time: 0, text: 'Line 1' },
        { time: 10, text: 'Line 2' },
        { time: 20, text: 'Line 3' },
    ]);

    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };

    return (
        <div className="Result">
            <div className="Header">
                <h1>Result Page</h1>
            </div>
            <div className="Body">
            <div className="TextContainer">
                <TextWithSpeaker text="Lorem ipsum dolor sit amet, consectetur adipiscing elit." />
                <TextWithSpeaker text="Sed euismod, nunc vel bibendum bibendum, elit elit bibendum."/>
                <TextWithSpeaker text="Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas." />
            </div>
            </div>
            <div className="Footer">
                <AudioPlayer onTimeUpdate={handleTimeUpdate} />
            </div>
        </div>
    );
};

export default Result;
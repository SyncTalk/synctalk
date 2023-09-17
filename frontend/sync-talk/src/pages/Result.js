import React, { useState } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import TextWithSpeaker from '../components/TextWithSpeaker';
import Text from '../components/Text';
import './css/Result.css';
import textData from '../test.json';

const Result = () => {
    const [currentTime, setCurrentTime] = useState(0);

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
                    {textData.map(({ time, text }) => (
                        <TextWithSpeaker key={time} text={text} time={time} />
                    ))}
                </div>
            </div>
            <div className="Footer">
                <AudioPlayer onTimeUpdate={handleTimeUpdate} />
            </div>
        </div>
    );
};

export default Result;
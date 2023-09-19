import React from 'react';
import AudioPlayer from '../components/AudioPlayer';
import TextWithSpeaker from '../components/TextWithSpeaker';
import './css/Result.css';
import textData from '../test.json';

const Result = () => {

    const handleTimeUpdate = (time) => {
        const lastTextEndTime = textData[textData.length - 1].endTime;
        if (time >= lastTextEndTime) {
            const audio = document.getElementById('audio');
            audio.pause();
            audio.currentTime = 0;
        }
    };

    return (
        <div className="Result">
            <div className="Header">
                <h1>Result Page</h1>
            </div>
            <div className="Body">
                <div className="TextContainer">
                    {textData.map(({ startTime, endTime, text }) => (
                        <TextWithSpeaker key={startTime} text={text} startTime={startTime} endTime={endTime} />
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
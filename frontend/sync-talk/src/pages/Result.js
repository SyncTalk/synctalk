import React, { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import Text from '../components/Text';
import './css/Result.css';
const Result = () => {

    const [currentTime, setCurrentTime] = useState(0);

    const handleTimeUpdate = (time) => {
        setCurrentTime(time);
    };

    const text = [
        { time: 0, text: 'Line 1' },
        { time: 10, text: 'Line 2' },
        { time: 20, text: 'Line 3' },
    ];
    
    return (
        <div className="Result" >
            <div className="Header">
                <h1>Result Page</h1>
            </div>
            <div className="Body">
                <Text text={text} currentTime={currentTime}/>
            </div>

            <div className="Footer">
                <AudioPlayer onTimeUpdate={handleTimeUpdate}/>
            </div>
        </div>
    );
}

export default Result;
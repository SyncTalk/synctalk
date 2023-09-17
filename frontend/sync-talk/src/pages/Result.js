import React, { useState, useEffect } from 'react';
import AudioPlayer from '../components/AudioPlayer';
import './css/Result.css';
const Result = () => {
    
    return (
        <div className="Result" >
            <div className="Title">

            </div>
            <div className="Content">
                
            </div>

            <div className="Footer">
                <AudioPlayer />
            </div>
        </div>
    );
}

export default Result;
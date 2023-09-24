import React from "react";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import TextWithSpeaker from "../../components/TextWithSpeaker";
import textData from "../../test.json";
import "./ResultPage.css";

const Result = () => {
  const handleTimeUpdate = (time) => {
    const lastTextEndTime = textData[textData.length - 1].endTime;
    if (time >= lastTextEndTime) {
      const audio = document.getElementById("audio");
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <div className="result">
      <div className="header">
        <h1>Result Page</h1>
      </div>
      <div className="body">
        <div className="text-container">
          {textData.map(({ startTime, endTime, text }) => (
            <TextWithSpeaker
              key={startTime}
              text={text}
              startTime={startTime}
              endTime={endTime}
            />
          ))}
        </div>
      </div>
      <div className="footer">
        <AudioPlayer onTimeUpdate={handleTimeUpdate} />
      </div>
    </div>
  );
};

export default Result;

import React from "react";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import TextWithSpeaker from "../../components/TextWithSpeaker";
import resultData from "../../result.json";
import "./ResultPage.css";

const Result = () => {

  const handleTimeUpdate = (time) => {
    const lastTextEndTime = resultData[resultData.length - 1].end;
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
          {resultData.map(({ id, start, end, text, translation }) => (
            <TextWithSpeaker
              key = {id}
              text={text}
              translation={translation}
              startTime={start}
              endTime={end}
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

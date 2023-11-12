import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import TextWithSpeaker from "../../components/TextWithSpeaker";
import "./ResultPage.css";

const Result = () => {
  const textPlayingRef = useRef(null);
  const location = useLocation();
  const resultData = location.state ? location.state.resultData : [];
  const parsedResultData = JSON.parse(resultData);
  const audioObjectURL = location.state ? location.state.audioObjectURL : "";

  useEffect(() => {
    // Update the scrolling every second
    const intervalId = setInterval(() => {
      // Get the current playing TextWithSpeaker component
      const currentText = document.querySelector(".text-container .playing");

      // Scroll the current playing TextWithSpeaker component into view
      if (currentText) {
        currentText.scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "center",
        });
      }
    }, 10);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleTimeUpdate = (time) => {
    const lastTextEndTime = parsedResultData[parsedResultData.length - 1].end;
    if (time >= lastTextEndTime) {
      const audio = document.getElementById("audio");
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <div className="result">
      <div className="header">
        <h1>Auto Alignment Result</h1>
      </div>
      <div className="body">
        <div className="text-container">
          {parsedResultData.map(({ id, start, end, text, translation }) => (
            <TextWithSpeaker
              ref={textPlayingRef}
              key={id}
              text={text}
              translation={translation}
              startTime={parseFloat(start)}
              endTime={parseFloat(end)}
            />
          ))}
        </div>
      </div>
      <div className="footer">
        <AudioPlayer
          audioObjectURL={audioObjectURL}
          onTimeUpdate={handleTimeUpdate}
        />
      </div>
    </div>
  );
};

export default Result;

import React, { useRef, useEffect } from "react";
import AudioPlayer from "../../components/AudioPlayer/AudioPlayer";
import TextWithSpeaker from "../../components/TextWithSpeaker";
import resultData from "../../result.json";
import "./ResultPage.css";

const Result = () => {
  const textPlayingRef = useRef(null);

  useEffect(() => {
    // Update the scrolling every second
    const intervalId = setInterval(() => {
      // Get the current playing TextWithSpeaker component
      const currentText = document.querySelector('.text-container .playing');

      // Scroll the current playing TextWithSpeaker component into view
      if (currentText) {
        currentText.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
    }, 10);

    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

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
        <h1>Auto Alignment Result</h1>
      </div>
      <div className="body">
        <div className="text-container">
          {resultData.map(({ id, start, end, text, translation }) => (
            <TextWithSpeaker
              ref={textPlayingRef}
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

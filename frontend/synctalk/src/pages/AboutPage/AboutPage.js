// Qingyue Zhu
import React from "react";
import { Link } from "react-router-dom";
import aboutIcon from "../../assets/edit.png";
import "../AboutPage/AboutPage.css";

const AboutPage = () => {
  return (
    <div>
      <div className="icon">
        <img src={aboutIcon} alt="about icon" className="about-icon"></img>
      </div>
      <div className="title">Text / Audio Alignment</div>
      <div>
        <p className="instruction">
          <span>1. Resources:</span> Start with a&#41; source-language text,
          b&#41; annotation-language text, c&#41; source language audio.
          <br></br>
          <span>2. Translation alignment:</span> Send the source language and
          annotation-language text files to the sentence aligner, create two
          parallel sentence-segmented corpora.<br></br>
          <span>3. Source segmented by translation alignment:</span> Add
          markings to the source corpus showing the breaks corresponding to the
          translation alignment.<br></br>
          <span>4. Split on silences:</span> Use the split-on-silences tool to
          divide up the audio corpus, choosing thresholds that make typical
          pieces a bit smaller than sentences. In practice it is quick to find
          such thresholds.<br></br>
          <span>5. Speech recognition:</span> Send the pieces of audio generated
          by the previous step to the speech recogniser.<br></br>
          <span>6. Make double-aligned text:</span> Use a beam search to align
          the sequence of recognition results against the text.14 Add markings
          to the source corpus showing the breaks corresponding to the audio
          alignment. The result is a text that is segmented both by translation
          alignment and by audio alignment.<br></br>
          <span>7. Post-process double-aligned text:</span> Post process the
          source corpus, iteratively applying a small set of transformations
          that reduce differences between the translation alignment and the
          audio alignment. Most importantly, if a translation alignment marker
          and an audio alignment marker are separated by text which does not
          include a word, move this text to the other side of the earlier
          marker.<br></br>
          <span>8. Make joint aligned text:</span> Segment the source text by
          breaking at the points where the two types of segmentation markers
          agree. In each segment of the jointly segmented corpus produced by the
          previous step, concatenate the component audio segments from the audio
          segmentation and the component translation segments from the
          translation segmentation.<br></br>
        </p>
      </div>
      <div className="center-button">
        <Link to="/upload">
          <button>Get Started</button>
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;

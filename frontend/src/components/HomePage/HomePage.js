// Qingyue Zhu
import React from 'react';
import { Link } from 'react-router-dom';
import '../HomePage/HomePage.css';
import soundEn from '../../assets/voice-en.m4a'; // Import the English audio in M4A format
import soundFr from '../../assets/voice-fr.m4a'; // Import the French audio in M4A format
import soundZh from '../../assets/voice-zh.m4a'; // Import the Chinese audio in M4A format
import soundImage from '../../assets/sound.jpg';
import introVideo from '../../assets/introVideo.mp4'

const HomePage = () => {
  // Function to play the corresponding audio
  const playAudio = (language) => {
    let audio;

    switch (language) {
      case 'en':
        audio = new Audio(soundEn);
        break;
      case 'fr':
        audio = new Audio(soundFr);
        break;
      case 'zh':
        audio = new Audio(soundZh);
        break;
      default:
        break;
    }

    if (audio) {
      audio.play();
    }
  };

  return (
    <div>
      <div className='home-title'>SyncTalk</div>
      <div className='home-container'>
        <div className='home-intro'>SyncTalk empowers language learners by seamlessly aligning audio, transcriptions, and translations. Enhance your language skills effortlessly.</div>
      </div>
      <div className='example'>
        <div onClick={() => playAudio('en')}>Hello<img src={soundImage} alt='sound icon' /></div>
        <div onClick={() => playAudio('fr')}>Bonjour<img src={soundImage} alt='sound icon' /></div>
        <div onClick={() => playAudio('zh')}>你好<img src={soundImage} alt='sound icon' /></div>
      </div>
      <div className='right-button'><Link to="/upload"><button>Get started</button></Link></div>
      <div className='home-container'>
        <div className='use-title'>How to use</div>
      </div>
      <div className='intro-video'>
        <video controls width="892" height="500">
          <source src={introVideo} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className='center-button home-end-button'><Link to="/upload"><button>Get started</button></Link></div>
    </div>
  );
};

export default HomePage;

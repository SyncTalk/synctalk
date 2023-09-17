// Qingyue Zhu
import React, { useState } from 'react';
import axios from 'axios';

const UploadPage = () => {
  const [selectedMp3Mp4File, setSelectedMp3Mp4File] = useState(null);
  const [selectedDocxTxtFile1, setSelectedDocxTxtFile1] = useState(null);
  const [selectedDocxTxtFile2, setSelectedDocxTxtFile2] = useState(null);

  const handleMp3Mp4FileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === 'audio/mp3' || file.type === 'video/mp4')) {
      setSelectedMp3Mp4File(file);
    } else {
      alert('Please select a valid mp3 or mp4 file');
    }
  };

  const isDocxOrTxtFile = (file) => {
    const fileName = file.name.toLowerCase();
    return fileName.endsWith('.docx') || fileName.endsWith('.txt');
  };

  const handleDocxTxtFileSelect1 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtFile(file)) {
      setSelectedDocxTxtFile1(file);
    } else {
      alert('Please select a valid docx or txt file');
    }
  };

  const handleDocxTxtFileSelect2 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtFile(file)) {
      setSelectedDocxTxtFile2(file);
    } else {
      alert('Please select a valid docx or txt file');
    }
  };

  const handleUpload = () => {
    // Check if the required files are selected
    if (selectedMp3Mp4File && selectedDocxTxtFile1) {
      const formData = new FormData();
      formData.append('mp3Mp4File', selectedMp3Mp4File);
      formData.append('docxTxtFile1', selectedDocxTxtFile1);

      if (selectedDocxTxtFile2) {
        // If the third file is selected, add it to the form data
        formData.append('docxTxtFile2', selectedDocxTxtFile2);
      }

      axios
        .post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((response) => {
          console.log('Upload successful', response.data);
        })
        .catch((error) => {
          console.error('Upload failed', error);
        });
    } else {
      alert('Please make sure to select the required files');
    }
  };

  return (
    <div>
      <div className='title'>Upload Your Files</div>
      <div>
        <h1>Audio</h1>
        <h2>Supported formats: .mp3, .mp4</h2>
        <input type="file" accept=".mp3, .mp4" onChange={handleMp3Mp4FileSelect} />
      </div>
      <div>
        <h1>Text</h1>
        <h2>Supported formats: .docx, .txt</h2>
        <input type="file" accept=".docx, .txt" onChange={handleDocxTxtFileSelect1} />
      </div>
      <div>
        <h1>Translation (Optional)</h1>
        <h2>Supported formats: .docx, .txt</h2>
        <input type="file" accept=".docx, .txt" onChange={handleDocxTxtFileSelect2} />
      </div>
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default UploadPage;

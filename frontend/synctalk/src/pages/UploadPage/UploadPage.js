import React, { useState } from "react";
import axios from "axios";
import uploadIcon from "../../assets/upload-icon.jpg";
import "../UploadPage/UploadPage.css";

const UploadPage = () => {
  const [selectedMp3Mp4File, setSelectedMp3Mp4File] = useState(null);
  const [selectedDocxTxtFile1, setSelectedDocxTxtFile1] = useState(null);
  const [selectedDocxTxtFile2, setSelectedDocxTxtFile2] = useState(null);
  const [selectedMp3Mp4FileName, setSelectedMp3Mp4FileName] = useState("");
  const [selectedDocxTxtFileName1, setSelectedDocxTxtFileName1] = useState("");
  const [selectedDocxTxtFileName2, setSelectedDocxTxtFileName2] = useState("");

  const handleMp3Mp4FileSelect = (event) => {
    const file = event.target.files[0];
    if (file && (file.type === "audio/mp3" || file.type === "video/mp4")) {
      setSelectedMp3Mp4File(file);
      setSelectedMp3Mp4FileName(file.name); // Set the file name
    } else {
      alert("Please select a valid mp3 or mp4 file");
    }
  };

  const isDocxOrTxtFile = (file) => {
    const fileName = file.name.toLowerCase();
    return fileName.endsWith(".docx") || fileName.endsWith(".txt");
  };

  const handleDocxTxtFileSelect1 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtFile(file)) {
      setSelectedDocxTxtFile1(file);
      setSelectedDocxTxtFileName1(file.name); // Set the file name
    } else {
      alert("Please select a valid docx or txt file");
    }
  };

  const handleDocxTxtFileSelect2 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtFile(file)) {
      setSelectedDocxTxtFile2(file);
      setSelectedDocxTxtFileName2(file.name); // Set the file name
    } else {
      alert("Please select a valid docx or txt file");
    }
  };

  const handleDrop = (event, fileType) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (
        fileType === "audio" &&
        (file.type === "audio/mp3" || file.type === "video/mp4")
      ) {
        setSelectedMp3Mp4File(file);
        setSelectedMp3Mp4FileName(file.name); // Set the file name
      } else if (fileType === "text1" && isDocxOrTxtFile(file)) {
        setSelectedDocxTxtFile1(file);
        setSelectedDocxTxtFileName1(file.name); // Set the file name
      } else if (fileType === "text2" && isDocxOrTxtFile(file)) {
        setSelectedDocxTxtFile2(file);
        setSelectedDocxTxtFileName2(file.name); // Set the file name
      } else {
        alert(
          `Please drop a valid ${
            fileType === "audio" ? "mp3 or mp4" : "docx or txt"
          } file`,
        );
      }
    }
  };

  const preventDefault = (event) => {
    event.preventDefault();
  };

  const isFileSelected = () => {
    return (
      selectedMp3Mp4File !== null ||
      selectedDocxTxtFile1 !== null ||
      selectedDocxTxtFile2 !== null
    );
  };

  const handleUpload = () => {
    if (selectedMp3Mp4File && selectedDocxTxtFile1) {
      const formData = new FormData();
      formData.append("mp3Mp4File", selectedMp3Mp4File);
      formData.append("docxTxtFile1", selectedDocxTxtFile1);

      if (selectedDocxTxtFile2) {
        formData.append("docxTxtFile2", selectedDocxTxtFile2);
      }

      axios
        .post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then((response) => {
          console.log("Upload successful", response.data);
          // Handle successful upload here
        })
        .catch((error) => {
          console.error("Upload failed", error);
        });
    } else {
      alert("Please make sure to select the required files");
    }
  };

  return (
    <div>
      <div className="nav-bar"></div>
      <div className="title upload-title">Upload Your Files</div>
      <div className="subtitle">
        <div className="three-part">Audio</div>
        <div className="three-part">Text</div>
        <div className="three-part">Translation (Optional)</div>
      </div>
      <div className="upload-instrument">
        <div className="three-part">Supported formats: .mp3, .mp4</div>
        <div className="three-part">Supported formats: .docx, .txt</div>
        <div className="three-part">Supported formats: .docx, .txt</div>
      </div>
      <div>
        <div className="upload-square">
          <div
            className={`three-part ${isFileSelected() ? "file-selected" : ""}`}
            onDrop={(event) => handleDrop(event, "audio")}
            onDragOver={preventDefault}
          >
            <img
              className="upload-icon"
              src={uploadIcon}
              alt="upload feature icon"
            ></img>
            <div className="select-part">
              <span>Select a file or drag and drop here</span>
              <input
                id="mp3Mp4File"
                type="file"
                accept=".mp3, .mp4"
                onChange={handleMp3Mp4FileSelect}
              />
              <div className="select-button">
                <label htmlFor="mp3Mp4File">Select file</label>
              </div>
            </div>
            <div className="file-name">{selectedMp3Mp4FileName}</div>{" "}
            {/* Display file name */}
          </div>
          <div
            className={`three-part ${isFileSelected() ? "file-selected" : ""}`}
            onDrop={(event) => handleDrop(event, "text1")}
            onDragOver={preventDefault}
          >
            <img
              className="upload-icon"
              src={uploadIcon}
              alt="upload feature icon"
            ></img>
            <div className="select-part">
              <span>Select a file or drag and drop here</span>
              <input
                id="docxTxtFile1"
                type="file"
                accept=".docx, .txt"
                onChange={handleDocxTxtFileSelect1}
              />
              <div className="select-button">
                <label htmlFor="docxTxtFile1">Select file</label>
              </div>
            </div>
            <div className="file-name">{selectedDocxTxtFileName1}</div>{" "}
            {/* Display file name */}
          </div>
          <div
            className={`three-part ${isFileSelected() ? "file-selected" : ""}`}
            onDrop={(event) => handleDrop(event, "text2")}
            onDragOver={preventDefault}
          >
            <img
              className="upload-icon"
              src={uploadIcon}
              alt="upload feature icon"
            ></img>
            <div className="select-part">
              <span>Select a file or drag and drop here</span>
              <input
                id="docxTxtFile2"
                type="file"
                accept=".docx, .txt"
                onChange={handleDocxTxtFileSelect2}
              />
              <div className="select-button">
                <label htmlFor="docxTxtFile2">Select file</label>
              </div>
            </div>
            <div className="file-name">{selectedDocxTxtFileName2}</div>{" "}
            {/* Display file name */}
          </div>
        </div>
      </div>
      <div className="right-button">
        <button onClick={handleUpload}>Generate</button>
      </div>
    </div>
  );
};

export default UploadPage;

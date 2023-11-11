import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../UploadPage/UploadPage.css";
import uploadIcon from "../../assets/upload-icon.jpg";
import LoadingPage from "../LoadingPage/LoadingPage"; // for loading page

const UploadPage = () => {
  const [selectedMp3File, setSelectedMp3File] = useState(null);
  const [selectedDocxTxtFile1, setSelectedDocxTxtFile1] = useState(null);
  const [selectedDocxTxtFile2, setSelectedDocxTxtFile2] = useState(null);
  const [selectedMp3FileName, setSelectedMp3FileName] = useState("");
  const [selectedDocxTxtFileName1, setSelectedDocxTxtFileName1] = useState("");
  const [selectedDocxTxtFileName2, setSelectedDocxTxtFileName2] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [showLoading, setShowLoading] = useState(false); // for loading page
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  const handleMp3FileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.name.toLowerCase().endsWith(".mp3")) {
      setSelectedMp3File(file);
      setSelectedMp3FileName(file.name);
    } else {
      alert("Please select a valid mp3 file");
    }
  };

  const handleLanguageSelect = (event) => {
    setSelectedLanguage(event.target.value);
  };

  const isDocxOrTxtOrPdfFile = (file) => {
    const fileName = file.name.toLowerCase();
    return (
      fileName.endsWith(".docx") ||
      fileName.endsWith(".txt") ||
      fileName.endsWith(".pdf")
    );
  };

  const handleDocxTxtFileSelect1 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtOrPdfFile(file)) {
      setSelectedDocxTxtFile1(file);
      setSelectedDocxTxtFileName1(file.name);
    } else {
      alert("Please select a valid docx, txt, or pdf file");
    }
  };

  const handleDocxTxtFileSelect2 = (event) => {
    const file = event.target.files[0];
    if (file && isDocxOrTxtOrPdfFile(file)) {
      setSelectedDocxTxtFile2(file);
      setSelectedDocxTxtFileName2(file.name);
    } else {
      alert("Please select a valid docx, txt, or pdf file");
    }
  };

  const handleDrop = (event, fileType) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      const fileExtension = file.name.toLowerCase().split(".").pop();
      if (fileType === "audio" && fileExtension === "mp3") {
        setSelectedMp3File(file);
        setSelectedMp3FileName(file.name);
      } else if (fileType === "text1" && isDocxOrTxtOrPdfFile(file)) {
        setSelectedDocxTxtFile1(file);
        setSelectedDocxTxtFileName1(file.name);
      } else if (fileType === "text2" && isDocxOrTxtOrPdfFile(file)) {
        setSelectedDocxTxtFile2(file);
        setSelectedDocxTxtFileName2(file.name);
      } else {
        alert(
          `Please drop a valid ${
            fileType === "audio" ? "mp3" : "docx, txt, or pdf"
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
      selectedMp3File !== null &&
      selectedDocxTxtFile1 !== null &&
      selectedDocxTxtFile2 !== null
    );
  };

  const handleUpload = async () => {
    if (selectedMp3File && selectedDocxTxtFile1 && selectedDocxTxtFile2) {
      setShowLoading(true); // for loading page

      const formData = new FormData();
      formData.append("audio", selectedMp3File);
      formData.append("text", selectedDocxTxtFile1);
      formData.append("translation", selectedDocxTxtFile2);
      formData.append("lang", selectedLanguage);

      try {
        const response = await fetch(process.env.UPLOAD_URL, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setUploadStatus("success");
          console.log(data);
          navigate("/result", { state: { resultData: data } });
        } else {
          throw new Error("Upload failed");
        }
      } catch (error) {
        setUploadStatus("fail");
        console.error("Upload failed", error);
      } finally {
        // for loading page
        setShowLoading(false); // for loading page
      } // for loading page
    } else {
      alert("Please make sure to select all three required files");
    }
  };

  return (
    <div>
      {showLoading ? ( // for loading page
        <LoadingPage /> // for loading page
      ) : (
        // for loading page
        <div>
          <div className="title upload-title">Upload Your Files</div>
          <div className="language-select">
            <label htmlFor="language">
              Select Language for your Audio file and Text file:{" "}
            </label>
            <select
              id="language"
              value={selectedLanguage}
              onChange={handleLanguageSelect}
            >
              <option value="en">English</option>
              <option value="zh">Chinese</option>
              <option value="fr">French</option>
              {/* Other Languages */}
            </select>
            <div>(Translation file must be in English)</div>
          </div>
          <div className="subtitle">
            <div className="three-part">Audio</div>
            <div className="three-part">Text</div>
            <div className="three-part">Translation</div>
          </div>
          <div className="upload-instrument">
            <div className="three-part">Supported format: .mp3</div>
            <div className="three-part">
              Supported formats: .docx, .txt, .pdf
            </div>
            <div className="three-part">
              Supported formats: .docx, .txt, .pdf
            </div>
          </div>
          <div>
            <div className="upload-square">
              <div
                className={`three-part ${
                  isFileSelected() ? "file-selected" : ""
                }`}
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
                    id="mp3File"
                    type="file"
                    accept=".mp3"
                    onChange={handleMp3FileSelect}
                  />
                  <div className="select-button">
                    <label htmlFor="mp3File">Select file</label>
                  </div>
                </div>
                <div className="file-name">{selectedMp3FileName}</div>
              </div>
              <div
                className={`three-part ${
                  isFileSelected() ? "file-selected" : ""
                }`}
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
                    accept=".docx, .txt, .pdf"
                    onChange={handleDocxTxtFileSelect1}
                  />
                  <div className="select-button">
                    <label htmlFor="docxTxtFile1">Select file</label>
                  </div>
                </div>
                <div className="file-name">{selectedDocxTxtFileName1}</div>
              </div>
              <div
                className={`three-part ${
                  isFileSelected() ? "file-selected" : ""
                }`}
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
                    accept=".docx, .txt, .pdf"
                    onChange={handleDocxTxtFileSelect2}
                  />
                  <div className="select-button">
                    <label htmlFor="docxTxtFile2">Select file</label>
                  </div>
                </div>
                <div className="file-name">{selectedDocxTxtFileName2}</div>
              </div>
            </div>
          </div>
          <div className="right-button">
            <button onClick={handleUpload}>
              {uploadStatus === "success"
                ? "Success"
                : uploadStatus === "fail"
                ? "Fail"
                : "Generate"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadPage;

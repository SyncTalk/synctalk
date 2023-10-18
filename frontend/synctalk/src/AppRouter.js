// Qingyue Zhu
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage";
import UploadPage from "./components/UploadPage/UploadPage";
import AboutPage from "./components/AboutPage/AboutPage";
import LoadingPage from "./components/LoadingPage/LoadingPage";
import ResultPage from "./components/ResultPage/ResultPage";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/result" element={<ResultPage />} />
      </Routes>
    </Router>
  );
};

export default AppRouter;

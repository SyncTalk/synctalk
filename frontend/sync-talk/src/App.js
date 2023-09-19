import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import Loading from './pages/Loading';
import Result from './pages/Result';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/loading" element={<Loading />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Loading from './pages/loading';
import Navbar from './components/Navbar';

function App() {
  return (
    /* link page tp loading */
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="/loading" element={<Loading />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;

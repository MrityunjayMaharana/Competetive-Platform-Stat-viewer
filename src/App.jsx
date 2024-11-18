import { Route, Routes, BrowserRouter } from 'react-router-dom';
import './App.css';
import Details from './pages/Details';
import LeetcodeProf from './pages/LeetcodeProf';
import GFGProf from './pages/GFGProf';
import CodeChefProf from './pages/CodeChefProf';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Details />} />
        <Route path="/profile/leetcode/:username" element={<LeetcodeProf />} />
        <Route path="/profile/gfg/:username" element={<GFGProf />} />
        <Route path="/profile/codechef/:username" element={<CodeChefProf />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

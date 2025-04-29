import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Form from "./Components/Form/Form"; // Correct import
import Subjects from "./Components/Subjects/Subjects";
import OmrExam from './Components/Omr/OmrExam';
import Landingpage from './Components/Home/Landingpage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/form" element={<Form />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/omr" element={<OmrExam/>} />
      </Routes>
    </Router>
  );
}

export default App;

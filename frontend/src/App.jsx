import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import Ingresar from './pages/Ingresar.jsx';
import Acerca from './pages/Acerca.jsx';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ingresar" element={<Ingresar />} />
        <Route path="/acerca" element={<Acerca />} />
      </Routes>
    </Router>
  );
};

export default App;

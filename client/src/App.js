import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/views/NavBar/NavBar';
import Footer from './components/views/Footer/Footer';
// Import pages
import Home from './components/pages/Home/Home';
import WrongPage from './components/pages/WrongPage/WrongPage';

function App() {
  return (
    <div>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="*" element={<WrongPage/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

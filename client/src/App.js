import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/views/NavBar/NavBar';
import Footer from './components/views/Footer/Footer';

function App() {
  return (
    <div>
      <NavBar />
      <header>
        <h1>
          Favorite Anime
        </h1>
      </header>
      <Footer />
    </div>
  );
}

export default App;

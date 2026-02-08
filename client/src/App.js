import { Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/views/NavBar/NavBar';
import Footer from './components/views/Footer/Footer';
import AnimeCard from './components/features/AnimeCard/AnimeCard';

function App() {
  return (
    <div>
      <NavBar />
      <header>
        <h1>
          Favorite Anime
          <AnimeCard>ggg</AnimeCard>
        </h1>
      </header>
      <Footer />
    </div>
  );
}

export default App;

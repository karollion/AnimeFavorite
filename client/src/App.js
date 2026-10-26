import { Routes, Route } from 'react-router-dom';
import NavBar from './components/views/NavBar/NavBar';
import Footer from './components/views/Footer/Footer';
// Import pages
import Home from './components/pages/Home/Home';
import Anime from './components/pages/Anime/Anime'
import AddAnime from './components/pages/AddAnime/AddAnime'
import WrongPage from './components/pages/WrongPage/WrongPage';
import Login from './components/pages/Login/Login';
import Logout from './components/pages/Logout/Logout';
import Signup from './components/pages/Signup/Signup';
import Profile from './components/pages/Profile/Profile';
import ProtectedRoute from './components/routing/ProtectedRoute';
import Character from './components/pages/Character/Character';
import Settings from './components/pages/Settings/Settings';
import ProfileEdit from './components/pages/ProfileEdit/ProfileEdit';
import EditAnime from './components/pages/EditAnime/EditAnime';
import AddCharacter from './components/pages/AddCharacter/AddCharacter';

import EditCharacter from './components/pages/EditCharacter/EditCharacter';
import MyAnimes from './components/pages/MyAnimes/MyAnimes';
import { useDispatch, useSelector } from 'react-redux'
import { getUser, fetchProfile } from './redux/reducers/userRedux'
import { useEffect, useRef } from 'react'
import syncLanguage from './i18n/syncLanguage'
import syncTheme from './theme/syncTheme'
import Search from './components/pages/Search/Search';
import './styles/ParallaxBackground.scss';

function App() {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    syncLanguage(user)
  }, [user])

  useEffect(() => {
    syncTheme(user)
  }, [user])

  const parallaxRef = useRef(null);
  
  useEffect(() => {
    const container = document.querySelector(
      '.parallax-background'
    );

    if (!container) return;

    const layers = Array.from(
      container.querySelectorAll('.parallax-layer')
    );

    let frameId = null;

    const updateParallax = () => {
      if (frameId !== null) return;

      frameId = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        layers.forEach((layer) => {
          const speed = Number(layer.dataset.speed) || 0;

          // Ograniczenie ruchu zapobiega odsłanianiu pustych obszarów.
          const offset = Math.min(scrollY * speed, 240);

          layer.style.transform =
            `translate3d(0, ${-offset}px, 0)`;
        });

        frameId = null;
      });
    };

    window.addEventListener('scroll', updateParallax, {
      passive: true,
    });

    updateParallax();

    return () => {
      window.removeEventListener('scroll', updateParallax);

      if (frameId !== null) {
        cancelAnimationFrame(frameId);
      }
    };
  }, []);
  
  return (
    <div className="app-shell">
      {/* Globalne tło — wspólne dla wszystkich podstron */}
      <div className="parallax-background">
        <div
          className="parallax-layer parallax-sky"
          data-speed="0.02"
        />

        <div
          className="parallax-layer parallax-mountains"
          data-speed="0.06"
        />

        <div
          className="parallax-layer parallax-clouds"
          data-speed="0.10"
        />

        <div
          className="parallax-layer parallax-foreground"
          data-speed="0.14"
        />
      </div>

      {/* Cała zawartość aplikacji znajduje się nad tłem */}
      <div className="app-content">
        <NavBar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/anime/:slug" element={<Anime />} />

            <Route path="/Signup" element={<Signup />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/Settings" element={<Settings />} />
            <Route path="/Search" element={<Search />} />

            <Route
              path="/Logout"
              element={
                <ProtectedRoute>
                  <Logout />
                </ProtectedRoute>
              }
            />

            <Route
              path="/Profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path="/MyAnimes"
              element={
                <ProtectedRoute>
                  <MyAnimes />
                </ProtectedRoute>
              }
            />

            <Route
              path="/ProfileEdit"
              element={
                <ProtectedRoute>
                  <ProfileEdit />
                </ProtectedRoute>
              }
            />

            <Route
              path="/anime/AddAnime"
              element={
                <ProtectedRoute role="admin">
                  <AddAnime />
                </ProtectedRoute>
              }
            />

            <Route
              path="/anime/EditAnime/:slug"
              element={
                <ProtectedRoute role="admin">
                  <EditAnime />
                </ProtectedRoute>
              }
            />

            <Route path="/character/:id" element={<Character />} />

            <Route
              path="/character/add"
              element={
                <ProtectedRoute role="admin">
                  <AddCharacter />
                </ProtectedRoute>
              }
            />

            <Route
              path="/character/:id/edit"
              element={
                <ProtectedRoute role="admin">
                  <EditCharacter />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<WrongPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default App;

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
import { fetchProfile } from './redux/reducers/userRedux';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchProfile())
  }, [dispatch])

  return (
    <div>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/anime/:slug' element={<Anime/>} />

          <Route path='/Signup' element={<Signup/>} />
          <Route path='/Login' element={<Login/>} />

          <Route
            path='/Logout'
            element={
              <ProtectedRoute>
                <Logout />
              </ProtectedRoute>
            }
          />

          <Route
            path='/Profile'
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path='/anime/AddAnime'
            element={
              <ProtectedRoute role="admin">
                <AddAnime />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<WrongPage/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

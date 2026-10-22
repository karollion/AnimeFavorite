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
import { useEffect } from 'react'
import syncLanguage from './i18n/syncLanguage'

function App() {
  const dispatch = useDispatch()
  const user = useSelector(getUser)

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

    useEffect(() => {
    syncLanguage(user)
  }, [user])

  return (
    <div>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path='/anime/:slug' element={<Anime/>} />

          <Route path='/Signup' element={<Signup/>} />
          <Route path='/Login' element={<Login/>} />

          <Route path='/Settings' element={<Settings/>} />

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
            path='/MyAnimes'
            element={
              <ProtectedRoute>
                <MyAnimes />
              </ProtectedRoute>
            }
          />

          <Route
            path='/ProfileEdit'
            element={
              <ProtectedRoute>
                <ProfileEdit />
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

          <Route
            path='/anime/EditAnime/:slug'
            element={
              <ProtectedRoute role="admin">
                <EditAnime />
              </ProtectedRoute>
            }
          />

          <Route path='/character/:id' element={<Character/>} />

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

          <Route path="*" element={<WrongPage/>} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;

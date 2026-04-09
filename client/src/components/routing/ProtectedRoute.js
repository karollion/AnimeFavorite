import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { getUser, getUserLoading } from '../../redux/reducers/userRedux'

/*
=====================================================
 PROTECTED ROUTE
 - blocks access when user not logged
 - optional role protection (admin etc.)
=====================================================
*/

const ProtectedRoute = ({ children, role }) => {
  const user = useSelector(getUser)
  const loading = useSelector(getUserLoading)

  // wait until profile loads
  if (loading) return <p>Loading...</p>

  // not logged
  if (!user) {
    return <Navigate to="/" replace />
  }

  // role protection (optional)
  if (role && user.role !== role) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
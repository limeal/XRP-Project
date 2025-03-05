import { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'

const PublicRoute = () => {
  const { user, isAuthenticated } = useContext(AuthContext)

  if (isAuthenticated) {
    return <Navigate to={`/profile/${user.id}`} />
  }

  return <Outlet />
}

export default PublicRoute

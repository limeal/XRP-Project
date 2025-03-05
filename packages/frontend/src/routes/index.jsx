import HomePage from '@pages/HomePage'
import Login from '@pages/Login'
import MonkeyPage from '@pages/MonkeyPage'
import ProfilePage from '@pages/ProfilePage'
import Register from '@pages/Register'
import { Route, Routes } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import PublicRoute from './PublicRoute'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/monkey/:id" element={<MonkeyPage />} />

      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/profile/:id" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes

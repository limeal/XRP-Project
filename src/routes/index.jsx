import HomePage from '@pages/HomePage'
import Login from '@pages/Login'
import MonkeyPage from '@pages/MonkeyPage'
import ProfilePage from '@pages/ProfilePage'
import Register from '@pages/Register'
import { Route, Routes } from 'react-router-dom'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/monkey/:id" element={<MonkeyPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
}

export default AppRoutes

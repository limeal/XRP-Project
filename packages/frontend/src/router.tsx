import { Route, Routes } from "react-router";
import Home from "./routes/home";

export default function Router() {
  return (
    <Routes>
      <Route index element={<Home />} />
    </Routes>
  )
}
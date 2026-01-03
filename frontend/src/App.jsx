import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import PrivateRoute from "./routes/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected */}
      <Route element={<PrivateRoute />}>
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
}

export default App;

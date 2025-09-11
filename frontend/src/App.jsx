import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./pages/Login";
import Signup from "./pages/Register";
import Inbox from "./pages/Inbox";
import Sent from "./pages/Sent";
import Trash from "./pages/Trash";
import Compose from "./pages/Compose";
import EmailDetail from "./pages/EmailDetail";

function ProtectedRoute({ children }) {
  const { token } = useContext(AuthContext);
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/sent" element={<Sent />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/compose" element={<Compose />} />
          <Route path="/emails/:id" element={<EmailDetail />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

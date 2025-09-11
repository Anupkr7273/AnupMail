import { useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to={token ? "/inbox" : "/"} className="flex items-center space-x-2">
            <div className="bg-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold">AnupMail</span>
          </Link>

          {token ? (
            <div className="flex items-center space-x-4">
              <Link 
                to="/inbox" 
                className={`px-3 py-2 rounded-md text-sm ${isActive('/inbox') ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
              >
                Inbox
              </Link>
              <Link 
                to="/sent" 
                className={`px-3 py-2 rounded-md text-sm ${isActive('/sent') ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
              >
                Sent
              </Link>
              <Link 
                to="/trash" 
                className={`px-3 py-2 rounded-md text-sm ${isActive('/trash') ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
              >
                Trash
              </Link>
              <Link 
                to="/compose" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md font-medium flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Compose
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link 
                to="/login" 
                className={`px-3 py-2 rounded-md text-sm ${isActive('/login') ? 'bg-blue-800' : 'hover:bg-blue-500'}`}
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
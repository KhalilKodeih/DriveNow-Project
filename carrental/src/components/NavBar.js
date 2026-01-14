// src/components/NavBar.js
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { User, LogOut } from "lucide-react";
import "./NavBar.css";

function NavBar() {
  const { user, logout, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar__logo">
        <Link to="/">DriveNow</Link>
      </div>
      <nav className="navbar__links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/services">Services</NavLink>
        <NavLink to="/cars">Cars</NavLink>
        <NavLink to="/contact">Contact</NavLink>
      </nav>
      <div className="navbar__auth">
        {isLoggedIn() ? (
          <div className="navbar__user">
            <span className="navbar__username">
              <User size={18} />
              {user?.name || user?.email}
            </span>
            <button onClick={handleLogout} className="navbar__logout-btn">
              <LogOut size={18} />
              Logout
            </button>
          </div>
        ) : (
          <div className="navbar__auth-links">
            <NavLink to="/login" className="navbar__login-btn">
              Login
            </NavLink>
            <NavLink to="/register" className="navbar__register-btn">
              Register
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}

export default NavBar;

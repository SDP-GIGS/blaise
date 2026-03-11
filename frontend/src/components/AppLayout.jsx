import { Link } from "react-router-dom";
import "../pages/login.css";

function AppLayout({ children }) {
  return (
    <div className="login-page">
      <div className="login-grid-pattern" />
      <div className="login-blob-left" />
      <div className="login-blob-right" />

      <div className="app-layout-shell">
        <header className="app-layout-header">
          <Link to="/student" className="app-layout-logo">
            <span className="app-layout-logo-mark">IL</span>
            <span className="app-layout-logo-text">Internship LES</span>
          </Link>
          <nav className="app-layout-nav">
            <Link to="/student" className="app-layout-nav-link">
              Dashboard
            </Link>
            <Link to="/login" className="app-layout-nav-link">
              Logout
            </Link>
          </nav>
        </header>

        <main className="app-layout-main">{children}</main>
      </div>
    </div>
  );
}

export default AppLayout;


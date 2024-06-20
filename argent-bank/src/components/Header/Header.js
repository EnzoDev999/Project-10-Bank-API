import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../slices/authSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import argentBankLogo from "../../assets/img/argentBankLogo.png";
import "./Header.css";

const Header = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="main-nav">
      <a className="main-nav-logo" href="/">
        <img
          className="main-nav-logo-image"
          src={argentBankLogo}
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </a>
      <div className="main-nav-items-container">
        <a className="main-nav-item" href="/user">
          <FontAwesomeIcon icon={faUserCircle} />
          {user.firstName} {user.lastName}
        </a>
        <a className="main-nav-item" href="/" onClick={handleLogout}>
          <FontAwesomeIcon icon={faSignOutAlt} />
          Sign Out
        </a>
      </div>
    </nav>
  );
};

export default Header;

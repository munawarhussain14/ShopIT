import React, { Fragment } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Search from "./Search";

import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";
import { logout } from "../../actions/userActions";

const Header = () => {
  const alert = useAlert();
  const dispatch = useDispatch();

  const { user, loading } = useSelector((state) => state.auth);

  const logoutHandler = () => {
    dispatch(logout());
    alert.alerts("Logged out Successfully");
  };

  return (
    <Fragment>
      <nav className="navbar row">
        <div className="col-12 col-md-3">
          <div className="navbar-brand">
            <img src="../images/logo.png" />
          </div>
        </div>

        <div className="col-12 col-md-6 mt-2 mt-md-0">{<Search />}</div>

        <div className="col-12 col-md-3 mt-4 mt-md-0 text-center">
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <span id="cart" className="ml-3">
              Cart
            </span>
            <span className="ml-1" id="cart_count">
              2
            </span>
          </Link>
          &nbsp;
          {user ? (
            <div className="ml-4 dropdown d-inline">
              <Link
                to="!#"
                className="btn dropdown-toggle text-white"
                type="button"
                id="dropDownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <span>{user && user.name}</span>
              </Link>
              <div
                className="dropdown-menu"
                aria-labelledby="dropDownMenuButton"
              >
                {user && user.role !== "admin" && (
                  <Link className="dropdown-item text-danger" to="/dashboard">
                    Dashboard
                  </Link>
                )}
                <Link className="dropdown-item text-danger" to="/me">
                  Profile
                </Link>
                <Link
                  className="dropdown-item text-danger"
                  to="/"
                  onClick={logoutHandler}
                >
                  Logout
                </Link>
              </div>
            </div>
          ) : (
            !loading && (
              <Link to="/login" className="btn" id="login_btn">
                Login
              </Link>
            )
          )}
        </div>
      </nav>
    </Fragment>
  );
};

export default Header;

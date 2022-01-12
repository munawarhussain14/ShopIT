import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Switch,
  Route,
} from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import ProductDetails from "./components/product/ProductDetails";
import Login from "./components/user/Login";
import Register from "./components/user/Register";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import Profile from "./components/user/Profile";
import ProtectedRoute from "./components/route/ProtectedRoute";

import { loadUser } from "./actions/userActions";
import store from "./store";

function App() {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <div className="container container-fluid">
          <Routes>
            <Route path="/" element={<Home />} exact />
            <Route path="/search/:keyword" element={<Home />} exact />
            <Route path="/product/:id" element={<ProductDetails />} exact />
            <Route path="/login" element={<Login />} exact />
            <Route path="/register" element={<Register />} exact />
            <Route
              path="/me"
              element={<ProtectedRoute component={<Profile />} />}
              exact
            />
            {/* <Route
              path="/dashboard"
              element={
                <ProtectedRoute isAdmin={true} component={<Dashboard />} />
              }
              exact
            /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;

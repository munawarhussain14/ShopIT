import React, { Fragment } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ isAdmin, component }) => {
  const { isAuthenticated, loading, user } = useSelector((state) => state.auth);
  //loading === false && user ? component : <Navigate to="/login" />
  return (
    <Fragment>
      {loading === false && (
        <Route
          {...rest}
          render={(props) => {
            if (isAuthenticated === false) {
              return <Navigate to="/login" />;
            }

            if (isAdmin === true && user.role !== "admin") {
              return <Navigate to="/" />;
            }

            return <Component {...props} />;
          }}
        />
      )}
    </Fragment>
  );
};

// const ProtectedRoute = ({ isAdmin, component: Component, ...rest }) => {
//   const { isAuthenticated, loading, user } = useSelector((state) => state.auth);

//   return (
//     <Fragment>
//       {loading === false && (
//         <Route
//           {...rest}
//           render={(props) => {
//             if (isAuthenticated === false) {
//               return <Navigate to="/login" />;
//             }

//             if (isAdmin === true && user.role !== "admin") {
//               return <Navigate to="/" />;
//             }

//             return <Component {...props} />;
//           }}
//         />
//       )}
//     </Fragment>
//   );
// };

export default ProtectedRoute;

// import { Navigate, Outlet } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';

// const ProtectedRoute = ({ role: requiredRole }) => {
//   const token = localStorage.getItem('jwt');
//   const userRaw = localStorage.getItem('user');

//   if (!token || !userRaw) {
//     return <Navigate to="/" replace />;
//   }

//   let user;
//   try {
//     user = JSON.parse(userRaw);
//     if (!user || typeof user !== 'object' || !user.role) {
//       throw new Error('Invalid user');
//     }

//     const decoded = jwtDecode(token);
//     if (decoded.exp < Date.now() / 1000) {
//       throw new Error('Token expired');
//     }

//     const userRole = user.role;
//     const userDesignation = user.designation;

//     // Staff-based access
//     if (requiredRole === 'STAFF') {
//     const allowedDesignations = ['Receptionist', 'Head Nurse', 'Pathologist'];
//       if (userRole === 'STAFF' && allowedDesignations.includes(userDesignation)) {
//         return <Outlet />;
//       }
//     }

//     if (requiredRole === 'INVENTORY_MANAGER') {
//       if (userRole === 'STAFF' && userDesignation === 'Inventory Manager') {
//         return <Outlet />;
//       }
//     }

//     if (userRole === requiredRole) return <Outlet />;

//     return <Navigate to="/" replace />;
//   } catch (error) {
//     console.error("Auth error:", error.message);
//     localStorage.removeItem('jwt');
//     localStorage.removeItem('user');
//     return <Navigate to="/" replace />;
//   }
// };


// export default ProtectedRoute;


import { Navigate, Outlet } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ role: requiredRole }) => {
  const token = localStorage.getItem('jwt');
  const userRaw = localStorage.getItem('user');

  if (!token || !userRaw) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userRaw);

    if (!user || !user.role) {
      throw new Error("Invalid user");
    }

    const decoded = jwtDecode(token);

    if (decoded.exp * 1000 < Date.now()) {
      localStorage.clear();
      return <Navigate to="/" replace />;
    }

    const userRole = user.role;
    const designation = user.designation;

    // ✅ STAFF (Receptionist, Nurse)

//     if (requiredRole === "STAFF") {
//   if (user.role === "STAFF" && user.designation === "Receptionist") {
//     return <Outlet />;
//   }
//   return <Navigate to="/" />;
// }


if (requiredRole === "STAFF") {

  const allowedDesignations = [
    "Receptionist",
    "Metron",
    "O.T. Attendant",
    "Sonography Assist",
    "Pharmacists",
    "Pathologist"

  ];

  if (
    user.role === "STAFF" &&
    allowedDesignations.includes(user.designation)
  ) {
    return <Outlet />;
  }

  return <Navigate to="/" replace />;
}
    // if (requiredRole === "STAFF") {
    //   const allowed = ["Receptionist", "Head Nurse"];

    //   if (userRole === "STAFF" && allowed.includes(designation)) {
    //     return <Outlet />;
    //   }

    //   return <Navigate to="/" replace />;
    // }

    // ✅ INVENTORY MANAGER
    if (requiredRole === "INVENTORY_MANAGER") {
      if (userRole === "STAFF" && designation === "Inventory Manager") {
        return <Outlet />;
      }
      return <Navigate to="/" replace />;
    }

    // ✅ ADMIN / DOCTOR
    if (userRole === requiredRole) {
      return <Outlet />;
    }

    return <Navigate to="/" replace />;

  } catch (err) {
    console.error("Auth error:", err.message);
    localStorage.clear();
    return <Navigate to="/" replace />;
  }
};

export default ProtectedRoute;
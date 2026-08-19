import {
  Navigate,
  useLocation,
} from 'react-router-dom';

const AdminRoute = ({ children }) => {
  const location = useLocation();

  // =====================================================
  // GET USER INFO
  // =====================================================

  const userInfo =
    localStorage.getItem(
      'userInfo'
    );

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!userInfo) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{
          from:
            location.pathname,
        }}
      />
    );
  }

  // =====================================================
  // PARSE USER
  // =====================================================

  let authData = null;

  try {

    authData =
      JSON.parse(userInfo);

  } catch (error) {

    console.error(
      'Invalid authentication data:',
      error
    );

    localStorage.removeItem(
      'userInfo'
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'adminToken'
    );

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // =====================================================
  // CURRENT STANDARD FORMAT
  //
  // {
  //   _id,
  //   name,
  //   email,
  //   role,
  //   token
  // }
  // =====================================================

  const user =
    authData?.user ||
    authData;

  // =====================================================
  // USER CHECK
  // =====================================================

  if (!user) {

    localStorage.removeItem(
      'userInfo'
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'adminToken'
    );

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // =====================================================
  // TOKEN CHECK
  // =====================================================

  const token =
    authData?.token ||
    localStorage.getItem(
      'token'
    );

  if (!token) {

    localStorage.removeItem(
      'userInfo'
    );

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'adminToken'
    );

    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );
  }

  // =====================================================
  // ADMIN ONLY
  // =====================================================

  if (
    user.role !== 'admin'
  ) {

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // =====================================================
  // AUTHORIZED
  // =====================================================

  return children;
};

export default AdminRoute;
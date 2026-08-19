import {
  useEffect,
  useState,
} from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';


// ======================================================
// PROFILE PAGE
// ======================================================

const Profile = () => {

  const navigate =
    useNavigate();


  // ====================================================
  // STATE
  // ====================================================

  const [
    user,
    setUser,
  ] = useState(null);


  const [
    loading,
    setLoading,
  ] = useState(true);


  // ====================================================
  // LOAD USER
  // ====================================================

  useEffect(() => {

    try {

      const userInfo =
        localStorage.getItem(
          'userInfo'
        );


      if (!userInfo) {

        navigate('/login');

        return;

      }


      const parsedUser =
        JSON.parse(
          userInfo
        );


      setUser(
        parsedUser
      );

    } catch (error) {

      console.error(
        'Profile load error:',
        error
      );

      localStorage.removeItem(
        'userInfo'
      );

      navigate('/login');

    } finally {

      setLoading(false);

    }

  }, [navigate]);


  // ====================================================
  // LOGOUT
  // ====================================================

  const handleLogout = () => {

    localStorage.removeItem(
      'userInfo'
    );

    localStorage.removeItem(
      'token'
    );


    navigate('/login');

    window.location.reload();

  };


  // ====================================================
  // LOADING
  // ====================================================

  if (loading) {

    return (

      <div
        className="
          min-h-screen
          bg-slate-50
          flex
          items-center
          justify-center
        "
      >

        <div
          className="
            text-sm
            text-slate-500
          "
        >

          Loading profile...

        </div>

      </div>

    );

  }


  // ====================================================
  // USER NOT FOUND
  // ====================================================

  if (!user) {

    return null;

  }


  // ====================================================
  // USER DATA
  // ====================================================

  const userName =
    user.name ||
    user.username ||
    'User';


  const userEmail =
    user.email ||
    '';


  const userRole =
    user.role ||
    'customer';


  const userPhone =
    user.phone ||
    user.mobile ||
    'Not added';


  const initials =
    userName
      .split(' ')
      .map(
        (word) =>
          word[0]
      )
      .join('')
      .slice(0, 2)
      .toUpperCase();


  // ====================================================
  // UI
  // ====================================================

  return (

    <div
      className="
        min-h-screen
        bg-slate-50
        py-8
        sm:py-10
      "
    >

      <div
        className="
          max-w-5xl
          mx-auto
          px-4
        "
      >

        {/* ==================================================
            PAGE HEADER
        ================================================== */}

        <div
          className="
            mb-6
          "
        >

          <h1
            className="
              text-2xl
              sm:text-3xl
              font-extrabold
              text-slate-900
            "
          >

            My Profile

          </h1>


          <p
            className="
              mt-1
              text-sm
              text-slate-500
            "
          >

            Manage your account and
            shopping activities.

          </p>

        </div>


        {/* ==================================================
            PROFILE CARD
        ================================================== */}

        <div
          className="
            bg-white
            rounded-2xl
            border
            border-slate-200
            shadow-sm
            overflow-hidden
          "
        >

          {/* ==================================================
              PROFILE HEADER
          ================================================== */}

          <div
            className="
              bg-slate-900
              px-5
              py-7
              sm:px-8
            "
          >

            <div
              className="
                flex
                items-center
                gap-4
              "
            >

              {/* AVATAR */}

              <div
                className="
                  w-16
                  h-16
                  sm:w-20
                  sm:h-20
                  rounded-full
                  bg-teal-500
                  text-white
                  flex
                  items-center
                  justify-center
                  text-xl
                  sm:text-2xl
                  font-extrabold
                  shrink-0
                "
              >

                {initials}

              </div>


              {/* USER INFO */}

              <div>

                <h2
                  className="
                    text-xl
                    sm:text-2xl
                    font-bold
                    text-white
                  "
                >

                  {userName}

                </h2>


                <p
                  className="
                    mt-1
                    text-sm
                    text-slate-300
                  "
                >

                  {userEmail}

                </p>


                <span
                  className="
                    inline-flex
                    mt-2
                    px-3
                    py-1
                    rounded-full
                    bg-white/10
                    text-xs
                    font-semibold
                    text-teal-300
                    capitalize
                  "
                >

                  {userRole}

                </span>

              </div>

            </div>

          </div>


          {/* ==================================================
              ACCOUNT INFORMATION
          ================================================== */}

          <div
            className="
              p-5
              sm:p-8
            "
          >

            <h3
              className="
                text-lg
                font-bold
                text-slate-900
              "
            >

              Account Information

            </h3>


            <div
              className="
                mt-5
                grid
                grid-cols-1
                sm:grid-cols-2
                gap-4
              "
            >

              {/* NAME */}

              <div
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                    uppercase
                  "
                >

                  Name

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >

                  {userName}

                </p>

              </div>


              {/* EMAIL */}

              <div
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                    uppercase
                  "
                >

                  Email

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-slate-800
                    break-all
                  "
                >

                  {userEmail}

                </p>

              </div>


              {/* PHONE */}

              <div
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                    uppercase
                  "
                >

                  Phone

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-slate-800
                  "
                >

                  {userPhone}

                </p>

              </div>


              {/* ROLE */}

              <div
                className="
                  p-4
                  rounded-xl
                  bg-slate-50
                  border
                  border-slate-200
                "
              >

                <p
                  className="
                    text-xs
                    font-semibold
                    text-slate-400
                    uppercase
                  "
                >

                  Account Type

                </p>


                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-slate-800
                    capitalize
                  "
                >

                  {userRole}

                </p>

              </div>

            </div>


            {/* ==================================================
                QUICK ACTIONS
            ================================================== */}

            <div
              className="
                mt-8
              "
            >

              <h3
                className="
                  text-lg
                  font-bold
                  text-slate-900
                "
              >

                Quick Actions

              </h3>


              <div
                className="
                  mt-4
                  grid
                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-4
                  gap-3
                "
              >

                {/* ORDERS */}

                <Link
                  to="/orders"
                  className="
                    p-4
                    rounded-xl
                    border
                    border-slate-200
                    hover:border-teal-400
                    hover:bg-teal-50
                    transition
                  "
                >

                  <div
                    className="
                      text-xl
                    "
                  >

                    📦

                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >

                    My Orders

                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >

                    View your orders

                  </p>

                </Link>


                {/* RFQ */}

                <Link
                  to="/my-rfqs"
                  className="
                    p-4
                    rounded-xl
                    border
                    border-slate-200
                    hover:border-teal-400
                    hover:bg-teal-50
                    transition
                  "
                >

                  <div
                    className="
                      text-xl
                    "
                  >

                    📝

                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >

                    My RFQs

                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >

                    View quotation requests

                  </p>

                </Link>


                {/* QUOTATIONS */}

                <Link
                  to="/my-quotations"
                  className="
                    p-4
                    rounded-xl
                    border
                    border-slate-200
                    hover:border-teal-400
                    hover:bg-teal-50
                    transition
                  "
                >

                  <div
                    className="
                      text-xl
                    "
                  >

                    💰

                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >

                    Quotations

                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >

                    View received quotations

                  </p>

                </Link>


                {/* WISHLIST */}

                <Link
                  to="/wishlist"
                  className="
                    p-4
                    rounded-xl
                    border
                    border-slate-200
                    hover:border-teal-400
                    hover:bg-teal-50
                    transition
                  "
                >

                  <div
                    className="
                      text-xl
                    "
                  >

                    ❤️

                  </div>


                  <p
                    className="
                      mt-2
                      text-sm
                      font-bold
                      text-slate-800
                    "
                  >

                    Wishlist

                  </p>


                  <p
                    className="
                      mt-1
                      text-xs
                      text-slate-500
                    "
                  >

                    Saved products

                  </p>

                </Link>

              </div>

            </div>


            {/* ==================================================
                LOGOUT
            ================================================== */}

            <div
              className="
                mt-8
                pt-6
                border-t
                border-slate-200
              "
            >

              <button
                type="button"
                onClick={
                  handleLogout
                }
                className="
                  w-full
                  sm:w-auto
                  px-6
                  py-3
                  rounded-xl
                  bg-red-50
                  border
                  border-red-200
                  text-red-600
                  text-sm
                  font-bold
                  hover:bg-red-100
                  transition
                "
              >

                Logout

              </button>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

};


export default Profile;
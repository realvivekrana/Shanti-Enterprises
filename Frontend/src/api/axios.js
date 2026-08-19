import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// ======================================================
// ATTACH AUTH TOKEN
// ======================================================

API.interceptors.request.use(
  (config) => {

    const userInfo =
      localStorage.getItem('userInfo');

    if (userInfo) {

      try {

        const user =
          JSON.parse(userInfo);

        if (user?.token) {

          config.headers.Authorization =
            `Bearer ${user.token}`;

        }

      } catch (error) {

        console.error(
          'Invalid userInfo in localStorage:',
          error
        );

      }

    }

    return config;

  },
  (error) => {

    return Promise.reject(error);

  }
);


// ======================================================
// RESPONSE INTERCEPTOR
// ======================================================

API.interceptors.response.use(

  (response) => {

    const responseData =
      response.data;


    // ==================================================
    // UNWRAP STANDARD API RESPONSE
    // ==================================================
    //
    // Backend response:
    //
    // {
    //   success: true,
    //   data: [...]
    // }
    //
    // Frontend ko directly:
    //
    // [...]
    //
    // chahiye.
    //

    if (
      responseData &&
      typeof responseData === 'object' &&
      !Array.isArray(responseData) &&
      Object.prototype.hasOwnProperty.call(
        responseData,
        'success'
      ) &&
      Object.prototype.hasOwnProperty.call(
        responseData,
        'data'
      )
    ) {

      response.data =
        responseData.data;

    }

    return response;

  },


  // ==================================================
  // RESPONSE ERROR
  // ==================================================

  (error) => {

    if (
      error.response?.status === 401
    ) {

      console.warn(
        'Unauthorized request.'
      );

    }

    return Promise.reject(
      error
    );

  }

);


export default API;
import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { RootState } from '~/store';

export default defineNuxtPlugin(({ $axios, store }) => {
  const state = (store.state as RootState).auth;

  // attach Authorization header to request
  $axios.onRequest((config) => {
    if (state.accessToken) {
      config.headers.Authorization = 'Bearer ' + state.accessToken;
    }

    return config;
  });

  $axios.onError((error) => {
    return new Promise((resolve, reject) => {
      const ignorePath = !!error.config.url?.match(/^\/auth\//);
      const statusCode = error.response ? error.response.status : -1;

      // handle auth error
      if (statusCode === 401 && !ignorePath) {
        // check message if present
        const message = error.response?.data ? error.response.data.message : '';

        const refreshToken = state.refreshToken;

        if (message === 'TOKEN_EXPIRED' && refreshToken) {
          // consider refresh process failed if 2nd attempt
          if ('retryAttempts' in error.config) {
            store.dispatch('auth/logout');
          } else {
            // add retryAttempts property to prevent infinite loop
            const config = { ...error.config, retryAttempts: 1 };

            store
              .dispatch('auth/refresh')
              .then(() => {
                // re-run request
                return resolve($axios(config));
              })
              .catch(() => {
                store.dispatch('auth/logout');
              });
          }
        } else if (message === 'TOKEN_INVALID') {
          store.dispatch('auth/logout');
        }
      }

      // return error if it made it here
      return reject(error);
    });
  });
});

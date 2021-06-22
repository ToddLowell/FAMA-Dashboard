import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import createPersistedState from 'vuex-persistedstate';
import * as Cookies from 'js-cookie';
import cookie from 'cookie';

// access Nuxt Context, https://nuxtjs.org/api/context
export default defineNuxtPlugin(({ store, req, isDev }) => {
  createPersistedState({
    key: 'authentication-cookie',
    paths: ['auth.username', 'auth.refreshToken'],
    storage: {
      // if on the browser, parse the cookies using js-cookie otherwise parse from the raw http request
      getItem: (key) =>
        process.client
          ? Cookies.get(key)
          : cookie.parse(req.headers.cookie || '')[key],

      // set client/server-side cookies with js-cookie
      // use isDev to determine if the cookies is accessible via https only (i.e. localhost likely won't be using https)
      setItem: (key, value) =>
        Cookies.set(key, value, { expires: 7, secure: !isDev }),

      // remove cookies with js-cookie
      removeItem: (key) => Cookies.remove(key),
    },
  })(store);
});

import { defineNuxtMiddleware } from '@nuxtjs/composition-api';

export default defineNuxtMiddleware(({ store, redirect, route }) => {
  // eslint-disable-next-line no-console
  console.log('Guarding Route...', route.fullPath);

  // if the user is not authenticated redirect
  if (!store.getters['auth/isAuthenticated'] && route.path !== '/') {
    return redirect('/');
  }
});

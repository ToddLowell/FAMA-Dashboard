import { GetterTree, ActionTree, MutationTree } from 'vuex';
import { AuthState } from './auth';

export const state = () => ({
  dashboardTitle: '',
});

export type RootState = ReturnType<typeof state> & { auth: AuthState };

export const getters: GetterTree<RootState, RootState> = {};

export const mutations: MutationTree<RootState> = {
  setDashboardTitle(state, title: string) {
    state.dashboardTitle = title;
  },
};

export const actions: ActionTree<RootState, RootState> = {
  // automatically refresh the access token on the initial request to the server, if possible
  // https://nuxtjs.org/guide/vuex-store/#the-nuxtserverinit-action
  async nuxtServerInit({ dispatch, state }) {
    const { refreshToken } = state.auth;

    if (refreshToken) {
      try {
        // refresh access token
        await dispatch('auth/refresh');
      } catch (e) {
        // catch any errors and logout the user
        await dispatch('auth/logout');
      }
    }
  },
};

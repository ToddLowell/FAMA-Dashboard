import { GetterTree, ActionTree, MutationTree } from 'vuex';
import * as Cookies from 'js-cookie';
import { RootState } from './index';

interface StringValues {
  [key: string]: string;
}

let refreshInterval: ReturnType<typeof setInterval>;

// -> state.auth
export const state = () => ({
  accessToken: '',
  refreshToken: '',
  username: '',
  admin: 0,
});

export type AuthState = ReturnType<typeof state>;

// -> getters['auth/isAuthenticated']
export const getters: GetterTree<AuthState, RootState> = {
  isAuthenticated({ accessToken }) {
    return !!accessToken;
  },
};

// -> dispatch('auth/login')
export const actions: ActionTree<AuthState, RootState> = {
  async login({ commit, dispatch }, { username, userPassword }) {
    try {
      const res = await this.$axios.post('/auth/login', {
        username,
        userPassword,
      });

      const {
        accessToken,
        refreshToken,
        username: name,
        admin,
        message,
      } = res.data;

      commit('setUser', { username: name, admin });
      commit('setToken', { accessToken, refreshToken });

      this.$router.replace('/dashboard/headquarter');

      refreshInterval = setInterval(() => {
        dispatch('refresh');
      }, 3000000); // every 50 mins

      return message;
    } catch (e) {
      // ! for dev server
      if (process.env.NODE_ENV === 'development') {
        const {
          accessToken,
          refreshToken,
          username: name,
          admin,
          message,
        } = e.response.data;

        commit('setUser', { username: name, admin });
        commit('setToken', { accessToken, refreshToken });

        if (accessToken) {
          this.$router.replace('/dashboard/headquarter');

          refreshInterval = setInterval(() => {
            dispatch('refresh');
          }, 3000000); // every 50 mins
        }

        return message;
      }
    }
  },

  async refresh({ state, commit, dispatch }) {
    const { refreshToken } = state;

    // eslint-disable-next-line
    console.log('Refreshing Token...')

    try {
      const res = await this.$axios.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken } = res.data;

      commit('setToken', { accessToken });

      // start interval here if came from store/nuxtServerInit
      if (refreshInterval) {
        refreshInterval = setInterval(() => {
          dispatch('refresh');
        }, 3000000); // every 50 mins
      }
    } catch (e) {
      dispatch('logout');
    }
  },

  logout({ commit }) {
    commit('logout');
    clearInterval(refreshInterval);
    Cookies.remove('authentication-cookie');
    this.$router.push('/');
  },
};

// -> commit('auth/login')
export const mutations: MutationTree<AuthState> = {
  setUser(state, { username, admin }: StringValues) {
    state.username = username;
    state.admin = +admin;
  },

  setToken(state, { accessToken = '', refreshToken = '' }: StringValues) {
    if (accessToken) {
      state.accessToken = accessToken;
    }

    if (refreshToken) {
      state.refreshToken = refreshToken;
    }
  },

  logout(state) {
    state.accessToken = '';
    state.refreshToken = '';
    state.username = '';
  },
};

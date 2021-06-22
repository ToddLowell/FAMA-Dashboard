<template>
  <div class="container">
    <form class="login fade-in" @submit.prevent="authenticate">
      <div class="header">
        <img src="~/assets/fama_logo.png" class="logo center" alt="FAMA logo" />
        <h1>DASHBOARD ANALITIK PETUNJUK PRESTASI</h1>
      </div>
      <div class="content spacer">
        <h2>Login Here</h2>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <p class="error" v-html="errorMessage" />
        <input
          v-model="username"
          type="text"
          placeholder="Username"
          @input="errorMessage = '&nbsp;'"
        />
        <input
          v-model="userPassword"
          type="password"
          placeholder="Password"
          @input="errorMessage = '&nbsp;'"
        />
        <button class="rel">
          <span :style="loading ? 'color: transparent' : 'color: currentColor'"
            >Login</span
          >
          <div v-if="loading" class="loader-container">
            <div class="loader" />
          </div>
        </button>
        <hr />
        <span>Forgot Password?</span>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  useRouter,
  useStore,
} from '@nuxtjs/composition-api';
import { RootState } from '~/store';

export default defineComponent({
  setup() {
    const username = ref('');
    const userPassword = ref('');
    const errorMessage = ref('&nbsp;');
    const loading = ref(false);
    const router = useRouter();
    const store = useStore<RootState>();

    if (store.getters['auth/isAuthenticated']) {
      router.replace('/dashboard/headquarter');
    }

    onMounted(() => {
      // add unique background
      document.querySelector('body')!.classList.add('loginBg');
    });

    onUnmounted(() => {
      // remove unique background
      document.querySelector('body')!.classList.remove('loginBg');
    });

    const authenticate = async () => {
      loading.value = true;

      const message = await store.dispatch('auth/login', {
        username: username.value,
        userPassword: userPassword.value,
      });

      errorMessage.value = message;
      loading.value = false;
    };

    return {
      username,
      userPassword,
      errorMessage,
      loading,
      authenticate,
    };
  },
});
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .header {
    color: var(--clr-secondary-400);
    line-height: 1;

    h1 {
      margin-top: var(--spacer);
    }
  }

  .content {
    color: var(--clr-primary-400);

    h2 {
      line-height: 1;
    }
  }

  .error {
    color: red;
  }
}

.bg-primary-400 {
  background-color: var(--clr-primary-400);
}

// loader
.loader-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.loader {
  height: 100%;
  display: grid;
  place-items: center;
}

.loader::after {
  content: ' ';
  display: block;
  width: 1.5em;
  height: 1.5em;
  border-radius: 50%;
  border: 4px solid #fff;
  border-color: #fff transparent #fff transparent;
  animation: loading-spinner 1.2s linear infinite;
}

@keyframes loading-spinner {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

import Vue from 'vue';
import { NuxtAxiosInstance } from '@nuxtjs/axios';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue {
    $axios: NuxtAxiosInstance;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $axios: NuxtAxiosInstance;
  }

  interface NuxtAppOptions {
    $axios: NuxtAxiosInstance;
  }
}

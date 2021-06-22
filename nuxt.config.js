export default {
  head: {
    title: 'FAMA Dashboard',
    htmlAttrs: {
      lang: 'ms',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: 'FAMA Admin Dashboard',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/metrics/favicon.svg' },
    ],
    script: [
      {
        // Google Maps API
        src: `https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_MAP_KEY}&libraries=visualization`,
      },
    ],
  },

  css: ['~/assets/scss/style.scss'],

  plugins: [
    '~/plugins/click-outside-directive.js',
    '~/plugins/local-storage.ts',
    '~/plugins/axios.ts',
  ],

  buildModules: ['@nuxt/typescript-build', '@nuxtjs/composition-api/module'],

  modules: ['@nuxtjs/axios'],

  axios: {
    baseURL:
      process.env.NODE_ENV !== 'production'
        ? 'http://localhost:3000/metrics/api'
        : 'http://epemasar.myonecorp.info/metrics/api',
  },

  router: {
    base: '/metrics',
    middleware: 'authenticated',
  },

  serverMiddleware: [
    {
      path: '/api',
      handler: '~/api/app.ts',
    },
  ],

  // build: {
  //   analyze: {
  //     analyzerMode: 'static',
  //   },
  // },
};

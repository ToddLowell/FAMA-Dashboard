<template>
  <div class="dashboard">
    <BGChanger />
    <header class="header">
      <div class="links">
        <NuxtLink to="/dashboard/headquarter" class="link">
          <BuildingIcon fill="currentColor" class="icon" />
          <div class="link-label">HQ</div>
        </NuxtLink>
        <NuxtLink to="/dashboard/industry" class="link">
          <ShopIcon fill="currentColor" class="icon" />
          <div class="link-label">PIM</div>
        </NuxtLink>
        <NuxtLink to="/dashboard/digital" class="link">
          <PlaceIcon fill="currentColor" class="icon" />
          <div class="link-label">PD</div>
        </NuxtLink>
        <NuxtLink to="/dashboard/operation" class="link">
          <OperationsIcon fill="currentColor" class="icon" />
          <div class="link-label">PO</div>
        </NuxtLink>
        <NuxtLink v-if="admin" to="/dashboard/admin" class="link">
          <AdminIcon fill="currentColor" class="icon" />
          <div class="link-label">ADMIN</div>
        </NuxtLink>
      </div>
      <div class="title">
        <h1>DASHBOARD PETUNJUK PRESTASI</h1>
        <h2>{{ title }}</h2>
      </div>
      <div class="details">
        <button @click="logout">
          <PowerIcon fill="red" class="icon" />
        </button>
        <div ref="datetime"></div>
        <div>{{ username }}</div>
      </div>
    </header>
    <Nuxt />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  computed,
  onMounted,
  onUnmounted,
  useStore,
} from '@nuxtjs/composition-api';
import PowerIcon from '../components/icons/power.vue';
import BuildingIcon from '../components/icons/building.vue';
import PlaceIcon from '../components/icons/place.vue';
import OperationsIcon from '../components/icons/operations.vue';
import ShopIcon from '../components/icons/shop.vue';
import AdminIcon from '../components/icons/admin.vue';
import BGChanger from '../components/BGChanger.vue';
import { RootState } from '~/store';

export default defineComponent({
  name: 'Dashboard',
  components: {
    PowerIcon,
    BuildingIcon,
    PlaceIcon,
    OperationsIcon,
    ShopIcon,
    AdminIcon,
    BGChanger,
  },
  setup() {
    const datetime = ref<HTMLElement | null>(null);
    let timeoutHandler: ReturnType<typeof setTimeout>;
    const store = useStore<RootState>();
    const username = computed(() => store.state.auth.username);
    const admin = computed(() => store.state.auth.admin);
    const title = computed(() => store.state.dashboardTitle);

    onMounted(() => {
      (() => {
        const checkTime = (i: number) => {
          return i < 10 ? '0' + i : i;
        };

        const startTime = () => {
          const now = new Date();
          const date = `${now.getDate()}-${
            now.getMonth() + 1
          }-${now.getFullYear()}`;
          const h = checkTime(now.getHours());
          const m = checkTime(now.getMinutes());
          const s = checkTime(now.getSeconds());
          const time = `${h}:${m}:${s}`;
          datetime.value!.innerHTML = `${date} | ${time}`;

          timeoutHandler = setTimeout(function () {
            startTime();
          }, 500);
        };

        startTime();
      })();
    });

    onUnmounted(() => {
      clearTimeout(timeoutHandler);
    });

    return {
      datetime,
      username,
      admin,
      title,
    };
  },
  methods: {
    logout(e: Event) {
      e.preventDefault();
      this.$store.dispatch('auth/logout');
    },
  },
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/mixins' as *;

.header {
  padding: 0 0 var(--spacer);
  display: flex;
  justify-content: space-between;
  text-align: center;

  .links {
    display: flex;
    flex: 25%;

    a {
      text-decoration: none;
      color: inherit;
      font-weight: 700;
      font-size: 1.8rem;
    }

    > .link + .link {
      margin-left: 1.5rem;
    }

    .link-label {
      transform: translateY(-25%);
    }
  }

  .title {
    flex: 50%;

    @include mq(phone) {
      display: none;
    }

    h1 {
      @include mq(tab-port) {
        display: none;
      }
    }
  }

  .details {
    text-align: right;
    font-weight: 500;
    flex: 25%;

    button {
      padding: 0.5rem;
      border: none;
      background: transparent;
      border-radius: 50%;
      transition: all 0.2s;

      &:hover {
        background: darkgray;
      }
    }
  }
}

.dashboard {
  // height: 100vh;
  min-height: 100vh;
  padding: var(--spacer);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  // - honestly don't know why this works but it fixes the min-height: 100vh
  &:first-child {
    height: 10vh;
  }
}
</style>

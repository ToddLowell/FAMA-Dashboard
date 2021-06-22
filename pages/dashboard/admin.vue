<template>
  <h1>Hello</h1>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  useContext,
} from '@nuxtjs/composition-api';

export default defineComponent({
  layout: 'dashboard',
  setup() {
    onMounted(() => {
      const ctx = useContext();

      // set Dashboard Title
      ctx.store.commit('setDashboardTitle', 'IBU PEJABAT FAMA');
    });
  },
});
</script>

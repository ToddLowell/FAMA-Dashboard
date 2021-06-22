<template>
  <SliderFrame>
    <div slot-scope="{ next, prev }" class="slider">
      <div class="rel fill">
        <slot />
      </div>

      <div class="split slider-controls">
        <button @click="prev">&larr;</button>
        <button @click="next">&rarr;</button>
      </div>
    </div>
  </SliderFrame>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api';
import SliderFrame from './SliderFrame.vue';

export default defineComponent({
  components: {
    SliderFrame,
  },
});
</script>

<style lang="scss" scoped>
.slider {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
}

.slider-controls {
  button {
    font-size: 3em;
    color: var(--clr-neutral-100);
    background: transparent;
    border: none;
    transition: all 0.2s ease;

    &:hover {
      color: var(--clr-neutral-300);
    }
  }
}
</style>

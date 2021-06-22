<template>
  <div class="data-handler-container">
    <slot />
    <div class="data-picker">
      <button
        v-for="(month, index) in Object.keys(chartData)"
        :key="index"
        :class="{ active: activeIndex === index }"
        @click="$emit('change-data', month)"
      >
        {{ month }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, computed } from '@nuxtjs/composition-api';

type MonthOfTheYear =
  | 'Jan'
  | 'Feb'
  | 'Mar'
  | 'Apr'
  | 'May'
  | 'Jun'
  | 'Jul'
  | 'Aug'
  | 'Sep'
  | 'Aug'
  | 'Nov'
  | 'Dec';

export default defineComponent({
  props: {
    chartData: {
      type: Object as PropType<{ [month in MonthOfTheYear]?: [] }>,
      // - alternative typing
      // type: Object as PropType<Partial<Record<MonthOfTheYear, []>>>,
      required: true,
    },
    selectedMonth: {
      type: String as PropType<MonthOfTheYear>,
      required: true,
    },
  },
  setup(props) {
    const activeIndex = computed(() =>
      Object.keys(props.chartData).indexOf(props.selectedMonth)
    );

    return {
      activeIndex,
    };
  },
});
</script>

<style lang="scss" scoped>
.data-handler-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  &:first-child {
    flex: 1;
  }
}

.data-picker {
  display: flex;
  justify-content: center;

  button {
    cursor: pointer;
    padding: 0.5em 1.5em;
    border: none;
    background: none;
    color: inherit;
    font-size: 0.9em;
    transition: all 0.2s;

    &.active {
      color: var(--clr-yellow-400);
    }

    &:hover {
      outline: 1px solid var(--clr-neutral-100);
      color: var(--clr-yellow-500);
    }
  }
}
</style>

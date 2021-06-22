<template>
  <div class="card">
    <h3 class="title">{{ title }}</h3>
    <div :class="{ 'split-rows': rows2 }" class="fill">
      <div class="row-container fill">
        <div v-for="(row, index) in rows" :key="index">
          <div v-for="(value, key) in row" :key="key" class="row">
            <span class="key">{{ key }}</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>
      </div>
      <div v-if="rows2" class="row-container fill">
        <div v-for="(row, index) in rows2" :key="index">
          <div v-for="(value, key) in row" :key="key" class="row">
            <span class="key">{{ key }}</span>
            <span class="value">{{ value }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    rows: {
      type: Array,
      required: true,
    },
    rows2: {
      type: [Array, Boolean],
      default() {
        return false;
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
  padding: calc(var(--spacer) / 2);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  text-align: center;

  .title {
    line-height: 1;
    margin-bottom: calc(var(--spacer) / 2);
  }

  .row-container {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .row {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .key {
      flex-basis: 100%;
      text-align: left;
    }

    .value {
      flex-basis: 100%;
      text-align: center;
      background: steelblue;
      border-left: 1px solid currentColor;

      // vertical center
      display: grid;
      place-items: center;
    }
  }

  .split-rows {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacer);
  }
}
</style>

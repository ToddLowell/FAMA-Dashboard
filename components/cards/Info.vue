<template>
  <div class="card" :style="{ background: color }">
    <h3>{{ title }}</h3>
    <div class="content">{{ formatNumber(current) }}</div>
    <table>
      <tbody>
        <tr>
          <td>Sebelumnya</td>
          <td>% Perubahan</td>
          <td>Tren</td>
        </tr>
        <tr>
          <td>{{ formatNumber(previous) }}</td>
          <td>{{ change }}</td>
          <td v-if="trendUp">
            <div class="f-center">
              <IncreaseIcon fill="currentColor" />
            </div>
          </td>
          <td v-else>
            <div class="f-center">
              <DecreaseIcon fill="currentColor" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import IncreaseIcon from '../icons/increase.vue';
import DecreaseIcon from '../icons/decrease.vue';

export default Vue.extend({
  components: {
    IncreaseIcon,
    DecreaseIcon,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    current: {
      type: Number,
      required: true,
    },
    previous: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
  },
  computed: {
    change() {
      const prev = this.previous;
      const curr = this.current;
      return `${((Math.abs(curr - prev) / prev) * 100).toFixed(1)}%`;
    },
    trendUp() {
      if (this.current > this.previous) return true;
      else return false;
    },
  },
  methods: {
    // https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
    formatNumber(x: number) {
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
  justify-content: space-between;
  text-align: center;

  .content {
    font-size: 3em;
    font-weight: 300;
    line-height: 1;
    margin-bottom: 5px;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-style: hidden;

    td {
      border: 2px solid var(--clr-neutral-100);

      svg {
        height: 2em;
      }
    }
  }
}
</style>

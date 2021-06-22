<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    :aria-labelledby="iconName + '-icon'"
    role="presentation"
  >
    <title :id="iconName + '-icon'" lang="en">{{ iconName }} icon</title>
    <path
      d="M73.688 20A3.004 3.004 0 1074 26h10.75L56 54.75 44.375 43.094a3 3 0 00-2.656-1.125 3 3 0 00-1.782.843l-34 32a3 3 0 104.125 4.344l31.876-30 11.187 11.188a3 3 0 005 .75L89 30.219V41a3 3 0 106 0V23a3 3 0 00-3-3H74a3 3 0 00-.313 0z"
    />
  </svg>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  data() {
    return {
      iconName: 'increase',
    };
  },
});
</script>

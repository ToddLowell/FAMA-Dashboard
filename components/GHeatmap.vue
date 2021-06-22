<template>
  <div class="gMap-container">
    <h3 class="gMap-label">{{ title }}</h3>
    <div ref="gMap" class="gMap" />
  </div>
</template>

<script lang="ts">
/* global google */
import Vue from 'vue';

interface PlaceConfig {
  location: {
    lat: number;
    lng: number;
  };
  info: string;
}

interface PlacesConfig extends Array<PlaceConfig> {}

export default Vue.extend({
  props: {
    title: {
      type: String,
      required: true,
    },
    places: {
      type: Array,
      required: true,
    },
  },

  mounted() {
    // init map and center on Malaysia
    const center: google.maps.LatLngLiteral = {
      lat: 4.22078193815024,
      lng: 108.5686211965463,
    };

    const map = new google.maps.Map(this.$refs.gMap as HTMLElement, {
      center,
      zoom: 5,
    });

    const heatmap = new google.maps.visualization.HeatmapLayer({
      data: (this.places as PlacesConfig).map(
        (place) =>
          new google.maps.LatLng(place.location.lat, place.location.lng)
      ),
    });

    heatmap.setMap(map);
  },
});
</script>

<style lang="scss" scoped>
h3 {
  text-align: center;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000,
    1px 1px 0 #000;
}

.gMap-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.gMap-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1;
}

.gMap {
  color: black;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>

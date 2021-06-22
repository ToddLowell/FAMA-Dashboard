<template>
  <div class="gMap-container">
    <h3 class="gMap-label">{{ title }}</h3>
    <div ref="gMap" class="gMap" />
  </div>
</template>

<script lang="ts">
/* global google */
import Vue from 'vue';
import MarkerClusterer from '@googlemaps/markerclustererplus';

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

  watch: {
    places() {
      this.displayMarkers();
    },
  },

  mounted() {
    this.displayMarkers();
  },

  methods: {
    displayMarkers() {
      // init map and center on Malaysia
      const center: google.maps.LatLngLiteral = {
        lat: 4.22078193815024,
        lng: 108.5686211965463,
      };

      const map = new google.maps.Map(this.$refs.gMap as HTMLElement, {
        center,
        zoom: 5,
      });

      // set-up markers
      const markers = (this.places as PlacesConfig).map(
        (place: PlaceConfig) => {
          const marker = new google.maps.Marker({
            position: place.location,
            // label: labels[i % labels.length],
          });

          const infowindow = new google.maps.InfoWindow({
            content: place.info,
          });

          marker.addListener('click', () => {
            infowindow.open(map, marker);
          });

          return marker;
        }
      );

      // init marker clusterer to manage the markers
      new MarkerClusterer(map, markers, {
        // imagePath: 'gMapsCluster/m'
        imagePath:
          'https://raaedkabir-assets.s3.amazonaws.com/temp/FAMA/gMapsClusterIcons/m',
      });
    },
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
  text-align: left;
}
</style>

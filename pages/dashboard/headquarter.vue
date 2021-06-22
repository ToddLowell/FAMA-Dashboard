<template>
  <div :class="{ 'map-view': mapView, 'chart-view': !mapView }">
    <Card class="item1">
      <InfoCard
        title="Bil. K-Shoppe (MTD: Febuari)"
        :current="1500"
        :previous="1000"
        color="limegreen"
      />
    </Card>
    <Card class="item2">
      <InfoCard
        title="Jumlah Jualan (MTD: Febuari)"
        :current="2460"
        :previous="2360"
        color="chocolate"
      />
    </Card>
    <Card class="item3">
      <InfoCard
        title="Jumlah Transaki (MTD: Febuari)"
        :current="11250"
        :previous="11000"
        color="orange"
      />
    </Card>
    <Card class="item4">
      <InfoCard
        title="Bil. SKU (MTD: Febuari)"
        :current="3225"
        :previous="3000"
        color="dodgerblue"
      />
    </Card>
    <Card class="item5">
      <DataCard
        title="Nilai Belian Hasil Pertanian (Keseluruhan)"
        :rows="[
          { 'SASARAN: MT/RM': '150 | 300,000' },
          { 'MTD: MT/RM': '120 | 240,000' },
          { 'YTD: MT/RM': '300 | 600,000' },
          { 'YTD CAPAI (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="item6">
      <DataCard
        title="Nilai Jualan POS (Keseluruhan)"
        :rows="[
          { 'MTD: # SKU': '1,075' },
          { 'MTD: # Transaksi': '3,750' },
          { 'MTD: UNIT/RM': '4,500 | 450,000' },
          { 'YTD: UNIT/RM': '13,500 | 1350,000' },
        ]"
      />
    </Card>
    <Card class="item7">
      <DataCard
        title="Nilai Jualan Digital - ABO (Keseluruhan)"
        :rows="[
          { 'MTD: # SKU': '1,075' },
          { 'MTD: # Transaksi': '3,750' },
          { 'MTD: UNIT/RM': '4,500 | 450,000' },
          { 'YTD: UNIT/RM': '13,500 | 1350,000' },
        ]"
      />
    </Card>
    <!-- Map View -->
    <template v-if="mapView">
      <Card class="map-1 rel">
        <div @click="toggleView">
          <ChangeViewIcon1 class="change-view-icon icon" />
        </div>
        <GMap title="Peta Lokasi K-Shoppe" :places="map1" />
      </Card>
      <Card class="map-2">
        <GMap title="Peta Lokasi POS" :places="map2" />
      </Card>
    </template>
    <!-- Chart View -->
    <template v-else>
      <Card class="chart-1 rel split">
        <div @click="toggleView">
          <ChangeViewIcon2 class="change-view-icon icon" />
        </div>
        <BarChart
          title="Nilai Belian Hasil Pertanian - Bulanan Mengikut Negeri"
          :data="chart1"
        />
        <BarChart
          title="Nilai Jualan Hasil Pertanian - Bulanan Mengikut Negeri"
          :data="chart2"
        />
      </Card>
      <Card class="chart-2 split">
        <BarChart
          title="Nilai Jualan Digital (ABO) - Bulanan Mengikut Negeri"
          :data="chart3"
        />
        <BarChart
          title="Nilai Jualan Digital (ABM) - Bulanan Mengikut Negeri"
          :data="chart4"
        />
      </Card>
      <Card class="chart-3 split">
        <BarChart
          title="Nilai Jualan POS - Bulanan Mengikut Negeri"
          :data="chart5"
        />
        <BarChart
          title="Nilai Jualan K-Shoppe - Bulanan Mengikut Negeri"
          :data="chart6"
        />
      </Card>
    </template>
    <Card class="item10">
      <DataCard
        title="Nilai Jualan Hasil Pertanian (Keseluruhan)"
        :rows="[
          { 'Sasaran: MT/RM': '150 | 300,000' },
          { 'MTD: MT/RM': '120 | 240,000' },
          { 'YTD: MT/RM': '300 | 600,000' },
          { 'YTD Capai (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="item11">
      <DataCard
        title="Nilai Jualan K-Shoppe (Keseluruhan)"
        :rows="[
          { Sasaran: '105,000,000' },
          { MTD: '875,000' },
          { YTD: '1,750,000' },
          { '% YTD': '17%' },
        ]"
      />
    </Card>
    <Card class="item12">
      <DataCard
        title="Nilai Jualan Digital - Kedai Online ABM (Keseluruhan)"
        :rows="[
          { 'MTD: # SKU': '1,075' },
          { 'MTD: # Transaksi': '3,750' },
          { 'MTD: UNIT/RM': '4,500 | 450,000' },
          { 'YTD: UNIT/RM': '13,500 | 1,350,000' },
        ]"
      />
    </Card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  useContext,
} from '@nuxtjs/composition-api';
import Card from '../../components/cards/Card.vue';
import DataCard from '../../components/cards/General.vue';
import InfoCard from '../../components/cards/Info.vue';
import GMap from '../../components/GMap.vue';
import ChangeViewIcon1 from '../../components/icons/change-1.vue';
import ChangeViewIcon2 from '../../components/icons/change-2.vue';
import BarChart from '../../components/charts/Bar.vue';

type ChartData = {
  key: string;
  value: number;
}[];

interface AllChartData {
  [key: string]: ChartData;
}

type MapMarker = {
  location: { lat: number; lng: number };
  info: string;
}[];

type MapMarkerInfo = {
  state: string;
  operationCenter: string;
  address: string;
  nameOfManager: string;
  telephone: string;
  email: string;
  coordinates: { lat: number; lng: number };
  name: string;
  active: boolean;
  uptime?: string;
  info?: string;
}[];

interface MapData {
  [key: string]: MapMarker;
}

export default defineComponent({
  components: {
    Card,
    DataCard,
    InfoCard,
    GMap,
    ChangeViewIcon1,
    ChangeViewIcon2,
    BarChart,
  },
  layout: 'dashboard',
  setup() {
    const mapView = ref(true);
    const toggleView = () => {
      mapView.value = !mapView.value;
    };

    let intervalHandler: ReturnType<typeof setInterval>;

    const chartData: AllChartData = reactive({
      chart1: [],
      chart2: [],
      chart3: [],
      chart4: [],
      chart5: [],
      chart6: [],
    });

    const mapData: MapData = reactive({
      map1: [],
      map2: [],
    });

    onMounted(() => {
      const ctx = useContext();

      // set Dashboard Title
      ctx.store.commit('setDashboardTitle', 'IBU PEJABAT FAMA');

      // get chart data
      const getChartData = () => {
        ctx.$axios
          .get<AllChartData>('/data/dashboard_headquarter')
          .then((res) => {
            chartData.chart1 = res.data[0];
            chartData.chart2 = res.data[1];
            chartData.chart3 = res.data[2];
            chartData.chart4 = res.data[3];
            chartData.chart5 = res.data[4];
            chartData.chart6 = res.data[5];
          });
      };

      // get map data
      ctx.$axios.get<MapMarker>('/data/location_data').then((res) => {
        mapData.map1 = res.data;
      });

      ctx.$axios.get<MapMarkerInfo>('/data/pos_units').then((res) => {
        const placeData = res.data.map((unit) => {
          return {
            location: unit.coordinates,
            info: `
              <h2 style="text-align: center;">${unit.operationCenter}</h2>
              <p><strong>ALAMAT:</strong> ${unit.address}</p>
              <p><strong>NAMA PENGURUS:</strong> ${unit.nameOfManager}</p>
              <p><strong>NO. TELEFON:</strong> ${unit.email}</p>
              <p><strong>EMEL:</strong> ${unit.email}</p>
              <p><strong>STATUS:</strong> ${
                unit.active ? 'Online' : 'Offline'
              }</p>
              ${
                unit.active
                  ? `<p><strong>UPTIME: </strong>${unit.uptime}</p>`
                  : ''
              }
            `,
          };
        });

        mapData.map2 = placeData;
      });

      getChartData();

      intervalHandler = setInterval(getChartData, 10000);
    });

    onUnmounted(() => {
      clearInterval(intervalHandler);
    });

    return {
      mapView,
      toggleView,
      ...toRefs(chartData),
      ...toRefs(mapData),
    };
  },
  head() {
    return {
      title: 'IBU PEJABAT FAMA',
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/mixins' as *;

.change-view-icon {
  padding: 5px;
  position: absolute;
  top: 0;
  right: 0;
  fill: white;
  background: darkblue;
  border-radius: 5px;
  z-index: 1;
  transform: translate(50%, -50%);
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    background: steelblue;
  }
}

@for $i from 1 through 12 {
  .item#{$i} {
    grid-area: cell#{$i};
  }
}

.map-view {
  flex: 1;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto auto repeat(6, 1fr);
  // grid-template-rows: repeat(8, calc((100% - var(--spacer) * 7) / 8));
  grid-template-areas:
    'cell1 cell2 cell3 cell4'
    'cell1 cell2 cell3 cell4'
    'cell5 map-1 map-1 cell10'
    'cell5 map-1 map-1 cell10'
    'cell6 map-1 map-1 cell11'
    'cell6 map-2 map-2 cell11'
    'cell7 map-2 map-2 cell12'
    'cell7 map-2 map-2 cell12';

  .map-1 {
    grid-area: map-1;
  }

  .map-2 {
    grid-area: map-2;
  }

  @include mq(tab-port) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto);
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1 cell2'
      'cell3 cell4'
      'cell5 cell6'
      'cell7 cell10'
      'cell11 cell12'
      'map-1 map-1'
      'map-1 map-1'
      'map-2 map-2'
      'map-2 map-2';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto);
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell5'
      'cell6'
      'cell7'
      'cell10'
      'cell11'
      'cell12'
      'map-1'
      'map-1'
      'map-2'
      'map-2';
  }
}

.chart-view {
  flex: 1;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: auto repeat(3, 1fr);
  grid-template-areas:
    'cell1  cell2   cell3   cell4'
    'cell5 chart-1 chart-1 cell10'
    'cell6 chart-2 chart-2 cell11'
    'cell7 chart-3 chart-3 cell12';

  .chart-1 {
    grid-area: chart-1;
  }

  .chart-2 {
    grid-area: chart-2;
  }

  .chart-3 {
    grid-area: chart-3;
  }

  @include mq(tab-port) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, auto) repeat(3, 1fr) repeat(3, 1.5fr);
    grid-template-areas:
      'cell1 cell2'
      'cell3 cell4'
      'cell5 cell6'
      'cell7 cell10'
      'cell11 cell12'
      'chart-1 chart-1'
      'chart-2 chart-2'
      'chart-3 chart-3';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(4, auto) repeat(6, 1fr) repeat(3, 1.5fr);
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell5'
      'cell6'
      'cell7'
      'cell10'
      'cell11'
      'cell12'
      'chart-1'
      'chart-2'
      'chart-3';
  }
}
</style>

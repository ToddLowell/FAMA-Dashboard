<template>
  <div :class="{ 'map-view': mapView, 'chart-view': !mapView }">
    <Card class="cell1">
      <DataCard
        title="Nilai Belian Hasil Pertanian (Langsung)"
        :rows="[
          { 'SASARAN: MT/RM': 'n/a | 200,000' },
          { 'MTD: MT/RM': '80 | 160,000' },
          { 'YTD: MT/RM': '200 | 400,000' },
          { 'YTD CAPAI (%)': '100%' },
          { 'YTD BIL. PETANI': '1,000' },
        ]"
      />
    </Card>
    <Card class="cell2">
      <DataCard
        title="Nilai Jualan Hasil Pertanian (Langsung)"
        :rows="[
          { 'SASARAN: MT/RM': '100 | n/a' },
          { 'MTD: MT/RM': '80 | 160,000' },
          { 'YTD: MT/RM': '200 | 400,000' },
          { 'YTD CAPAI (%)': '100%' },
          { 'YTD BIL. PELANGGAN': '5,000' },
        ]"
      />
    </Card>
    <Card class="cell3">
      <DataCard
        title="Nilai Belian Hasil Pertanian (Tidak Langsung)"
        :rows="[
          { 'SASARAN: MT/RM': 'n/a | 100,000' },
          { 'MTD: MT/RM': '40 | 80,000' },
          { 'YTD: MT/RM': '100 | 200,000' },
          { 'YTD CAPAI (%)': '100%' },
          { 'YTD BIL. PETANI': '500' },
        ]"
      />
    </Card>
    <Card class="cell4">
      <DataCard
        title="Nilai Jualan Hasil Pertanian (Tidak Langsung)"
        :rows="[
          { 'SASARAN: MT/RM': '50 | n/a' },
          { 'MTD: MT/RM': '40 | 80,000' },
          { 'YTD: MT/RM': '100 | 200,000' },
          { 'YTD CAPAI (%)': '100%' },
          { 'YTD BIL. PELANGGAN': '2,500' },
        ]"
      />
    </Card>
    <!-- Map View -->
    <template v-if="mapView">
      <Card class="map-1 rel">
        <div @click="toggleView">
          <ChangeViewIcon1 class="change-view-icon icon" />
        </div>
        <SVGMap1 title="Peta Lokasi Pusat Operasi" />
      </Card>
      <Card class="map-2">
        <SVGMap2 title="Peta Lokasi POS" />
      </Card>
    </template>
    <template v-else>
      <Card class="chart-1 rel split">
        <div @click="toggleView">
          <ChangeViewIcon2 class="change-view-icon icon" />
        </div>
        <BarChart
          title="Nilai Jualan Hasil Pertanian - Bulanan Mengikut Negeri"
          :data="chart1"
        />
        <BarChart
          title="Nilai Belian Hasil Pertanian - Bulanan Mengikut Negeri"
          :data="chart2"
        />
      </Card>
      <Card class="chart-2 split">
        <BarChart
          title="Nilai Jualan POS - Bulanan Keseluruhan (RM'000)"
          :data="chart3"
        />
        <BarChart
          title="Nilai Jualan POS - Bulanan Mengikut Negeri (RM'000)"
          :data="chart4"
        />
      </Card>
      <Card class="chart-3 split">
        <BarChart
          title="MTD Nilai Jualan POS - Keseluruhan ('000)"
          :data="chart5"
        />
        <LineChart
          title="MTD Bil. Transaksi POS - Keseluruhan"
          :data="chart6"
        />
      </Card>
    </template>
    <Card class="cell5">
      <DataCard
        title="Nilai Jualan POS (Produk Segar)"
        :rows="[
          { 'MTD: # SKU': '50' },
          { 'MTD: # Transaksi': '500' },
          { 'MTD: UNIT/RM': '1,000 | 100,000' },
          { 'YTD: UNIT/RM': '3,000 | 300,000' },
        ]"
      />
    </Card>
    <Card class="cell6">
      <DataCard
        title="Nilai Jualan POS (Produk Florikultur)"
        :rows="[
          { 'MTD: # SKU': '50' },
          { 'MTD: # Transaksi': '500' },
          { 'MTD: UNIT/RM': '1,000 | 100,000' },
          { 'YTD: UNIT/RM': '3,000 | 300,000' },
        ]"
      />
    </Card>
    <Card class="cell7">
      <DataCard
        title="Nilai Jualan POS (Produk Proses)"
        :rows="[
          { 'MTD: # SKU': '900' },
          { 'MTD: # Transaksi': '2,500' },
          { 'MTD: UNIT/RM': '5000 | 50,000' },
          { 'YTD: UNIT/RM': '1,500 | 150,000' },
        ]"
      />
    </Card>
    <Card class="cell8">
      <DataCard
        title="Nilai Jualan POS (Barang Kawalan)"
        :rows="[
          { 'MTD: # SKU': '900' },
          { 'MTD: # Transaksi': '2,500' },
          { 'MTD: UNIT/RM': '5000 | 50,000' },
          { 'YTD: UNIT/RM': '1,500 | 150,000' },
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
import ChangeViewIcon1 from '../../components/icons/change-1.vue';
import ChangeViewIcon2 from '../../components/icons/change-2.vue';
import SVGMap1 from '../../components/SVGMap1.vue';
import SVGMap2 from '../../components/SVGMap2.vue';
import BarChart from '../../components/charts/Bar.vue';
import LineChart from '../../components/charts/Line.vue';

type ChartData = {
  key: string;
  value: number;
}[];

interface AllChartData {
  [key: string]: ChartData;
}

export default defineComponent({
  components: {
    Card,
    DataCard,
    ChangeViewIcon1,
    ChangeViewIcon2,
    SVGMap1,
    SVGMap2,
    BarChart,
    LineChart,
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

    onMounted(() => {
      const ctx = useContext();

      // set Dashboard Title
      ctx.store.commit('setDashboardTitle', 'PEMASARAN PUSAT OPERASI');

      // get chart data
      const getChartData = () => {
        ctx.$axios
          .get<AllChartData>('/data/dashboard_operation')
          .then((res) => {
            chartData.chart1 = res.data[0];
            chartData.chart2 = res.data[1];
            chartData.chart3 = res.data[2];
            chartData.chart4 = res.data[3];
            chartData.chart5 = res.data[4];
            chartData.chart6 = res.data[5];
          });
      };

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
    };
  },
  head() {
    return {
      title: 'PEMASARAN PUSAT OPERASI',
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
  .cell#{$i} {
    grid-area: cell#{$i};
  }
}

.map-view {
  flex: 1;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    'cell1 map-1 map-1 cell3'
    'cell2 map-1 map-1 cell4'
    'cell5 map-2 map-2 cell7'
    'cell6 map-2 map-2 cell8';

  .map-1 {
    grid-area: map-1;
  }

  .map-2 {
    grid-area: map-2;
  }

  @include mq(tab-port) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr) repeat(2, 1.5fr);
    grid-template-areas:
      'cell1 cell3'
      'cell2 cell4'
      'cell5 cell7'
      'cell6 cell8'
      'map-1 map-1'
      'map-2 map-2';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr) repeat(2, 1.5fr);
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell5'
      'cell6'
      'cell7'
      'cell8'
      'map-1'
      'map-2';
  }
}

.chart-view {
  flex: 1;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-template-areas:
    'cell1 chart-1 chart-1 cell3'
    'cell1 chart-1 chart-1 cell3'
    'cell1 chart-1 chart-1 cell3'
    'cell2 chart-1 chart-1 cell4'
    'cell2 chart-2 chart-2 cell4'
    'cell2 chart-2 chart-2 cell4'
    'cell5 chart-2 chart-2 cell7'
    'cell5 chart-2 chart-2 cell7'
    'cell5 chart-3 chart-3 cell7'
    'cell6 chart-3 chart-3 cell8'
    'cell6 chart-3 chart-3 cell8'
    'cell6 chart-3 chart-3 cell8';

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
    grid-template-rows: repeat(4, 1fr) repeat(3, 1.5fr);
    grid-template-areas:
      'cell1     cell3'
      'cell2     cell4'
      'cell5     cell7'
      'cell6     cell8'
      'chart-1 chart-1'
      'chart-2 chart-2'
      'chart-3 chart-3';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(8, 1fr) repeat(3, 1.5fr);
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell5'
      'cell6'
      'cell7'
      'cell8'
      'chart-1'
      'chart-2'
      'chart-3';
  }
}
</style>

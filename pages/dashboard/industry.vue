<template>
  <div class="grid-view">
    <Card class="cell1">
      <DataCard
        title="Nilai Belian Hasil Pertanian (Keseluruhan)"
        :rows="[
          { 'Bil. Permohonan Setakat Ini': '2,000' },
          { 'Bil. Permohonan Baru': '500' },
        ]"
        :rows2="[
          { Semak: '500 | 500' },
          { Lawatan: '100 | 500' },
          { 'Lulus/Gagal': '20 | 80' },
          { Laksana: '10' },
        ]"
      />
    </Card>
    <Card class="cell2">
      <DataCard
        title="Nilai Jualan K-Shoppe"
        :rows="[
          { Sasaran: '105,000,000' },
          { MTD: '875,000' },
          { YTD: '1,750,000' },
          { '% YTD': '17%' },
        ]"
      />
    </Card>
    <Card class="cell3">
      <DataCard
        title="Pembangunan K-Shoppe Baru"
        :rows="[
          { Peruntukkan: '560,000' },
          { Sasar: '28' },
          { Capai: '14' },
          { '% Capai': '50%' },
        ]"
      />
    </Card>
    <Card class="cell4">
      <DataCard
        title="Naiktaraf K-Shoppe"
        :rows="[
          { Peruntukkan: '70,000' },
          { Sasar: '14' },
          { Capai: '7' },
          { '% Capai': '50%' },
        ]"
      />
    </Card>
    <Card class="cell5">
      <DataCard
        title="Promosi In-Store"
        :rows="[
          { Peruntukkan: '140,000' },
          { Sasar: '0' },
          { Capai: '0' },
          { '% Capai': '0%' },
        ]"
      />
    </Card>
    <Card class="cell6">
      <DataCard
        title="Pengedar Baru"
        :rows="[
          { Peruntukkan: '160,000' },
          { Sasar: '2' },
          { Capai: '0' },
          { 'Nilai Jualan': '0' },
        ]"
      />
    </Card>
    <Card class="cell7">
      <DataCard
        title="Imej Produk Usahawn Mikro (PKS1-3)"
        :rows="[
          { Peruntukkan: '560,000' },
          { Sasar: '85' },
          { Capai: '14' },
          { '% Capai': '17%' },
        ]"
      />
    </Card>
    <Card class="cell8">
      <GMap title="Peta Lokasi K-Shoppe" :places="places" />
    </Card>
    <Card class="cell9">
      <ChartManager>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart1AllMonths"
            :selected-month="chart1SelectedMonth"
            @change-data="changeData('chart1SelectedMonth', $event)"
          >
            <BarChart
              title="Nilai Jualan K-Shoppe Mengikut Negeri"
              :data="chart1Data"
            />
          </ChartDataManager>
        </SliderSlide>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart2AllMonths"
            :selected-month="chart2SelectedMonth"
            @change-data="changeData('chart2SelectedMonth', $event)"
          >
            <BarChart
              title="Bilangan K-Shoppe Mengikut Negeri"
              :data="chart2Data"
            />
          </ChartDataManager>
        </SliderSlide>
      </ChartManager>
    </Card>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  toRefs,
  computed,
  onMounted,
  onUnmounted,
  useContext,
} from '@nuxtjs/composition-api';
import Card from '../../components/cards/Card.vue';
import DataCard from '../../components/cards/General.vue';
import GMap from '../../components/GMap.vue';
import ChartDataManager from '../../components/charts/chartsManager/DataHandler.vue';
import ChartManager from '../../components/charts/chartsManager/ChartManager.vue';
import SliderSlide from '../../components/charts/chartsManager/ChartSlide.vue';
import BarChart from '../../components/charts/Bar.vue';

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

type ChartData = {
  key: string;
  value: number;
}[];

type ChartDataByMonth = {
  [month in MonthOfTheYear]?: ChartData;
};

interface AllChartDataByMonth {
  [key: string]: ChartDataByMonth;
}

type MapMarker = {
  location: { lat: number; lng: number };
  info: string;
}[];

interface MapData {
  [key: string]: MapMarker;
}

export default defineComponent({
  components: {
    Card,
    DataCard,
    GMap,
    ChartDataManager,
    ChartManager,
    SliderSlide,
    BarChart,
  },
  layout: 'dashboard',
  setup() {
    let intervalHandler: ReturnType<typeof setInterval>;

    const chartData: AllChartDataByMonth = reactive({
      chart1AllMonths: {},
      chart2AllMonths: {},
    });

    const activeChart: { [key: string]: MonthOfTheYear } = reactive({
      chart1SelectedMonth: 'Jan',
      chart2SelectedMonth: 'Jan',
    });

    const selectedMonth = reactive({
      chart1Data: computed(() => {
        return chartData.chart1AllMonths[activeChart.chart1SelectedMonth] || [];
      }),
      chart2Data: computed(() => {
        return chartData.chart2AllMonths[activeChart.chart2SelectedMonth] || [];
      }),
    });

    const changeData = (chart: string, value: MonthOfTheYear) => {
      activeChart[chart] = value;
    };

    const mapData: MapData = reactive({
      places: [],
    });

    onMounted(() => {
      const ctx = useContext();

      // set Dashboard Title
      ctx.store.commit('setDashboardTitle', 'PEMASARAN INDUSTRI MAKANAN');

      // get map data
      ctx.$axios.get<MapMarker>('/data/location_data').then((res) => {
        mapData.places = res.data;
      });

      // get chart data
      const getChartData = () => {
        ctx.$axios
          .get<ChartDataByMonth[]>('/data/dashboard_industry')
          .then((res) => {
            chartData.chart1AllMonths = res.data[0];
            chartData.chart2AllMonths = res.data[1];

            activeChart.chart1SelectedMonth = Object.keys(
              chartData.chart1AllMonths
            )[
              Object.keys(chartData.chart1AllMonths).length - 1
            ] as MonthOfTheYear;

            activeChart.chart2SelectedMonth = Object.keys(
              chartData.chart2AllMonths
            )[
              Object.keys(chartData.chart2AllMonths).length - 1
            ] as MonthOfTheYear;
          });
      };

      getChartData();

      intervalHandler = setInterval(getChartData, 10000);
    });

    onUnmounted(() => {
      clearInterval(intervalHandler);
    });

    return {
      ...toRefs(mapData),
      ...toRefs(chartData),
      ...toRefs(activeChart),
      ...toRefs(selectedMonth),
      changeData,
    };
  },
  head() {
    return {
      title: 'PEMASARAN INDUSTRI MAKANAN',
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/mixins' as *;

@for $i from 1 through 9 {
  .cell#{$i} {
    grid-area: cell#{$i};
  }
}

.grid-view {
  flex: 1;
  display: grid;
  gap: var(--spacer);
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(4, 1fr);
  grid-template-areas:
    'cell1 cell1 cell8 cell8'
    'cell2 cell3 cell8 cell8'
    'cell4 cell5 cell9 cell9'
    'cell6 cell7 cell9 cell9';

  @include mq(tab-port) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1 cell1'
      'cell2 cell3'
      'cell4 cell5'
      'cell6 cell7'
      'cell8 cell8'
      'cell8 cell8'
      'cell9 cell9'
      'cell9 cell9';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell5'
      'cell6'
      'cell7'
      'cell8'
      'cell8'
      'cell9'
      'cell9';
  }
}
</style>

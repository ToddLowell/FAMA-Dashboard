<template>
  <div class="grid-view">
    <Card class="cell1">
      <DataCard
        title="Nilai Jualan Digital (Produk Segar)"
        :rows="[
          { 'MTD: # SKU': '50' },
          { 'MTD: UNIT/RM': '1,000 | 100,000' },
          { 'YTD: UNIT/RM': '3,000 | 300,000' },
          { 'YTD CAPAI (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="cell2">
      <DataCard
        title="Nilai Jualan Digital (Produk Proses)"
        :rows="[
          { 'MTD: # SKU': '900' },
          { 'MTD: UNIT/RM': '2,000 | 200,000' },
          { 'YTD: UNIT/RM': '6,000 | 600,000' },
          { 'YTD CAPAI (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="cell3">
      <DataCard
        title="Nilai Jualan Digital (Produk Florikultur)"
        :rows="[
          { 'MTD: # SKU': '50' },
          { 'MTD: UNIT/RM': '1,000 | 100,000' },
          { 'YTD: UNIT/RM': '3,000 | 300,000' },
          { 'YTD CAPAI (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="cell4">
      <DataCard
        title="Nilai Jualan Digital (Barang Kawalan)"
        :rows="[
          { 'MTD: # SKU': '25' },
          { 'MTD: UNIT/RM': '500 | 50,000' },
          { 'YTD: UNIT/RM': '1,500 | 150,000' },
          { 'YTD CAPAI (%)': '100%' },
        ]"
      />
    </Card>
    <Card class="cell5">
      <ChartManager>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart1AllMonths"
            :selected-month="chart1SelectedMonth"
            @change-data="changeData('chart1SelectedMonth', $event)"
          >
            <BarChart
              title="Nilai Jualan Digital - Bulanan ABO Mengikut Negeri (RM'000)"
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
            <StackedBarChart
              title="Nilai Jualan Digital - Bulanan ABO & Kedai Online ABM (RM'000)"
              :data="chart2Data"
            />
          </ChartDataManager>
        </SliderSlide>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart3AllMonths"
            :selected-month="chart3SelectedMonth"
            @change-data="changeData('chart3SelectedMonth', $event)"
          >
            <BarChart
              title="MTD Nilai Jualan Digital - Keseluruhan ('000)"
              :data="chart3Data"
            />
          </ChartDataManager>
        </SliderSlide>
      </ChartManager>
    </Card>
    <Card class="cell6">
      <GHeatmap title="Peta Lokasi Usahawan Digital" :places="places" />
    </Card>
    <Card class="cell7">
      <ChartManager>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart4AllMonths"
            :selected-month="chart4SelectedMonth"
            @change-data="changeData('chart4SelectedMonth', $event)"
          >
            <BarChart
              title="Nilai Jualan Digital - Bulanan Kedai Online ABM Mengikut Negeri (RM'000)"
              :data="chart4Data"
            />
          </ChartDataManager>
        </SliderSlide>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart5AllMonths"
            :selected-month="chart5SelectedMonth"
            @change-data="changeData('chart5SelectedMonth', $event)"
          >
            <BarChart
              title="Nilai Jualan Digital - Bulanan ABO & Kedai Online ABM Mengikut Negeri (RM'000)"
              :data="chart5Data"
            />
          </ChartDataManager>
        </SliderSlide>
        <SliderSlide>
          <ChartDataManager
            :chart-data="chart6AllMonths"
            :selected-month="chart6SelectedMonth"
            @change-data="changeData('chart6SelectedMonth', $event)"
          >
            <LineChart
              title="MTD Bil. Transaksi Digital - Keseluruhan"
              :data="chart6Data"
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
import GHeatmap from '../../components/GHeatmap.vue';
import ChartDataManager from '../../components/charts/chartsManager/DataHandler.vue';
import ChartManager from '../../components/charts/chartsManager/ChartManager.vue';
import SliderSlide from '../../components/charts/chartsManager/ChartSlide.vue';
import BarChart from '../../components/charts/Bar.vue';
import StackedBarChart from '../../components/charts/StackedBar.vue';
import LineChart from '../../components/charts/Line.vue';

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

type StackedChartData = {
  ABO: number;
  ABM: number;
}[];

type ChartDataByMonth = {
  [month in MonthOfTheYear]?: ChartData | StackedChartData;
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
    GHeatmap,
    ChartDataManager,
    ChartManager,
    SliderSlide,
    BarChart,
    StackedBarChart,
    LineChart,
  },
  layout: 'dashboard',
  setup() {
    let intervalHandler: ReturnType<typeof setInterval>;

    const chartData: AllChartDataByMonth = reactive({
      chart1AllMonths: {},
      chart2AllMonths: {},
      chart3AllMonths: {},
      chart4AllMonths: {},
      chart5AllMonths: {},
      chart6AllMonths: {},
    });

    const activeChart: { [key: string]: MonthOfTheYear } = reactive({
      chart1SelectedMonth: 'Jan',
      chart2SelectedMonth: 'Jan',
      chart3SelectedMonth: 'Jan',
      chart4SelectedMonth: 'Jan',
      chart5SelectedMonth: 'Jan',
      chart6SelectedMonth: 'Jan',
    });

    const selectedMonth = reactive({
      chart1Data: computed(() => {
        return chartData.chart1AllMonths[activeChart.chart1SelectedMonth] || [];
      }),
      chart2Data: computed(() => {
        return chartData.chart2AllMonths[activeChart.chart2SelectedMonth] || [];
      }),
      chart3Data: computed(() => {
        return chartData.chart3AllMonths[activeChart.chart3SelectedMonth] || [];
      }),
      chart4Data: computed(() => {
        return chartData.chart4AllMonths[activeChart.chart4SelectedMonth] || [];
      }),
      chart5Data: computed(() => {
        return chartData.chart5AllMonths[activeChart.chart5SelectedMonth] || [];
      }),
      chart6Data: computed(() => {
        return chartData.chart6AllMonths[activeChart.chart6SelectedMonth] || [];
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
      ctx.store.commit('setDashboardTitle', 'PEMASARAN DIGITAL');

      // get map data
      ctx.$axios.get<MapMarker>('/data/location_data').then((res) => {
        mapData.places = res.data;
      });

      // get chart data
      const getChartData = () => {
        ctx.$axios
          .get<ChartDataByMonth[]>('/data/dashboard_digital')
          .then((res) => {
            chartData.chart1AllMonths = res.data[0];
            chartData.chart2AllMonths = res.data[1];
            chartData.chart3AllMonths = res.data[2];
            chartData.chart4AllMonths = res.data[3];
            chartData.chart5AllMonths = res.data[4];
            chartData.chart6AllMonths = res.data[5];

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

            activeChart.chart3SelectedMonth = Object.keys(
              chartData.chart3AllMonths
            )[
              Object.keys(chartData.chart3AllMonths).length - 1
            ] as MonthOfTheYear;

            activeChart.chart4SelectedMonth = Object.keys(
              chartData.chart4AllMonths
            )[
              Object.keys(chartData.chart4AllMonths).length - 1
            ] as MonthOfTheYear;

            activeChart.chart5SelectedMonth = Object.keys(
              chartData.chart5AllMonths
            )[
              Object.keys(chartData.chart5AllMonths).length - 1
            ] as MonthOfTheYear;

            activeChart.chart6SelectedMonth = Object.keys(
              chartData.chart6AllMonths
            )[
              Object.keys(chartData.chart6AllMonths).length - 1
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
      title: 'PEMASARAN DIGITAL',
    };
  },
});
</script>

<style lang="scss" scoped>
@use '~/assets/scss/abstracts/mixins' as *;

@for $i from 1 through 7 {
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
    'cell1 cell2 cell6 cell6'
    'cell3 cell4 cell6 cell6'
    'cell5 cell5 cell7 cell7'
    'cell5 cell5 cell7 cell7';

  @include mq(tab-port) {
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1 cell2'
      'cell3 cell4'
      'cell6 cell6'
      'cell6 cell6'
      'cell5 cell5'
      'cell5 cell5'
      'cell7 cell7'
      'cell7 cell7';
  }

  @include mq(phone) {
    grid-template-columns: 1fr;
    grid-auto-rows: 1fr;
    grid-template-areas:
      'cell1'
      'cell2'
      'cell3'
      'cell4'
      'cell6'
      'cell6'
      'cell5'
      'cell5'
      'cell7'
      'cell7';
  }
}
</style>

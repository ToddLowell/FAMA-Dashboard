<template>
  <div class="chart">
    <h3>{{ title }}</h3>
    <div class="fill f-center">
      <svg ref="chart"></svg>
    </div>
  </div>
</template>

<script>
import {
  defineComponent,
  onMounted,
  ref,
  watch,
  nextTick,
} from '@nuxtjs/composition-api';
import * as d3 from 'd3';

export default defineComponent({
  props: {
    title: {
      type: String,
      required: true,
    },
    data: {
      type: Array,
      required: true,
    },
  },

  setup(props) {
    let width = 600;
    let height = 200;
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const chart = ref(null);

    watch(
      () => props.data,
      () => {
        update();
      }
    );

    onMounted(() => {
      nextTick().then(() => {
        const parentRect = chart.value.parentElement.getBoundingClientRect();

        width = parentRect.width;
        height = parentRect.height;

        init();
      });
    });

    function init() {
      const data = props.data;
      const svg = d3
        .select(chart.value)
        .attr('width', `${width}`)
        .attr('height', `${height}`)
        .attr('viewBox', `0, 0, ${width}, ${height}`);

      const parseDate = d3.timeParse('%Y-%m-%d');
      const xAccessor = (d) => parseDate(d.key);
      const yAccessor = (d) => d.value;

      const t = d3.select(chart.value).transition().duration(1000);

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, yAccessor)])
        .range([height - margin.bottom, margin.top]);

      // line
      const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)));

      svg
        .append('g')
        .classed('data-line', true)
        .append('path')
        .attr('fill', 'none')
        .attr('stroke', 'cornflowerblue')
        .attr('stroke-width', 4)
        // .attr(
        //   'd',
        //   `M${margin.left} ${height - margin.bottom} L ${width -
        //     margin.right} ${height - margin.bottom}`
        // )
        .transition(t)
        .attr('d', lineGenerator(data));

      // axes
      const xAxis = d3
        .axisBottom()
        .scale(xScale)
        .tickFormat(d3.timeFormat('%-d'));

      const yAxis = d3
        .axisLeft()
        .scale(yScale)
        .tickFormat((d) => (d % 200 === 0 ? d : ''))
        .tickSizeOuter(0);

      svg
        .append('g')
        .call(xAxis)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      svg
        .append('g')
        .call(yAxis)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      // average line
      const sum = d3.sum(data, (d) => d.value);
      const average = sum / data.length;

      svg
        .append('line')
        .classed('avg-line', true)
        .style('stroke', '#fff')
        .style('stroke-width', '4')
        .attr('x1', margin.left)
        .attr('x2', margin.left)
        .attr('y1', yScale(average))
        .attr('y2', yScale(average))
        .transition(t)
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(average))
        .attr('y2', yScale(average));

      svg
        .append('text')
        .classed('avg-text', true)
        .style('fill', '#fff')
        .attr(
          'transform',
          `translate(${width - margin.right}, ${yScale(average)})`
        )
        .attr('dx', '-.4em')
        .attr('dy', '-.5em')
        .attr('text-anchor', 'end')
        .attr('font-size', '2rem')
        .html('Average: ' + average.toFixed(0))
        .style('opacity', '0')
        .transition(t)
        .style('opacity', '1');
    }

    function update() {
      const data = props.data;
      const svg = d3.select(chart.value);

      const parseDate = d3.timeParse('%Y-%m-%d');
      const xAccessor = (d) => parseDate(d.key);
      const yAccessor = (d) => d.value;

      const t = d3.select(chart.value).transition().duration(1000);

      const xScale = d3
        .scaleTime()
        .domain(d3.extent(data, xAccessor))
        .range([margin.left, width - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(data, yAccessor)])
        .range([height - margin.bottom, margin.top]);

      // update bars
      const lineGenerator = d3
        .line()
        .x((d) => xScale(xAccessor(d)))
        .y((d) => yScale(yAccessor(d)));

      svg
        .select('.data-line')
        .select('path')
        // .data(data)
        .transition(t)
        .attr('d', lineGenerator(data));

      // update average line
      const sum = d3.sum(data, (d) => d.value);
      const average = sum / data.length;

      svg
        .select('.avg-line')
        .transition(t)
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', yScale(average))
        .attr('y2', yScale(average));

      svg
        .select('.avg-text')
        .html('Average: ' + average.toFixed(0))
        .transition(t)
        .attr(
          'transform',
          `translate(${width - margin.right}, ${yScale(average)})`
        );
    }

    return {
      chart,
      width,
      height,
      margin,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart {
  h3 {
    text-align: center;
  }

  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  svg {
    max-width: 100%;
    flex: 1;
  }
}
</style>

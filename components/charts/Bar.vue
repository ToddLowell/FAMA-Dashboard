<template>
  <div class="chart">
    <h3>{{ title }}</h3>
    <div class="fill f-center rel">
      <svg ref="chart"></svg>
      <div ref="tooltip" class="tooltip">
        <div>
          <span id="range" class="tooltip-range"></span>
          <span id="count"></span>
        </div>
      </div>
    </div>
    <div v-if="data.length === 0" class="loading-ring" />
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
    const tooltip = ref(null);

    watch(
      () => props.data,
      () => {
        if (props.data.length) {
          nextTick().then(() => {
            // to run AFTER onMounted
            setTimeout(() => {
              // plot data points
              plot();
            });
          });
        }
      },
      {
        immediate: true,
      }
    );

    onMounted(() => {
      nextTick().then(() => {
        // set chart width and height
        const parentRect = chart.value.parentElement.getBoundingClientRect();

        width = parentRect.width;
        height = parentRect.height;

        d3.select(chart.value)
          .attr('width', `${width}`)
          .attr('height', `${height}`)
          .attr('viewBox', `0, 0, ${width}, ${height}`);

        // draw chart
        draw();
      });
    });

    function draw() {
      const svg = d3
        .select(chart.value)
        .attr('width', `${width}`)
        .attr('height', `${height}`)
        .attr('viewBox', `0, 0, ${width}, ${height}`);

      // init static elements
      svg.append('g').classed('bars', true);
      svg.append('g').classed('x-axis', true);
      svg.append('g').classed('y-axis', true);
      svg
        .append('line')
        .classed('avg-line', true)
        .style('stroke', '#fff')
        .style('stroke-width', '4')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .attr('y1', height - margin.bottom)
        .attr('y2', height - margin.bottom);
      svg
        .append('text')
        .classed('avg-text', true)
        .style('fill', '#fff')
        .attr('dx', '-.4em')
        .attr('dy', '-.5em')
        .attr('text-anchor', 'end')
        .attr('font-size', '2rem')
        .style('opacity', '0')
        .attr(
          'transform',
          `translate(${width - margin.right}, ${height - margin.bottom})`
        );
    }

    function plot() {
      const data = props.data;

      const svg = d3.select(chart.value);

      const t = d3.select(chart.value).transition().duration(1000);

      const xScale = d3
        .scaleBand()
        .domain(d3.range(data.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        // .domain([0, d3.max(data, d => d.value)])
        .domain([0, 200])
        .range([height - margin.bottom, margin.top]);

      const color = d3.scaleOrdinal().range(['red', 'orange']);

      // bars
      const bars = svg
        .select('.bars')
        .selectAll('rect')
        .data(data)
        .join(
          (enter) =>
            enter
              .append('rect')
              .attr('width', xScale.bandwidth())
              .attr('height', 0)
              .attr('fill', (_d, i) => color(i))
              .attr('x', (_d, i) => xScale(i))
              .attr('y', height - margin.bottom)
              .call((enter) =>
                enter
                  .transition(t)
                  .attr('y', (d) => yScale(d.value))
                  .attr('height', (d) => yScale(0) - yScale(d.value))
              ),
          (update) =>
            update.call((update) =>
              update
                .transition(t)
                .attr('y', (d) => yScale(d.value))
                .attr('height', (d) => yScale(0) - yScale(d.value))
            ),
          (exit) => exit.remove()
        );

      // axes
      const xAxis = d3
        .axisBottom(xScale)
        .tickFormat((i) => data[i].key)
        .tickSizeOuter(0);

      const yAxis = d3.axisLeft(yScale);

      svg
        .select('.x-axis')
        .style('color', '#fff')
        .call(xAxis)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      svg
        .select('.y-axis')
        .style('color', '#fff')
        .call(yAxis)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      // average line
      const sum = d3.sum(data, (d) => d.value);
      const average = sum / data.length;

      svg
        .select('.avg-line')
        .attr('x1', margin.left)
        .attr('x2', width - margin.right)
        .transition(t)
        .attr('y1', yScale(average))
        .attr('y2', yScale(average));

      svg
        .select('.avg-text')
        .html('Average: ' + average.toFixed(0))
        .transition(t)
        .attr(
          'transform',
          `translate(${width - margin.right}, ${yScale(average)})`
        )
        .style('opacity', '1');

      // interactions
      const tooltipEl = d3.select(tooltip.value);

      bars
        .on('mouseenter', (_e, d) => {
          // tooltipEl.select('#range').text(d.key + ': ');
          tooltipEl.select('#count').text(d.value);

          const xPos =
            xScale(data.map((d) => d.key).indexOf(d.key)) +
            xScale.bandwidth() / 2;
          const yPos = yScale(d.value);

          tooltipEl
            .style(
              'transform',
              `translate(calc(${xPos}px - 50%), calc(${yPos}px - 100%))`
            )
            .style('opacity', 1);
        })
        .on('mouseleave', () => {
          tooltipEl.style('opacity', 0);
        });
    }

    return {
      chart,
      tooltip,
      width,
      height,
      margin,
    };
  },
});
</script>

<style lang="scss" scoped>
.chart {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .fill {
    .tooltip {
      color: var(--clr-neutral-700);
      opacity: 0;
      position: absolute;
      top: -12px;
      left: 0;
      padding: 0.6em 1em;
      background: #fff;
      text-align: center;
      border: 1px solid #333;
      transition: all 0.2s ease-out;
      pointer-events: none;
      z-index: 100;
    }

    // down arrow
    .tooltip:before {
      content: '';
      position: absolute;
      bottom: 0;
      left: 50%;
      width: 12px;
      height: 12px;
      background: white;
      border: 1px solid #333;
      border-color: transparent #333 #333 transparent;
      transform: translate(-50%, 50%) rotate(45deg);
      transform-origin: center center;
      z-index: 100;
    }

    .tooltip-range {
      margin-bottom: 0.2em;
      font-weight: 600;
    }
  }

  h3 {
    text-align: center;
  }

  svg {
    max-width: 100%;
    flex: 1;
  }
}
</style>

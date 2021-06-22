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
    const margin = { top: 20, right: 30, bottom: 20, left: 50 };
    const chart = ref(null);
    const tooltip = ref(null);

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
        .attr('width', width)
        .attr('height', height)
        .attr('viewBox', `0, 0, ${width}, ${height}`);

      const t = d3.transition().duration(1000);

      // get all subgroup names besides the title
      const subgroups = [];
      for (const key in data[0]) {
        if (key !== 'Month') subgroups.push(key);
      }

      // list of groups for x-axis
      const groups = d3.map(data, (d) => d.Month);

      // x-axis
      const xScale = d3
        .scaleBand()
        .domain(groups)
        .range([margin.left, width - margin.right])
        .padding(0.05);

      const xAxis = d3.axisBottom(xScale).tickSizeOuter(0).tickValues([]);

      svg
        .append('g')
        .classed('x-axis', true)
        .call(xAxis)
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      // y-axis
      const yScale = d3
        .scaleLinear()
        .domain([0, 500])
        .range([height - margin.bottom, margin.top]);

      const yAxis = d3.axisLeft(yScale);

      svg
        .append('g')
        .classed('y-axis', true)
        .call(yAxis)
        .attr('transform', `translate(${margin.left}, 0)`)
        .attr('font-size', width < 500 ? '1.2rem' : '1.5rem');

      // color palette
      const colorScale = d3.scaleOrdinal(['red', 'orange']);

      // stack the data? --> stack per subgroup
      const stackGen = d3.stack().keys(subgroups);
      const stackedData = stackGen(data);

      // bars
      const bars = svg
        .append('g')
        .classed('bars', true)
        .selectAll('g')
        // Enter in the stack data = loop key per key = group per group
        .data(stackedData)
        .join('g');

      bars
        .attr('fill', (d) => {
          return colorScale(d.key);
        })
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .selectAll('rect')
        .data((d) => {
          return d;
        })
        .join('rect')
        .attr('x', (d) => {
          return xScale(d.data.Month);
        })
        .attr('y', height - margin.bottom)
        .attr('height', 0)
        .attr('width', xScale.bandwidth())
        .transition(t)
        .attr('y', (d) => {
          return yScale(d[1]);
        })
        .attr('height', (d) => {
          return yScale(d[0]) - yScale(d[1]);
        });

      // legend
      const legend = svg
        .append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 10)
        .attr('text-anchor', 'end')
        .selectAll('g')
        .data(subgroups.reverse())
        .join('g')
        .attr('transform', (_d, i) => {
          return 'translate(0,' + i * 20 + ')';
        });

      legend
        .append('rect')
        .attr('x', width - margin.right - 19)
        .attr('y', margin.top)
        .attr('width', 19)
        .attr('height', 19)
        .attr('fill', colorScale);

      legend
        .append('text')
        .attr('fill', 'white')
        .attr('x', width - margin.right - 24)
        .attr('y', margin.top + 9.5)
        .attr('dy', '0.32em')
        .text((d) => {
          return d;
        });

      // interactions
      const tooltipEl = d3.select(tooltip.value);

      bars
        .on('mouseenter', (_e, d) => {
          tooltipEl.select('#range').text(d.key + ': ');
          tooltipEl.select('#count').text(d[0].data[d.key]);

          const xPos = width / 2;
          const yPos = yScale(d[0][1]);

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

    function update() {
      const data = props.data;
      const svg = d3.select(chart.value);

      const t = d3.transition().duration(1000);

      const yScale = d3
        .scaleLinear()
        .domain([0, 500])
        .range([height - margin.bottom, margin.top]);

      const colorScale = d3.scaleOrdinal(['red', 'orange']);

      const subgroups = [];
      for (const key in data[0]) {
        if (key !== 'Month') subgroups.push(key);
      }
      // stack the data? --> stack per subgroup
      const stackGen = d3.stack().keys(subgroups);
      const stackedData = stackGen(data);

      // bars
      svg
        .select('.bars')
        .selectAll('g')
        .data(stackedData)
        .join('g')
        .attr('fill', (d) => {
          return colorScale(d.key);
        })
        .selectAll('rect')
        .data((d) => {
          return d;
        })
        .join('rect')
        .transition(t)
        .attr('y', (d) => {
          return yScale(d[1]);
        })
        .attr('height', (d) => {
          return yScale(d[0]) - yScale(d[1]);
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

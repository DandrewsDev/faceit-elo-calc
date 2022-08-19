<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GaugeChart } from 'echarts/charts'
import {
  TooltipComponent,
} from 'echarts/components'
import VChart, { THEME_KEY } from 'vue-echarts'
import { defineComponent, ref } from 'vue'

use([
  TooltipComponent, GaugeChart, CanvasRenderer,
])

export default defineComponent({
  name: 'LeetifyStatsGauge',
  components: {
    VChart,
  },
  provide: {
    [THEME_KEY]: 'dark',
  },
  props: ['playerStats'],
  setup(props) {
    const showChart = ref(false)
    const option = ref({
      tooltip: {
        formatter: '{b}: {c}%',
      },
      backgroundColor: '#181818',
      series: [
        {
          radius: '90%',
          type: 'gauge',
          startAngle: 90,
          endAngle: -270,
          pointer: {
            show: false,
          },
          progress: {
            show: true,
            overlap: false,
            roundCap: true,
            clip: false,
            itemStyle: {
              borderWidth: 1,
              borderColor: '#464646',
            },
          },
          axisLine: {
            lineStyle: {
              width: 80,
            },
          },
          splitLine: {
            show: false,
            distance: 0,
            length: 10,
          },
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
            distance: 50,
          },
          data: [
            {
              value: props.playerStats.leetify_rating,
              name: 'Leetify Rating',
              title: {
                offsetCenter: ['-22%', '-40%'],
              },
              itemStyle: {
                color: props.playerStats.leetify_rating_color,
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['-22%', '-30%'],
              },
            },
            {
              value: props.playerStats.aim_rating,
              name: 'Aim',
              title: {
                offsetCenter: ['22%', '-40%'],
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['22%', '-30%'],
              },
            },
            {
              value: props.playerStats.utility_rating,
              name: 'Utility',
              title: {
                offsetCenter: ['-22%', '-10%'],
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['-22%', '0%'],
              },
            },
            {
              value: props.playerStats.positioning_rating,
              name: 'Positioning',
              title: {
                offsetCenter: ['22%', '-10%'],
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['22%', '0%'],
              },
            },
            {
              value: props.playerStats.clutch_rating,
              name: 'Clutching',
              title: {
                offsetCenter: ['-22%', '26%'],
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['-22%', '36%'],
              },
            },
            {
              value: props.playerStats.opening_duels_rating,
              name: 'Opening Duels',
              title: {
                offsetCenter: ['22%', '26%'],
              },
              detail: {
                valueAnimation: true,
                offsetCenter: ['22%', '36%'],
              },
            },
          ],
          title: {
            fontSize: 14,
          },
          detail: {
            width: 50,
            height: 12,
            fontSize: 14,
            color: 'auto',
            borderColor: 'auto',
            borderRadius: 20,
            borderWidth: 1,
            formatter: '{value}%',
          },
        },
      ],
    })
    return { option, showChart }
  },
})
</script>

<template>
  <VChart class="chart" :option="option" />
</template>

<style scoped>
.chart {
  height: 410px;
  width: 410px;
}
</style>

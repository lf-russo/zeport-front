<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: { type: Object, required: true },
  preview: { type: Boolean, default: false }
})

const MOCK_DATA = Array.from({ length: 24 }, (_, i) => [
  new Date(Date.now() - (23 - i) * 3600000).toISOString(),
  Math.round(20 + Math.random() * 60)
])

const option = computed(() => ({
  grid: { top: 10, right: 10, bottom: 20, left: 36 },
  xAxis: {
    type: 'category',
    data: MOCK_DATA.map(d => new Date(d[0]).getHours() + 'h'),
    axisLabel: { fontSize: 9, color: '#9ca3af' },
    axisLine: { show: false },
    axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontSize: 9, color: '#9ca3af' },
    splitLine: { lineStyle: { color: '#f3f4f6' } }
  },
  series: [{
    type: 'line',
    data: MOCK_DATA.map(d => d[1]),
    smooth: true,
    symbol: 'none',
    lineStyle: { color: props.config.color || '#185FA5', width: 2 },
    areaStyle: props.config.filled !== false ? {
      color: (props.config.color || '#185FA5') + '22'
    } : null
  }],
  tooltip: {
    trigger: 'axis',
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
    textStyle: { color: '#111827', fontSize: 11 }
  }
}))
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 80px; }
</style>

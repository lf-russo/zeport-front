<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ config: Object, preview: Boolean })

const LABELS = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom']
const MOCK = LABELS.map(() => Math.round(10 + Math.random() * 80))

const option = computed(() => ({
  grid: { top: 10, right: 10, bottom: 20, left: 36 },
  xAxis: {
    type: 'category', data: LABELS,
    axisLabel: { fontSize: 9, color: '#9ca3af' },
    axisLine: { show: false }, axisTick: { show: false }
  },
  yAxis: {
    type: 'value',
    axisLabel: { fontSize: 9, color: '#9ca3af' },
    splitLine: { lineStyle: { color: '#f3f4f6' } }
  },
  series: [{
    type: 'bar', data: MOCK,
    itemStyle: { color: props.config.color || '#1D9E75', borderRadius: [3,3,0,0] },
    barMaxWidth: 32
  }],
  tooltip: { trigger: 'axis', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { fontSize: 11 } }
}))
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 80px; }
</style>

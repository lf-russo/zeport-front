<template>
  <VChart class="chart" :option="option" autoresize />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  config: Object,
  preview: Boolean,
  donut: { type: Boolean, default: false }
})

const MOCK_DATA = [
  { value: 3, name: 'High/Disaster', itemStyle: { color: '#E24B4A' } },
  { value: 8, name: 'Average', itemStyle: { color: '#EF9F27' } },
  { value: 15, name: 'Warning/Info', itemStyle: { color: '#185FA5' } }
]

const option = computed(() => ({
  legend: props.config.show_legend ? {
    orient: 'vertical', right: 0, top: 'center',
    textStyle: { fontSize: 10, color: '#6b7280' },
    itemWidth: 8, itemHeight: 8
  } : false,
  series: [{
    type: 'pie',
    radius: props.donut ? ['45%', '70%'] : '70%',
    center: props.config.show_legend ? ['35%', '50%'] : ['50%', '50%'],
    data: MOCK_DATA,
    label: { show: false },
    emphasis: { scale: true, scaleSize: 4 }
  }],
  tooltip: { trigger: 'item', backgroundColor: '#fff', borderColor: '#e5e7eb', textStyle: { fontSize: 11 } }
}))
</script>

<style scoped>
.chart { width: 100%; height: 100%; min-height: 80px; }
</style>

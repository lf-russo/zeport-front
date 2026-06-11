<template>
  <PieChartWidget :config="config" :preview="preview" :donut="true" />
</template>

<script setup>
import PieChartWidget from './PieChartWidget.vue'
defineProps({ config: Object, preview: Boolean })
</script>

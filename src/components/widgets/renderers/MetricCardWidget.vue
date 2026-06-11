<template>
  <div class="metric">
    <div class="metric-value" :style="{ color: config.color || '#185FA5' }">
      {{ mockValue }}{{ config.unit }}
    </div>
    <div class="metric-label">{{ config.title }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ config: Object, preview: Boolean })

const mockValue = computed(() => {
  const v = 95 + Math.random() * 5
  return v.toFixed(props.config.decimals ?? 1)
})
</script>

<style scoped>
.metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  width: 100%;
  height: 100%;
}

.metric-value {
  font-size: 28px;
  font-weight: 600;
  line-height: 1;
}

.metric-label {
  font-size: 11px;
  color: var(--color-text-hint);
}
</style>

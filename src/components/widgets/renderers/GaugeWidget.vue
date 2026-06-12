<template>
  <div class="gauge-wrap">
    <svg :viewBox="`0 0 200 ${svgHeight}`" class="gauge-svg" aria-hidden="true">
      <path
        :d="arcPath"
        fill="none"
        stroke="var(--color-border)"
        :stroke-width="SW"
        stroke-linecap="round"
      />
      <path
        :d="arcPath"
        fill="none"
        :stroke="config.color || '#185FA5'"
        :stroke-width="SW"
        stroke-linecap="round"
        :stroke-dasharray="`${filledLength} ${arcLength}`"
      />
    </svg>
    <div class="gauge-value" :style="{ color: config.color || '#185FA5' }">
      {{ displayValue }}{{ config.unit }}
    </div>
    <div class="gauge-label">{{ config.title }}</div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({ config: Object, preview: Boolean })

const R = 82
const SW = 16
const CX = 100
const CY = 100

const svgHeight = CY + SW / 2 + 2
const arcPath = `M ${CX - R} ${CY} A ${R} ${R} 0 0 1 ${CX + R} ${CY}`
const arcLength = Math.PI * R

const mockValue = 73

const rawValue = computed(() => {
  if (props.preview) return mockValue
  return Number(props.config.value ?? mockValue)
})

const min = computed(() => Number(props.config.min ?? 0))
const max = computed(() => Number(props.config.max ?? 100))

const percent = computed(() => {
  const range = max.value - min.value
  if (range === 0) return 0
  return Math.min(1, Math.max(0, (rawValue.value - min.value) / range))
})

const filledLength = computed(() => percent.value * arcLength)

const displayValue = computed(() =>
  rawValue.value.toFixed(props.config.decimals ?? 1)
)
</script>

<style scoped>
.gauge-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  gap: 2px;
}

.gauge-svg {
  width: 100%;
  max-width: 180px;
}

.gauge-value {
  font-size: 22px;
  font-weight: 600;
  line-height: 1;
  margin-top: -4px;
}

.gauge-label {
  font-size: 11px;
  color: var(--color-text-hint);
}
</style>

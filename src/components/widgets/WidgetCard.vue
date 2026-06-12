<template>
  <div
    class="widget-card"
    :class="{ selected }"
    @click.stop="$emit('select')"
  >
    <div class="widget-header">
      <span class="widget-title">
        <i :class="`ti ${widgetDef?.icon}`" aria-hidden="true"></i>
        {{ widget.config.title || widgetDef?.label }}
      </span>
      <div class="widget-controls">
        <button class="icon-btn drag-handle" title="Mover">
          <i class="ti ti-grip-horizontal" aria-hidden="true"></i>
        </button>
        <button class="icon-btn" @click.stop="$emit('remove')" title="Remover">
          <i class="ti ti-x" aria-hidden="true"></i>
        </button>
      </div>
    </div>

    <div class="widget-body">
      <component :is="widgetComponent" :config="widget.config" :preview="true" />
    </div>
  </div>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue'
import { WIDGET_TYPES } from './widgetTypes.js'

const props = defineProps({
  widget: { type: Object, required: true },
  selected: { type: Boolean, default: false }
})

defineEmits(['select', 'remove'])

const widgetDef = computed(() => WIDGET_TYPES[props.widget.type])

const WIDGET_COMPONENTS = {
  line_chart: defineAsyncComponent(() => import('./renderers/LineChartWidget.vue')),
  bar_chart: defineAsyncComponent(() => import('./renderers/BarChartWidget.vue')),
  pie_chart: defineAsyncComponent(() => import('./renderers/PieChartWidget.vue')),
  donut_chart: defineAsyncComponent(() => import('./renderers/DonutChartWidget.vue')),
  metric_card: defineAsyncComponent(() => import('./renderers/MetricCardWidget.vue')),
  problems_table: defineAsyncComponent(() => import('./renderers/ProblemsTableWidget.vue')),
  text_box: defineAsyncComponent(() => import('./renderers/TextBoxWidget.vue')),
  divider: defineAsyncComponent(() => import('./renderers/DividerWidget.vue')),
  gauge: defineAsyncComponent(() => import('./renderers/GaugeWidget.vue'))
}

const widgetComponent = computed(() => WIDGET_COMPONENTS[props.widget.type] || null)
</script>

<style scoped>
.widget-card {
  height: 100%;
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s;
}

.widget-card:hover { border-color: var(--color-border); box-shadow: 0 0 0 1px var(--color-border); }
.widget-card.selected { border: 1.5px solid var(--color-primary); }

.widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 6px 10px;
  border-bottom: 0.5px solid var(--color-border-light);
  flex-shrink: 0;
}

.widget-title {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
}

.widget-title i { font-size: 13px; }

.widget-controls {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.1s;
}

.widget-card:hover .widget-controls,
.widget-card.selected .widget-controls { opacity: 1; }

.icon-btn {
  width: 20px; height: 20px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--color-text-hint); border-radius: 4px;
}

.icon-btn:hover { background: var(--color-bg); color: var(--color-text-muted); }
.icon-btn i { font-size: 13px; }
.drag-handle { cursor: grab; }
.drag-handle:active { cursor: grabbing; }

.widget-body {
  flex: 1;
  overflow: hidden;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

<template>
  <div class="props-panel">
    <div class="panel-header">
      <i :class="`ti ${widgetDef?.icon}`" aria-hidden="true"></i>
      <span>{{ widgetDef?.label || 'Widget' }}</span>
      <button class="icon-btn ml-auto" @click="$emit('deselect')" title="Fechar">
        <i class="ti ti-x" aria-hidden="true"></i>
      </button>
    </div>

    <div class="panel-body">
      <div class="field" v-if="cfg.title !== undefined">
        <label class="field-label">Título</label>
        <input type="text" v-model="cfg.title" @input="emit" />
      </div>

      <template v-if="['line_chart','bar_chart'].includes(widget.type)">
        <div class="field">
          <label class="field-label">Item Zabbix</label>
          <select v-model="cfg.item_key" @change="emit">
            <option value="">Selecionar item...</option>
            <option v-for="item in items" :key="item.itemid" :value="item.key_">
              {{ item.name }}
            </option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Período</label>
          <select v-model="cfg.period" @change="emit">
            <option v-for="p in PERIOD_OPTIONS" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Cor</label>
          <div class="color-row">
            <div
              v-for="c in PRESET_COLORS"
              :key="c"
              class="swatch"
              :class="{ active: cfg.color === c }"
              :style="{ background: c }"
              @click="cfg.color = c; emit()"
            ></div>
            <input type="color" v-model="cfg.color" @input="emit" class="color-picker" />
          </div>
        </div>
        <div class="field" v-if="widget.type === 'line_chart'">
          <label class="field-label">Área preenchida</label>
          <select v-model="cfg.filled" @change="emit">
            <option :value="true">Sim</option>
            <option :value="false">Não</option>
          </select>
        </div>
      </template>

      <template v-if="['pie_chart','donut_chart'].includes(widget.type)">
        <div class="field">
          <label class="field-label">Fonte dos dados</label>
          <select v-model="cfg.data_source" @change="emit">
            <option v-for="d in DATA_SOURCE_OPTIONS" :key="d.value" :value="d.value">{{ d.label }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Período</label>
          <select v-model="cfg.period" @change="emit">
            <option v-for="p in PERIOD_OPTIONS" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>
        </div>
      </template>

      <template v-if="widget.type === 'metric_card'">
        <div class="field">
          <label class="field-label">Item Zabbix</label>
          <select v-model="cfg.item_key" @change="emit">
            <option value="">Selecionar item...</option>
            <option v-for="item in items" :key="item.itemid" :value="item.key_">{{ item.name }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Unidade</label>
          <input type="text" v-model="cfg.unit" placeholder="%, ms, Mbps..." @input="emit" />
        </div>
        <div class="field">
          <label class="field-label">Casas decimais</label>
          <input type="number" v-model.number="cfg.decimals" min="0" max="4" @input="emit" />
        </div>
        <div class="field">
          <label class="field-label">Cor do valor</label>
          <div class="color-row">
            <div v-for="c in PRESET_COLORS" :key="c" class="swatch" :class="{ active: cfg.color === c }" :style="{ background: c }" @click="cfg.color = c; emit()"></div>
            <input type="color" v-model="cfg.color" @input="emit" class="color-picker" />
          </div>
        </div>
      </template>

      <template v-if="widget.type === 'problems_table'">
        <div class="field">
          <label class="field-label">Severidade mínima</label>
          <select v-model="cfg.min_severity" @change="emit">
            <option v-for="s in SEVERITY_OPTIONS" :key="s.value" :value="s.value">{{ s.label }}</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Máx. de linhas</label>
          <input type="number" v-model.number="cfg.max_rows" min="5" max="100" @input="emit" />
        </div>
        <div class="field">
          <label class="field-label">Período</label>
          <select v-model="cfg.period" @change="emit">
            <option v-for="p in PERIOD_OPTIONS" :key="p.value" :value="p.value">{{ p.label }}</option>
          </select>
        </div>
      </template>

      <template v-if="widget.type === 'text_box'">
        <div class="field">
          <label class="field-label">Conteúdo</label>
          <textarea v-model="cfg.content" rows="3" @input="emit"></textarea>
          <div class="field-hint">Use <code>{"{{"}host_name{{"}}"}}</code> para inserir o nome do host</div>
        </div>
        <div class="field">
          <label class="field-label">Tamanho da fonte</label>
          <select v-model="cfg.font_size" @change="emit">
            <option value="12px">Pequeno</option>
            <option value="14px">Normal</option>
            <option value="16px">Médio</option>
            <option value="20px">Grande</option>
            <option value="24px">Título</option>
          </select>
        </div>
        <div class="field">
          <label class="field-label">Alinhamento</label>
          <select v-model="cfg.align" @change="emit">
            <option value="left">Esquerda</option>
            <option value="center">Centro</option>
            <option value="right">Direita</option>
          </select>
        </div>
      </template>

      <div class="field size-field">
        <label class="field-label">Tamanho (colunas × linhas)</label>
        <div class="size-row">
          <input type="number" :value="widget.w" min="1" max="12" @input="$emit('resize', { w: +$event.target.value, h: widget.h })" />
          <span>×</span>
          <input type="number" :value="widget.h" min="1" max="12" @input="$emit('resize', { w: widget.w, h: +$event.target.value })" />
        </div>
      </div>
    </div>

    <div class="panel-footer">
      <button class="btn-ghost" @click="$emit('duplicate')">
        <i class="ti ti-copy" aria-hidden="true"></i>Duplicar
      </button>
      <button class="btn-ghost btn-danger" @click="$emit('remove')">
        <i class="ti ti-trash" aria-hidden="true"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from 'vue'
import { WIDGET_TYPES, PERIOD_OPTIONS, SEVERITY_OPTIONS, DATA_SOURCE_OPTIONS } from './widgetTypes.js'

const props = defineProps({
  widget: { type: Object, required: true },
  items: { type: Array, default: () => [] }
})

const emits = defineEmits(['update', 'deselect', 'remove', 'duplicate', 'resize'])

const PRESET_COLORS = ['#185FA5','#1D9E75','#E24B4A','#EF9F27','#7F77DD','#D85A30']

const widgetDef = computed(() => WIDGET_TYPES[props.widget.type])
const cfg = reactive({ ...props.widget.config })

watch(() => props.widget, (w) => {
  Object.assign(cfg, w.config)
}, { deep: true })

function emit() {
  emits('update', { config: { ...cfg } })
}
</script>

<style scoped>
.props-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.panel-header {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 12px 14px;
  border-bottom: 0.5px solid var(--color-border);
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  flex-shrink: 0;
}

.panel-header i { font-size: 16px; color: var(--color-primary); }
.ml-auto { margin-left: auto; }

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field { display: flex; flex-direction: column; gap: 4px; }

.field-label {
  font-size: 10px;
  font-weight: 500;
  color: var(--color-text-hint);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field input[type=text],
.field input[type=number],
.field select,
.field textarea {
  padding: 5px 8px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 12px;
  width: 100%;
}

.field textarea { resize: vertical; min-height: 60px; }
.field-hint { font-size: 10px; color: var(--color-text-hint); }
.field-hint code { background: var(--color-bg); padding: 1px 3px; border-radius: 3px; }

.color-row { display: flex; align-items: center; gap: 5px; }

.swatch {
  width: 22px;
  height: 22px;
  border-radius: 4px;
  border: 0.5px solid var(--color-border);
  cursor: pointer;
  flex-shrink: 0;
}

.swatch.active { outline: 2px solid var(--color-primary); outline-offset: 1px; }

.color-picker {
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  border-radius: 4px;
  cursor: pointer;
}

.size-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.size-row input { width: 60px; text-align: center; }
.size-row span { color: var(--color-text-muted); }

.panel-footer {
  display: flex;
  gap: 6px;
  padding: 10px 14px;
  border-top: 0.5px solid var(--color-border);
  flex-shrink: 0;
}

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
}

.btn-ghost:hover { background: var(--color-bg); }
.btn-ghost.btn-danger:hover { color: var(--color-danger); border-color: var(--color-danger); }
.btn-ghost i { font-size: 14px; }

.icon-btn {
  width: 24px; height: 24px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--color-text-muted); border-radius: var(--radius-sm);
}
.icon-btn:hover { background: var(--color-bg); }
.icon-btn i { font-size: 14px; }
</style>

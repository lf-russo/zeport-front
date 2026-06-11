<template>
  <div class="builder-page">
    <div class="builder-topbar">
      <div class="topbar-left">
        <RouterLink to="/templates" class="back-btn">
          <i class="ti ti-arrow-left" aria-hidden="true"></i>
        </RouterLink>
        <div class="divider-v"></div>
        <input
          v-model="templateName"
          class="template-name-input"
          placeholder="Nome do template..."
        />
        <span v-if="isDirty" class="unsaved-badge">não salvo</span>
      </div>
      <div class="topbar-right">
        <button class="btn-ghost" @click="toggleGrid">
          <i class="ti ti-grid-dots" aria-hidden="true"></i>
          Grade
        </button>
        <button class="btn-ghost" :disabled="saving" @click="saveTemplate">
          <i class="ti ti-device-floppy" aria-hidden="true"></i>
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
        <button class="btn-primary" @click="showGenerateModal = true">
          <i class="ti ti-file-type-pdf" aria-hidden="true"></i>
          Gerar relatório
        </button>
      </div>
    </div>

    <div class="builder-workspace">
      <div class="panel-widgets">
        <div class="panel-section">Widgets</div>
        <div
          v-for="wt in WIDGET_LIST"
          :key="wt.type"
          class="widget-palette-item"
          draggable="true"
          @dragstart="onDragStart(wt)"
        >
          <i :class="`ti ${wt.icon}`" aria-hidden="true"></i>
          {{ wt.label }}
        </div>
      </div>

      <div
        class="canvas"
        :class="{ 'show-grid': showGridDots }"
        @dragover.prevent
        @drop="onDrop"
        @click.self="selectedId = null"
      >
        <GridLayout
          v-model:layout="layout"
          :col-num="12"
          :row-height="60"
          :is-draggable="true"
          :is-resizable="true"
          :margin="[8, 8]"
          :use-css-transforms="true"
          drag-allow-from=".drag-handle"
        >
          <GridItem
            v-for="item in layout"
            :key="item.i"
            :x="item.x" :y="item.y"
            :w="item.w" :h="item.h"
            :i="item.i"
            @moved="onMoved"
            @resized="onResized"
          >
            <WidgetCard
              :widget="item"
              :selected="selectedId === item.i"
              @select="selectedId = item.i"
              @remove="removeWidget(item.i)"
            />
          </GridItem>
        </GridLayout>

        <div v-if="layout.length === 0" class="canvas-empty">
          <i class="ti ti-drag-drop" aria-hidden="true"></i>
          <p>Arraste widgets para cá para começar</p>
        </div>
      </div>

      <div class="panel-props" v-if="selectedWidget">
        <WidgetProps
          :widget="selectedWidget"
          :items="zabbixItems"
          @update="updateWidgetConfig"
          @deselect="selectedId = null"
          @remove="removeWidget(selectedId)"
          @duplicate="duplicateWidget(selectedId)"
          @resize="resizeWidget"
        />
      </div>
      <div class="panel-props panel-props-empty" v-else>
        <i class="ti ti-cursor-text" aria-hidden="true"></i>
        <p>Selecione um widget para editar suas propriedades</p>
      </div>
    </div>

    <div class="builder-statusbar">
      <div class="status-left">
        <span class="status-dot success"></span>
        Zabbix conectado
      </div>
      <div class="status-right">
        {{ layout.length }} widgets · grade 12 colunas
      </div>
    </div>

    <div v-if="showGenerateModal" class="modal-overlay" @click.self="showGenerateModal = false">
      <div class="modal">
        <div class="modal-header">
          <span>Gerar relatório</span>
          <button class="icon-btn" @click="showGenerateModal = false">
            <i class="ti ti-x" aria-hidden="true"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="field">
            <label class="field-label">Título do relatório</label>
            <input type="text" v-model="generateForm.title" placeholder="Ex: Relatório Mensal Jun/2026" />
          </div>
          <div class="field">
            <label class="field-label">Hosts</label>
            <select v-model="generateForm.host_ids" multiple>
              <option v-for="h in zabbixHosts" :key="h.hostid" :value="h.hostid">{{ h.name }}</option>
            </select>
            <div class="field-hint">Segure Ctrl para selecionar múltiplos</div>
          </div>
          <div class="field date-row">
            <div>
              <label class="field-label">De</label>
              <input type="datetime-local" v-model="generateForm.period_from" />
            </div>
            <div>
              <label class="field-label">Até</label>
              <input type="datetime-local" v-model="generateForm.period_to" />
            </div>
          </div>
          <div class="quick-periods">
            <button class="btn-ghost" @click="setQuickPeriod(1)">Hoje</button>
            <button class="btn-ghost" @click="setQuickPeriod(7)">7 dias</button>
            <button class="btn-ghost" @click="setQuickPeriod(30)">30 dias</button>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-ghost" @click="showGenerateModal = false">Cancelar</button>
          <button class="btn-primary" @click="generateReport" :disabled="generating">
            <i class="ti ti-file-type-pdf" aria-hidden="true"></i>
            {{ generating ? 'Gerando...' : 'Gerar PDF' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter, RouterLink } from 'vue-router'
import { GridLayout, GridItem } from 'grid-layout-plus'
import { useTemplateStore } from '@/stores/templates'
import { zabbixService } from '@/services/zabbix'
import { WIDGET_LIST, WIDGET_TYPES } from '@/components/widgets/widgetTypes.js'
import WidgetCard from '@/components/widgets/WidgetCard.vue'
import WidgetProps from '@/components/widgets/WidgetProps.vue'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()
const store = useTemplateStore()

const templateName = ref('Novo template')
const layout = ref([])
const selectedId = ref(null)
const isDirty = ref(false)
const saving = ref(false)
const showGridDots = ref(true)
const showGenerateModal = ref(false)
const generating = ref(false)
const zabbixHosts = ref([])
const zabbixItems = ref([])

const generateForm = ref({
  title: '',
  host_ids: [],
  period_from: '',
  period_to: ''
})

const selectedWidget = computed(() => layout.value.find(w => w.i === selectedId.value) || null)

watch(layout, () => { isDirty.value = true }, { deep: true })
watch(templateName, () => { isDirty.value = true })

onMounted(async () => {
  if (route.params.id) {
    const tpl = await store.fetchOne(route.params.id)
    templateName.value = tpl.name
    layout.value = tpl.layout || []
    isDirty.value = false
  }
  try {
    const hosts = await zabbixService.getHosts()
    zabbixHosts.value = hosts
    if (hosts.length > 0) {
      const items = await zabbixService.getItems(hosts.slice(0,3).map(h => h.hostid))
      zabbixItems.value = items
    }
  } catch (e) {
    console.warn('Zabbix não disponível, usando mock')
  }
})

let dragWidget = null

function onDragStart(wt) {
  dragWidget = wt
}

function onDrop(e) {
  if (!dragWidget) return
  const def = WIDGET_TYPES[dragWidget.type]
  const newWidget = {
    i: `widget-${Date.now()}`,
    x: 0,
    y: layout.value.length * 2,
    w: def.defaultSize.w,
    h: def.defaultSize.h,
    type: dragWidget.type,
    config: { ...def.defaultConfig, title: def.label }
  }
  layout.value.push(newWidget)
  selectedId.value = newWidget.i
  dragWidget = null
}

function removeWidget(id) {
  layout.value = layout.value.filter(w => w.i !== id)
  if (selectedId.value === id) selectedId.value = null
}

function duplicateWidget(id) {
  const w = layout.value.find(w => w.i === id)
  if (!w) return
  const clone = {
    ...JSON.parse(JSON.stringify(w)),
    i: `widget-${Date.now()}`,
    y: w.y + w.h
  }
  layout.value.push(clone)
  selectedId.value = clone.i
}

function updateWidgetConfig({ config }) {
  const w = layout.value.find(w => w.i === selectedId.value)
  if (w) w.config = { ...w.config, ...config }
}

function resizeWidget({ w, h }) {
  const item = layout.value.find(w => w.i === selectedId.value)
  if (item) { item.w = w; item.h = h }
}

function onMoved() { isDirty.value = true }
function onResized() { isDirty.value = true }
function toggleGrid() { showGridDots.value = !showGridDots.value }

async function saveTemplate() {
  saving.value = true
  try {
    const payload = {
      id: route.params.id || undefined,
      name: templateName.value,
      layout: layout.value,
      widget_count: layout.value.length
    }
    const saved = await store.save(payload)
    isDirty.value = false
    if (!route.params.id) {
      router.replace(`/templates/${saved.id}/edit`)
    }
  } finally {
    saving.value = false
  }
}

function setQuickPeriod(days) {
  const now = new Date()
  const from = new Date(now - days * 86400000)
  generateForm.value.period_to = now.toISOString().slice(0, 16)
  generateForm.value.period_from = from.toISOString().slice(0, 16)
}

async function generateReport() {
  generating.value = true
  try {
    const { data } = await api.post('/reports', {
      title: generateForm.value.title,
      template_id: route.params.id,
      config: {
        host_ids: generateForm.value.host_ids,
        period_from: generateForm.value.period_from,
        period_to: generateForm.value.period_to
      }
    })
    showGenerateModal.value = false
    router.push('/reports')
  } finally {
    generating.value = false
  }
}
</script>

<style scoped>
.builder-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
}

.builder-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 9px 16px;
  background: var(--color-surface);
  border-bottom: 0.5px solid var(--color-border);
  flex-shrink: 0;
  gap: 12px;
}

.topbar-left, .topbar-right { display: flex; align-items: center; gap: 8px; }

.back-btn {
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
}
.back-btn:hover { background: var(--color-bg); }
.back-btn i { font-size: 15px; }

.divider-v { width: 0.5px; height: 18px; background: var(--color-border); }

.template-name-input {
  border: none;
  background: transparent;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  padding: 3px 6px;
  border-radius: var(--radius-sm);
  width: 240px;
}
.template-name-input:focus { background: var(--color-bg); }

.unsaved-badge {
  font-size: 10px;
  padding: 2px 7px;
  background: var(--color-warning-light);
  color: #854F0B;
  border-radius: 10px;
}

.btn-ghost {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 5px 10px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 12px;
}
.btn-ghost:hover { background: var(--color-bg); }
.btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-ghost i { font-size: 14px; }

.btn-primary {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 13px;
  background: var(--color-primary);
  color: white; border: none;
  border-radius: var(--radius-md);
  font-size: 12px; font-weight: 500;
}
.btn-primary:hover { background: var(--color-primary-dark); }

.builder-workspace {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.panel-widgets {
  width: 160px;
  background: var(--color-surface);
  border-right: 0.5px solid var(--color-border);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex-shrink: 0;
  padding-bottom: 12px;
}

.panel-section {
  padding: 10px 12px 4px;
  font-size: 10px;
  color: var(--color-text-hint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.widget-palette-item {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 7px 10px;
  margin: 1px 6px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 12px;
  color: var(--color-text-muted);
  cursor: grab;
  user-select: none;
}
.widget-palette-item:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: var(--color-primary-light);
}
.widget-palette-item i { font-size: 15px; }

.canvas {
  flex: 1;
  overflow: auto;
  padding: 16px;
  background: var(--color-bg);
  position: relative;
}

.canvas.show-grid {
  background-image: radial-gradient(circle, #c8ccd4 1.5px, transparent 1.5px);
  background-size: 20px 20px;
}

.canvas-empty {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: var(--color-text-hint);
  pointer-events: none;
}
.canvas-empty i { font-size: 36px; }
.canvas-empty p { font-size: 13px; }

.panel-props {
  width: 220px;
  background: var(--color-surface);
  border-left: 0.5px solid var(--color-border);
  flex-shrink: 0;
  overflow: hidden;
}

.panel-props-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: var(--color-text-hint);
  padding: 20px;
  text-align: center;
}
.panel-props-empty i { font-size: 28px; }
.panel-props-empty p { font-size: 12px; }

.builder-statusbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 5px 16px;
  background: var(--color-surface);
  border-top: 0.5px solid var(--color-border);
  font-size: 10px;
  color: var(--color-text-hint);
  flex-shrink: 0;
}

.status-left { display: flex; align-items: center; gap: 6px; }
.status-dot { width: 6px; height: 6px; border-radius: 50%; }
.status-dot.success { background: var(--color-success); }

.modal-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.35);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  width: 440px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 16px;
  border-bottom: 0.5px solid var(--color-border);
  font-size: 14px; font-weight: 500;
}

.modal-body {
  padding: 16px;
  display: flex; flex-direction: column; gap: 14px;
}

.modal-footer {
  display: flex; justify-content: flex-end; gap: 8px;
  padding: 12px 16px;
  border-top: 0.5px solid var(--color-border);
}

.field { display: flex; flex-direction: column; gap: 4px; }

.field-label {
  font-size: 10px; font-weight: 500;
  color: var(--color-text-hint);
  text-transform: uppercase; letter-spacing: 0.04em;
}

.field input, .field select {
  padding: 7px 9px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 13px; width: 100%;
}

.field select[multiple] { height: 90px; }
.field-hint { font-size: 10px; color: var(--color-text-hint); }

.date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }

.quick-periods { display: flex; gap: 6px; }
.quick-periods .btn-ghost { font-size: 11px; padding: 4px 9px; }

.icon-btn {
  width: 26px; height: 26px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: transparent;
  color: var(--color-text-muted); border-radius: var(--radius-sm);
}
.icon-btn:hover { background: var(--color-bg); }
.icon-btn i { font-size: 14px; }
</style>

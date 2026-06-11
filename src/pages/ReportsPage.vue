<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Relatórios</h1>
        <p class="page-sub">Histórico de relatórios gerados</p>
      </div>
    </div>

    <div class="filters">
      <select v-model="filterStatus">
        <option value="">Todos os status</option>
        <option value="done">Concluídos</option>
        <option value="generating">Gerando</option>
        <option value="error">Com erro</option>
      </select>
    </div>

    <div class="reports-list">
      <div v-for="r in filteredReports" :key="r.id" class="report-row">
        <div class="report-icon" :class="r.status">
          <i :class="`ti ${statusIcon(r.status)}`" aria-hidden="true"></i>
        </div>
        <div class="report-info">
          <div class="report-title">{{ r.title }}</div>
          <div class="report-meta">
            {{ formatDate(r.created_at) }}
            <template v-if="r.file_size_kb"> · {{ r.file_size_kb }} KB</template>
            <template v-if="r.status === 'error'"> · {{ r.error_message }}</template>
          </div>
        </div>
        <span class="badge" :class="`badge-${r.status}`">
          <i :class="`ti ${statusIcon(r.status)}`" style="font-size:10px"></i>
          {{ statusLabel(r.status) }}
        </span>
        <div class="report-actions">
          <a v-if="r.viewer_url" :href="r.viewer_url" target="_blank" class="btn-ghost" title="Visualizar">
            <i class="ti ti-eye" aria-hidden="true"></i>
          </a>
          <a v-if="r.download_url" :href="r.download_url" download class="btn-ghost" title="Download">
            <i class="ti ti-download" aria-hidden="true"></i>
          </a>
          <button v-if="r.status === 'error'" class="btn-ghost" @click="retry(r)" title="Tentar novamente">
            <i class="ti ti-refresh" aria-hidden="true"></i>
          </button>
        </div>
      </div>

      <div v-if="filteredReports.length === 0" class="empty-state">
        <i class="ti ti-file-off" aria-hidden="true"></i>
        <p>Nenhum relatório encontrado</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'

const reports = ref([])
const filterStatus = ref('')

const filteredReports = computed(() =>
  filterStatus.value
    ? reports.value.filter(r => r.status === filterStatus.value)
    : reports.value
)

onMounted(async () => {
  try {
    const { data } = await api.get('/reports')
    reports.value = data.items || []
  } catch (e) {
    reports.value = [
      { id: '1', title: 'Internet Way — Junho 2026', status: 'done', created_at: new Date().toISOString(), file_size_kb: 3200, download_url: '#', viewer_url: '#' },
      { id: '2', title: 'AcessaNet — Semanal', status: 'generating', created_at: new Date().toISOString() },
      { id: '3', title: 'Nortel — Incidentes', status: 'error', created_at: new Date().toISOString(), error_message: 'zbx_session expirado' }
    ]
  }
})

function statusIcon(s) {
  return { done: 'ti-check', generating: 'ti-loader-2', error: 'ti-alert-triangle', pending: 'ti-clock' }[s] || 'ti-file'
}

function statusLabel(s) {
  return { done: 'Concluído', generating: 'Gerando', error: 'Erro', pending: 'Aguardando' }[s] || s
}

function formatDate(dt) {
  return new Date(dt).toLocaleString('pt-BR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

async function retry(r) {
  await api.post(`/reports/${r.id}/retry`)
  r.status = 'pending'
}
</script>

<style scoped>
.page { flex: 1; overflow-y: auto; padding: 24px; }
.page-header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; }
.page-title { font-size: 18px; font-weight: 600; margin-bottom: 2px; }
.page-sub { font-size: 12px; color: var(--color-text-muted); }

.filters { margin-bottom: 16px; }
.filters select { font-size: 12px; padding: 5px 10px; border: 0.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-surface); color: var(--color-text-muted); }

.reports-list { display: flex; flex-direction: column; gap: 6px; }

.report-row {
  display: flex; align-items: center; gap: 12px;
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: 10px 14px;
}
.report-row:hover { border-color: var(--color-border); }

.report-icon {
  width: 34px; height: 34px;
  border-radius: var(--radius-md);
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  background: var(--color-primary-light);
  color: var(--color-primary);
}
.report-icon.error { background: var(--color-danger-light); color: var(--color-danger); }
.report-icon.generating { background: var(--color-warning-light); color: #854F0B; }
.report-icon i { font-size: 16px; }

.report-info { flex: 1; min-width: 0; }
.report-title { font-size: 13px; font-weight: 500; color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.report-meta { font-size: 11px; color: var(--color-text-hint); margin-top: 2px; }

.badge { display: inline-flex; align-items: center; gap: 3px; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: 500; white-space: nowrap; }
.badge-done { background: var(--color-success-light); color: #085041; }
.badge-generating { background: var(--color-warning-light); color: #854F0B; }
.badge-error { background: var(--color-danger-light); color: var(--color-danger); }
.badge-pending { background: var(--color-bg); color: var(--color-text-muted); }

.report-actions { display: flex; gap: 4px; }
.btn-ghost { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border: 0.5px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-muted); }
.btn-ghost:hover { background: var(--color-bg); }
.btn-ghost i { font-size: 14px; }

.empty-state { display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 48px; color: var(--color-text-hint); }
.empty-state i { font-size: 36px; }
</style>

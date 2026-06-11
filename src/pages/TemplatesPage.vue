<template>
  <div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Templates</h1>
        <p class="page-sub">Crie e gerencie seus layouts de relatório</p>
      </div>
      <RouterLink to="/templates/new" class="btn-primary">
        <i class="ti ti-plus" aria-hidden="true"></i>
        Novo template
      </RouterLink>
    </div>

    <div v-if="store.loading" class="loading-state">
      <i class="ti ti-loader-2 spin" aria-hidden="true"></i>
      Carregando templates...
    </div>

    <div v-else-if="store.templates.length === 0" class="empty-state">
      <i class="ti ti-layout-grid" aria-hidden="true"></i>
      <p>Nenhum template ainda</p>
      <RouterLink to="/templates/new" class="btn-primary">Criar primeiro template</RouterLink>
    </div>

    <div v-else class="templates-grid">
      <div
        v-for="tpl in store.templates"
        :key="tpl.id"
        class="template-card"
      >
        <div class="template-preview">
          <div class="preview-grid">
            <div class="preview-block big"></div>
            <div class="preview-block small"></div>
            <div class="preview-block small"></div>
            <div class="preview-block full"></div>
          </div>
        </div>
        <div class="template-info">
          <div class="template-name">{{ tpl.name }}</div>
          <div class="template-meta">
            {{ tpl.widget_count || 0 }} widgets
            · atualizado {{ formatDate(tpl.updated_at) }}
          </div>
        </div>
        <div class="template-actions">
          <RouterLink :to="`/templates/${tpl.id}/edit`" class="btn-ghost">
            <i class="ti ti-edit" aria-hidden="true"></i>
            Editar
          </RouterLink>
          <button class="btn-ghost btn-danger" @click="confirmDelete(tpl)">
            <i class="ti ti-trash" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import { useTemplateStore } from '@/stores/templates'

const store = useTemplateStore()

onMounted(() => store.fetchAll())

function formatDate(dt) {
  if (!dt) return '—'
  return new Date(dt).toLocaleDateString('pt-BR')
}

async function confirmDelete(tpl) {
  if (confirm(`Excluir o template "${tpl.name}"?`)) {
    await store.remove(tpl.id)
  }
}
</script>

<style scoped>
.page {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.page-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 2px;
}

.page-sub {
  font-size: 12px;
  color: var(--color-text-muted);
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 12px;
  font-weight: 500;
}

.btn-primary:hover { background: var(--color-primary-dark); }

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 60px;
  color: var(--color-text-muted);
  font-size: 13px;
}

.empty-state i { font-size: 40px; color: var(--color-border); }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.templates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 14px;
}

.template-card {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: border-color 0.15s;
}

.template-card:hover { border-color: var(--color-primary); }

.template-preview {
  height: 120px;
  background: var(--color-bg);
  padding: 12px;
  border-bottom: 0.5px solid var(--color-border);
}

.preview-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 1fr 1fr;
  gap: 6px;
  height: 100%;
}

.preview-block {
  background: var(--color-border-light);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.preview-block.big { grid-row: 1 / 3; }
.preview-block.full { grid-column: 1 / 3; }

.template-info {
  padding: 12px 14px 8px;
}

.template-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: 3px;
}

.template-meta {
  font-size: 11px;
  color: var(--color-text-hint);
}

.template-actions {
  display: flex;
  gap: 6px;
  padding: 8px 14px 12px;
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
</style>

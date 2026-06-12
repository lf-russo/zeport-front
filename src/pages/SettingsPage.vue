<template>
  <div class="page">
    <div class="page-header">
      <h1 class="page-title">Configurações</h1>
    </div>

    <div class="settings-grid">
      <div class="settings-card">
        <div class="card-title"><i class="ti ti-server" aria-hidden="true"></i>Conexão Zabbix</div>
        <div class="field">
          <label class="field-label">URL da API</label>
          <input type="url" v-model="form.zabbix_url" placeholder="https://zabbix.empresa.com" />
        </div>
        <div class="field">
          <label class="field-label">Usuário</label>
          <input type="text" v-model="form.zabbix_user" placeholder="api_user" />
        </div>
        <div class="field">
          <label class="field-label">Senha</label>
          <input type="password" v-model="form.zabbix_pass" placeholder="••••••••" />
        </div>
        <button class="btn-ghost" @click="testConnection" :disabled="testing">
          <i class="ti ti-plug" aria-hidden="true"></i>
          {{ testing ? 'Testando...' : 'Testar conexão' }}
        </button>
        <div v-if="connectionStatus" class="connection-status" :class="connectionStatus.ok ? 'ok' : 'fail'">
          <i :class="`ti ${connectionStatus.ok ? 'ti-check' : 'ti-x'}`" aria-hidden="true"></i>
          {{ connectionStatus.message }}
        </div>
      </div>

      <div class="settings-card">
        <div class="card-title"><i class="ti ti-palette" aria-hidden="true"></i>Branding</div>
        <div class="field">
          <label class="field-label">Nome da empresa</label>
          <input type="text" v-model="form.name" placeholder="Internet Way Telecom" />
        </div>
        <div class="field">
          <label class="field-label">Rodapé do relatório</label>
          <input type="text" v-model="form.branding.report_footer" placeholder="Empresa — NOC 24h" />
        </div>
        <div class="field">
          <label class="field-label">Cor primária</label>
          <div class="color-row">
            <div v-for="c in PRESET_COLORS" :key="c" class="swatch" :class="{active: form.branding.primary_color === c}" :style="{background:c}" @click="form.branding.primary_color = c"></div>
            <input type="color" v-model="form.branding.primary_color" class="color-picker" />
          </div>
        </div>
      </div>
    </div>

    <div class="save-row">
      <button class="btn-primary" @click="save" :disabled="saving">
        {{ saving ? 'Salvando...' : 'Salvar configurações' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import api from '@/services/api'

const PRESET_COLORS = ['#185FA5','#1D9E75','#E24B4A','#EF9F27','#7F77DD','#D85A30']

const form = ref({
  zabbix_url: '',
  zabbix_user: '',
  zabbix_pass: '',
  name: '',
  branding: {
    report_footer: '',
    primary_color: '#185FA5',
  }
})

const testing = ref(false)
const connectionStatus = ref(null)
const saving = ref(false)

async function testConnection() {
  testing.value = true
  connectionStatus.value = null
  try {
    await api.post('/zabbix/test', {
      url: form.value.zabbix_url,
      user: form.value.zabbix_user,
      password: form.value.zabbix_pass
    })
    connectionStatus.value = { ok: true, message: 'Conexão bem sucedida!' }
  } catch (e) {
    connectionStatus.value = { ok: false, message: e.response?.data?.detail || 'Falha na conexão' }
  } finally {
    testing.value = false
  }
}

async function save() {
  saving.value = true
  try {
    await api.patch('/tenants/me', form.value)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page { flex: 1; overflow-y: auto; padding: 24px; }
.page-header { margin-bottom: 24px; }
.page-title { font-size: 18px; font-weight: 600; }

.settings-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px; margin-bottom: 20px; }

.settings-card {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 16px 18px;
  display: flex; flex-direction: column; gap: 12px;
}

.card-title { display: flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 500; margin-bottom: 4px; }
.card-title i { font-size: 16px; color: var(--color-primary); }

.field { display: flex; flex-direction: column; gap: 4px; }
.field-label { font-size: 10px; font-weight: 500; color: var(--color-text-hint); text-transform: uppercase; letter-spacing: 0.04em; }
.field input { padding: 6px 9px; border: 0.5px solid var(--color-border); border-radius: var(--radius-md); background: var(--color-bg); color: var(--color-text); font-size: 13px; width: 100%; }

.btn-ghost { display: inline-flex; align-items: center; gap: 5px; padding: 6px 12px; border: 0.5px solid var(--color-border); border-radius: var(--radius-md); background: transparent; color: var(--color-text-muted); font-size: 12px; }
.btn-ghost:hover { background: var(--color-bg); }
.btn-ghost i { font-size: 14px; }

.connection-status { display: flex; align-items: center; gap: 6px; font-size: 12px; padding: 6px 10px; border-radius: var(--radius-md); }
.connection-status.ok { background: var(--color-success-light); color: #085041; }
.connection-status.fail { background: var(--color-danger-light); color: var(--color-danger); }

.color-row { display: flex; align-items: center; gap: 6px; }
.swatch { width: 22px; height: 22px; border-radius: 4px; border: 0.5px solid var(--color-border); cursor: pointer; }
.swatch.active { outline: 2px solid var(--color-primary); outline-offset: 1px; }
.color-picker { width: 22px !important; height: 22px; padding: 0; border-radius: 4px; cursor: pointer; }

.save-row { display: flex; justify-content: flex-end; }
.btn-primary { display: inline-flex; align-items: center; gap: 6px; padding: 8px 18px; background: var(--color-primary); color: white; border: none; border-radius: var(--radius-md); font-size: 13px; font-weight: 500; }
.btn-primary:hover { background: var(--color-primary-dark); }
</style>

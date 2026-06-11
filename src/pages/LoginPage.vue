<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-logo">Ze<span>port</span></div>
      <p class="login-sub">Report builder para Zabbix</p>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="field">
          <label class="field-label">E-mail</label>
          <input
            v-model="email"
            type="email"
            placeholder="seu@email.com"
            required
            autocomplete="email"
            class="field-input"
          />
        </div>
        <div class="field">
          <label class="field-label">Senha</label>
          <input
            v-model="password"
            type="password"
            placeholder="••••••••"
            required
            autocomplete="current-password"
            class="field-input"
          />
        </div>

        <div v-if="error" class="error-msg">
          <i class="ti ti-alert-circle" aria-hidden="true"></i>
          {{ error }}
        </div>

        <button type="submit" class="btn-login" :disabled="loading">
          <i v-if="loading" class="ti ti-loader-2 spin" aria-hidden="true"></i>
          <span>{{ loading ? 'Entrando...' : 'Entrar' }}</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function handleLogin() {
  error.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    router.push('/templates')
  } catch (e) {
    error.value = e.response?.data?.detail || 'Erro ao fazer login'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg);
}

.login-card {
  background: var(--color-surface);
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 36px 32px;
  width: 360px;
}

.login-logo {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.5px;
  margin-bottom: 4px;
}

.login-logo span { color: var(--color-primary); }

.login-sub {
  font-size: 13px;
  color: var(--color-text-muted);
  margin-bottom: 28px;
}

.login-form { display: flex; flex-direction: column; gap: 14px; }

.field { display: flex; flex-direction: column; gap: 5px; }

.field-label {
  font-size: 11px;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-input {
  padding: 8px 10px;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 13px;
  width: 100%;
}

.error-msg {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  background: var(--color-danger-light);
  color: var(--color-danger);
  border-radius: var(--radius-md);
  font-size: 12px;
}

.btn-login {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 9px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 13px;
  font-weight: 500;
  margin-top: 4px;
}

.btn-login:hover:not(:disabled) { background: var(--color-primary-dark); }
.btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

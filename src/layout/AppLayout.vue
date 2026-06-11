<template>
  <div class="app-layout">
    <aside class="sidebar">
      <div class="sidebar-logo">
        <span class="brand">Ze<span class="brand-accent">port</span></span>
        <span class="tenant-name">{{ auth.user?.full_name?.split(' ')[0] }}</span>
      </div>

      <nav class="sidebar-nav">
        <div class="nav-section">Menu</div>
        <RouterLink to="/templates" class="nav-item">
          <i class="ti ti-layout-grid" aria-hidden="true"></i>
          Templates
        </RouterLink>
        <RouterLink to="/reports" class="nav-item">
          <i class="ti ti-history" aria-hidden="true"></i>
          Relatórios
        </RouterLink>
        <div class="nav-section">Config</div>
        <RouterLink to="/settings" class="nav-item">
          <i class="ti ti-settings" aria-hidden="true"></i>
          Configurações
        </RouterLink>
      </nav>

      <div class="sidebar-footer">
        <div class="user-row">
          <div class="avatar">{{ initials }}</div>
          <div class="user-info">
            <div class="user-name">{{ auth.user?.full_name }}</div>
            <div class="user-role">{{ auth.user?.role }}</div>
          </div>
          <button class="icon-btn" @click="auth.logout(); $router.push('/login')" title="Sair">
            <i class="ti ti-logout" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    </aside>

    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const initials = computed(() => {
  if (!auth.user?.full_name) return '?'
  return auth.user.full_name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
})
</script>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.sidebar {
  width: 200px;
  background: var(--color-surface);
  border-right: 0.5px solid var(--color-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.sidebar-logo {
  padding: 16px;
  border-bottom: 0.5px solid var(--color-border);
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.brand {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text);
  letter-spacing: -0.3px;
}

.brand-accent { color: var(--color-primary); }

.tenant-name {
  font-size: 11px;
  color: var(--color-text-hint);
}

.sidebar-nav {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.nav-section {
  padding: 10px 14px 4px;
  font-size: 10px;
  color: var(--color-text-hint);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  margin: 1px 6px;
  font-size: 13px;
  color: var(--color-text-muted);
  border-radius: var(--radius-md);
  transition: background 0.1s, color 0.1s;
}

.nav-item:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.nav-item.router-link-active {
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  font-weight: 500;
}

.nav-item i { font-size: 16px; }

.sidebar-footer {
  border-top: 0.5px solid var(--color-border);
  padding: 10px 8px;
}

.user-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border-radius: var(--radius-md);
}

.avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  flex-shrink: 0;
}

.user-info { flex: 1; min-width: 0; }
.user-name { font-size: 12px; font-weight: 500; color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.user-role { font-size: 10px; color: var(--color-text-hint); }

.icon-btn {
  width: 26px;
  height: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

.icon-btn:hover { background: var(--color-bg); }
.icon-btn i { font-size: 14px; }

.main-content {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>

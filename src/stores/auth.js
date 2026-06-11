import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('zeport_token') || null)
  const user = ref(JSON.parse(localStorage.getItem('zeport_user') || 'null'))

  const isLoggedIn = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'admin' || user.value?.role === 'superadmin')
  const isSuperadmin = computed(() => user.value?.role === 'superadmin')

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password })
    token.value = data.access_token
    user.value = {
      full_name: data.full_name,
      role: data.role,
      tenant_id: data.tenant_id
    }
    localStorage.setItem('zeport_token', data.access_token)
    localStorage.setItem('zeport_user', JSON.stringify(user.value))
    api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('zeport_token')
    localStorage.removeItem('zeport_user')
    delete api.defaults.headers.common['Authorization']
  }

  // Inicializa header se já tiver token salvo
  if (token.value) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  return { token, user, isLoggedIn, isAdmin, isSuperadmin, login, logout }
})

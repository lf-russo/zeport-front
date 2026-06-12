import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/services/api'

export const useTemplateStore = defineStore('templates', () => {
  const templates = ref([])
  const loading = ref(false)
  const current = ref(null)

  async function fetchAll() {
    loading.value = true
    try {
      const { data } = await api.get('/templates')
      templates.value = data.items ?? data
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      const { data } = await api.get(`/templates/${id}`)
      current.value = data
      return data
    } finally {
      loading.value = false
    }
  }

  async function save(template) {
    if (template.id) {
      const { data } = await api.patch(`/templates/${template.id}`, template)
      current.value = data
      const idx = templates.value.findIndex(t => t.id === data.id)
      if (idx >= 0) templates.value[idx] = data
      return data
    } else {
      const { data } = await api.post('/templates', template)
      templates.value.unshift(data)
      current.value = data
      return data
    }
  }

  async function remove(id) {
    await api.delete(`/templates/${id}`)
    templates.value = templates.value.filter(t => t.id !== id)
  }

  return { templates, loading, current, fetchAll, fetchOne, save, remove }
})

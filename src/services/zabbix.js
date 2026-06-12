import api from './api'

export const zabbixService = {
  async getHosts(groupIds = []) {
    const { data } = await api.get('/zabbix/hosts', {
      params: groupIds.length ? { group_ids: groupIds } : {}
    })
    return data
  },

  async getGroups() {
    const { data } = await api.get('/zabbix/groups')
    return data
  },

  async getItems(hostIds = [], keySearch = null) {
    const params = {}
    if (hostIds.length) params.host_ids = hostIds
    if (keySearch) params.key_search = keySearch
    const { data } = await api.get('/zabbix/items', { params })
    return data
  },

  async getHistory(itemId, timeFrom, timeTill) {
    const { data } = await api.get('/zabbix/history', {
      params: { item_id: itemId, time_from: timeFrom, time_till: timeTill }
    })
    return data
  },

  async getTriggers(hostIds = [], timeFrom, timeTill) {
    const { data } = await api.get('/zabbix/triggers', {
      params: { host_ids: hostIds, time_from: timeFrom, time_till: timeTill }
    })
    return data
  }
}

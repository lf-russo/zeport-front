import api from './api'

export const zabbixService = {
  async getHosts(groupIds = []) {
    const params = groupIds.length ? { group_ids: groupIds.join(',') } : {}
    const { data } = await api.get('/zabbix/hosts', { params })
    return data
  },

  async getGroups() {
    const { data } = await api.get('/zabbix/groups')
    return data
  },

  async getItems(hostIds = []) {
    const params = { host_ids: hostIds.join(',') }
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
      params: {
        host_ids: hostIds.join(','),
        time_from: timeFrom,
        time_till: timeTill
      }
    })
    return data
  }
}

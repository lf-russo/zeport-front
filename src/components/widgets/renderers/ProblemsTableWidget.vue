<template>
  <div class="table-wrap">
    <table>
      <thead>
        <tr>
          <th>Severidade</th>
          <th>Problema</th>
          <th>Início</th>
          <th>Duração</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in MOCK_ROWS" :key="row.id">
          <td><span class="badge" :class="`badge-${row.sev}`">{{ row.sevLabel }}</span></td>
          <td>{{ row.name }}</td>
          <td>{{ row.time }}</td>
          <td>{{ row.duration }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
defineProps({ config: Object, preview: Boolean })

const MOCK_ROWS = [
  { id: 1, sev: 'high', sevLabel: 'High', name: 'Interface down: eth0', time: '10/06 08:14', duration: '2h 30m' },
  { id: 2, sev: 'average', sevLabel: 'Average', name: 'CPU acima de 85%', time: '10/06 11:02', duration: '45m' },
  { id: 3, sev: 'warning', sevLabel: 'Warning', name: 'Disco acima de 80%', time: '10/06 12:30', duration: '1h 10m' }
]
</script>

<style scoped>
.table-wrap { width: 100%; height: 100%; overflow: auto; }

table { width: 100%; border-collapse: collapse; font-size: 10px; }

thead tr { background: var(--color-bg); }
thead th { padding: 5px 8px; text-align: left; font-size: 10px; font-weight: 500; color: var(--color-text-hint); border-bottom: 0.5px solid var(--color-border); }

tbody td { padding: 5px 8px; border-bottom: 0.5px solid var(--color-border-light); color: var(--color-text-muted); }

.badge { display: inline-block; padding: 1px 6px; border-radius: 10px; font-size: 9px; font-weight: 500; }
.badge-high { background: var(--color-danger-light); color: var(--color-danger); }
.badge-average { background: var(--color-warning-light); color: #854F0B; }
.badge-warning { background: #fef9c3; color: #854F0B; }
.badge-disaster { background: var(--color-danger-light); color: var(--color-danger); }
</style>

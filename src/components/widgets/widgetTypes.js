export const WIDGET_TYPES = {
  line_chart: {
    type: 'line_chart',
    label: 'Linha',
    icon: 'ti-chart-line',
    defaultSize: { w: 6, h: 4 },
    defaultConfig: {
      title: 'Gráfico de linha',
      item_key: '',
      period: '7d',
      color: '#185FA5',
      filled: true,
      show_legend: true
    }
  },
  bar_chart: {
    type: 'bar_chart',
    label: 'Barras',
    icon: 'ti-chart-bar',
    defaultSize: { w: 6, h: 4 },
    defaultConfig: {
      title: 'Gráfico de barras',
      item_key: '',
      period: '7d',
      color: '#1D9E75',
      show_legend: true
    }
  },
  pie_chart: {
    type: 'pie_chart',
    label: 'Pizza',
    icon: 'ti-chart-pie',
    defaultSize: { w: 4, h: 4 },
    defaultConfig: {
      title: 'Gráfico de pizza',
      data_source: 'triggers_by_severity',
      period: '30d',
      show_legend: true
    }
  },
  donut_chart: {
    type: 'donut_chart',
    label: 'Rosca',
    icon: 'ti-circle-half',
    defaultSize: { w: 4, h: 4 },
    defaultConfig: {
      title: 'Gráfico de rosca',
      data_source: 'triggers_by_severity',
      period: '30d',
      show_legend: true
    }
  },
  metric_card: {
    type: 'metric_card',
    label: 'Métrica',
    icon: 'ti-hash',
    defaultSize: { w: 3, h: 2 },
    defaultConfig: {
      title: 'Métrica',
      item_key: '',
      unit: '',
      decimals: 1,
      color: '#185FA5'
    }
  },
  problems_table: {
    type: 'problems_table',
    label: 'Tabela',
    icon: 'ti-table',
    defaultSize: { w: 12, h: 3 },
    defaultConfig: {
      title: 'Problemas detectados',
      min_severity: 'warning',
      max_rows: 20,
      sort_by: 'severity',
      period: '7d'
    }
  },
  text_box: {
    type: 'text_box',
    label: 'Texto',
    icon: 'ti-text-size',
    defaultSize: { w: 12, h: 1 },
    defaultConfig: {
      content: 'Título da seção',
      font_size: '16px',
      align: 'left',
      bold: false
    }
  },
  divider: {
    type: 'divider',
    label: 'Divisor',
    icon: 'ti-separator',
    defaultSize: { w: 12, h: 1 },
    defaultConfig: {}
  }
}

export const WIDGET_LIST = Object.values(WIDGET_TYPES)

export const PERIOD_OPTIONS = [
  { value: '24h', label: 'Últimas 24h' },
  { value: '7d', label: 'Últimos 7 dias' },
  { value: '30d', label: 'Últimos 30 dias' },
  { value: 'custom', label: 'Personalizado' }
]

export const SEVERITY_OPTIONS = [
  { value: 'all', label: 'Todas' },
  { value: 'information', label: 'Information' },
  { value: 'warning', label: 'Warning' },
  { value: 'average', label: 'Average' },
  { value: 'high', label: 'High' },
  { value: 'disaster', label: 'Disaster' }
]

export const DATA_SOURCE_OPTIONS = [
  { value: 'triggers_by_severity', label: 'Problemas por severidade' },
  { value: 'availability_by_host', label: 'Disponibilidade por host' }
]

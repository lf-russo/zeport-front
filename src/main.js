import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ECharts from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, DataZoomComponent
} from 'echarts/components'

import router from './router'
import App from './App.vue'
import './assets/main.css'

use([
  CanvasRenderer, LineChart, BarChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent,
  TitleComponent, DataZoomComponent
])

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('VChart', ECharts)
app.mount('#app')

<template>
  <div ref="mydiv" class="mydiv" />
</template>

<script>
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 引入柱状图图表，图表后缀都为 Chart
import { RadarChart } from 'echarts/charts'
// 引入提示框，标题，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components'
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

// 注册必须的组件
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  RadarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])
export default {
  mounted() {
    var myChart = echarts.init(this.$refs.mydiv)
    myChart.setOption({
      title: {
        text: '基础雷达图'
      },
      legend: {
        data: ['预算分配(Allocated Budget)', '实际开销(Actual Spending)']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '考勤', max: 100 },
          { name: '技术', max: 100 },
          { name: '管理', max: 100 },
          { name: '分享', max: 100 },
          { name: 'Bug', max: 100 },
          { name: '助人', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [100, 100, 100, 100, 50, 10],
              name: 'Allocated Budget'
            },
            {
              value: [100, 60, 40, 100, 50, 100],
              name: 'Actual Spending'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
.mydiv{
    height: 400px;
    width: 600px;
}
</style>

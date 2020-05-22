<template>
    <div>
     <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">數據統計</a></el-breadcrumb-item>
    <el-breadcrumb-item>數據報表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <div id="main" style="width: 750px;height:400px;"></div>
    </el-card>
    </div>
</template>
<script>
import echarts from 'echarts'
import _ from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  created() {
  },
  methods: {

  },
  async mounted() {
    var myChart = echarts.init(document.getElementById('main'))
    const { data: res } = await this.$http.get('reports/type/1')
    if (res.meta.status !== 200) {
      return this.$message.error('獲取數據失敗')
    }
    const rest = _.merge(res.data, this.options)
    myChart.setOption(rest)
  }
}
</script>
<style lang="less" scoped>
</style>

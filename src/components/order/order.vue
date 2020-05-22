<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">訂單管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>訂單列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-row>
    <el-col :span="8">
    <el-input placeholder="请输入内容" clearable v-model="queryinfo.query" @clear="clera" size="20px">
    <el-button slot="append" icon="el-icon-search" @click="getorderlist"></el-button>
     </el-input>
    </el-col>
    </el-row>
    <el-table :data="list" border stripe>
    <el-table-column type="index"></el-table-column>
    <el-table-column label="訂單編號" prop="order_number"></el-table-column>
    <el-table-column label="訂單價格" prop="order_price" width="100px"></el-table-column>
    <el-table-column label="是否付款" prop="order_pay" width="120px">
        <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '0'" type="danger">未付款</el-tag>
            <el-tag v-if="scope.row.pay_status === '1'" >已付款</el-tag>
        </template>
    </el-table-column>
    <el-table-column label="是否發貨" prop="is_send"    width="100px"></el-table-column>
    <el-table-column label="下單時間" prop="" width="150px">
        <template slot-scope="scop">
        {{ scop.row.create_time | dataFormat }}
        </template>
    </el-table-column>
    <el-table-column label="操作" width="200px">
      <template>
        <el-button type="primary" size="mini" icon="el-icon-edit" disabled></el-button>
        <el-button type="success" size="mini" icon="el-icon-location-outline" @click="showprogress"></el-button>
      </template>
    </el-table-column>
    </el-table>
    </el-card>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 4, 5, 10]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <el-dialog
     title="物流進度"
    :visible.sync="dialogVisible"
     width="50%"
     >
    <el-timeline>
    <el-timeline-item
      v-for="(activity, index) in progerinfo"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      queryinfo: {
        query: '',
        pagesize: 5,
        pagenum: 1
      },
      progerinfo: [],
      total: 0,
      list: []
    }
  },
  created() {
    this.getorderlist()
  },
  methods: {
    async getorderlist() {
      const { data: res } = await this.$http.get('orders', { params: this.queryinfo })
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error('獲取訂單失敗')
      }
      this.total = res.data.total
      this.list = res.data.goods
    },
    clera() {
      this.queryinfo.query = ''
      this.getorderlist()
    },
    handleCurrentChange(newpagec) {
      this.queryinfo.pagenum = newpagec
      this.getorderlist()
    },
    handleSizeChange(newpagec) {
      this.queryinfo.pagesize = newpagec
      this.getorderlist()
    },
    async showprogress() {
      const { data: res } = await this.$http.get('/kuaidi/1106975712662')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取物流失敗')
      }
      this.progerinfo = res.data
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="less" scoped>
</style>

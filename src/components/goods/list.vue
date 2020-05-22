<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row :gutter="20">
        <el-col span="8">
        <el-input placeholder="请输入内容" v-model="listquery.query" clearable @clear="getlist">
        <el-button slot="append" icon="el-icon-search" @click="getlist"></el-button>
        </el-input>
        </el-col>
        <el-col span="4">
        <el-button type="primary" @click="goAdd">添加商品</el-button>
        </el-col>
        </el-row>
        <el-table :data="list" stripe border>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名稱" prop="goods_name"></el-table-column>
        <el-table-column label="商品價格（元）" prop="goods_price" width="95px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
        <el-table-column label="商品創建時間" prop="add_time" width="140px">
            <template slot-scope="scope">
                {{ scope.row.add_time | dataFormat }}
            </template>
        </el-table-column>
        <el-table-column label="操作" width="130px">
            <template slot-scope="se">
                <el-button type="primary" icon="el-icon-edit" size="mini" disabled></el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="delet(se.row.goods_id)"></el-button>
            </template>
        </el-table-column>
        </el-table>
        <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="listquery.pagenum"
      :page-sizes="[1, 5, 10]"
      :page-size="listquery.pagesize"
      :total="total"
      layout="total, sizes, prev, pager, next, jumper"
      background
      >
    </el-pagination>
    </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
      listquery: {
        query: '',
        pagenum: 1,
        pagesize: 5
      },
      list: [],
      total: 0
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    async getlist() {
      const { data: res } = await this.$http.get('goods', { params: this.listquery })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.list = res.data.goods
      this.total = res.data.total
      console.log(this.list)
    },
    handleCurrentChange(newnum) {
      this.listquery.pagenum = newnum
      this.getlist()
    },
    handleSizeChange(newsize) {
      this.listquery.pagesize = newsize
      this.getlist()
    },
    async delet(id) {
      const res = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (res !== 'confirm') {
        return this.$message.info('取消成功')
      }
      const { data: rest } = await this.$http.delete('goods/' + id)
      if (rest.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      this.$message.success('刪除成功')
      this.getlist()
    },
    goAdd() {
      this.$router.push('/goods/add')
    }
  }
}
</script>
<style lang="less" scoped>
</style>

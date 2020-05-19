<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">權限管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>權限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-table :data="list" stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="名稱" prop="authName"></el-table-column>
            <el-table-column label="路徑" prop="path"></el-table-column>
            <el-table-column label="等級" prop="level">
            <template slot-scope="scoped">
                <el-tag type="success"  v-if="scoped.row.level === '0'">一級</el-tag>
                <el-tag type="warning" v-if="scoped.row.level === '1'">二級</el-tag>
                <el-tag v-if="scoped.row.level === '2'">三級</el-tag>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
    </div>
</template>
<script>
export default {
  data() {
    return {
    // 權限列表
      list: []
    }
  },
  created () {
    //  獲取權限列表
    this.getRightsList()
  },
  methods: {
    // 獲取權限function
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.list = res.data
    }
  }
}
</script>
<style lang="less" scoped>

</style>

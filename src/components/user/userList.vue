<template>
 <div class="list">
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用戶管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
  <el-card>
  <el-row :gutter="20">
    <el-col :span="7">
    <el-input placeholder="请输入内容">
    <el-button slot="append" icon="el-icon-search"></el-button>
  </el-input>
  </el-col>
    <el-col :span="4">
    <el-button type="primary">添加用戶</el-button>
    </el-col>
  </el-row>
</el-card>
 </div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>

</style>

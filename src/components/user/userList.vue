<template>
<div class="list">
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">用戶管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>用戶列表</el-breadcrumb-item>
    </el-breadcrumb>
</div>
</template>
<script>
export default {}
</script>
<style lang="less" scoped>
  .list{
    width: 300px;
    height: 100px;
    background-color: aquamarine;
  }
</style>

<template>
    <div>
   <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>參數列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-alert
    :closable="false"
    show-icon=""
    title="未開放"
    type="warning">
  </el-alert></el-card>
    </div>
</template>

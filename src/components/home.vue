<template>
<el-container class="home-conta">
  <el-header>
  <span>電商後臺管理系統</span>
  <el-button type="info" @click="logout" class="ss">登出</el-button>
  </el-header>
  <el-container>
    <el-aside width="200px">
      <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409eff"
      :unique-opened="true"
      :router="true"
      :default-active="activepath"
      >
      <!--一級菜單-->
      <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id" >
      <!--一級菜單模板-->
        <template slot="title">
          <i :class="iconobj[item.id]"></i>
          <span>{{ item.authName }}</span>
        </template>
        <!--二級菜單-->
         <el-menu-item @click="saveNavpath('/' + subitem.path)" :index="'/' + subitem.path + ''" v-for="subitem in item.children" :key="subitem.id">
         <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ subitem.authName}}</span>
        </template>
         </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <el-main>
    <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script>
export default {
  data() {
    return {
      menulist: [],
      iconobj: {
        125: 'iconfont icon-user',
        103: 'iconfont icon-tijikongjian',
        101: 'iconfont icon-shangpin',
        102: 'iconfont icon-danju',
        145: 'iconfont icon-baobiao'
      },
      activepath: ''
    }
  },
  created() {
    this.getMenuList()
    this.activepat = window.sessionStorage.getItem('activepath')
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data: res } = await this.$http.get('menus')
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      this.menulist = res.data
      // console.log(res.data)
    },
    saveNavpath(activepath) {
      window.sessionStorage.setItem('activepath', activepath)
      this.activepath = activepath
    }
  }
}
</script>
<style lang="less" scoped>
.home-conta{
  height: 100vh;
}
.el-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #373d41;
  color:#ffffff;
  font-size: 20px;
}
.el-aside{
  background-color: #333744;
  .el-menu{
    border-right: none;
  }
}
.el-main{
  background-color: #eaedf1;
}
.iconfont{
  margin-right: 10px;
}
</style>

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
    <el-input placeholder="请输入内容" v-model="querif.query" clearable @clear="getUserlist">
    <el-button slot="append" icon="el-icon-search" @click="getUserlist"></el-button>
  </el-input>
  </el-col>
    <el-col :span="4">
    <el-button type="primary" @click="dialogVisible = true">添加用戶</el-button>
    </el-col>
  </el-row>
  <el-table :data="userlist" border="" stripe="">
    <el-table-column type="index"></el-table-column>
    <el-table-column label="姓名" prop="username"></el-table-column>
    <el-table-column label="郵箱" prop="email"></el-table-column>
    <el-table-column label="電話" prop="mobile"></el-table-column>
    <el-table-column label="角色" prop="role_name"></el-table-column>
    <el-table-column label="狀態" prop="mg_state">
      <template slot-scope="scoped">
      <el-switch @change="userdatachange(scoped.row)"
        v-model="scoped.row.mg_state">
    </el-switch>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="180">
      <template>
       <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
       <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
       <el-tooltip effect="dark" content="角色分配" :enterable="false" placement="top">
       <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
       </el-tooltip>
      </template>
    </el-table-column>
  </el-table>
   <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="querif.pagenum"
      :page-sizes="[1, 2, 3,]"
      :page-size="querif.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
</el-card>
<el-dialog
  title="填寫數據"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <span>
  <el-form :model="addFrom" :rules="addFromrules" ref="addFromref" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用戶名稱" prop="username">
    <el-input v-model="addFrom.username"></el-input>
  </el-form-item>
  <el-form-item label="密碼" prop="password">
    <el-input v-model="addFrom.password"></el-input>
  </el-form-item>
  <el-form-item label="郵箱" prop="email">
    <el-input v-model="addFrom.email"></el-input>
  </el-form-item>
  </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">添加</el-button>
  </span>
</el-dialog>
 </div>
</template>
<script>
export default {
  data() {
    return {
      querif: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      addFrom: {
        username: '',
        password: '',
        email: ''
      },
      addFromrules: {
        username: [
          { required: true, message: '請輸入用戶名', trigger: 'blur' },
          { min: 3, max: 10, message: '請用戶名長度在3到10個', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '請輸入密碼', trigger: 'blur' },
          { min: 3, max: 10, message: '長度在3到10個', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '請輸入郵箱', trigger: 'blur' },
          { type: email, message: '郵箱格式錯誤', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserlist()
  },
  methods: {
    async getUserlist() {
      const { data: res } = await this.$http.get('users', { params: this.querif })
      if (res.meta.status !== 200) return this.$message.error('SHIBAI')
      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },
    handleSizeChange(newsizepage) {
      this.querif.pagesize = newsizepage
      this.getUserlist()
    },
    handleCurrentChange(newpage) {
      this.querif.pagenum = newpage
      this.getUserlist()
    },
    async userdatachange(stage) {
      const { data: res } = await this.$http.put(`users/${stage.id}/state/${stage.mg_state}`)
      if (res.meta.status !== 200) {
        stage.mg_state = !stage.mg_state
        return this.$message.error('更新失敗！')
      }
      this.$message.success('更新成功')
    }
  }
}
</script>
<style lang="less" scoped>

</style>

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
      <template slot-scope="scoped">
       <el-button type="primary" icon="el-icon-edit" size="mini" @click="showeidt(scoped.row.id)"></el-button>
       <el-button type="danger" icon="el-icon-delete" size="mini" @click="deluser(scoped.row.id)"></el-button>
       <el-tooltip effect="dark" content="角色分配" :enterable="false" placement="top">
       <el-button type="warning" icon="el-icon-setting" size="mini" ></el-button>
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
  @close="closeadd"
  >
  <span>
  <el-form :model="addFrom" :rules="addFromrules" ref="addFromref" label-width="70px" class="demo-ruleForm">
  <el-form-item label="用戶名" prop="username">
    <el-input v-model="addFrom.username"></el-input>
  </el-form-item>
  <el-form-item label="密碼" prop="password">
    <el-input v-model="addFrom.password"></el-input>
  </el-form-item>
  <el-form-item label="郵箱" prop="email">
    <el-input v-model="addFrom.email"></el-input>
  </el-form-item>
   <el-form-item label="手機" prop="mobile">
    <el-input v-model="addFrom.mobile"></el-input>
  </el-form-item>
  </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="adduser()">添加</el-button>
  </span>
</el-dialog>
<el-dialog
  title="修改用戶資料"
  :visible.sync="editshow"
  width="50%"
  @close="editclose"
  >
  <span>
  <el-form ref="editfronref" :model="editfrom" :rules="addFromrules" label-width="80px">
  <el-form-item label="用戶名">
    <el-input :disabled="true" v-model="editfrom.username"></el-input>
  </el-form-item>
  <el-form-item label="郵箱" prop="email">
    <el-input v-model="editfrom.email" ></el-input>
  </el-form-item>
  <el-form-item label="手機" prop="mobile">
    <el-input v-model="editfrom.mobile"></el-input>
  </el-form-item>
   </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editshow = false">取 消</el-button>
    <el-button type="primary" @click="editsubm">确 定</el-button>
  </span>
</el-dialog>
 </div>
</template>
<script>
export default {
  data() {
    var chenckemail = (rule, value, cd) => {
      const regemual = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      if (regemual.test(value)) {
        return cd()
      }
      cd(new Error('請輸入正確的郵箱'))
    }
    var chenckmobli = (rule, value, cd) => {
      const re = /^1[3456789]\d{9}$/
      if (re.test(value)) {
        return cd()
      }
      cd(new Error('請輸入正確的手機'))
    }
    return {
      querif: {
        query: '',
        pagenum: 1,
        pagesize: 2
      },
      userlist: [],
      total: 0,
      dialogVisible: false,
      editshow: false,
      addFrom: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      editfrom: {},
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
          { validator: chenckemail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '請輸入手機號碼', trigger: 'blur' },
          { validator: chenckmobli, trigger: 'blur' }
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
    },
    closeadd() {
      this.$refs.addFromref.resetFields()
    },
    adduser() {
      this.$refs.addFromref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('users', this.addFrom)

        if (res.meta.status !== 200) {
          this.$message.error('添加失敗')
        }
        this.$message.success('添加成功')
        this.dialogVisible = false
        this.getUserlist()
      })
    },
    async showeidt(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('請求失敗')
      }
      this.editfrom = res.data
      this.editshow = true
    },
    editsubm() {
      this.$refs.editfronref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('users/' + this.editfrom.id, {
          email: this.editfrom.email,
          mobile: this.editfrom.mobile
        })
        if (res.meta.status !== 200) {
          return this.$message.error('修改失敗')
        }
        this.editshow = false
        this.getUserlist()
        this.$message.success('修改成功')
      })
    },
    editclose() {
      this.$refs.editfronref.resetFields()
    },
    async deluser(id) {
      const rest = await this.$confirm('此操作将永久删除该用戶, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).catch(err => err) // 這裏是個簡寫  （err =>{ return err }）
      if (rest !== 'confirm') {
        return this.$message.info('已取消操作')
      } // 這裏是用戶按下取消按鈕后的操作
      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      this.$message.success('刪除成功')
      this.pagenum = 1
      this.getUserlist()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-form-item{
    font-size: 12px;
  }
</style>

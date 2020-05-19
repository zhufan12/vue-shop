<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">權限管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
        <el-row>
        <el-col><el-button type="primary" @click="showAddwindo">添加角色</el-button></el-col>
        </el-row>
        <el-table :data="list" border="" stripe="">
            <el-table-column type="expand"></el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名稱" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
            <template slot-scope="scoped">
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="editformshow(scoped.row.id)">編輯</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteuser(scoped.row.id)">刪除</el-button>
             <el-button size="mini" type="warning" icon="el-icon-setting">分配權限</el-button>
            </template>
            </el-table-column>
        </el-table>
    </el-card>
    <el-dialog
  title="添加角色"
  :visible.sync="showAdd"
  width="50%"
  @close="resteaddfrom"
  >
  <span>
    <el-form :model="addfrom" :rules="addformriles" ref="addfromref">
        <el-form-item label="用戶名稱" prop="roleName">
        <el-input v-model="addfrom.roleName"></el-input>
         </el-form-item>
         <el-form-item label="角色描述">
        <el-input v-model="addfrom.roleDesc"></el-input>
         </el-form-item>
    </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showAdd = false">取 消</el-button>
    <el-button type="primary" @click="Addusers">添加</el-button>
  </span>
</el-dialog>
   <el-dialog
  title="添加角色"
  :visible.sync="editshow"
  width="50%"
  @close="restedit"
  >
  <span>
    <el-form :model="editfrom" :rules="addformriles" ref="ediffrom">
        <el-form-item label="用戶名稱" prop="roleName">
        <el-input v-model="editfrom.roleName"></el-input>
         </el-form-item>
         <el-form-item label="角色描述">
        <el-input v-model="editfrom.roleDesc"></el-input>
         </el-form-item>
    </el-form>
  </span>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editshow = false">取 消</el-button>
    <el-button type="primary" @click="subeditform">添加</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
    // 角色列表數據
      list: [],
      showAdd: false,
      editshow: false,
      addfrom: {
        roleName: '',
        roleDesc: ''
      },
      editfrom: {},
      addformriles: {
        roleName: [
          { required: true, message: '請輸入用戶名', trigger: 'blur' },
          { min: 3, max: 10, message: '請用戶名長度在3到10個', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getUserRoles()
  },
  methods: {
    // 獲取所有角色的列表
    async getUserRoles() {
      const { data: res } = await this.$http.get('/roles')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.list = res.data
    },
    showAddwindo() {
      this.showAdd = true
    },
    Addusers() {
      this.$refs.addfromref.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.post('/roles', this.addfrom)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失敗')
        }
        this.showAdd = false
        this.getUserRoles()
        this.$message.success('添加成功')
      })
    },
    resteaddfrom() {
      this.addfrom = {}
    },
    async deleteuser(id) {
      const rest = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rest !== 'confirm') {
        return this.$message.info('已經取消')
      }
      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      this.getUserRoles()
      this.$message.success('刪除成功')
    },
    restedit() {
      this.$refs.ediffrom.resetFields()
    },
    async editformshow(id) {
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('請求失敗')
      }
      this.editfrom = res.data
      this.editshow = true
    },
    async subeditform() {
      const { data: res } = await this.$http.put('roles/' + this.editfrom.roleId, {
        roleName: this.editfrom.roleName,
        roleDesc: this.editfrom.roleDesc
      })
      console.log(this.editfrom)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失敗')
      }
      this.editshow = false
      this.getUserRoles()
      this.$message.success('修改成功')
    }
  }
}
</script>
<style lang="less" scoped>

</style>

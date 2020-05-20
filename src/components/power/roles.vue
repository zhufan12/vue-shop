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
            <el-table-column type="expand">
              <template slot-scope="seoped">
              <el-row v-for="(item1, i1) in seoped.row.children" :key="item1.id" :class="['bdbottom','vcentr', i1 === 0 ? 'bdtop' : '']">
              <!--一級權限-->
              <el-col :span="5">
                <el-tag closable @close="removerById(seoped.row, item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!--二級權限和三級-->
              <el-col :span="19">
                <el-row v-for="(item2, i2) in item1.children" :key="item2.id" :class="['vcentr',i2 === 0 ? '' : 'bdtop']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removerById(seoped.row, item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removerById(seoped.row, item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
              </el-row>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="角色名稱" prop="roleName"></el-table-column>
            <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
            <el-table-column label="操作" width="300px">
            <template slot-scope="scoped">
             <el-button size="mini" type="primary" icon="el-icon-edit" @click="editformshow(scoped.row.id)">編輯</el-button>
             <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteuser(scoped.row.id)">刪除</el-button>
             <el-button size="mini" type="warning" icon="el-icon-setting" @click="showadd(scoped.row)">分配權限</el-button>
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
  title="修改角色"
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
              <el-dialog
  title="添加權限"
  :visible.sync="addroles"
  width="50%"
  @close="resetDefaultKeys"
  >
  <el-tree show-checkbox="" node-key="id" :data="roleslist" ref="treeref" :props="treeprops" :default-expand-all="true" :default-checked-keys="defkyes"></el-tree>
  <span>
    <el-button @click="addroles = false">取 消</el-button>
    <el-button type="primary" @click="allotroles()">确 定</el-button>
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
      roleslist: [],
      showAdd: false,
      editshow: false,
      addroles: false,
      defkyes: [],
      roleid: '',
      treeprops: {
        label: 'authName',
        children: 'children'
      },
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
      // console.log(this.editfrom)
      if (res.meta.status !== 200) {
        return this.$message.error('修改失敗')
      }
      this.editshow = false
      this.getUserRoles()
      this.$message.success('修改成功')
    },
    async removerById(userid, rightid) {
      const rest = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rest !== 'confirm') {
        return this.$message.info('已經取消')
      }
      const { data: res } = await this.$http.delete(`roles/${userid.id}/rights/${rightid}`)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      userid.children = res.data
    },
    async showadd(node) {
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.roleslist = res.data
      this.addroles = true
      this.getleafKye(node, this.defkyes)
      this.roleid = node.id
    },
    getleafKye(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getleafKye(item, arr))
    },
    resetDefaultKeys() {
      this.defkyes = []
    },
    async allotroles() {
      const keys = [
        ...this.$refs.treeref.getCheckedKeys(),
        this.$refs.treeref.getHalfCheckedKeys()
      ]
      const idstr = keys.join(',')
      const { data: res } = await this.$http.post(`roles/${this.roleid}/rights`, { rids: idstr })
      if (res.meta.status !== 200) {
        return this.$message.error('分配權限失敗')
      }
      this.$message.success('分配權限成功')
      this.getUserRoles()
      this.addroles = false
    }
  }
}
</script>
<style lang="less" scoped>
  .el-tag{
    margin: 7px;
  }
  .bdtop{
    border-top: 1px solid #eeeeee;
  }
  .bdbottom{
    border-bottom: 1px solid #eeeeee;
  }
  .vcentr{
    display: flex;
    align-items:center;
  }
</style>

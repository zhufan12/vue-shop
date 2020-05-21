<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>商品分類</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-row style="margin-bottom:10px;">
        <el-button  type="primary" disabled="">添加分類</el-button>
    </el-row>
    <tree-table
    :data="catelist"
    :columns="columns"
    :selection-type="false"
    :expand-type="false"
    show-index
    index-text="#"
    border
    :show-row-hover="false"
    >
    <template slot="isok" slot-scope="scoped">
      <i class="el-icon-success" style="color: lightgreen;" v-if="scoped.row.cat_deleted === false"></i>
      <i class="el-icon-error" style="color: red;" type="sucesss" v-if="scoped === true"></i>
    </template>
    <template slot-scope="res" slot="order">
      <el-tag type="success" v-if="res.row.cat_level === 0">一級</el-tag>
      <el-tag type="warning" v-if="res.row.cat_level === 1">二級</el-tag>
      <el-tag type="" v-if="res.row.cat_level === 2">三級</el-tag>
    </template>
    <template slot="conter" slot-scope="spend">
      <el-button icon="el-icon-edit" type="primary" @click="editform(spend.row.cat_id)">編輯</el-button>
      <el-button type="danger" icon="el-icon-delete" @click="deletecat(spend.row.cat_id)">刪除</el-button>
    </template>
    </tree-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handlepagenumChange"
      :current-page="queryinfo.pagenum"
      :page-sizes="[1, 3, 5]"
      :page-size="queryinfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  <el-dialog
  title="編輯分類"
  :visible.sync="showeditform"
  width="50%"
  >
  <el-form ref="editformres" :rules="editformrules" :model="editforms" label-width="100px">
    <el-form-item label="分類名稱:" prop="cat_name">
      <el-input v-model="editforms.cat_name"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="showeditform = false">取 消</el-button>
    <el-button type="primary" @click="subeditform">确 定</el-button>
  </span>
</el-dialog>
    </div>
</template>
<script>
export default {
  data() {
    return {
      catelist: [],
      total: 0,
      showeditform: false,
      editforms: {},
      queryinfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5
      },
      editformrules: {
        cat_name: [
          { required: true, message: '請輸入分類名稱', trigger: 'blur' },
          { min: 2, max: 7, message: '分類長度在2到7個', trigger: 'blur' }
        ]
      },
      // tree-table 裏面的 columns
      columns: [
        {
          label: '分類名稱',
          prop: 'cat_name'
        },
        {
          label: '是否有效',
          prop: 'cat_deleted',
          type: 'template',
          template: 'isok'
        },
        {
          label: '排序',
          prop: 'cat_level',
          type: 'template',
          template: 'order'
        },
        {
          label: '操作',
          prop: 'cat_id',
          type: 'template',
          template: 'conter'
        }
      ]
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories', { params: this.queryinfo })
      if (res.meta.status !== 200) {
        return this.$message.error('獲取分類失敗')
      }
      this.catelist = res.data.result
      this.total = res.data.total
      console.log(res.data)
    },
    handleSizeChange(newpagesize) {
      this.queryinfo.pagesize = newpagesize
      this.getCateList()
    },
    handlepagenumChange(newpagenum) {
      this.queryinfo.pagenum = newpagenum
      this.getCateList()
    },
    async editform(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.showeditform = true
      this.editforms = res.data
    },
    subeditform() {
      console.log(this.editforms.cat_name)
      this.$refs.editformres.validate(async valid => {
        if (!valid) return
        const { data: res } = await this.$http.put('categories/' + this.editforms.cat_id,
          {
            cat_name: this.editforms.cat_name
          })
        if (res.meta.status !== 200) {
          return this.$message('修改失敗')
        }
        this.getCateList()
        this.$message.success('修改成功')
        this.showeditform = false
      })
    },
    async deletecat(id) {
      const rest = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (rest !== 'confirm') {
        return this.$message.info('取消成功')
      }
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('刪除失敗')
      }
      this.$message.success('刪除成功')
      this.getCateList()
    }
  }
}
</script>
<style lang="less" scoped>
  .el-cascader{
    width: 100%;
  }
</style>

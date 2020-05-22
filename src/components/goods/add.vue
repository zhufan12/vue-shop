<template>
    <div>
    <el-breadcrumb separator="/">
    <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
    <el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
    <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
    <el-alert
    title="添加商品信息"
    type="info"
    center
    show-icon
    :closable="false">
  </el-alert>
  <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
  <el-step title="基本信息"></el-step>
  <el-step title="商品參數"></el-step>
  <el-step title="商品屬性"></el-step>
  <el-step title="商品圖片"></el-step>
  <el-step title="商品内容"></el-step>
  <el-step title="完成"></el-step>
</el-steps>
<el-form :model="addForm" :rules="addfromrules" ref="addruleForm" label-width="100px" label-position="top">
 <el-tabs :tab-position="'left'" v-model="activeIndex" :before-leave="beforele" @tab-click="tabClicked">
    <el-tab-pane label="基本信息" name="0">
        <el-form-item label="商品名稱" prop="goods_name">
        <el-input v-model="addForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品價格" prop="goods_price">
        <el-input v-model="addForm.goods_price" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="addForm.goods_weight" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品數量" prop="goods_number">
        <el-input v-model="addForm.goods_number" type="number"></el-input>
        </el-form-item>
        <el-form-item label="商品分類" prop="goods_cat">
            <el-cascader
            v-model="addForm.goods_cat"
            :options="catlist"
            expandTrigger="hover"
            :props="catprpos"
             @change="handleChange"></el-cascader>
        </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品參數" name="1">
      <el-form-item :label="item.attr_name" v-for="item in manytabedata" :key="item.attr_id">
        <el-checkbox-group v-model="item.attr_vals">
        <el-checkbox :label="cd" v-for="(cd, i) in item.attr_vals" :key="i" border></el-checkbox>
  </el-checkbox-group>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品屬性" name="2">
      <el-form-item :label="itme.attr_name" v-for="itme in onlytabledata" :key="itme.attr_id">
      <el-input v-model="itme.attr_vals"></el-input>
      </el-form-item>
    </el-tab-pane>
    <el-tab-pane label="商品圖片" name="3">
      <el-upload
      :action="uploadlink"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handlesuccess"
      :headers="header"
      list-type="picture">
  <el-button size="small" type="primary">点击上传</el-button>
</el-upload>
    </el-tab-pane>
    <el-tab-pane label="商品内容" name="4">
    <quill-editor v-model="addForm.goods_introduce">
    </quill-editor>
    <el-button type="primary" class="but" @click="submitform">添加商品</el-button>
    </el-tab-pane>
  </el-tabs>
</el-form>
  </el-card>
  <el-dialog
  title="圖片預覽"
  :visible.sync="dialogVisible"
  width="50%">
  <img :src="pri" alt="" class="image">
</el-dialog>
    </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      activeIndex: '0',
      dialogVisible: false,
      manytabedata: [],
      onlytabledata: [],
      pri: '',
      uploadlink: 'http://127.0.0.1:8888/api/private/v1/upload',
      header: {
        Authorization: window.sessionStorage.getItem('token')
      },
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: '',
        attrs: []
      },
      catlist: [],
      catprpos: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      addfromrules: {
        goods_name: [
          { required: true, message: '請輸入商品名稱', trigger: 'blur' }
        ],
        goods_price: [
          { required: true, message: '請輸入商品價格', trigger: 'blur' }
        ],
        goods_number: [
          { required: true, message: '請輸入商品數量', trigger: 'blur' }
        ],
        goods_weight: [
          { required: true, message: '請輸入商品重量', trigger: 'blur' }
        ],
        goods_cat: [
          { required: true, message: '請選擇分類', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getlist()
  },
  methods: {
    async getlist() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('獲取失敗')
      }
      this.catlist = res.data
      // console.log(this.catlist)
    },
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforele(activename, oldactivename) {
      if (oldactivename === 0 || this.addForm.goods_cat.length !== 3) {
        this.$message.error('請選擇商品分類')
        return false
      }
    },
    async tabClicked() {
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: 'many' } })
        if (res.meta.status !== 200) {
          return this.$message.error('獲取失敗')
        }
        console.log(res)
        res.data.forEach(item => {
          item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manytabedata = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(`categories/${this.cateID}/attributes`, { params: { sel: 'only' } })
        if (res.meta.status !== 200) {
          return this.$message.error('獲取失敗')
        }
        this.onlytabledata = res.data
      }
    },
    handlePreview(file) {
      this.pri = file.response.data.url
      this.dialogVisible = true
    },
    handleRemove(file) {
      const filepath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex(x => x.pic === filepath)
      console.log(i + '123')
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    handlesuccess(respons) {
      const prinfo = { pic: respons.data.tmp_path }
      this.addForm.pics = prinfo
      console.log(this.addForm)
    },
    submitform() {
      this.$refs.addruleForm.validate(async valid => {
        if (!valid) {
          return this.$message.error('請添加必要的表單')
        }
        const rom = _.cloneDeep(this.addForm)
        rom.goods_cat = rom.goods_cat.join(',')
        this.manytabedata.forEach(item => {
          const newinfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
          this.addForm.attrs.push(newinfo)
        })
        this.onlytabledata.forEach(item => {
          const neif = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(neif)
        })
        rom.attrs = this.addForm.attrs
        const { data: res } = await this.$http.post('goods', rom)
        console.log(rom)
        if (res.meta.status !== 201) {
          return this.$message.error('添加失敗')
        }
        this.$message.success('添加成功')
        this.$router.push('/goods')
      })
    }
  },
  computed: {
    cateID() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>
<style lang="less" scoped>
 .el-checkbox{
   margin: 0 10px 0 0 !important;
 }
 .image{
   widows: 100%;
 }
 .but{
   margin-top: 20px;
 }
</style>

<template>
<div class="login_con">
    <div class="login_box">
        <div class="ava_box">
        <img src="../assets/logo.png">
        </div>
        <el-form :model="loginFrom" :rules="loginFromRules" label-width="0px" class="login_from">
        <!--用戶名-->
            <el-form-item prop="loginFromRules.username">
                <el-input v-model="loginFrom.username"  prefix-icon="el-icon-user"></el-input>
            </el-form-item>
             <!--密碼-->
            <el-form-item prop="loginFromRules.password">
                <el-input v-model="loginFrom.passwrod" type="password" prefix-icon="el-icon-goods"></el-input>
            </el-form-item>
             <!--按鈕-->
            <el-form-item class="btn_s">
                <el-button type="primary">登錄</el-button>
                <el-button type="info">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</div>
</template>
<script>
export default {
  data () {
    return {
      loginFrom: {
        username: '',
        password: ''
      },
      loginFromRules: {
        username: [
        ],
        password: [
        ]
      }
    }
  }
}
</script>
<style lang="less" scoped>
    .login_con{
        background-color:#2B4B6B;
        height:100vh;
            }
    .login_box{
        width: 450px;
        height: 300px;
        background-color: white;
        position: absolute;
        border-radius: 20px;
        top: 50%;
        left: 50%;
        transform: translate(-50%,-50%);
    }
    .ava_box{
        height: 130px;
        width: 130px;
        overflow: hidden;
        border-radius: 50%;
        padding: 10px;
        box-shadow: 0 0 10px #dddddd;
        position:absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #ffffff;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color:#eeeeee;
        }
    }
    .btn_s{
        display: flex;
        justify-content: flex-end;
    }
    .login_from{
        position: absolute;
        bottom: 0px;
        width: 100%;
        padding: 0 20px;
        box-sizing: border-box;
    }
</style>

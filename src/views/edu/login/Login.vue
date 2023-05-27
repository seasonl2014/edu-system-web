<template>
  <!--头部 start-->
   <TopHeader/>
  <!--头部 start-->
  <!--搜索 start-->
  <Search/>
  <!--搜索 end-->

  <!--登录 Start-->
  <div class="login" style="position: relative;">
    <el-form ref="loginFormRef" :rules="loginFormRules" :model="loginForm">
      <div class="loginbox">
        <a class="ewm_login" @click="wxlogin"><span>扫码登录更便捷</span></a>
        <div class="login02">
          <div class="tit">账号登录 <a class="changelogin hide">使用密码登录</a> <a class="changelogin hide">使用验证码登录</a>
          </div>
          <ul class="logn_ul2">
            <li>
              <el-form-item prop="phone">
              <el-input prefix-icon="Phone" v-model="loginForm.phone"  class="input1" placeholder="手机号"/>
              </el-form-item>
            </li>
            <li>
              <el-form-item prop="password">
              <el-input prefix-icon="Lock" type="password" v-model="loginForm.password" class="input1" placeholder="请输入密码"/>
              </el-form-item>
            </li>
            <li style="border:0">
              <el-button class="sub1" :loading="subLoading" @click="login(loginFormRef)">登录</el-button>
            </li>
            <h1 style="position:relative">还没有帐号？<a @click="wxlogin">微信扫码即注册</a><span style="position:absolute; right:0">忘记密码？<a @click="wxlogin">立即找回</a></span></h1>
          </ul>
        </div>
      </div>
    </el-form>
  </div>
  <!--登录 end-->

  <!--底部 start-->
  <Footer/>
  <!--底部 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue";
import Search from "@/views/edu/common/search/Search.vue";
import Footer from "@/views/edu/common/footer/Footer.vue";
import { ElMessage,FormInstance,FormRules } from 'element-plus'
import {ref,reactive} from 'vue'
import {loginApi} from "@/api/edu/login/login";
import {useRouter } from 'vue-router'
import { useStudentStore } from "@/store/modules/student"
// 获取服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 获取路由对象
const router = useRouter()
// 获取学员在pinia对象
const studentStore = useStudentStore()
// 登录表单实例对象
const loginFormRef = ref<FormInstance>()
// 登录按钮状态
const subLoading = ref(false)
// 自定义手机号规则
const checkMobile = (rule, value, callback) => {
  const regMobile = /^1[34578]\d{9}$/
  if (regMobile.test(value)) {
    return callback()
  }
  // 返回一个错误提示
  callback(new Error('请输入合法的手机号码'))
}
// 定义登录表单规则
const loginFormRules = reactive<FormRules>({
  phone: [{ required:true,message:'请输入手机号',trigger:'blur' },
    { validator:checkMobile,trigger: 'blur'}],
  password: [{required: true,message: '请输入密码',trigger: 'blur'}]
})
// 定义表单数据对象
const loginForm = reactive({
  phone: '',
  password: ''
})
// 点击登录执行函数
const login = async (formEl: FormInstance | undefined)=> {
  if(!formEl)return
  await formEl.validate(async (valid,fields)=> {
    subLoading.value = true
    if (valid){
     const { data } = await loginApi(loginForm)
      if(data.status === 200){
        // 设置学员token
        studentStore.setStudentToken(data.result.studentToken)
        // 设置登录学员信息
        studentStore.setStudentPartInfo(data.result)
        ElMessage.success(data.message)
        // 跳转首页
        router.push({
          path: '/index'
        })
      }else {
        ElMessage.error(data.message)
      }

    }else {
      ElMessage.error('提交表单失败，你还有未填写的项目')
    }
    subLoading.value = false
  })
}
const page = reactive({
  width: window.screen.width * 0.5,
  height: window.screen.height * 0.5
})
// 微信扫码登录
const wxlogin = ()=> {
  const wxUrl = url+'wechat/login'
  window.open(wxUrl, 'newWindow', `resizable=yes, height=${page.height}, width=${page.width}, top=10%, left=10%, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=no, status=no`)
  window.addEventListener('message', resolveSocialLogin, false)
}

const resolveSocialLogin= async(e:any)=> {
  console.info('传入参数', e.data)
  // 设置学员token
  studentStore.setStudentToken(e.data.studentToken)
  // 设置登录学员信息
  studentStore.setStudentInfo({
    studentIcon: e.data.studentIcon,
    name: e.data.name
  })
  if(studentStore.studentToken!=null){
    window.removeEventListener('message',resolveSocialLogin,false)
    // 跳转首页
    router.push({
      path: '/index'
    })
  }

}

</script>

<style scoped>
ul, li, dl, dt {
  list-style: none;
}
.login {
  width: 100%;
  height: 500px;
  background: url(@/static/img/login_bg.jpg) center 0 no-repeat;
}
.login form {
  position: absolute;
  left: 50%;
  margin-left: -575px;
  top: 0;
  height: 500px;
  z-index: 1;
  width: 1150px;
}
.loginbox {
  position: absolute;
  width: 300px;
  height: 300px;
  padding: 30px 50px;
  right: 0;
  top: 70px;
  background: #fff;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
}
.loginbox .ewm_login {
  position: absolute;
  width: 50px;
  height: 50px;
  background: url(@/static/img/ewm_login.png) 0 0 no-repeat;
  right: 5px;
  top: 5px;
  cursor: pointer;
  z-index: 1;
}
.loginbox .ewm_login span {
  position: absolute;
  width: 110px;
  height: 26px;
  border: 1px solid #f3d995;
  background: #fefcee;
  color: #df9c1f;
  left: -120px;
  top: 2px;
  font-size: 13px;
  line-height: 26px;
  text-align: center;
}
.loginbox .tit {
  font-size: 20px;
  margin-top: 15px;
  height: 40px;
  position: relative;
}
.loginbox .tit .changelogin {
  position: absolute;
  font-size: 14px;
  color: #666;
  right: 0;
  bottom: 15px;
  cursor: pointer;
}
.hide {
  display: none;
}
.loginbox .logn_ul2 {
  width: 300px;
  height: auto;
  padding: 0;
  margin: 0 auto;
  position: relative;
  top: 0;
}
.login form ul li {
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  margin-bottom: 20px;
  position: relative;
  background: #fff;
}
.login form ul li .input1 {
  -webkit-appearance: none;
  height: 50px;
  border: 0;
  background: none;
  font-size: 14px;
  color: #000;
  line-height: 50px;
}

.login form ul .sub1 {
  -webkit-appearance: none;
  width: 100%;
  background: #ff536a;
  color: #fff;
  font-size: 16px;
  border: 0;
  height: 50px;
  line-height: 50px;
  border-radius: 4px;
  -webkit-border-radius: 4px;
  -moz-border-radius: 4px;
  margin-top: 20px;
}
.login form ul h1 {
  padding: 15px 0;
  color: #999;
  text-align: left;
  font-size: 12px;
}
.login form ul h1 a {
  color: #ff536a;
  cursor: pointer;
}
</style>

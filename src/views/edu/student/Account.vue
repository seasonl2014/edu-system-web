<template>
  <!--头部组件 start-->
  <TopHeader/>
  <!--头部组件 start-->
  <!--搜索组件 start-->
  <Search/>
  <!--搜索组件 start-->
  <!--中间内容 start-->
  <!--banner start-->
  <div class="details-banner">
    <h3>学员编号：{{studentInfo.stuNo}}</h3>
    <div class="details-tag">
      <span>手机号：{{studentInfo.phone==null?'未绑定':studentInfo.phone}}</span>
      | <span>昵称：{{studentInfo.name}}</span>
      | <span>性别：{{studentInfo.sex==0?'保密':studentInfo.sex==2?'男':'女'}}</span>
      | <span>会员类型：{{studentInfo.vipType==null?'注册会员':'齐天大会员'}}</span>
      | <span>区域：{{studentInfo.province}}-{{studentInfo.city}}</span>
    </div>
  </div>
  <!--banner end-->
  <div class="edu-container center-main">
    <!--左边菜单 start-->
    <StudentLeft :menuType="menuType"/>
    <!--左边菜单 end-->
    <!--右边绑定内容 start-->
    <div class="center-right">
      <div class="right-title">
        账号绑定
      </div>
      <div class="account-box">
        <div class="account-item">
          <span><img src="@/static/img/a_ico1.png"> </span> 邮箱<i v-if="studentInfo.email==null">(未绑定)</i><i v-else>{{ studentInfo.email }}</i>
          <div class="account-btn mail-btn" @click="emailBind()" v-if="studentInfo.email==null">立即绑定</div>
          <div class="account-btn mail-btn" @click="emailBind()" v-else>设置</div>
        </div>
        <div class="account-item">
          <span><img src="@/static/img/a_ico2.png"> </span> 手机<i v-if="studentInfo.phone==null">(未绑定)</i><i v-else>{{ studentInfo.phone  }}</i>
          <div class="account-btn set-phone" @click="setMobile()">设置</div>
        </div>
        <div class="account-item">
          <span><img src="@/static/img/a_ico3.png"> </span> 密码
          <div class="account-btn change-btn" @click="changePassWord()">修改</div>
        </div>
      </div>
    </div>
    <!--右边绑定内容 end-->
  </div>

  <!--弹框 start-->
  <div class="j-cover" v-show="coverState">
    <!--绑定邮箱 start-->
    <div class="j-cover-box bind-mail" v-show="mailState">
      <h3>绑定邮箱</h3>
      <form class="cover-form">
        <div class="cover-item">
          <span>邮箱地址：</span>
          <input type="text" v-model="studentInfo.email" placeholder="请输入邮箱" class="cover-input">
        </div>
        <div class="cover-item">
          <span>邮箱验证：</span>
          <input type="text" v-model="studentInfo.emailCode" class="cover-input">
          <i @click="sendEmail()">验证码接收</i>
        </div>
        <div class="cover-btn">
          <input type="button" value="确定" @click="bindEmail()" class="form-btn subBtn">
          <input type="button" value="取消" @click="cancelBindEmail()" class="form-btn cancel">
        </div>
      </form>
    </div>
    <!--绑定邮箱 end-->

    <!--解绑手机 start-->
    <div class="j-cover-box phone-cover" v-show="phoneState">
      <h3>当前绑定手机号{{studentInfo.phone}}</h3>
      <form class="cover-form">
        <div class="cover-btn">
          <input type="button" value="更换手机" class="form-btn change-phone" @click="changePhone()">
        </div>
      </form>
    </div>
    <!--更改手机-->
    <div class="j-cover-box bind-phone" v-show="bindPhoneState">
      <h3>更改手机</h3>
      <form class="cover-form">
        <div class="cover-item">
          <span>手机号码：</span>
          <input type="text" v-model="studentInfo.phone" placeholder="请输入手机号" class="cover-input">
        </div>
        <div class="cover-item">
          <span>短信验证：</span>
          <input type="text" v-model="studentInfo.phoneCode" class="cover-input">
          <i @click="sendSms()">短信接收</i>
        </div>
        <div class="cover-btn">
          <input type="button" value="确定" class="form-btn subBtn" @click="bindPhone()">
          <input type="button" value="取消" class="form-btn cancel" @click="cancelBindMobile()">
        </div>
      </form>
    </div>
    <!--解绑手机 end-->

    <!--更改密码 start-->
    <div class="j-cover-box change-password" v-show="passwordState">
      <h3>修改密码</h3>
      <form class="cover-form">
        <div class="cover-item">
          <span>原始密码：</span>
          <input type="text" v-model="passWordInfo.passWord" placeholder="请输入密码" class="cover-input">
        </div>
        <div class="cover-item">
          <span>新密码：</span>
          <input type="text" v-model="passWordInfo.newPassWord" placeholder="请输入密码" class="cover-input">
        </div>
        <div class="cover-item">
          <span>确认密码：</span>
          <input type="text" v-model="passWordInfo.resNewPassWord" placeholder="请输入密码" class="cover-input">
        </div>
        <div class="cover-btn">
          <input type="button" value="确定" class="form-btn subBtn" @click="savePassWord()">
          <input type="button" value="取消" class="form-btn cancel" @click="cancelUpdatePassWord()">
        </div>
      </form>
    </div>
    <!--更改密码 end-->

  </div>
  <!--弹框 end-->

  <!--中间内容 end-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue";
import Search from "@/views/edu/common/search/Search.vue"
import Footer from "@/views/edu/common/footer/Footer.vue"
import StudentLeft from "@/views/edu/student/components/StudentLeft.vue"
import { ref,reactive,onMounted} from 'vue'
import {
  bindEmailApi,
  bindPhoneApi,
  getStudentInfoApi,
  savePassWordApi,
  sendEmailApi,
  sendSmsApi
} from "@/api/edu/student/student";
import {ElMessageBox} from 'element-plus'
const  menuType = ref('account')
// 学生信息对象
const studentInfo = reactive({
  id: 0,
  name: '',
  sex: 0,
  vipType: '',
  stuNo: '',
  province: '',
  city: '',
  email: '',
  emailCode: '',
  phone: '',
  phoneCode: ''
})
/**
 * 获取登录学员信息
 */
const getStudentInfo = async ()=> {
  const { data } = await getStudentInfoApi()
  // 填充数据
  for (const key in studentInfo) {
    studentInfo[key] = data.result[key]
  }
}
onMounted(()=> {
  getStudentInfo()
})
// 弹出框状态
const coverState = ref(false)
// 邮箱状态
const mailState = ref(false)
/**
 *
 * 绑定邮箱
 */
const emailBind = ()=>{
  coverState.value = true
  mailState.value = true
}
/**
 *
 * 取消绑定邮箱
 */
const cancelBindEmail = ()=>{
  coverState.value = false
  mailState.value = false
}
/**
 * 验证邮箱
 */
const verifyEmail = ()=> {
  let emailRegExp=/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
  if(!emailRegExp.test(studentInfo.email))	{
    ElMessageBox.alert('邮箱格式不对')
    return false
  }else{
    return true
  }
}

/**
 * 获取邮箱验证码
 */
const sendEmail = async ()=> {
  if(verifyEmail()){
    const { data } = await sendEmailApi(studentInfo.email)
    ElMessageBox.alert(data.message)
  }

}
/**
 * 提交绑定邮箱
 */
const bindEmail = async () => {
  const { data } = await bindEmailApi(studentInfo.email,studentInfo.emailCode)
  ElMessageBox.alert(data.message)
  cancelBindEmail()
}

/**
 *
 * 设置手机号
 */
const phoneState = ref(false)
const setMobile = ()=>{
  coverState.value = true
  phoneState.value = true
}
/**
 *
 * 验证手机号
 */
const verifyPhone = ()=>{
  // 验证手机号
  let reg = /^1[0-9]{10}$/
  if (studentInfo.phone === '' || studentInfo.phone.length <= 10|| !reg.test(studentInfo.phone)) {
    ElMessageBox.alert('手机号不正确')
    return false
  }else {
    return true
  }
}
/**
 *
 * 弹出更换手机号
 */
const bindPhoneState = ref(false)
const changePhone = ()=>{
  phoneState.value = false
  bindPhoneState.value = true

}
/**
 *
 * 发送短信验证码
 */
const sendSms = async ()=>{
  if(verifyPhone()){
    const { data } = await sendSmsApi(studentInfo.phone)
    ElMessageBox.alert(data.message)
  }
}

/**
 *
 * 取消绑定邮箱
 */
const cancelBindMobile = ()=>{
  coverState.value = false
  bindPhoneState.value = false
}
/**
 *
 * 提交绑定手机号
 */
const bindPhone = async ()=>{
  const { data } = await bindPhoneApi(studentInfo.phone,studentInfo.phoneCode)
  ElMessageBox.alert(data.message)
}
// 密码对象
const passWordInfo =reactive({
      passWord: '',
      newPassWord: '',
      resNewPassWord: ''
})
// 修改密码弹出框状态
const passwordState = ref(false)
/**
 *
 * 弹出修改密码
 */
const changePassWord = ()=>{
  coverState.value = true
  passwordState.value = true
}
/**
 *
 * 取消修改密码
 */
const cancelUpdatePassWord = ()=>{
  coverState.value = false
  passwordState.value = false
}
/**
 *
 * 验证密码
 */
const verifyPassword = ()=>{
  // 验证密码
  let reg = /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{6,30}$/
  if (passWordInfo.newPassWord === '' ||  !reg.test(passWordInfo.newPassWord)) {
    ElMessageBox.alert("密码为数字，小写字母，大写字母，特殊符号 至少包含三种，长度为 6 - 30位")
    return false
  }else {
    if(passWordInfo.resNewPassWord!=passWordInfo.newPassWord){
      ElMessageBox.alert("两次输入密码不一致")
      return false
    }else {
      return true
    }

  }
}
/**
 *
 * 保存密码
 */
const savePassWord = async ()=> {
  if (!verifyPassword()) {
    return;
  }
  const { data } = await savePassWordApi(passWordInfo)
  ElMessageBox.alert(data.message)
  if(data.status === 200){
    cancelUpdatePassWord()
  }
}
</script>

<style scoped>
/*banner样式 start*/
.details-banner {
  width: 100%;
  height: 150px;
  background: url(@/static/img/details_banner.jpg) no-repeat top;
  background-size: 100% 100%;
  text-align: center;
  padding-top: 50px;
}
.details-banner h3 {
  color: #fff;
  font-size: 39px;
  text-shadow: 1px 1px 5px rgb(0 0 0 / 30%);
  margin-bottom: 20px;
}
.details-tag {
  color: #fff;
}
.details-tag span {
  display: inline-block;
  color: #fff;
  font-size: 14px;
  margin: 0 20px;
}
.details-banner-btn {
  cursor: pointer;
  width: 82px;
  height: 29px;
  padding-left: 20px;
  line-height: 28px;
  margin: 40px auto 0;
  border: 1px solid #fff;
  color: #fff;
  font-size: 14px;
  text-align: center;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo2NTY5Q0RGMzk5MTMxMUVBODdCNEU3Rjk0NTM2RjZCNCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo2NTY5Q0RGNDk5MTMxMUVBODdCNEU3Rjk0NTM2RjZCNCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjY1NjlDREYxOTkxMzExRUE4N0I0RTdGOTQ1MzZGNkI0IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjY1NjlDREYyOTkxMzExRUE4N0I0RTdGOTQ1MzZGNkI0Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+VcJUXgAAAQlJREFUeNqM0rFLgkEYx3FfwSlEECHhpaE2ndQhcJBybPKPaBF6odnBVVFxiyYJB9dydhAECTcxEbFCwt3hHaQhorfvxR0ccScefOTex/u973vPe04QBCHLeEQCF8Z/RdCgAh8b3JnW2IJinGnz2CHBLhba9QhjhPV1Dj8nvHEVKSQRwyWWcjcunvGNLT7QFEHRnT6GmGJiaVYOWelGPPYLbcteTW7xIybHsgG9A0INuTatClHs8LAnVJMh939XPaz3BFdoqeuwtvk8BiH7EA3MmE7OHEU5L+AF77iStVO8IqK+o7qHjyd5Ps/RwSc8vGGGMuJ/de2JJcxwjyOtLk5MHUtcq/qvAAMAvVG1qNmxtlwAAAAASUVORK5CYII=) no-repeat 18px;
  background-size: auto;
  border-radius: 20px;
}
/*banner样式 end*/
.edu-container {
  width: 1200px;
  margin: auto;
}
.center-main{
  background: #ffffff;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  min-height: 600px;
  border-radius: 10px;
  box-shadow: 1px 1px 10px rgb(27 39 94 / 40%);
}
.center-right{
  width: 888px;
  margin-left: 60px;
  margin-top: 30px;
}
.right-title{
  color: #555555;
  font-size: 16px;
  padding-right: 20px;
  border-bottom: 1px solid #bebebe;
  line-height: 40px;
}
.right-title span{
  color: #065786;
  font-size: 14px;
  cursor: pointer;
  float: right;
}
.account-item{
  padding: 30px 0;
  border-bottom: 1px solid #e8e8e8;
  color: #343434;
  font-size: 16px;
}
.account-item i{
  color: #ff2a00;
  font-style: normal;
  margin-left: 5px;
}
.account-item span img{
  vertical-align: middle;
  margin-right: 10px;
}
.account-btn{
  display: inline-block;
  float: right;
  width: 88px;
  height: 36px;
  border:1px solid #888888;
  text-align: center;
  line-height: 36px;
  color: #7d7d7d;
  font-size: 16px;
  border-radius: 20px;
  cursor: pointer;
}

/*弹出框样式 start*/
.j-cover{
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.3);
  position: fixed;
  left: 0;
  top:0;
  z-index: 1;
}
.j-cover-box{
  width: 488px;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 1px 1px 5px rgba(0,0,0,.1);
  position: fixed;
  left: 50%;
  top:50%;
  transform: translate(-50%, -50%);
  padding: 20px 30px;
}
.j-cover-box h3{
  color: #555555;
  font-size: 16px;
}
.cover-form{
  margin-top: 30px;
}
.cover-item{
  margin: 20px 0;
}
.cover-item span{
  width: 16px;
  color: #555555;
  display: inline-block;
  width: 85px;
}
.cover-input{
  width: 75%;
  height: 36px;
  border:none;
  background: #f4f4f4;
  border-radius: 6px;
  font-size: 14px;
  padding-left: 10px;
}
.cover-item i{
  color: #05af10;
  font-size: 16px;
  padding: 0 10px;
  margin-left: -100px;
  line-height: 36px;
  font-style: normal;
  cursor: pointer;
}
.cover-btn{
  text-align: center;
  margin-top: 20px;
}
.form-btn{
  color: #8f8f8f;
  border:1px solid #8f8f8f;
  padding: 2px 10px;
  font-size: 14px;
  border-radius: 20px;
  margin: 0 10px;
  cursor: pointer;
}
.subBtn{
  color: #ffffff;
  background: #05af10;
  border:none;
}
/*弹出框样式 end*/
</style>

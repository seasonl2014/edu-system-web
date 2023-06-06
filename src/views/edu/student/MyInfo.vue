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
  <!--右边个人信息 start-->
    <div class="center-right">
      <div class="right-title">
        个人信息
        <span @click="edit()"><img src="@/static/img/edit.png">  修改</span>
      </div>
      <div class="info-list">
        <div class="info-item">
          <div class="info-label">昵称</div>
          <div class="info-text">{{ studentInfo.name }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">性别</div>
          <div class="info-text" v-if="studentInfo.sex==1">女</div>
          <div class="info-text" v-else-if="studentInfo.sex==2">男</div>
          <div class="info-text" v-else>保密</div>
        </div>
        <div class="info-item">
          <div class="info-label">VIP</div>
          <div class="info-text">
            <template v-if="studentInfo.vipType==null">
              <router-link to="/edu/vip">
              <el-button type="primary">加入VIP会员</el-button>
              </router-link>
            </template>
          </div>
        </div>
        <div class="info-item">
          <div class="info-label">区域</div>
          <div class="info-text">{{studentInfo.province}}-{{studentInfo.city}}</div>
        </div>
      </div>
    </div>
  <!--右边个人信息 start-->
  </div>

  <!--修改信息弹框 start-->
  <div class="j-cover" v-show="editState">
    <div class="j-cover-box">
      <h3>修改个人信息</h3>
      <form class="cover-form">
        <div class="cover-item">
          <span>昵称：</span>
          <input type="text" v-model="studentInfo.name" placeholder="请输入昵称" class="cover-input">
        </div>
        <div class="cover-item">
          <span>性别：</span>
          <input type="radio" value="2" v-model="studentInfo.sex" class="cover-radio">
          <label class="cover-label">男</label>
          <input type="radio" value="1" v-model="studentInfo.sex" class="cover-radio">
          <label class="cover-label">女</label>
        </div>
        <div class="cover-btn">
          <el-button :loading="subLoading"  @click="update()" class="form-btn subBtn">确定</el-button>
          <input type="button" value="取消" @click="cancel()" class="form-btn cancel">
        </div>
      </form>
    </div>
  </div>
  <!--修改信息弹框 end-->

  <!--中间内容 end-->
  <!--底部组件 start-->
  <Footer/>
  <!--底部组件 end-->
</template>

<script setup lang="ts">
import TopHeader from "@/views/edu/common/header/TopHeader.vue";
import Search from "@/views/edu/common/search/Search.vue";
import Footer from "@/views/edu/common/footer/Footer.vue";
import StudentLeft from "@/views/edu/student/components/StudentLeft.vue";
import { ref,reactive,onMounted } from 'vue'
import {getStudentInfoApi, updateApi} from "@/api/edu/student/student";
import {ElMessage} from 'element-plus'
// 左边菜单参数
const menuType = ref('centerInfo')
// 学生信息对象
const studentInfo = reactive({
  id: 0,
  name: '',
  sex: 0,
  vipType: '',
  stuNo: '',
  province: '',
  city: ''
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
/**
 *
 * 编辑会员信息
 */
const editState = ref(false)
const edit = ()=>{
  editState.value = true
}
/**
 *
 * 取消编辑会员信息
 */
const cancel = ()=>{
  editState.value = false
}
/**
 *
 * 更新会员信息
 */
const subLoading = ref(false)
const update = async ()=>{
  subLoading.value = true
  const { data } = await updateApi(studentInfo)
  if(data.status === 200){
    ElMessage.success(data.message)
    await getStudentInfo()
    editState.value = false

  }else {
    ElMessage.error(data.message)
  }

}


onMounted(()=> {
  getStudentInfo()
})

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
/*右边学员信息样式 start*/
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
.info-list{
  margin-top: 40px;
}
.info-item{
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}
.info-label{
  width: 120px;
  height: 60px;
  background: #f4f4f4;
  text-align: center;
  line-height: 60px;
  color: #555555;
  font-size: 14px;
}
.info-text{
  width: 605px;
  color: #7d7d7d;
  font-size: 14px;
  line-height: 60px;
  margin-left: 15px;
  border-bottom: 1px solid #f4f4f4;
}
/*右边学员信息样式 end*/
/*编辑信息弹出层样式 start*/
.j-cover{
  /* display: none;*/
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,.3);
  position: fixed;
  left: 0;
  top:0;
  z-index: 99999999;
}
.j-cover-box{
  width: 488px;
  /*height: 444px;*/
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
.cover-item select{
  width: 23%;
  height: 36px;
  border:none;
  background: #f4f4f4;
  border-radius: 6px;
  font-size: 14px;
  color: #555555;
  padding-left: 10px;
  margin-right: 10px;
}
.cover-radio{
  vertical-align: -1px;
}
.cover-label{
  color: #555555;
  font-size: 16px;
  margin:0 20px 0 5px;
}
.cover-item textarea{
  width: 75%;
  height: 120px;
  border:none;
  background: #f4f4f4;
  border-radius: 6px;
  font-size: 14px;
  padding: 10px;
  resize: none;
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
  background: #065786;
  border:none;
  cursor: pointer;
}
/*编辑信息弹出层样式 end*/
</style>

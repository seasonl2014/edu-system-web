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
    <!--右边下载记录 Start-->
    <div class="center-right">
      <div class="right-title">
        下载课程资料记录
      </div>
      <table width="100%" cellspacing="0" cellpadding="0" class="recharge-tab">
        <tr>
          <th>资料名称</th>
          <th>所属课程</th>
          <th width="20%">下载次数</th>
          <th>下载时间</th>
        </tr>
        <tr v-for="item in videoList">
          <td>{{ item.eduVideo.title }}</td>
          <td>{{ item.eduVideo.title }}</td>
          <td style="color:red;">{{ item.playCount }}次</td>
          <td>{{item.eduVideo.duration*item.playCount*1000 | formatDate}}</td>
        </tr>

      </table>
      <!--分页 start-->
      <!--分页 end-->
    </div>
    <!--右边下载记录 end-->


  </div>
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
import {getStudentInfoApi} from "@/api/edu/student/student";
const  menuType = ref('myDownload')
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
.recharge-tab{
  margin: 20px 0;
}
.recharge-tab tr th{
  line-height: 45px;
  background: #efefef;
  color: #555555;
  font-size: 14px;
  text-align: center;
}
.recharge-tab tr td{
  color: #555555;
  font-size: 14px;
  line-height: 45px;
  border-bottom: 1px solid #bdbdbd;
  text-align: center;
}
.recharge-tab tr:last-child td{
  border-bottom: none;
}
</style>

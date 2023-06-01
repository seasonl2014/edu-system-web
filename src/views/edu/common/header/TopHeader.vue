<template>
<div class="edu-header header-store">
  <div class="edu-container">
   <router-link class="logo" to="/index">
     <img src="@/assets/edu/images/edu-logo.png" alt="学灯网在线教育" />
   </router-link>

    <div class="edu-component"></div>

    <ul class="edu-nav">
      <li class="edu-nav-item" :class="{'edu-active':eduActive=='/index'}">
        <router-link to="/index">首页</router-link>
      </li>

      <li class="edu-nav-item">
        <router-link to="/edu/vip" target="_blank">VIP会员</router-link>
      </li>

      <li class="edu-nav-item" :class="{'edu-active':eduActive=='/edu/list'}">
        <router-link to="/edu/list">全部课程</router-link>
      </li>

      <!--已登录 start-->
      <template v-if="studentToken!=''">
        <li class="edu-nav-item edu-member" :class="{'edu-active':eduActive=='/edu/myInfo'}">
          <router-link class="edu-nav-avatar edu-case-active" to="/edu/student/myInfo">
            <img v-if="studentInfo.studentIcon!=null" :src="studentInfo.studentIcon">
            <img v-else src="@/assets/edu/images/head.jpg">
            <cite>欢迎您：{{studentInfo.name}}</cite>
          </router-link>
        </li>
        <li class="edu-nav-item">
          <a class="edu-case-active" @click="exitSystem" href="JavaScript:void(0);">退出</a>
        </li>
      </template>
      <!--已登录 end-->

      <!--未登录 start-->
      <template v-else>
      <li class="edu-nav-item" :class="{'edu-active':eduActive=='/edu/login'}">
        <router-link to="/edu/login">登录 | 注册</router-link>
      </li>
      </template>
      <!--未登录 end-->

<!--      <li class="edu-nav-item">
        <router-link to="/home" target="_blank">我是讲师</router-link>
      </li>-->

    </ul>

  </div>
</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {useRoute} from 'vue-router'
import { useStudentStore } from "@/store/modules/student"
import { ElMessage,ElMessageBox } from 'element-plus'
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
// 获取登录会员信息
const {studentInfo,studentToken} = useStudentStore()
const route = useRoute()
const eduActive = ref()
eduActive.value = route.path

// 退出系统
const exitSystem = async ()=> {
  ElMessageBox.confirm(
      '您确定要退出学灯网吗？',
      '温馨提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(()=> {
    ElMessage.success('退出成功')
    // 清除用户登录信息
    window.localStorage.removeItem('studentStore')
    // 返回课程首页
    window.location.href='/'
  }).catch(()=> {
    ElMessage.error('退出失败')
  })
}

</script>

<style scoped>
.edu-header {
  height: 59px;
  border-bottom: 1px solid #404553;
  background-color: #083a6d;
  z-index: 1000;
  position: relative;
}

.edu-container {
  width: 1200px;
  padding: 0;
  position: relative;
  margin: 0 auto;
  box-sizing: border-box;
}

.edu-container .logo {
  position: absolute;
  top: 16px;
}

.edu-container .logo img {
  width: 125px;
  height: 46px;
  border: none;
}

.edu-container .edu-nav {
  right: 15px;
  position: absolute;
  top: 0;
  padding: 0;
  background: none;
  color: #fff;
  border-radius: 2px;
  box-sizing: border-box;
}
.edu-nav .edu-nav-item {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  line-height: 60px;
  margin: 0 20px;
}
.edu-nav * {
  font-size: 14px;
}

.edu-nav .edu-nav-item a {
  display: block;
  padding: 0 20px;
  color: #fff;
  transition: all .3s;
  -webkit-transition: all .3s;
}

.edu-active {
  color: #fff!important;
}

.edu-nav .edu-nav-item a:hover,.edu-nav .edu-active a {
  color: #fff;
}
.edu-nav .edu-active:after {
  top: auto;
  bottom: 0;
  width: 100%;
  position: absolute;
  left: 0;
  height: 5px;
  background-color: #5FB878;
  transition: all .2s;
  -webkit-transition: all .2s;
}

/*头像样式*/
.edu-nav-avatar img {
  width: 36px;
  height: 36px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 100%;
  vertical-align: middle;
}

</style>

<template>
<el-col :span="6">
  <div class="right-box">
    <h3 class="title">
      <el-icon style="margin-right: 10px;">
        <Grid/>
      </el-icon>
      信息展示
    </h3>

    <div class="info">
      <div class="right_photo">
        <img v-if="userInfo.userIcon === null || userInfo.userIcon === ''" src="../../../../assets/default_avatar.png">
        <img v-else :src="url+'uploadFile/'+userInfo.userIcon">
      </div>
      <h2>Hi,{{userInfo.realname}}</h2>
      <br>
      <p class="email">{{userInfo.email}}</p>
    </div>
    <el-divider />
    <h3 class="title">
      <el-icon style="margin-right: 10px;">
        <Sunrise/>
      </el-icon>
      账号类型
    </h3>
    <div class="type">
      <br>
      <p>账号类型分为：普通用户、管理员</p>
      <p>管理可对本站数据、成绩、系统等进行管理</p>
      <p>普通用户可对成绩进行管理</p>
      <br>
      <p>
        站长邮箱：<a href="http://mail.qq.com/cgi-bin/qm_share?t=qm_mailme&amp;email=11184629@qq.com"
                    target="_blank" data-v-634963c2="">11184629 @qq.com</a>
      </p>
    </div>

    <el-divider />
    <h3>
      <el-icon style="margin-right: 10px;">
        <Watch/>
      </el-icon>
      本站运行天数（{{calculateDays('2023-3-1 00:00:00')}}）
    </h3>

  </div>
</el-col>
</template>

<script setup lang="ts">
import {calculateDays} from "../../../../utils/date"
import {useUserStore} from "../../../../store/modules/user";

// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API

// 登录用户信息
const { userInfo } =useUserStore()

</script>

<style scoped>
.right-box {
  width: 100%;
  height: auto;
  background: white;
  padding: 20px;
  box-sizing: border-box;
}

.right_photo {
  position: relative;
  text-align: center;
  height: 100px;
  width: 100px;
  margin-left: -50px;
  left: 50%;
}

.info{
  text-align: center;
}

.right_photo img {
  width: 100%;
  border-radius: 50%;
}

.right-box h2{
  padding-top: 10px;
  letter-spacing: 0;
  font-size: 30px;
}

.right-box .title {
  color: #083a6d;
}

</style>

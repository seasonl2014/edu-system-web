<template>
<div class="hotel-footer">
  <p><a href="http://www.xueden.cn">学灯网</a>2023 © <a href="http://www.xueden.cn">www.xueden.cn</a><a href="https://beian.miit.gov.cn/" target="_blank">桂ICP备2023004515号-1</a></p>
  友情链接
  <a href="http://hotel.xueden.cn">酒店管理系统</a>
  <a href="http://edu.xueden.cn">学灯网</a>
  <a href="http://student.xueden.cn">学生信息管理系统</a>
  <el-backtop :right="100" :bottom="100" />
</div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.hotel-footer {
  margin: 18px 0 0;
  padding: 40px 0 30px;
  line-height: 30px;
  text-align: center;
  color: #737573;
  border-top: 1px solid #e2e2e2;
}
.hotel-footer a {
  padding: 0 6px;
  font-weight: 300;
  color: #333;
}
</style>

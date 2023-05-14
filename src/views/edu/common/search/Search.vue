<template>
<div style="height: auto">
  <el-form>
    <div class="input-search">
      <div class="search-room">
        <el-input class="el-input" placeholder="搜索你需要的课程" v-model="keywords"></el-input>
        <el-button @click="searchKeyWord" color="#5e6eba" class="hotel-btn" icon="Search" size="large"></el-button>
      </div>
    </div>
  </el-form>
</div>
</template>

<script setup lang="ts">
import {ref} from 'vue'
import {useRouter} from 'vue-router'
// 定义路由对象
const router = useRouter()
// 定义搜索关键字
const keywords = ref('')
// 根据关键字搜索
const searchKeyWord = ()=> {
  // 跳转到列表页
  router.push({
    path: '/edu/list',
    query: {
      keywords:keywords.value
    }
  })
}
</script>

<style scoped>
.input-search {
  width: 100%;
  padding: 30px 0 10px;
  text-align: center;
  background-color: #fff;
}
.input-search .el-input {
  vertical-align: middle;
  width: 500px;
  height: 40px;
  background: #d9dfe0;
  border: none;
  outline: none;
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}
</style>

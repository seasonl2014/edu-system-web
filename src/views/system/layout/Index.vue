<template>
  <!--背景图片-->
  <div id="ebg">

  </div>

  <div class="common-layout">
    <el-container>
      <!--左侧菜单 start-->
       <el-aside width="auto">
         <AsideMenu/>
       </el-aside>
      <!--左侧菜单 end-->
      <el-container>
        <!--顶部导航栏 start-->
        <el-header>
          <TopBar/>
        </el-header>
        <!--顶部导航栏 end-->
        <!--主要内容-->
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup lang="ts">
// 引入左侧菜单栏自定组件
import AsideMenu from './aside/Index.vue'
// 引入顶部自定义组件
import TopBar from "./header/TopBar.vue"
</script>

<style scoped>
/*顶部导航栏*/
.el-header {
  --el-header-padding:0px;
  --el-header-height: atuo;
  height: 111px;
  background: #F3F3F3;
}
.el-main{
  background: #F3F3F3;
}
.el-container {
  height: 100%;
}
.common-layout{
  width: 99vw;
  height: 98vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  background-color: white;
  border-radius: 15px;
  overflow: hidden;
}

#ebg {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding: 10px;
  background-image: url("@/assets/system-bg.jpg");
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
}

.el-menu-vertical-demo:not(.el-menu--collapse){
  width: 206px;
}
</style>

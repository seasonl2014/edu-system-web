<template>
<div class="main-tabs-view">
  <div class="tabs-view">
    <el-tabs v-model="activeTabsValue"
    type="card"
    @tab-click="tabClick"
    @tab-remove="removeTab">
     <el-tab-pane v-for="item in visitedViews"
     :key="item.path"
     :path="item.path"
     :label="item.title"
     :name="item.path"
     :closable="!(item.meta&&item.meta.affix)">
     <template #label>
       <el-icon class="tabs-icon" v-if="item.icon">
         <component :is="item.icon"></component>
       </el-icon>
       {{item.title}}
     </template>
     </el-tab-pane>
    </el-tabs>
  </div>
  <div class="right-tbn">
    <MoreButton/>
  </div>
</div>
</template>

<script setup lang="ts">
import { computed,watch,ref,onMounted } from 'vue'
import { useRoute,useRouter } from 'vue-router'
import { TabsPaneContext } from 'element-plus'
import { useTagsViewStore } from "../../../../store/modules/tagsView"
import MoreButton from "./components/MoreButton.vue"
const tagsViewStore = useTagsViewStore()
const route = useRoute()
const router = useRouter()

const visitedViews = computed(()=> tagsViewStore.visitedViews)
const activeTabsValue = computed({
  get: ()=> {
    return tagsViewStore.activeTabsValue
  },
  set: val => {
    tagsViewStore.setTabsMenuValue(val)
  }
})

// 显示上一个或者下一个tabs标签
function toLastView(activeTabPath){
  // 当前tabs的索引
let index = visitedViews.value.findIndex(item=>item.path===activeTabPath)
  // 获取下一个tab索引或者上一个索引
  const nextTab = visitedViews.value[index+1]||visitedViews.value[index-1]
  if (!nextTab)return
  router.push(nextTab.path)
  // 新增tabs标签的函数
  tagsViewStore.addVisitedView(nextTab)
}

// 点击tabs标签事件
const tabClick = (tabItem:TabsPaneContext)=> {
   let path = tabItem.props.name as string
  router.push(path)
}

// 添加tabs标签
const addTabs = ()=> {
  const { name } = route
  if(name==='Login')return
  if(name){
    tagsViewStore.addView(route)
  }
  return false
}

// 判断是否删除的是当前tabs标签
const isActive = (path)=> {
  return path === route.path
}

// 删除tabs
const removeTab = async (activeTabPath:string)=> {
  if(isActive(activeTabPath)){
    toLastView(activeTabPath)
  }
  await tagsViewStore.delView(activeTabPath)
}

onMounted(()=>{
  addTabs()
})
watch(route, () => {
  addTabs()
})
</script>

<style scoped>
.main-tabs-view {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 10px;
  padding-right: 10px;
  background: white;
}
.tabs-view {
  flex: 1;
  overflow: hidden;
  box-sizing: border-box;
}
:deep(.el-tabs){
  border-top: 1px solid #083a6d;
}
:deep(.el-tabs .el-tabs__nav){
  border: none;
}
:deep(.el-tabs .el-tabs__header .el-tabs__item ){
  border: none;
  color: #cccccc;
}

:deep(.el-tabs .el-tabs__header .el-tabs__item.is-active ) {
  color: #083a6d;
  border-bottom:2px solid #083a6d;
}
</style>


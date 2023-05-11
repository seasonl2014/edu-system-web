<template>
<el-dropdown trigger="hover">
  <el-button size="small" color="#083a6d">
    <span>更多</span>
    <el-icon color="el-icon-right"><arrow-down/></el-icon>
  </el-button>
  <template #dropdown>
    <el-dropdown-menu>
      <el-dropdown-item @click="closeOtherTab"><el-icon :size="14"><Close/></el-icon>关闭其他</el-dropdown-item>
      <el-dropdown-item @click="closeAllTab"><el-icon :size="14"><FolderDelete/></el-icon>关闭所有</el-dropdown-item>
    </el-dropdown-menu>

  </template>
</el-dropdown>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useSettingStore } from "../../../../../store/modules/setting"
import { useTagsViewStore} from "../../../../../store/modules/tagsView"
import { useRouter,useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
const settingStore =useSettingStore()
const tagsViewsStore = useTagsViewStore()
const visitedViews = computed(()=>tagsViewsStore.visitedViews)

// 关闭其他页
const closeOtherTab = async ()=> {
  tagsViewsStore.delOtherViews(route.path)
}
// 关闭所有标签页
const closeAllTab = async ()=> {
  await tagsViewsStore.delAllViews()
  tagsViewsStore.goHome()
}
</script>

<style scoped>

</style>

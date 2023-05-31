<template>
<el-card class="box-card">
  <!--头部 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon>
          <Clock/>
        </el-icon>轮播图管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search"
            placeholder="关键字搜索（回车）"/>
          </el-col>

          <el-col :span="11">
            <div class="my-button">
            <el-button plain style="width: 100%" color="#2fa7b9" @click="addBanner">添加轮播图</el-button>
              <el-button  style="width: 100%" type="primary"  @click="exportExcelAction">
                <el-icon>
                <Download/>
              </el-icon>导出 Excel</el-button>
            </div>
          </el-col>

          <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
            <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh">
              <Refresh/>
            </el-icon>
          </el-col>

        </el-row>
      </div>
      <!--搜索区域 end-->

    </div>
  </template>
  <!--头部 end-->
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',
     textAlign: 'center'}">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="封面" align="center" width="100px" padding="0px">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="right" width="400px">
            <template #default>
              <img :src="scope.row.img"
                   style="height: 200px;width: 360px"/>
            </template>
            <template #reference>
              <img :src="scope.row.img" style="height: 38px;width: 58px;cursor: pointer" @click="uploadCover(scope.row.id,scope.row.title)"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="标题">
        <template #default="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="链接地址">
        <template #default="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <el-tag effect="plain" type="success" v-if="scope.row.status===0">禁用</el-tag>
          <el-tag effect="plain"  v-else>启用</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button  link title="编辑轮播图"   @click="() => editBanner(scope.row.id)" :loading="updateLoading.includes(scope.row.id)" icon="edit">编辑</el-button>
        </template>
      </el-table-column>

    </el-table>
  </div>
  <!--表格区域 end-->
  <!--分页插件 start-->
   <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
   v-model:page-size="pageSize" :page-sizes="[10,20,30,40]" @current-change="changePage"/>
  <!--分页插件 end-->
</el-card>

  <!--新增轮播图弹出框 start-->
   <el-dialog align-center v-model="addBannerDialogFormVisible" width="42%" destroy-on-close>

     <template #header="{close,titleId,titleClass}">
       <div class="my-header">
         <el-icon size="26px"><EditPen/></el-icon>
         <h1 id="titleId">添加轮播图</h1>
       </div>
     </template>

     <!--添加轮播图组件 start-->
     <AddBanner @closeAddBannerForm="closeAddBannerForm" @success="success"/>
     <!--添加轮播图组件 end-->
   </el-dialog>
  <!--新增轮播图弹出框 end-->

  <!--编辑轮播图弹出框 start-->
  <el-dialog align-center v-model="editBannerDialogFormVisible" width="52%" destroy-on-close>

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">编辑轮播图</h1>
      </div>
    </template>

    <!--编辑轮播图组件 start-->
         <EditBanner :bannerInfo="bannerInfo" @closeEditBannerForm="closeEditBannerForm" @success="success"/>
    <!--编辑轮播图组件 end-->
  </el-dialog>
  <!--编辑轮播图弹出框 end-->

  <!--上传轮播图封面 弹出框 start-->
  <UploadBanner
      :banner-id="bannerId"
      :banner-title="bannerTitle"
      :upload-cover-visible="uploadCoverVisible"
      @onCancel="uploadBannerCancel"
  />
  <!--上传轮播图封面 弹出框 start-->
</template>

<script setup lang="ts">
import {ref,reactive,toRefs,onMounted } from 'vue'
import UploadBanner from "@/views/edu/banner/components/UploadBanner.vue"
import AddBanner from "@/views/edu/banner/components/AddBanner.vue"
import EditBanner from "@/views/edu/banner/components/EditBanner.vue"
import { ElMessage } from 'element-plus'
import {exportExcel} from "@/utils/exportExcel";
import {getBannerApi, getBannerListApi} from "@/api/edu/banner/banner";
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示条数
  pageSize: 10,
  // 当前页面
  pageIndex: 1,
  // 数据加载状态
  loading: false
})
// 更新按钮状态
const updateLoading = ref<number[]>([]);
// 获取轮播图列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getBannerListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

/**
 * 上传封面
 */
const uploadCoverVisible = ref(false)
const bannerTitle = ref()
const bannerId = ref(0)
const uploadCover = (id:number,title:string)=> {
  bannerTitle.value = `你正在给轮播图：“${title}”上传封面`
  uploadCoverVisible.value = true
  bannerId.value = id
}
/**
 * 关闭上传轮播图弹框
 */
const uploadBannerCancel = () => {
  uploadCoverVisible.value = false
  loadData(state)
}
// 刷新轮播图列表数据
const refresh = ()=> {
  // 搜索关键字
  state.searchValue = ''
  // 更新数据
  loadData(state)
}

//搜索
const search = ()=> {
  if(state.searchValue!==null){
    loadData(state)
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
  }
}
// 切换页码执行的事件函数
const changePage = (val:number)=> {
  state.pageIndex = val
  loadData(state)
}

// 处理列表数据序号
const Nindex = (index:number)=> {
  // 当前页面
  const page = state.pageIndex
  // 每页条数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 新增轮播图对话框弹出状态
const addBannerDialogFormVisible = ref(false)
// 添加轮播图
const addBanner = ()=> {
  addBannerDialogFormVisible.value=true
}
// 关闭新增轮播图弹出框
const closeAddBannerForm = ()=> {
  addBannerDialogFormVisible.value=false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddBannerForm()
  closeeditBannerForm()
}

// 编辑弹出框状态
const editBannerDialogFormVisible = ref(false)
// 编辑轮播图信息
const bannerInfo = ref()
const editBanner = async (id:number)=> {
  const { data } =await getBannerApi(id)
  bannerInfo.value = data.result
  editBannerDialogFormVisible.value = true
}
// 关闭编辑轮播图弹出框
const closeEditBannerForm = ()=>{
  editBannerDialogFormVisible.value = false
}

// 删除轮播图信息
const delCourse = async (id:number)=>{
  const { data } = await deleteCourseApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

// 导出类别
const column = [
  { name: 'id',label: '轮播图id' },
  { name: 'courseno',label: '轮播图编号' },
  { name: 'coursename',label: '轮播图名称'},
  { name: 'remarks',label: '备注' }
]
const exportExcelAction=()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '轮播图信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})

const { tableData,pageSize,pageIndex,loading,total,searchValue } = toRefs(state)

</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header){
  border-bottom: 1px solid rgb(238 238 238);
  color: #083a6d;
}

/*分页样式*/
.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

/*轮播图弹出框自定义头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #083a6d;
}

/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
}

</style>

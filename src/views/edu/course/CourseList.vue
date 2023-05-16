<template>
<el-card class="box-card">
  <!--头部区域 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right: 10px;"><Box/></el-icon>
        课程管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="Search" placeholder="关键字搜索（回车）" v-model="searchValue" @keyup.enter.native="search"/>
          </el-col>
          <el-col :span="11">
            <div class="my-button">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="addCourse">添加课程</el-button>
              <el-button style="width: 100%;" @click="exportExcelAction" type="primary">
                <el-icon style="margin-right: 1px;"><Download /></el-icon>
                导出 Excel
              </el-button>
            </div>

          </el-col>
          <el-col :span="3" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
            <el-icon style="font-size: 20px;color: #b3b6bc;" @click="refresh"><Refresh/></el-icon>
          </el-col>
        </el-row>
      </div>
      <!--搜索区域 end-->

    </div>
  </template>
  <!--头部区域 end-->
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center' }"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="80" type="index" :index="Nindex"/>

      <el-table-column label="封面"  align="center" width="100px" padding="0px">
        <template #default="scope">
          <el-popover effect="light" trigger="hover" placement="right">
            <template #default>
              <img :src="scope.row.cover"
                   style="height: 200px;width: 360px"/>

            </template>
            <template #reference>
              <img :src="scope.row.cover" style="height: 38px;width: 58px;cursor: pointer" @click="uploadCover(scope.row.id,scope.row.title)"/>
            </template>
          </el-popover>
        </template>
      </el-table-column>

      <el-table-column label="短标题" show-overflow-tooltip>
        <template #default="scope">
          <span>{{scope.row.shortTitle}}</span>
        </template>
      </el-table-column>

      <el-table-column label="长标题" show-overflow-tooltip>
        <template #default="scope">
          <span>{{scope.row.title}}</span>
        </template>
      </el-table-column>

      <el-table-column label="价格" width="90">
        <template #default="scope">
          <span><el-tag>{{ Number(scope.row.price) === 0 ? '免费' :
              '¥' + scope.row.price.toFixed(2) }}</el-tag></span>
        </template>
      </el-table-column>

      <el-table-column label="课时">
        <template #default="scope">
          <el-tooltip class="item" effect="dark" content="点击创建课程大纲" placement="top">
            <a @click="() => syllabusData(scope.row.id)" style="cursor: pointer;">
              <el-tag type="success"  size="mini" closable v-text="scope.row.lessonNum"></el-tag>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="学习人数">
        <template #default="scope">
          <el-tooltip class="item" effect="dark" content="浏览课程的用户" placement="top">
            <a>
              <el-tag type="success"> {{ scope.row.viewCount }}人</el-tag>
            </a>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="vip学员">
        <template #default="scope">
          <el-tooltip class="item" effect="dark" content="加入VIP免费观看课程的用户" placement="top">
            <el-tag  type="warning">{{ scope.row.vipCount }}人</el-tag>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="课程状态">
        <template #default="scope">
          <el-tooltip :content="scope.row.status === 'Draft' ? '未发布' : '已发布'" placement="top">
            <el-switch
                v-model="scope.row.status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="Normal"
                inactive-value="Draft"
                @change="updateStatus(scope.row.id,scope.row.status)">
            </el-switch>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button  text   @click="() => detailUpdateData(scope.row.id)" :loading="detailUpdateLoading.includes(scope.row.id)" icon="edit">编辑</el-button>
          <el-button   text   @click="() => deleteTableData(scope.row.id)" :loading="deleteLoading.includes(scope.row.id)" icon="delete">删除</el-button>
          <el-button  text   title="上传课程资源"  :loading="detailUploadLoading.includes(scope.row.id)"    size="mini" icon="upload" @click="uploadResourceById(scope.row.id)">上传</el-button>
          <el-button  text    @click="() => downloadTableData(scope.row.id)" :loading="downloadLoading.includes(scope.row.id)" icon="download">下载</el-button>
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
  <!--新增课程弹出框 start-->
  <el-dialog align-center v-model="addCourseDialogFormVisible" width="50%" destroy-on-close>

    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>添加课程</h1>
      </div>
    </template>
 <!--添加课程组件 start-->
    <AddCourse @closeAddCourseForm="closeAddCourseForm" @success="success"/>
    <!--添加课程组件 end-->
  </el-dialog>
  <!--新增课程弹出框 end-->

  <!--编辑课程弹出框 start-->
  <el-dialog align-center v-model="editCourseDialogFormVisible" width="50%" destroy-on-close>

    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen /></el-icon>
        <h1>编辑课程</h1>
      </div>
    </template>

    <!--编辑课程组件 start-->
    <EditCourse :CourseInfo="CourseInfo" @closeEditCourseForm="closeEditCourseForm" @success="success"/>
    <!--编辑课程组件 end-->
  </el-dialog>
  <!--编辑课程弹出框 end-->

  <!--上传课程封面 弹出框 start-->
    <UploadCover
        :course-id="courseId"
        :course-title="courseTitle"
        :upload-cover-visible="uploadCoverVisible"
        @onCancel="uploadCoverCancel"
    />
  <!--上传课程封面 弹出框 start-->

</template>

<script setup lang="ts">
import {formatTime} from "@/utils/date"
import {ref,reactive,toRefs,onMounted} from 'vue'

import { ElMessage } from 'element-plus'
import AddCourse from "./components/AddCourse.vue"
import EditCourse from "./components/EditCourse.vue"
import UploadCover from "@/views/edu/course/components/UploadCover.vue"
import {exportExcel} from "@/utils/exportExcel";
import {delCourseApi, getCourseApi, getCourseListApi} from "@/api/edu/course/course";
// 服务器路径
const url = import.meta.env.VITE_APP_BASE_API
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 表格数据
  tableData:[],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  // 当前页码
  pageIndex: 1,
  // 数据加载状态
  loading: false
})
// 获取课程列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getCourseListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}
onMounted(()=> {
  loadData(state)
})

// 刷新
const refresh = ()=> {
  // 搜索关键字
  state.searchValue = ''
  // 加载数据
  loadData(state)
}
// 搜索
const search = ()=> {
  if(state.searchValue!=null){
    loadData(state)
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
  }
}
// 切换页码执行事件
const changePage = (val:number)=> {
  state.pageIndex = val
  loadData(state)
}
// 处理列表序号
const Nindex = (index: number)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页行数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}
// 更新按钮状态
const detailUpdateLoading = ref<number[]>([]);
// 删除 按钮状态
const deleteLoading = ref<number[]>([]);
// 上传课程资料按钮状态
const detailUploadLoading = ref<number[]>([]);
// 下载 loading
const downloadLoading = ref<number[]>([]);
// 新增课程弹出框状态
const addCourseDialogFormVisible =ref(false)
// 添加课程
const addCourse = ()=> {
  addCourseDialogFormVisible.value = true
}
// 关闭新增课程弹出框
const closeAddCourseForm = ()=> {
  addCourseDialogFormVisible.value = false
}
// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddCourseForm()
  closeEditCourseForm()
}

// 编辑课程弹出框状态
const editCourseDialogFormVisible = ref(false)
// 课程信息
const CourseInfo = ref()
// 编辑课程信息
const editCourse = async (id:number)=> {
  const { data } = await getCourseApi(id)
  CourseInfo.value = data.result
  editCourseDialogFormVisible.value = true
}
// 关闭编辑课程弹出框
const closeEditCourseForm = ()=> {
  editCourseDialogFormVisible.value = false
}
// 删除课程信息
const delCourse = async (id: number)=> {
  const { data } = await delCourseApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: '课程ID'},
  {name: 'CourseName',label: '课程名称'},
  {name: 'CourseNumber',label: '课程号'},
  {name: 'bedType',label: '床型'},
  {name: 'broadband',label: '宽带'},
  {name: 'standardPrice',label: '标准价'},
  {name: 'memberPrice',label: '会员价'}
]
// 导出课程信息
const exportExcelAction = () => {
  exportExcel({
    column,
    data: state.tableData,
    filename: '课程信息数据',
    format: 'xlsx',
    autowidth: true
  })
}
const {tableData,pageSize,loading,total,searchValue} = toRefs(state)

// 上传封面
// 课程ID
const courseId = ref()
// 课程标题
const courseTitle = ref('')
// 上传课程封面弹出框状态
const uploadCoverVisible = ref(false)
const uploadCover = (id:number,title:string)=> {
  courseTitle.value = `你正在给课程：“${title}”上传封面`
  uploadCoverVisible.value = true
  courseId.value = id
}
// 关闭上传封面弹出框
const uploadCoverCancel = ()=> {
  uploadCoverVisible.value = false
}
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
  justify-content: center;
  margin-top: 20px;
}

:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

/*自定义弹出框头部样式*/
.my-header {
  display: flex;
  justify-content: flex-start;
  color: #083a6d;
}
.my-button {
  display: flex;
  justify-content: space-between;
}
</style>

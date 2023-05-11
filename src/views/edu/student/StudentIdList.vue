<template>
<el-card class="box-card">
  <!--头部 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon>
          <List/>
        </el-icon>学生学号管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="SearCh" v-model="searchValue" @keyup.enter.native="search"
            placeholder="关键字搜索（回车）"/>
          </el-col>

          <el-col :span="11">
            <div class="my-button">
            <el-button plain style="width: 100%" color="#2fa7b9" @click="addCourse">生成学号</el-button>
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

      <el-table-column label="学号编号">
        <template #default="scope">
          <span>{{scope.row.studentId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="状态">
        <template #default="scope">
          <el-tag effect="plain" type="success" v-if="scope.row.status===0">未使用</el-tag>
          <el-tag effect="plain"  v-else>已使用</el-tag>
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

  <!--新增学号弹出框 start-->
   <el-dialog align-center v-model="addCourseDialogFormVisible" width="42%" destroy-on-close>

     <template #header="{close,titleId,titleClass}">
       <div class="my-header">
         <el-icon size="26px"><EditPen/></el-icon>
         <h1 id="titleId">生成学号</h1>
       </div>
     </template>

     <!--添加学号组件 start-->
     <AddStudentId @closeAddCourseForm="closeAddCourseForm" @success="success"/>
     <!--添加学号组件 end-->
   </el-dialog>
  <!--新增学号弹出框 end-->

</template>

<script setup lang="ts">
import {ref,reactive,toRefs,onMounted } from 'vue'


import { ElMessage } from 'element-plus'
import AddStudentId from "./components/AddStudentId.vue"
import {exportExcel} from "@/utils/exportExcel";
import {getStudentIdListApi} from "@/api/edu/student/studentid";
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

// 获取学号列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getStudentIdListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

// 刷新学号列表数据
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

// 新增学号对话框弹出状态
const addCourseDialogFormVisible = ref(false)
// 添加学号
const addCourse = ()=> {
  addCourseDialogFormVisible.value=true
}
// 关闭新增学号弹出框
const closeAddCourseForm = ()=> {
  addCourseDialogFormVisible.value=false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddCourseForm()
  closeEditCourseForm()
}

// 编辑弹出框状态
const editCourseDialogFormVisible = ref(false)
// 编辑学号信息
const courseInfo = ref()
const editCourse = async (id:number)=> {
  const { data } =await getCourseApi(id)
  courseInfo.value = data.result
  editCourseDialogFormVisible.value = true
}
// 关闭编辑学号弹出框
const closeEditCourseForm = ()=>{
  editCourseDialogFormVisible.value = false
}

// 删除学号信息
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
  { name: 'id',label: '学号id' },
  { name: 'courseno',label: '学号编号' },
  { name: 'coursename',label: '学号名称'},
  { name: 'remarks',label: '备注' }
]
const exportExcelAction=()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '学号信息数据',
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

/*学号弹出框自定义头部样式*/
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

<template>
<el-card>
  <!--头部区域 Start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right: 10px"><Avatar/></el-icon>讲师管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="Search" v-model="searchValue"
            @keyup.enter.native="search" placeholder="关键搜索（回车）" />
          </el-col>

          <el-col :span="11">
            <div class="my-button">
            <el-button plain style="width: 100%;" color="#2fa7b9" @click="addTeacher">开通讲师</el-button>
            <el-button  style="width: 100%;"  @click="exportExcelAction" type="primary">
              <el-icon style="margin-right: 1px"><Download/></el-icon>
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

       <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

       <el-table-column label="教师邮箱">
         <template #default="scope">
           <span>{{scope.row.email}}</span>
         </template>
       </el-table-column>

       <el-table-column label="教师姓名">
         <template #default="scope">
           <span>{{scope.row.name}}</span>
         </template>
       </el-table-column>

       <el-table-column label="课程数量">
         <template #default="scope">
           <span><el-tag type="success">{{scope.row.courseTotal}}</el-tag></span>
         </template>
       </el-table-column>

       <el-table-column label="性别">
         <template #default="scope">
           <span><el-tag type="info">{{scope.row.sex}}</el-tag></span>
         </template>
       </el-table-column>

       <el-table-column label="手机号">
         <template #default="scope">
           <span>{{scope.row.phone}}</span>
         </template>
       </el-table-column>

       <el-table-column label="QQ">
         <template #default="scope">
           <span>{{scope.row.qq}}</span>
         </template>
       </el-table-column>

       <el-table-column label="创建时间">
         <template #default="scope">
           <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
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

  <!--新增教师弹出框 start-->
  <el-dialog align-center v-model="addTeacherDialogFormVisible" width="42%" destroy-on-close>

    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">开通讲师</h1>
      </div>
    </template>

    <!--添加教师组件 start-->
    <AddTeacher @closeAddTeacherForm="closeAddTeacherForm" @success="success"/>
    <!--添加教师组件 end-->
  </el-dialog>
  <!--新增教师弹出框 end-->

  <!--编辑教师弹出框 start-->
  <el-dialog align-center v-model="editTeacherDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">编辑教师</h1>
      </div>
    </template>
    <!--编辑教师组件 start-->
    <EditTeacher :teacherInfo="teacherInfo" @closeEditTeacherForm="closeEditTeacherForm" @success="success"/>
    <!--编辑教师组件 end-->
  </el-dialog>
  <!--编辑教师弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,toRefs ,onMounted} from 'vue'
import {deleteTeacherApi, getTeacherApi, getTeacherListApi} from "@/api/edu/teacher/teacher"
import {formatTime} from "@/utils/date"
import { ElMessage } from 'element-plus'
import AddTeacher from "./components/AddTeacher.vue"
import EditTeacher from "./components/EditTeacher.vue"
import {exportExcel} from "@/utils/exportExcel";
const state = reactive({
  // 搜索关键字
  searchValue: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  // 当前页码
  pageIndex: 1,
  // 数据加载状态
  loading: false
})

// 获取教师列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getTeacherListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

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
const changePage = (val: number)=> {
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

// 新增教师弹出框状态
const addTeacherDialogFormVisible = ref(false)
// 添加教师
const addTeacher = ()=> {
  addTeacherDialogFormVisible.value = true
}

// 关闭新增教师弹出框
const closeAddTeacherForm = ()=> {
  addTeacherDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=>{
  loadData(state)
  closeAddTeacherForm()
  closeEditTeacherForm()
}
// 编辑教师弹出框状态
const editTeacherDialogFormVisible = ref(false)
// 编辑教师信息
const teacherInfo = ref()
const editTeacher = async (id:number)=>{
  const { data } = await getTeacherApi(id)
  teacherInfo.value = data.result
  editTeacherDialogFormVisible.value = true
}

// 关闭编辑教师弹出框
const closeEditTeacherForm = ()=> {
  editTeacherDialogFormVisible.value = false
}

// 删除教师信息
const delTeacher = async (id: number)=>{
  const { data } = await deleteTeacherApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

// 导出列表
const column = [
  {name: 'id',label: '教师ID'},
  {name: 'name',label: '教师名称'},
  {name: 'teacherno',label: '教师工号'},
  {name: 'sex',label: '教师性别'},
  {name: 'phone',label: '手机号'},
  {name: 'qq',label: 'QQ号'}
]

// 导出教师信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '教师信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

onMounted(()=> {
  loadData(state)
})
const {tableData,pageSize,pageIndex,loading,total,searchValue} = toRefs(state)
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

:deep(.el-card__header) {
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

/*自定义弹出框头部样式*/
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

<template>
<el-card class="box-card">
  <!--头部 start-->
   <template #header>
     <div class="card-header">
       <h3>
         <el-icon style="margin-right: 10px">
           <User/>
         </el-icon>
         学生管理
       </h3>

       <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input :prefix-icon="Search" v-model="searchValue"
              @keyup.enter.native="search" placeholder="关键字搜索（回车）"/>
            </el-col>

            <el-col :span="11">
              <div class="my-button">
                <el-button plain style="width: 100%" color="#2fa7b9" @click="addStudent">添加学生</el-button>
                <el-button type="primary" style="width: 100%"  @click="exportExcelAction">导出 Excel</el-button>
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
  <!--头部 end-->

  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center" :cell-style="{ textAlign: 'center' }"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="学号">
        <template #default="scope">
          <span>{{scope.row.stuNo}}</span>
        </template>
      </el-table-column>

      <el-table-column label="登录账号">
        <template #default="scope">
          <span>{{scope.row.loginName}}</span>
        </template>
      </el-table-column>


      <el-table-column label="性别">
        <template #default="scope">
          <span>{{scope.row.sex}}</span>
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

      <el-table-column label="邮箱">
        <template #default="scope">
          <span>{{scope.row.email}}</span>
        </template>
      </el-table-column>

      <el-table-column label="注册时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="Delete" icon-color="#626AEF"
          :title="'确定删除学生名为“'+scope.row.loginName+'”的学生吗？'"
          @confirm="delStudent(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <!--表格区域 end-->

  <!--分页 start-->
  <el-pagination background layout="total,sizes,prev,pager,next,jumper" :total="total"
                 v-model:page-size="pageSize" :page-sizes="[10,20,30,40]" @current-change="changePage"/>
  <!--分页 end-->
</el-card>

  <!--新增学生弹出框 start-->
<el-dialog align-center v-model="addStudentDialogFormVisible" width="42%" destroy-on-close>
  <template #header="{ close,titleId,titleClass }">
    <div class="my-header">
      <el-icon size="26px"><EditPen/></el-icon>
      <h1 id="titleId">新增学生</h1>
    </div>
  </template>
  <!--添加学生组件 start-->
   <AddStudent @closeAddStudentForm="closeAddStudentForm" @success="success"/>
  <!--添加学生组件 end-->
</el-dialog>
  <!--新增学生弹出框 end-->

  <!--编辑学生信息弹出框 start-->
  <el-dialog align-center v-model="editStudentDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">编辑学生</h1>
      </div>
    </template>
    <!--编辑学生组件 start-->
    <EditStudent :studentInfo="studentInfo" @closeEditStudentForm="closeEditStudentForm" @success="success"/>
    <!--编辑学生组件 end-->
  </el-dialog>
  <!--编辑学生信息弹出框 end-->

</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted} from 'vue'
import {deleteStudentApi, getStudentApi, getStudentListApi} from "@/api/edu/student/student"
import { formatTime } from "@/utils/date"
import { ElMessage } from 'element-plus'
import AddStudent from "./components/AddStudent.vue"
import EditStudent from "./components/EditStudent.vue"
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
  pageIndex: 1,
  // 数据加载
  loading: false
})

// 获取学生列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空列表数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize':state.pageSize,
    'searchValue': state.searchValue
  }

  const { data } = await getStudentListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

// 刷新学生列表数据
const refresh = ()=> {
  // 搜索关键字清空
  state.searchValue = ""
  // 更新列表数据
  loadData(state)
}

// 搜索
const search = ()=> {
  if(state.searchValue!==null){
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
    loadData(state)
  }
}

// 改变页码执行事件
const changePage = (val: number)=> {
  state.pageIndex = val
  loadData(state)
}

// 处理分页序号
const Nindex = (index)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页显示函数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 新增学生弹出框状态
const addStudentDialogFormVisible = ref(false)
// 添加学生
const addStudent = ()=> {
  addStudentDialogFormVisible.value = true
}

// 关闭新增学生信息弹出框
const closeAddStudentForm = ()=> {
  addStudentDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddStudentForm()
  closeEditStudentForm()
}

// 编辑学生弹出框状态
const editStudentDialogFormVisible = ref(false)
// 编辑学生信息
// 学生信息对象
const studentInfo = ref()
const editStudent = async (id: number)=> {
  const { data } = await getStudentApi(id)
  studentInfo.value = data.result
  editStudentDialogFormVisible.value = true
}

// 关闭编辑学生弹出框
const closeEditStudentForm = ()=>{
  editStudentDialogFormVisible.value = false
}

// 删除学生信息
const delStudent = async (id: number)=> {
  const { data } = await deleteStudentApi(id)
  if(data.status === 200){
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

// 导出列表
const column = [
  { name: 'id',label: '学生ID' },
  { name: 'name',label: '学生姓名'},
  { name: 'stuno',label: '学号'},
  { name: 'sex',label: '学生性别' },
  { name: 'phone',label: '手机号' },
  { name: 'qq',label: 'QQ' }
]

// 导出数据
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '学生信息数据',
    format: 'xlsx',
    autowidth: true
  })
}


// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})
const { total,tableData,pageSize,pageIndex,loading,searchValue}=toRefs(state)
</script>

<style scoped>
.card-header{
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3{
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card__header){
  border-bottom: 1px solid rgb(238 238 238);
  color: #083a6d;
}
/*分页插件样式*/
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

.el-pagination{
  margin-top: 20px;
  justify-content: center;
}

/*学生弹出框自定义头部样式*/
.my-header{
  display: flex;
  justify-items: flex-start;
  color: #083a6d;
}
/*自定义按钮样式*/
.my-button {
  display: flex;
  justify-content: space-between;
}
</style>

<template>
<el-card>
  <!--头部区域 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right: 10px"><Memo/></el-icon>
        课程类型管理
      </h3>
      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="8">
            <el-input v-model="searchValue" :prefix-icon="Search" @keyup.enter.native="search" placeholder="关键字搜索（回车）"/>
          </el-col>

          <el-col :span="12">
            <div class="my-button">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="addSubject">添加课程类型</el-button>
              <el-button style="width: 100%;" @click="exportExcelAction" type="primary">
                <el-icon style="margin-right: 1px"><Download/></el-icon>
                导出 Excel
              </el-button>
            </div>
          </el-col>

          <el-col :span="4" style="display: inline-flex;justify-content: center;align-items: center;cursor: pointer;">
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
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }"
      row-key="id">

      <el-table-column class-name="el-table-my-index" label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="课程类型名称" >
        <template #default="scope">
          <span>{{scope.row.name}}</span>
        </template>
      </el-table-column>

      <el-table-column label="课程类型排序">
        <template #default="scope">
          <span>{{scope.row.sort}}</span>
        </template>
      </el-table-column>

      <el-table-column label="阿里云视频点播分类ID">
        <template #default="scope">
          <span>{{scope.row.cateId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="层级">
        <template #default="scope">
          <span><el-tag type="success">{{scope.row.lev}}级分类</el-tag></span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="editSubject(scope.row.id)">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" icon="Delete"
                         icon-color="#626AEF" :title="'确定删除名为“'+scope.row.name+'”的课程类型吗？'"
                         @confirm="delSubject(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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

  <!--新增课程类型弹出框 start-->
  <el-dialog align-center v-model="addSubjectDialogFormVisible" width="30%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">添加课程类型</h1>
      </div>
    </template>
    <!--添加课程类型组件 start-->
    <AddSubject @closeAddSubjectForm="closeAddSubjectForm" @success="success" :subjectTreeData="subjectTreeData"/>
    <!--添加课程类型组件 end-->
  </el-dialog>
  <!--新增课程类型弹出框 end-->

  <!--编辑课程类型弹出框 start-->
  <el-dialog align-center v-model="editSubjectDialogFormVisible" width="30%" destroy-on-close>
    <template #header="{ close,titleId,titleClass  }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>编辑课程类型</h1>
      </div>
    </template>
    <!--编辑课程类型组件 Start-->
    <EditSubject :subjectInfo="subjectInfo" @closeEditSubjectForm="closeEditSubjectForm" @success="success"/>
    <!--编辑课程类型组件 end-->

  </el-dialog>
  <!--编辑课程类型弹出框 end-->
</template>

<script setup lang="ts">
import {formatTime} from "@/utils/date.js";
import {ref,reactive,toRefs,onMounted} from 'vue'
import { ElMessage } from 'element-plus'
import {delSubjectApi, getCategoryTreeApi, getParentCategoryListApi, getSubjectApi} from "@/api/edu/subject/subject"
import AddSubject from "./components/AddSubject.vue"
import EditSubject from "./components/EditSubject.vue"
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

// 获取课程类型列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex':state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getCategoryTreeApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}
onMounted(()=> {
  loadData(state)
})

// 刷新
const refresh = ()=> {
  // 搜索关键字清空
  state.searchValue = ''
  // 加载数据
  loadData(state)
}
// 搜索
const search = ()=> {
  if(state.searchValue!=''||state.searchValue!=null){
    loadData(state)
    ElMessage({
      type: 'success',
      message: `关键字“${state.searchValue}”搜索内容如下`
    })
  }
}

// 切换页码执行的事件
const changePage = (val:number)=> {
  state.pageIndex = val
  loadData(state)
}

// 处理列表序号
const Nindex = (index:number)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页显示行数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 新增或修改获取课程分类树形数据
const subjectTreeData = ref<object[]>([]);
const getParentCategoryList = async () => {
  const { data} = await getParentCategoryListApi();
  if(data.status===200) {
    subjectTreeData.value=data.result
  }else {
    subjectTreeData.value = [];
  }

}

// 新增课程类型弹出框状态
const addSubjectDialogFormVisible = ref(false)

// 添加课程类型
const addSubject = ()=> {
  getParentCategoryList()
  addSubjectDialogFormVisible.value = true
}
// 关闭新增课程类型弹出框
const closeAddSubjectForm = ()=> {
  addSubjectDialogFormVisible.value = false
}
// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddSubjectForm()
  closeEditSubjectForm()
}

// 编辑课程类型弹出框状态
const editSubjectDialogFormVisible = ref(false)
// 编辑课程类型信息
const subjectInfo = ref()
const editSubject = async (id:number)=> {
  const { data } = await getSubjectApi(id)
  subjectInfo.value = data.result
  editSubjectDialogFormVisible.value = true
}
// 关闭编辑课程类型弹出框
const closeEditSubjectForm = ()=> {
  editSubjectDialogFormVisible.value = false
}

// 删除课程类型
const delSubject = async (id: number)=> {
  const { data } = await delSubjectApi(id)
  if(data.status === 200){
    ElMessage.success('删除成功')
    loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: '课程类型ID'},
  {name: 'typeName',label: '课程类型名称'},
  {name: 'typeSort',label: '课程类型排序'}
]
// 导出课程类型
const exportExcelAction = () => {
  exportExcel({
    column,
    data:state.tableData,
    filename: '课程类型信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

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

:deep(.el-card__header){
  border-bottom: 1px solid rgb(238 238 238);
  color: #083a6d;
}
.my-button {
  display: flex;
  justify-content: space-between;
}

/*自定义分页样式*/
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

.my-index {
  margin-top: 100px!important;
}

:deep(.el-table-my-index) {
  position: relative;
}
:deep(.el-table-my-index .cell) {
  position: absolute;
  bottom: 7px;
}

</style>

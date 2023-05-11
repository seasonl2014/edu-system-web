<template>
<el-card>
  <!--头部 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right:10px;"><Stamp/></el-icon>角色管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search"
            placeholder="关键字搜索（回车）"/>
          </el-col>
          <el-col :span="11">
            <div class="my-button">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="addRole">添加角色</el-button>
              <el-button plain style="width: 100%;" type="primary" @click="exportExcelAction">
                <el-icon style="margin-right: 6px"><Download/></el-icon>
                导出Excel
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
  <!--头部 end-->
  <!--表格区域 start-->
  <div class="table-box">
    <el-table element-loading-text="数据加载中..." v-loading="loading" :data="tableData"
    style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center'}"
    :row-class-name="rowClassName"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">
      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="角色名称" >
        <template #default="scope">
          <el-tooltip :content="scope.row.name" placement="top" effect="light">
            <span>{{scope.row.name}}</span>
          </el-tooltip>
        </template>
      </el-table-column>

      <el-table-column label="角色编号">
        <template #default="scope">
          <span>{{scope.row.code}}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
         <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small"  @click="editRole(scope.row.id)">编辑</el-button>

          <el-popconfirm width="200px" confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
                         icon-color="#626AEF" :title="'确定删除角色名为“'+scope.row.name+'”的角色吗？'"
                         @confirm="delRole(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger" >删除</el-button>
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

  <!--新增角色弹出框 start-->
  <el-dialog align-center v-model="addRoleDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{close,titleId,titleClass}">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1 id="titleId">新增角色</h1>
      </div>
    </template>
    <!--添加角色组件 start-->
    <AddRole @closeAddRoleForm="closeAddRoleForm" @success="success"/>
    <!--添加角色组件 end-->
  </el-dialog>
  <!--新增角色弹出框 end-->

  <!--编辑角色弹出框 start-->
  <el-dialog align-center v-model="editRoleDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="16px"><EidtPen/></el-icon>
        <h1 id="titleId">编辑角色</h1>
      </div>
    </template>
    <!--编辑角色组件 start-->
     <EditRole :roleInfo="roleInfo" @closeEditRoleForm="closeEditRoleForm" @success="success"/>
    <!--编辑角色组件 end-->
  </el-dialog>
  <!--编辑角色弹出框 end-->

</template>

<script setup lang="ts">
import { reactive,toRefs,ref,onMounted } from 'vue'
import {deleteRoleApi, getRoleApi, getRoleListApi} from "../../../api/system/role/role"
import { formatTime } from "../../../utils/date"
import { ElMessage } from 'element-plus'
import AddRole from "./components/AddRole.vue"
import EditRole from "./components/EditRole.vue"
import {exportExcel} from "../../../utils/exportExcel";
const state = reactive({
  // 搜索内容
  searchValue: '',
  // 表格数据
  tableData: [],
  // 总条数
  total: 0,
  // 每页显示行数
  pageSize: 10,
  // 当前页码
  pageIndex: 1,
  loading: false
})

// 获取角色列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getRoleListApi(params)
  state.tableData = data.content
  state.total = data.totalElements
  state.loading = false
}

// 刷新列表数据
const refresh = ()=> {
  // 搜索表单内容
  state.searchValue = ''
  // 更新数据
  loadData(state)
}

// 搜索功能
const search = ()=> {
  if(state.searchValue!==null){
    ElMessage({
      type: 'success',
      message: `关键字"${state.searchValue}"搜索内容如下`
    })
    loadData(state)
  }
}

//切换页码执行的事件
const changePage = (val:number)=> {
  state.pageIndex = val
  loadData(state)
}

// 处理列表分页后的序号
const Nindex = (index:number)=> {
  const page = state.pageIndex
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

const addRoleDialogFormVisible = ref(false)
// 添加角色
const addRole = ()=> {
  addRoleDialogFormVisible.value = true
}
// 关闭新增角色弹出框
const closeAddRoleForm = ()=> {
  addRoleDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddRoleForm()
  closeEditRoleForm()
}

// 编辑角色弹出框状态
const editRoleDialogFormVisible =ref(false)
// 编辑角色信息
const roleInfo = ref()
const editRole = async (id:number)=> {
  const { data } = await getRoleApi(id)
  roleInfo.value = data.result
  editRoleDialogFormVisible.value = true
}

// 关闭编辑角色弹出框
const closeEditRoleForm = ()=> {
  editRoleDialogFormVisible.value = false
}

// 删除角色信息
const delRole = async (id: number)=> {
  const { data } = await deleteRoleApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}

// 导出列表
const column = [
  { name: 'id',label: '角色ID' },
  { name : 'name',label: '角色名称'},
  { name: 'code',label: '角色编号'},
  { name: 'remarks',label: '备注' }
]

// 导出Excel
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '角色信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})

const { tableData,pageIndex,pageSize,loading,total,searchValue } = toRefs(state)
</script>

<style scoped>
.card-header{
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
:deep(.el-pagination.is-background .el-pager li:not(.is-disabled).is-active){
  background-color: #083a6d;
}

.el-pagination {
  margin-top: 20px;
  justify-content: center;
}

/*用户弹出框自定义头部样式*/
.my-header{
  display: flex;
  justify-content: flex-start;
}

/*自定义按钮样式*/
.my-button{
  display: flex;
  justify-content: space-between;
}
</style>

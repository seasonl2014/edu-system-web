<template>
<el-card>
  <!--头部区域 start-->
  <template #header>
    <div class="card-header">
      <h3>
        <el-icon style="margin-right: 10px;"><School/></el-icon>
        VIP类型管理
      </h3>

      <!--搜索区域 start-->
      <div class="card-search">
        <el-row :gutter="10">
          <el-col :span="10">
            <el-input :prefix-icon="Search" v-model="searchValue" @keyup.enter.native="search" placeholder="关键字搜索（回车）"/>
          </el-col>

          <el-col :span="11">
            <div class="my-button">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="addVipType">添加VIP类别</el-button>
              <el-button style="width: 100%;" type="primary" @click="exportExcelAction">
                <el-icon style="margin-right: 1px;"><Download/></el-icon>
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
    style="width: 100%;text-align: center;" :cell-style="{ textAlign: 'center'}"
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }">

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="会员价格">
        <template #default="scope">
          <span>{{scope.row.vipMoney}}</span>
        </template>
      </el-table-column>

      <el-table-column label="VIP名称">
        <template #default="scope">
          <span>{{scope.row.vipName}}</span>
        </template>
      </el-table-column>

      <el-table-column label="加入人数">
        <template #default="scope">
          <span style="cursor: pointer;text-decoration:underline;" @click="view(scope.row.id)"><el-tag>{{scope.row.nums}}</el-tag></span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间">
        <template #default="scope">
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd')}}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template #default="scope">
          <el-button size="small" @click="editVipType(scope.row.id)">编辑</el-button>
          <el-popconfirm confirm-button-text="确定" cancel-button-text="取消" :icon="Delete"
          icon-color="#626AEF" :title="'确定删除名为“'+scope.row.VipTypeName+'”的VIP类型吗'"
          @confirm="delVipType(scope.row.id)">
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
  v-model:page-size="pageSize" :page-sizes="[10,20,30,40]"
  @current-change="changePage"/>
  <!--分页插件 end-->
</el-card>

  <!--新增VIP类型弹出框 start-->
  <el-dialog align-center v-model="addVipTypeDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>添加VIP类别</h1>
      </div>
    </template>
    <!--新增VIP类型组件 start-->
    <AddVipType @closeAddVipTypeForm="closeAddVipTypeForm" @success="success"/>
    <!--新增VIP类型组件 end-->
  </el-dialog>
  <!--新增VIP类型弹出框 end-->

  <!--编辑VIP类型弹出框 start-->
  <el-dialog align-center v-model="editVipTypeDialogFormVisible" width="42%" destroy-on-close>
    <template #header="{ close,titleId,titleClass }">
      <div class="my-header">
        <el-icon size="26px"><EditPen/></el-icon>
        <h1>编辑VIP类型</h1>
      </div>
    </template>
    <!--编辑VIP类型组件 start-->
    <EditVipType :VipTypeInfo="VipTypeInfo" @closeEditVipTypeForm="closeEditVipTypeForm" @success="success"/>
    <!--编辑VIP类型组件 end-->
  </el-dialog>
  <!--编辑VIP类型弹出框 end-->

  <!--查看VIP学员列表数据 start-->
  <el-dialog align-center v-model="viewVipStudentVisible" width="60%"  destroy-on-close>
    <template #header>
      <div class="my-header">
        <el-icon size="26px"><View/></el-icon>
        <h1>查看VIP学员列表数据</h1>
      </div>
    </template>
    <!--学员列表组件 start-->
    <ViewVipStudentList :vipId="vipId"/>
    <!--学员列表组件 end-->
  </el-dialog>

  <!--查看VIP学员列表数据 end-->
</template>

<script setup lang="ts">
import {formatTime} from "@/utils/date"
import {ref,reactive,toRefs,onMounted} from 'vue'

import {ElMessage} from 'element-plus'
import AddVipType from "@/views/edu/VipType/components/AddVipType.vue"
import EditVipType from "@/views/edu/VipType/components/EditVipType.vue"
import ViewVipStudentList from "@/views/edu/viptype/components/ViewVipStudentList.vue";
import {exportExcel} from "@/utils/exportExcel";
import {delVipTypeApi, getVipTypeApi, getVipTypeListApi} from "@/api/edu/viptype/vipType";
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

// 获取VIP类型列表数据
const loadData = async (state: any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getVipTypeListApi(params)
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
      message:`关键字“${state.searchValue}”搜索内容如下`
    })
  }
}

// 切换页码执行事件
const changePage = (val:number)=> {
  state.pageIndex=val
  loadData(state)
}
// 处理列表数据序号
const Nindex = (index: number)=> {
  // 当前页码
  const page = state.pageIndex
  // 每页显示行数
  const pageSize = state.pageSize
  return index+1+(page-1)*pageSize
}

// 添加VIP类型弹出框
const addVipTypeDialogFormVisible = ref(false)
const addVipType = ()=> {
  addVipTypeDialogFormVisible.value = true
}
// 关闭新增VIP类型弹出框
const closeAddVipTypeForm = ()=> {
  addVipTypeDialogFormVisible.value = false
}

// 提交表单回调函数
const success = ()=> {
  loadData(state)
  closeAddVipTypeForm()
  closeEditVipTypeForm()
}

// 编辑VIP类型弹出框状态
const editVipTypeDialogFormVisible = ref(false)
// 编辑VIP类型信息
const VipTypeInfo = ref()
const editVipType =  async (id:number)=> {
  const { data } = await getVipTypeApi(id)
  VipTypeInfo.value = data.result
  editVipTypeDialogFormVisible.value = true
}
// 关闭编辑VIP类型弹出框
const closeEditVipTypeForm = ()=> {
  editVipTypeDialogFormVisible.value = false
}

// 删除VIP类型信息
const delVipType = async (id:number)=> {
  const { data } = await delVipTypeApi(id)
  if(data.status===200){
    ElMessage.success('删除成功')
    await loadData(state)
  }else {
    ElMessage.error('删除失败')
  }
}
// 导出列表
const column = [
  {name: 'id',label: 'VIP类型ID'},
  {name: 'VipTypeNo',label: 'VIP类型号'},
  {name: 'VipTypeName',label: 'VIP类型名称'},
  {name: 'remarks',label: '备注'}
]

// 导出VIP类型信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: 'VIP类型信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

// 查看VIP学员列表数据
const vipId = ref()
const viewVipStudentVisible = ref(false)
const view = (id:number)=> {
  vipId.value = id
  viewVipStudentVisible.value = true
}

const {tableData,pageSize,loading,total,searchValue} = toRefs(state)
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

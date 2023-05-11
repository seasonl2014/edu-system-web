<template>
  <el-card>
    <!--头部区域 Start-->
    <template #header>
      <div class="card-header">
        <h3>
          <el-icon style="margin-right: 10px"><Histogram/></el-icon>日志管理
        </h3>

        <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="14">
              <el-input :prefix-icon="Search" v-model="searchValue"
                        @keyup.enter.native="search" placeholder="关键搜索（回车）" />
            </el-col>

            <el-col :span="7">
              <el-button plain style="width: 100%;" color="#2fa7b9" @click="exportExcelAction">导出 Excel</el-button>
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

        <el-table-column label="来源">
          <template #default="scope">
            <span v-if="scope.row.remoteAddr == '127.0.0.1'">内网地址</span>
            <span v-else>{{scope.row.province}}-{{scope.row.city}}</span>
          </template>
        </el-table-column>

        <el-table-column label="请求类型">
          <template #default="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>

        <el-table-column label="行为" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.title}}</span>
          </template>
        </el-table-column>

        <el-table-column label="请求地址" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.requestUri}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作方式">
          <template #default="scope">
            <span>{{scope.row.httpMethod}}</span>
          </template>
        </el-table-column>

        <el-table-column label="请求方法" show-overflow-tooltip>
          <template #default="scope">
            <span>{{scope.row.classMethod}}</span>
          </template>
        </el-table-column>

        <el-table-column label="请求参数">
          <template #default="scope">
            <el-button plain type="primary">点我显示</el-button>
          </template>
        </el-table-column>

        <el-table-column label="返回内容">
          <template #default="scope">
            <el-button plain type="success">点我显示</el-button>
          </template>
        </el-table-column>

        <el-table-column label="执行时间(ms)">
          <template #default="scope">
            <el-tag>{{scope.row.useTime}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="浏览器">
          <template #default="scope">
            <el-tag>{{scope.row.browser}}</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="异常信息">
          <template #default="scope">
            <span>{{scope.row.exception}}</span>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" show-overflow-tooltip>
          <template #default="scope">
            <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss')}}</span>
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
</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted } from 'vue'
import {getLogListApi} from "@/api/system/log/log"
import {formatTime} from "@/utils/date"
import {ElMessage} from 'element-plus'
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
// 获取日志列表数据
const loadData = async (state:any)=> {
  state.loading = true
  // 先清空表格数据
  state.tableData = []
  const params = {
    'pageIndex': state.pageIndex,
    'pageSize': state.pageSize,
    'searchValue': state.searchValue
  }
  const { data } = await getLogListApi(params)
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
// 导出列表
const column = [
  {name: 'id',label: '日志ID'},
  {name: 'type',label: '请求类型'},
  {name: 'title',label: '行为'},
  {name: 'requestUri',label: '请求地址'},
  {name: 'httpMethod',label: '操作方式'},
  {name: 'classMethod',label: '请求方法'},
  {name: 'useTime',label: '执行时间(ms)'},
  {name: 'browser',label: '浏览器'},
  {name: 'exception',label: '异常信息'}
]
// 导出日志信息
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '日志信息数据',
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
</style>

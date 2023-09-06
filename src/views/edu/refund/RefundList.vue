<template>
<el-card class="box-card">
  <!--头部 start-->
   <template #header>
     <div class="card-header">
       <h3>
         <el-icon style="margin-right: 10px">
           <CreditCard/>
         </el-icon>
         退款记录
       </h3>

       <!--搜索区域 start-->
        <div class="card-search">
          <el-row :gutter="10">
            <el-col :span="10">
              <el-input :prefix-icon="Search" v-model="searchValue"
              @keyup.enter.native="search" placeholder="关键字搜索（回车）"/>
            </el-col>

            <el-col :span="6">
              <el-select v-model="refundType"  placeholder="请选择">
                <el-option label="课程退款" value="0"/>
                <el-option label="VIP退款" value="1"/>
              </el-select>
            </el-col>

            <el-col :span="5">
              <div class="my-button">
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
    :header-cell-style="{ fontSize: '15px',background: '#083a6d',color: 'white',textAlign: 'center' }"
    >

      <el-table-column label="序号" width="100" type="index" :index="Nindex"/>

      <el-table-column label="来源">
        <template #default="scope">
          <el-tag>{{scope.row.province}}-{{scope.row.city}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="退款单号" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{scope.row.refundId}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="商户退款单号" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{scope.row.outRefundNo}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="交易单号" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{scope.row.transactionId}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="商户单号" show-overflow-tooltip>
        <template #default="scope">
          <el-tag type="success">{{scope.row.outTradeNo}}</el-tag>
        </template>
      </el-table-column>


      <el-table-column label="学生ID">
        <template #default="scope">
          <span>{{scope.row.studentId}}</span>
        </template>
      </el-table-column>

      <el-table-column label="金额（分）" width="100">
        <template #default="scope">
          <el-tag type="info">￥{{scope.row.refundTotal}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="退款类型">
        <template #default="scope">
          <el-tag v-if="scope.row.refundType===0">课程退款</el-tag>
          <el-tag type="warning" v-else>VIP退款</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="成交时间">
        <template #default="scope">
          <el-icon><timer /></el-icon>
          <span>{{formatTime(scope.row.createTime,'yyyy-MM-dd HH:mm:ss')}}</span>
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

</template>

<script setup lang="ts">
import { ref,reactive,toRefs,onMounted} from 'vue'
import { formatTime } from "@/utils/date"
import { ElMessage } from 'element-plus'
import {exportExcel} from "@/utils/exportExcel";
import {getListApi} from "@/api/edu/refund/refund";


const state = reactive({
  // 成交方式
  refundType: '',
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
    'searchValue': state.searchValue,
    'refundType':state.refundType
  }

  const { data } = await getListApi(params)
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

// 导出列表
const column = [
  { name: 'id',label: '成交ID' },
  { name: 'orderNo',label: '订单编号'},
  { name: 'studentId',label: '学生ID'},
  { name: 'price',label: '成交金额' },
  { name: 'refundType',label: '成交类型' },
  { name: 'province',label: '省份' },
  { name: 'city',label: '城市' },
  { name: 'createTime',label: '成交时间' }
]

// 导出数据
const exportExcelAction = ()=> {
  exportExcel({
    column,
    data: state.tableData,
    filename: '成交金额信息数据',
    format: 'xlsx',
    autowidth: true
  })
}

// 挂载后加载数据
onMounted(()=> {
  loadData(state)
})
const { total,tableData,pageSize,pageIndex,loading,searchValue,refundType}=toRefs(state)
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
